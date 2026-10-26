import { h, clear } from '../dom'
import { go } from '../router'
import type { ContentData, Question, QuizData } from '../types'
import { getCard, putCard, getChapterProgress, putChapterProgress } from '../state/db'
import { chapterKey } from '../state/progress'
import { newCard, onWrong } from '../state/scheduler'

interface Session {
  questions: Question[]
  idx: number
  correct: number
  misses: string[]
  results: ('ok' | 'bad')[]
}

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ')
}

function passageLink(q: Question, topicId: string, label = 'Re-read this section ↗'): HTMLElement {
  return h('a', {
    href: `#/topic/${topicId}/chapter/${q.chapterId}?s=${q.sectionId}`,
    onclick: (e: Event) => { e.preventDefault(); go(`/topic/${topicId}/chapter/${q.chapterId}?s=${q.sectionId}`) },
  }, label)
}

export async function renderQuiz(
  app: HTMLElement,
  content: ContentData | null,
  quiz: QuizData | null,
  topicId: string,
  chapterId: string,
): Promise<void> {
  clear(app)
  const topic = content?.topics.find((t) => t.id === topicId)
  const chapter = topic?.chapters.find((c) => c.id === chapterId)
  const questions = (quiz?.questions ?? []).filter(
    (q) => q.topicId === topicId && q.chapterId === chapterId,
  )

  if (!topic || !chapter) {
    app.append(
      h('div', { class: 'view' }, h('div', { class: 'empty' }, 'Chapter not found.')),
    )
    return
  }

  if (questions.length === 0) {
    app.append(
      h('div', { class: 'appbar' },
        h('a', { class: 'back', href: `#/topic/${topicId}/chapter/${chapterId}`, onclick: (e: Event) => { e.preventDefault(); go(`/topic/${topicId}/chapter/${chapterId}`) } }, '‹'),
        h('span', { class: 'title' }, `${chapter.title} · Quiz`)),
      h('div', { class: 'view' },
        h('div', { class: 'empty' }, 'Nothing to quiz on here.'),
        h('div', { class: 'stack' },
          h('a', {
            class: 'btn ghost', href: `#/topic/${topicId}/chapter/${chapterId}`,
            onclick: (e: Event) => { e.preventDefault(); go(`/topic/${topicId}/chapter/${chapterId}`) },
          }, 'Back to chapter'))),
    )
    return
  }

  const session: Session = { questions, idx: 0, correct: 0, misses: [], results: [] }
  const chap = chapter
  const view = h('div', { class: 'view' })
  app.append(
    h('div', { class: 'appbar' },
      h('a', { class: 'back', href: `#/topic/${topicId}/chapter/${chapterId}`, onclick: (e: Event) => { e.preventDefault(); go(`/topic/${topicId}/chapter/${chapterId}`) } }, '‹'),
      h('span', { class: 'title' }, `${chapter.title} · Quiz`)),
    view,
  )
  drawQuestion()
  window.scrollTo({ top: 0 })

  function drawQuestion(): void {
    clear(view)
    const q = session.questions[session.idx]
    if (!q) {
      void finish()
      return
    }

    view.append(
      h('div', { class: 'qdots' },
        ...session.questions.map((_, i) =>
          h('i', {
            class:
              i < session.results.length
                ? session.results[i]
                : i === session.idx ? 'on' : '',
          }),
        )),
    )

    const sectionTitle =
      chap.sections.find((s) => s.id === q.sectionId)?.title ?? q.sectionId
    const card = h('div', { class: 'qcard' },
      h('div', { class: 'qmeta' },
        h('span', { class: `src tag-${q.source}` }, q.source),
        h('span', { class: 'from' },
          'from ',
          passageLink(q, topicId, `${chap.title} · ${sectionTitle}`))),
      h('h2', null, q.prompt))

    const feedback = h('div')
    const next = h('button', { class: 'btn', style: 'display:none' }, 'Next question')
    next.addEventListener('click', () => {
      session.idx++
      drawQuestion()
      window.scrollTo({ top: 0 })
    })

    const grade = (isCorrect: boolean) => {
      session.results.push(isCorrect ? 'ok' : 'bad')
      if (isCorrect) session.correct++
      else session.misses.push(q.id)
      redrawDots()
      feedback.append(
        isCorrect
          ? h('div', { class: 'feedback good' }, h('b', null, 'Correct.'), ' ', q.explanation)
          : h('div', { class: 'feedback bad' },
              h('b', null, 'Not quite.'),
              q.type === 'cloze' ? ` The answer is “${q.answer}”.` : '',
              ' ', q.explanation, ' ',
              passageLink(q, topicId)),
      )
      next.style.display = ''
      if (session.idx === session.questions.length - 1) next.textContent = 'See results'
      window.scrollTo({ top: document.documentElement.scrollHeight })
    }

    if (q.type === 'mc') {
      const letters = ['A', 'B', 'C', 'D', 'E', 'F']
      q.choices.forEach((choice, i) => {
        const btn = h('button', { class: 'choice' },
          h('span', { class: 'l' }, letters[i]),
          h('span', null, choice),
          h('span', { class: 'mark' }))
        btn.addEventListener('click', () => {
          if (feedback.firstChild) return
          for (const b of card.querySelectorAll('button.choice')) (b as HTMLButtonElement).disabled = true
          if (i === q.answer) {
            btn.classList.add('right')
            btn.querySelector('.mark')!.textContent = '✓'
            grade(true)
          } else {
            btn.classList.add('wrong')
            btn.querySelector('.mark')!.textContent = '✗'
            const right = card.querySelectorAll('button.choice')[q.answer]
            right.classList.add('right')
            right.querySelector('.mark')!.textContent = '✓'
            grade(false)
          }
        })
        card.append(btn)
      })
    } else {
      const input = h('input', {
        class: 'cloze-input', type: 'text', autocomplete: 'off',
        placeholder: 'type the missing term…', 'aria-label': 'answer',
      })
      const check = h('button', { class: 'btn' }, 'Check')
      check.addEventListener('click', () => {
        if (feedback.firstChild) return
        const value = (input as HTMLInputElement).value
        input.disabled = true
        check.disabled = true
        grade(normalize(value) === normalize(q.answer))
      })
      input.addEventListener('keydown', (e) => {
        if ((e as KeyboardEvent).key === 'Enter') check.click()
      })
      card.append(input, check)
    }

    view.append(card, feedback, next)
  }

  function redrawDots(): void {
    // dots are rebuilt on next drawQuestion; live-update current one for feedback
    const dots = view.querySelectorAll('.qdots i')
    dots.forEach((d, i) => {
      if (i < session.results.length) d.className = session.results[i]
    })
  }

  async function finish(): Promise<void> {
    // persist: misses enter/refresh the schedule, progress records the attempt
    const now = Date.now()
    for (const id of session.misses) {
      const existing = await getCard(id)
      await putCard(id, existing ? onWrong(existing, now) : newCard(now))
    }
    const key = chapterKey(topicId, chapterId)
    const prev = await getChapterProgress(key)
    await putChapterProgress(key, {
      ...prev,
      opened: true,
      quizTaken: true,
      lastScore: { correct: session.correct, total: session.questions.length },
      lastQuizAt: now,
    })

    clear(view)
    const pct = session.questions.length
      ? Math.round((session.correct / session.questions.length) * 100)
      : 0

    view.append(
      h('div', { class: 'score' },
        h('div', { class: 'big' }, String(session.correct),
          h('em', null, `/${session.questions.length}`)),
        h('div', { class: 'verdict' },
          `${chap.title} · ${
            session.misses.length === 0
              ? 'all clear'
              : session.misses.length <= 2 ? 'solid, a few to sharpen' : 'plenty to review'
          }`),
        h('div', { class: 'bar' }, h('i', { style: `width:${pct}%;background:var(--ok)` })),
      ),
    )

    if (session.misses.length > 0) {
      view.append(
        h('div', { class: 'sched' },
          h('b', null, 'Misses scheduled: tomorrow. '),
          'Wrong answers come back as reviews until you beat them — that\u2019s how they stick.'),
        h('ul', { class: 'misses' },
          ...session.misses.map((id) => {
            const q = session.questions.find((x) => x.id === id)!
            const li = h('li', null, h('span', null, excerpt(q.prompt)))
            li.append(passageLink(q, topicId, 're-read ↗'))
            return li
          })),
      )
    } else {
      view.append(
        h('div', { class: 'sched' }, 'Clean sheet — nothing scheduled. Keep going!'),
      )
    }

    const stack = h('div', { class: 'stack' })
    if (session.misses.length > 0) {
      stack.append(
        h('a', {
          class: 'btn', href: `#/review/${topicId}?cards=${session.misses.join(',')}`,
          onclick: (e: Event) => {
            e.preventDefault()
            go(`/review/${topicId}?cards=${session.misses.join(',')}`)
          },
        }, 'Review misses now'),
      )
    }
    stack.append(
      h('a', {
        class: 'btn ghost', href: `#/topic/${topicId}`,
        onclick: (e: Event) => { e.preventDefault(); go(`/topic/${topicId}`) },
      }, 'Back to chapters'),
    )
    view.append(stack)
    window.scrollTo({ top: 0 })
  }
}

function excerpt(prompt: string, max = 70): string {
  return prompt.length > max ? `${prompt.slice(0, max)}…` : prompt
}
