import { h, clear } from '../dom'
import { go } from '../router'
import type { ContentData, QuizData } from '../types'
import { dueInfo, progressMap, topicProgress, chapterKey, estimatedMinutes } from '../state/progress'

export async function renderHome(
  app: HTMLElement,
  content: ContentData | null,
  quiz: QuizData | null,
): Promise<void> {
  clear(app)
  const due = await dueInfo(quiz)
  const progress = await progressMap()

  const view = h('div', { class: 'view' })

  if (due.total > 0) {
    view.append(
      h('a', {
        class: 'due-banner',
        href: '#/review',
        onclick: (e: Event) => { e.preventDefault(); go('/review') },
      },
        h('span', { class: 'n' }, String(due.total)),
        h('span', { class: 't' }, `${due.total === 1 ? 'card' : 'cards'} due today`, h('br'), `~${estimatedMinutes(due.total)} min`),
        h('span', { class: 'go' }, 'Review'),
      ),
    )
  }

  if (!content || content.topics.length === 0) {
    view.append(h('div', { class: 'empty' }, 'No topics yet.\nAdd chapters under content/ and run `npm run gen`.'))
  }

  for (const topic of content?.topics ?? []) {
    const keys = topic.chapters.map((ch) => chapterKey(topic.id, ch.id))
    const tp = topicProgress(keys, progress)
    const topicDue = due.byTopic.get(topic.id) ?? 0

    const meta = h('div', { class: 'meta' },
      h('span', null, `${tp.completed}/${tp.total} chapters`),
      h('span', null, '·'),
      h('span', null, `${tp.pct}%`))
    if (topicDue > 0) meta.append(h('span', { class: 'pill' }, `${topicDue} due`))

    view.append(
      h('a', {
        class: 'topic-card',
        href: `#/topic/${topic.id}`,
        onclick: (e: Event) => { e.preventDefault(); go(`/topic/${topic.id}`) },
      },
        h('h3', null, topic.title),
        h('div', { class: 'bar' }, h('i', { style: `width:${tp.pct}%` })),
        meta,
      ),
    )
  }

  app.append(
    h('div', { class: 'appbar' },
      h('span', { class: 'title' }, 'My Topics'),
      h('span', { class: 'right' },
        navigator.serviceWorker?.controller ? 'offline ready ✓' : '')),
    view,
  )
}
