import './styles.css'
import { registerSW } from 'virtual:pwa-register'
import { parseHash } from './router'
import { loadContent, loadQuiz } from './api'
import type { ContentData, QuizData } from './types'
import { renderHome } from './views/home'
import { renderTopic } from './views/topic'
import { renderChapter } from './views/chapter'
import { renderQuiz } from './views/quiz'
import { renderReview } from './views/review'
import { applyTheme, loadTheme } from './state/theme'
import { applyTextSize, loadTextSize } from './state/textsize'

const app = document.getElementById('app')!

registerSW({ immediate: true })

let content: ContentData | null = null
let quiz: QuizData | null = null

function render(): void {
  const route = parseHash(location.hash)
  const done = (() => {
    switch (route.name) {
      case 'topic':
        return renderTopic(app, content, quiz, route.topicId)
      case 'chapter':
        return renderChapter(app, content, quiz, route.topicId, route.chapterId, route.sectionId)
      case 'quiz':
        return renderQuiz(app, content, quiz, route.topicId, route.chapterId)
      case 'review':
        return renderReview(app, content, quiz, route.topicId, route.cardIds)
      default:
        return renderHome(app, content, quiz)
    }
  })()
  done?.catch((err) => console.error('render failed', err))
}

async function boot(): Promise<void> {
  // the appearance and text size land in parallel with the content fetch, before the first paint
  const themed = loadTheme().then(applyTheme).catch((err) => console.error('theme failed', err))
  const sized = loadTextSize().then(applyTextSize).catch((err) => console.error('text size failed', err))
  try {
    ;[content, quiz] = await Promise.all([loadContent(), loadQuiz()])
  } catch {
    // views render an empty state; content may appear after `npm run gen`
  }
  await Promise.all([themed, sized])
  render()
  window.addEventListener('hashchange', render)
}

void boot()
