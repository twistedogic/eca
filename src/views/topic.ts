import { h, clear } from '../dom'
import { go } from '../router'
import type { ContentData, QuizData } from '../types'
import { chapterStatus, dueInfo, progressMap, chapterKey, topicProgress, estimatedMinutes } from '../state/progress'

export async function renderTopic(
  app: HTMLElement,
  content: ContentData | null,
  quiz: QuizData | null,
  topicId: string,
): Promise<void> {
  clear(app)
  const topic = content?.topics.find((t) => t.id === topicId)

  if (!topic) {
    app.append(
      h('div', { class: 'appbar' },
        h('a', { class: 'back', href: '#/', onclick: (e: Event) => { e.preventDefault(); go('/') } }, '‹'),
        h('span', { class: 'title' }, 'Topic')),
      h('div', { class: 'view' }, h('div', { class: 'empty' }, 'Topic not found.')),
    )
    return
  }

  const due = await dueInfo(quiz)
  const progress = await progressMap()
  const topicDue = due.byTopic.get(topic.id) ?? 0
  const tp = topicProgress(
    topic.chapters.map((ch) => chapterKey(topic.id, ch.id)),
    progress,
  )

  const view = h('div', { class: 'view' })

  if (topicDue > 0) {
    view.append(
      h('a', {
        class: 'due-banner',
        href: `#/review/${topic.id}`,
        onclick: (e: Event) => { e.preventDefault(); go(`/review/${topic.id}`) },
      },
        h('span', { class: 'n' }, String(topicDue)),
        h('span', { class: 't' }, `${topicDue === 1 ? 'card' : 'cards'} due`, h('br'), `~${estimatedMinutes(topicDue)} min`),
        h('span', { class: 'go' }, 'Review'),
      ),
    )
  }

  const list = h('ul', { class: 'chapters' })
  for (const [i, ch] of topic.chapters.entries()) {
    const key = chapterKey(topic.id, ch.id)
    const p = progress.get(key)
    const weak = due.weakByChapter.get(key) ?? 0
    const status = chapterStatus(p, weak)
    const qCount = quiz?.questions.filter((q) => q.topicId === topic.id && q.chapterId === ch.id).length ?? 0

    const sub = status === 'new'
      ? qCount > 0 ? `${ch.readMinutes} min read · ${qCount} questions` : `${ch.readMinutes} min read`
      : status === 'in-progress'
        ? `reading${p?.scrollPct != null ? ` · ${Math.round(p.scrollPct * 100)}%` : ''}`
        : status === 'review-due'
          ? `read · ${weak} card${weak === 1 ? '' : 's'} weak`
          : `read · quiz ${p?.lastScore?.correct ?? 0}/${p?.lastScore?.total ?? qCount}`

    const chip = status === 'new'
      ? h('span', { class: 'chip new' }, 'new')
      : status === 'in-progress'
        ? h('span', { class: 'chip due' }, 'in progress')
        : status === 'review-due'
          ? h('span', { class: 'chip due' }, 'review due')
          : h('span', { class: 'chip done' }, '✓')

    list.append(
      h('li', null,
        h('a', {
          class: 'row',
          href: `#/topic/${topic.id}/chapter/${ch.id}`,
          onclick: (e: Event) => { e.preventDefault(); go(`/topic/${topic.id}/chapter/${ch.id}`) },
        },
          h('span', { class: `num${status === 'done' ? ' done' : ''}` }, String(i + 1)),
          h('span', null,
            h('span', { class: 'ct' }, ch.title),
            h('br'),
            h('span', { class: 'cs' }, sub)),
          chip,
        )),
    )
  }
  view.append(list)

  app.append(
    h('div', { class: 'appbar' },
      h('a', { class: 'back', href: '#/', onclick: (e: Event) => { e.preventDefault(); go('/') } }, '‹'),
      h('span', { class: 'title' }, topic.title),
      h('span', { class: 'right' }, `${tp.pct}%`)),
    view,
  )
}
