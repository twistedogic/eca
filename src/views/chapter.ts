import { h, clear } from '../dom'
import { go } from '../router'
import type { ContentData, QuizData } from '../types'
import { getChapterProgress, putChapterProgress } from '../state/db'
import { chapterKey } from '../state/progress'

export async function renderChapter(
  app: HTMLElement,
  content: ContentData | null,
  quiz: QuizData | null,
  topicId: string,
  chapterId: string,
  sectionId?: string,
): Promise<void> {
  clear(app)
  const topic = content?.topics.find((t) => t.id === topicId)
  const chapter = topic?.chapters.find((c) => c.id === chapterId)

  if (!topic || !chapter) {
    app.append(
      h('div', { class: 'appbar' },
        h('a', { class: 'back', href: `#/topic/${topicId}`, onclick: (e: Event) => { e.preventDefault(); go(`/topic/${topicId}`) } }, '‹'),
        h('span', { class: 'title' }, 'Chapter')),
      h('div', { class: 'view' }, h('div', { class: 'empty' }, 'Chapter not found.')),
    )
    return
  }

  const key = chapterKey(topicId, chapterId)
  const prev = await getChapterProgress(key)
  await putChapterProgress(key, { quizTaken: false, ...prev, opened: true })

  const qCount =
    quiz?.questions.filter((q) => q.topicId === topicId && q.chapterId === chapterId).length ?? 0

  const view = h('div', { class: 'view chapter' })

  const readbar = h('div', { class: 'readbar' },
    h('i', { style: `width:${Math.round((prev?.scrollPct ?? 0) * 100)}%` }))
  view.append(readbar, h('h1', null, chapter.title),
    h('div', { class: 'sub' }, `${topic.title} · ${chapter.readMinutes} min read`))

  for (const section of chapter.sections) {
    view.append(
      h('div', { class: 'section' },
        h('h2', { id: section.id }, section.title),
        h('div', { html: section.html }),
      ),
    )
  }

  if (qCount > 0) {
    view.append(
      h('a', {
        class: 'quizcta',
        href: `#/quiz/${topicId}/${chapterId}`,
        onclick: (e: Event) => { e.preventDefault(); go(`/quiz/${topicId}/${chapterId}`) },
      }, `Take chapter quiz · ${qCount} question${qCount === 1 ? '' : 's'}`),
    )
  } else {
    const idx = topic.chapters.findIndex((c) => c.id === chapterId)
    const next = topic.chapters[idx + 1]
    view.append(
      next
        ? h('a', {
            class: 'quizcta',
            href: `#/topic/${topicId}/chapter/${next.id}`,
            onclick: (e: Event) => { e.preventDefault(); go(`/topic/${topicId}/chapter/${next.id}`) },
          }, `Nothing to quiz on here · Next: ${next.title}`)
        : h('a', {
            class: 'btn ghost',
            href: `#/topic/${topicId}`,
            onclick: (e: Event) => { e.preventDefault(); go(`/topic/${topicId}`) },
          }, 'Nothing to quiz on here · back to chapters'),
    )
  }

  app.append(
    h('div', { class: 'appbar' },
      h('a', { class: 'back', href: `#/topic/${topicId}`, onclick: (e: Event) => { e.preventDefault(); go(`/topic/${topicId}`) } }, '‹'),
      h('span', { class: 'title' }, chapter.title)),
    view,
  )

  // restore position: section anchor wins, else saved scroll fraction
  requestAnimationFrame(() => {
    if (sectionId) {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'instant' })
    } else if (prev?.scrollPct) {
      const max = document.documentElement.scrollHeight - window.innerHeight
      window.scrollTo({ top: prev.scrollPct * max })
    } else {
      window.scrollTo({ top: 0 })
    }
  })

  // track reading position (throttled)
  let timer: number | undefined
  const onScroll = () => {
    window.clearTimeout(timer)
    timer = window.setTimeout(() => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (max <= 0) return
      const pct = Math.min(1, Math.max(0, window.scrollY / max))
      readbar.firstElementChild?.setAttribute('style', `width:${Math.round(pct * 100)}%`)
      void getChapterProgress(key).then((p) =>
        putChapterProgress(key, { quizTaken: false, ...p, opened: true, scrollPct: pct }),
      )
    }, 400)
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  const stop = () => window.removeEventListener('scroll', onScroll)
  window.addEventListener('hashchange', stop, { once: true })
}
