import { h, clear } from '../dom'
import { go } from '../router'
import type { ContentData, Question, QuizData } from '../types'
import { allCards, deleteCard, putCard } from '../state/db'
import { isDue, onCorrect, onWrong, nextIntervalDays } from '../state/scheduler'

interface QueueCard {
  qid: string
  question: Question
  box: number
  due: number
}

export async function renderReview(
  app: HTMLElement,
  content: ContentData | null,
  quiz: QuizData | null,
  topicId?: string,
  cardIds?: string[],
): Promise<void> {
  clear(app)
  const backHref = topicId ? `#/topic/${topicId}` : '#/'
  const back = (e: Event) => {
    e.preventDefault()
    go(topicId ? `/topic/${topicId}` : '/')
  }
  const view = h('div', { class: 'view' })
  app.append(
    h('div', { class: 'appbar' },
      h('a', { class: 'back', href: backHref, onclick: back }, '‹'),
      h('span', { class: 'title' }, 'Review'),
      h('span', { class: 'right' })),
    view,
  )

  // question index + chapter titles for provenance
  const questionById = new Map((quiz?.questions ?? []).map((q) => [q.id, q]))
  const chapterTitle = new Map<string, string>()
  const topicTitle = new Map<string, string>()
  for (const t of content?.topics ?? []) {
    topicTitle.set(t.id, t.title)
    for (const c of t.chapters) chapterTitle.set(`${t.id}/${c.id}`, c.title)
  }

  // collect stored cards, purging any whose question no longer exists (task 6.4)
  const stored = await allCards()
  const live: QueueCard[] = []
  let purged = 0
  for (const [qid, card] of stored) {
    const q = questionById.get(qid)
    if (!q) {
      await deleteCard(qid)
      purged++
      continue
    }
    if (topicId && q.topicId !== topicId) continue
    live.push({ qid, question: q, box: card.box, due: card.due })
  }

  // queue: forced drill (from results screen) or all due cards
  const now = Date.now()
  let queue: QueueCard[]
  if (cardIds && cardIds.length > 0) {
    queue = cardIds
      .map((id) => live.find((c) => c.qid === id))
      .filter((c): c is QueueCard => c !== undefined)
  } else {
    queue = live.filter((c) => isDue({ box: c.box, due: c.due }, now))
  }
  queue = queue.sort((a, b) => a.qid.localeCompare(b.qid))

  const meta = { idx: 0, kept: 0 }

  if (queue.length === 0) {
    view.append(
      h('div', { class: 'empty' },
        purged > 0 ? `${purged} stale card${purged === 1 ? '' : 's'} removed.` : '',
        purged > 0 ? h('br') : '',
        'Nothing due right now.', h('br'),
        'Miss a card and it comes back tomorrow.'),
      h('div', { class: 'stack' },
        h('a', { class: 'btn ghost', href: backHref, onclick: back },
          topicId ? 'Back to topic' : 'Back to topics')),
    )
    return
  }

  draw()
  window.scrollTo({ top: 0 })

  function draw(): void {
    clear(view)
    const card = queue[meta.idx]
    if (!card) return done()

    const q = card.question
    const ck = `${q.topicId}/${q.chapterId}`
    const passageHref = `#/topic/${q.topicId}/chapter/${q.chapterId}?s=${q.sectionId}`
    const toPassage = (e: Event) => {
      e.preventDefault()
      go(`/topic/${q.topicId}/chapter/${q.chapterId}?s=${q.sectionId}`)
    }

    const appRight = app.querySelector('.appbar .right')!
    appRight.textContent = `${meta.idx + 1}/${queue.length}`

    view.append(h('div', { class: 'qdots' },
      ...queue.map((_, i) => h('i', { class: i < meta.idx ? 'ok' : i === meta.idx ? 'on' : '' }))))

    view.append(
      h('div', { class: 'revmeta' },
        h('span', { class: `src tag-${q.source}` }, q.source),
        h('span', null, 'from '),
        h('a', { href: passageHref, onclick: toPassage },
          `${chapterTitle.get(ck) ?? q.chapterId} · ${topicTitle.get(q.topicId) ?? q.topicId}`)),
    )

    const body = h('div')
    const reveal = h('button', { class: 'btn' }, 'Show answer')
    const grade = h('div', { class: 'grade', style: 'display:none' })
    const verdict = h('div')

    const doReveal = () => {
      reveal.style.display = 'none'
      grade.style.display = ''
      if (q.type === 'cloze') {
        body.append(
          h('div', { class: 'cloze-card' },
            q.prompt,
            h('br'),
            h('span', { class: 'nextin' }, `answer: ${q.answer}`),
            h('p', { class: 'explain' }, q.explanation),
          ),
        )
      } else {
        const letters = ['A', 'B', 'C', 'D', 'E', 'F']
        const choices = q.choices.map((c, i) => {
          const mark = i === q.answer ? '✓' : ''
          return h('div', {
            class: `choice${i === q.answer ? ' right' : ''}`,
            style: i === q.answer ? '' : 'opacity:.55',
          },
            h('span', { class: 'l' }, letters[i]),
            h('span', null, c),
            h('span', { class: 'mark' }, mark))
        })
        body.append(
          h('div', { class: 'qcard' },
            ...choices,
            h('p', { class: 'explain' }, q.explanation),
          ),
        )
      }
    }
    reveal.addEventListener('click', doReveal)

    const again = h('button', { class: 'btn again' }, 'Again')
    const good = h('button', { class: 'btn good' }, 'Good')
    const doGrade = async (correct: boolean) => {
      again.replaceWith(h('span'))
      good.replaceWith(h('span'))
      const card0 = (await allCards()).find(([id]) => id === card.qid)?.[1]
      const next = correct ? onCorrect(card0 ?? { box: 1, due: 0 }) : onWrong(card0 ?? { box: 1, due: 0 })
      await putCard(card.qid, next)
      if (correct) meta.kept++
      verdict.append(
        h('div', { style: 'text-align:center;margin-top:12px' },
          h('span', {
            class: 'nextin',
            style: correct ? '' : 'background:var(--bad-soft);color:var(--bad-ink)',
          }, correct ? `✓ next in ${nextIntervalDays(next.box)}d` : '✗ back tomorrow')),
      )
      const cont = h('button', { class: 'btn', style: 'margin-top:12px' },
        meta.idx + 1 < queue.length ? 'Next card' : 'Finish')
      cont.addEventListener('click', () => {
        meta.idx++
        draw()
        window.scrollTo({ top: 0 })
      })
      verdict.append(cont)
    }
    again.addEventListener('click', () => void doGrade(false))
    good.addEventListener('click', () => void doGrade(true))

    body.prepend(h('div', { class: 'qcard', style: 'margin-bottom:14px' }, h('h2', null, q.prompt)))
    grade.append(again, good)

    view.append(body, reveal, grade, verdict)
  }

  function done(): void {
    clear(view)
    view.append(
      h('div', { class: 'score' },
        h('div', { class: 'big' }, String(meta.kept),
          h('em', null, `/${queue.length}`)),
        h('div', { class: 'verdict' }, 'cards kept · the rest return tomorrow')),
      h('div', { class: 'stack' },
        h('a', { class: 'btn ghost', href: backHref, onclick: back },
          topicId ? 'Back to topic' : 'Back to topics')),
    )
  }
}
