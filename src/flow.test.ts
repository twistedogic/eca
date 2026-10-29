// @vitest-environment jsdom
/**
 * Full-flow walk: home -> topic -> chapter -> quiz -> results -> review.
 * Drives the real views against the real generated sample content.
 *
 * The cases run in order and share device storage on purpose: this is one
 * continuous session (the app keeps its state in IndexedDB), not isolated
 * units. `it.only` on a single case will lose the earlier state.
 */
import 'fake-indexeddb/auto'
import { readFileSync } from 'node:fs'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { parseHash } from './router'
import { renderHome } from './views/home'
import { renderTopic } from './views/topic'
import { renderChapter } from './views/chapter'
import { renderQuiz } from './views/quiz'
import { renderReview } from './views/review'
import { allCards, deleteSetting, getSetting, putCard } from './state/db'
import type { ContentData, QuizData, Question } from './types'

const content = JSON.parse(readFileSync('public/content.json', 'utf8')) as ContentData
const quiz = JSON.parse(readFileSync('public/quiz.json', 'utf8')) as QuizData

const TOPIC = content.topics[0].id
const CHAPTER = content.topics[0].chapters[0].id
const CHAPTERS = content.topics[0].chapters.length

let app: HTMLElement

beforeEach(async () => {
  document.body.innerHTML = '<div id="app"></div>'
  app = document.getElementById('app')!
  window.scrollTo = () => {}
  Element.prototype.scrollIntoView = () => {}
  // the appearance is global state; reset it so each case starts in light
  await deleteSetting('theme')
  document.documentElement.removeAttribute('data-theme')
  await deleteSetting('textSize')
  document.documentElement.removeAttribute('data-text-size')
})

function text(el: Element | null): string {  return (el?.textContent ?? '').replace(/\s+/g, ' ').trim()
}

function find(selector: string, needle: string): HTMLElement | undefined {
  return [...app.querySelectorAll<HTMLElement>(selector)].find((el) =>
    text(el).toLowerCase().includes(needle.toLowerCase()),
  )
}

function require(selector: string, needle: string): HTMLElement {
  const el = find(selector, needle)
  if (!el) throw new Error(`no ${selector} containing "${needle}"`)
  return el
}

/** Clicks the wrong (or right) choice of the question on screen. */
function answer(q: Question, correct: boolean): void {
  if (q.type === 'mc') {
    const choices = app.querySelectorAll<HTMLButtonElement>('button.choice')
    const idx = correct ? q.answer : (q.answer + 1) % q.choices.length
    choices[idx].click()
    return
  }
  const input = app.querySelector<HTMLInputElement>('input.cloze-input')!
  input.value = correct ? q.answer : 'definitely wrong'
  app.querySelector<HTMLButtonElement>('button.btn')!.click()
}

function next(): void {
  const btn = app.querySelector<HTMLElement>('.view')!.lastElementChild as HTMLElement
  btn.click()
}

/** Waits for an element that renders after an async write. */
async function waitFor(selector: string, timeout = 2000): Promise<HTMLElement> {
  const start = Date.now()
  for (;;) {
    const el = app.querySelector<HTMLElement>(selector)
    if (el) return el
    if (Date.now() - start > timeout) throw new Error(`timeout waiting for ${selector}`)
    await new Promise((r) => setTimeout(r, 10))
  }
}

function chapterRow(title: string): HTMLElement {
  const row = [...app.querySelectorAll<HTMLElement>('.chapters li')].find((li) => text(li).includes(title))
  if (!row) throw new Error(`no chapter row for "${title}"`)
  return row
}

describe('full flow', () => {
  it('home lists the topic with zero progress and no due count', async () => {
    await renderHome(app, content, quiz)
    expect(text(app.querySelector('.topic-card h3'))).toBe(content.topics[0].title)
    expect(text(app.querySelector('.topic-card .meta'))).toContain(`0/${CHAPTERS} chapters`)
    expect(text(app.querySelector('.topic-card .meta'))).toContain('0%')
    expect(app.querySelector('.due-banner')).toBeNull()
  })

  it('topic lists every chapter as new', async () => {
    await renderTopic(app, content, quiz, TOPIC)
    const rows = app.querySelectorAll('.chapters li')
    expect(rows.length).toBe(content.topics[0].chapters.length)
    expect(app.querySelectorAll('.chip.new').length).toBe(rows.length)
  })

  it('chapter renders its sections and offers the quiz with a question count', async () => {
    await renderChapter(app, content, quiz, TOPIC, CHAPTER)
    expect(text(app.querySelector('.chapter h1'))).toBe(content.topics[0].chapters[0].title)
    expect(app.querySelectorAll('.section').length).toBeGreaterThan(0)
    const cta = require('.quizcta', 'Take chapter quiz')
    const n = quiz.questions.filter((q) => q.chapterId === CHAPTER).length
    expect(text(cta)).toContain(`${n} question`)
  })

  it('chapter with no questions says so and offers the next chapter', async () => {
    const withoutQuestions: QuizData = {
      questions: quiz.questions.filter((q) => q.chapterId !== CHAPTER),
    }
    await renderChapter(app, content, withoutQuestions, TOPIC, CHAPTER)
    expect(text(require('.quizcta', 'Nothing to quiz on here'))).toContain('Next:')
  })

  it('quiz grades immediately, shows feedback, and summarises with misses linked', async () => {
    const questions = quiz.questions.filter((q) => q.chapterId === CHAPTER)
    await renderQuiz(app, content, quiz, TOPIC, CHAPTER)

    // progress dots cover the whole set
    expect(app.querySelectorAll('.qdots i').length).toBe(questions.length)

    // first question wrong -> correct answer highlighted + explanation + passage link
    answer(questions[0], false)
    expect(app.querySelector('.feedback.bad')).not.toBeNull()
    expect(app.querySelector('.choice.right')).not.toBeNull()
    expect(app.querySelector('.feedback.bad a[href*="?s="]')).not.toBeNull()

    next()
    for (const q of questions.slice(1)) {
      answer(q, true)
      expect(app.querySelector('.feedback.good')).not.toBeNull()
      next()
    }
    await waitFor('.score') // results render after the cards are written

    // results
    expect(text(app.querySelector('.score .big'))).toBe(`${questions.length - 1}/${questions.length}`)
    expect(app.querySelectorAll('.misses li').length).toBe(1)
    expect(app.querySelector('.misses li a[href*="?s="]')).not.toBeNull()
    expect(text(app.querySelector('.sched'))).toContain('Misses scheduled')
  })

  it('a missed question becomes a card scheduled for tomorrow', async () => {
    const missed = quiz.questions.find((q) => q.chapterId === CHAPTER)!
    const card = (await allCards()).find(([id]) => id === missed.id)
    expect(card).toBeDefined()
    expect(card![1].box).toBe(1)
    expect(card![1].due - Date.now()).toBeLessThanOrEqual(24 * 60 * 60 * 1000 + 1000)
    expect(card![1].due).toBeGreaterThan(Date.now())
  })

  it('a chapter with missed answers is marked review due', async () => {
    await renderTopic(app, content, quiz, TOPIC)
    const row = chapterRow(content.topics[0].chapters[0].title)
    expect(text(row.querySelector('.chip.due'))).toBe('review due')
    expect(text(row.querySelector('.cs'))).toContain('weak')
  })

  it('a taken quiz counts toward the topic progress and stays retakeable', async () => {
    await renderHome(app, content, quiz)
    expect(text(app.querySelector('.topic-card .meta'))).toContain(`1/${CHAPTERS} chapters`)
    expect(text(app.querySelector('.topic-card .meta'))).toContain(`${Math.round(100 / CHAPTERS)}%`)

    await renderChapter(app, content, quiz, TOPIC, CHAPTER)
    expect(text(require('.quizcta', 'Take chapter quiz'))).toContain('question')
  })

  it('the quiz route with no questions says so instead of scoring an empty run', async () => {
    const withoutQuestions: QuizData = {
      questions: quiz.questions.filter((q) => q.chapterId !== CHAPTER),
    }
    await renderQuiz(app, content, withoutQuestions, TOPIC, CHAPTER)
    expect(text(app.querySelector('.empty'))).toContain('Nothing to quiz on here')
    expect(app.querySelector('.score')).toBeNull()
  })

  it('home counts cards due once the day has come, and review shows provenance', async () => {
    const missed = quiz.questions.find((q) => q.chapterId === CHAPTER)!
    const card = (await allCards()).find(([id]) => id === missed.id)![1]
    await putCard(missed.id, { ...card, due: Date.now() - 1000 })

    await renderHome(app, content, quiz)
    const banner = app.querySelector('.due-banner')!
    expect(text(banner.querySelector('.n'))).toBe('1')
    expect(text(banner.querySelector('.t'))).toContain('card due today')
    expect(text(banner.querySelector('.t'))).toContain('min')

    await renderReview(app, content, quiz)
    const meta = app.querySelector('.revmeta')!
    expect(text(meta)).toContain(content.topics[0].chapters[0].title)
    expect(text(meta)).toContain(content.topics[0].title)
    expect(app.querySelector('.revmeta a[href*="?s="]')).not.toBeNull()
  })

  it('grading a review card stretches the interval and clears it from the due set', async () => {
    const missed = quiz.questions.find((q) => q.chapterId === CHAPTER)!
    await renderReview(app, content, quiz)
    app.querySelector<HTMLButtonElement>('button.btn')!.click() // show answer
    expect(app.querySelector('.grade')).not.toBeNull()
    app.querySelector<HTMLButtonElement>('button.btn.good')!.click()
    await waitFor('.nextin')

    expect(text(app.querySelector('.nextin'))).toContain('next in 3d')
    const card = (await allCards()).find(([id]) => id === missed.id)![1]
    expect(card.box).toBe(2)

    await renderHome(app, content, quiz)
    expect(app.querySelector('.due-banner')).toBeNull()

    // the beaten chapter is done again
    await renderTopic(app, content, quiz, TOPIC)
    expect(chapterRow(content.topics[0].chapters[0].title).querySelector('.chip.done')).not.toBeNull()
  })

  it('the appearance control flips the theme and the choice survives a re-render', async () => {
    await renderHome(app, content, quiz)
    const row = require('.appear-row', 'Appearance')
    expect(text(row.querySelector('.pill'))).toBe('Light')

    row.click()
    expect(text(app.querySelector('.appear-row .pill'))).toBe('Dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
    await vi.waitFor(async () => expect(await getSetting('theme')).toBe('dark'))

    await renderHome(app, content, quiz)
    expect(text(app.querySelector('.appear-row .pill'))).toBe('Dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('the appearance control shows and changes what is on screen, not what was saved', async () => {
    // the app is showing dark while the saved preference says otherwise
    document.documentElement.dataset.theme = 'dark'
    await renderHome(app, content, quiz)
    expect(text(app.querySelector('.appear-row .pill'))).toBe('Dark')

    app.querySelector<HTMLButtonElement>('.appear-row')!.click()
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(text(app.querySelector('.appear-row .pill'))).toBe('Light')
  })

  it('the text size control resizes the app and the choice survives a re-render', async () => {
    await renderHome(app, content, quiz)
    const row = require('.size-row', 'Text size')
    expect(row.querySelector('[aria-pressed="true"]')?.getAttribute('aria-label')).toBe('Text size: Default')

    const large = [...row.querySelectorAll<HTMLElement>('button.size')]
      .find((b) => b.getAttribute('aria-label') === 'Text size: Large')!
    large.click()
    expect(document.documentElement.dataset.textSize).toBe('lg')
    expect(row.querySelector('[aria-pressed="true"]')?.getAttribute('aria-label')).toBe('Text size: Large')
    await vi.waitFor(async () => expect(await getSetting('textSize')).toBe('lg'))

    await renderHome(app, content, quiz)
    expect(document.documentElement.dataset.textSize).toBe('lg')
    expect(app.querySelector('.size-row [aria-pressed="true"]')?.getAttribute('aria-label')).toBe('Text size: Large')
  })

  it('a card whose question no longer exists is dropped without errors', async () => {
    await putCard('gone-q1', { box: 1, due: Date.now() - 1000 })
    await renderReview(app, content, quiz)
    expect((await allCards()).find(([id]) => id === 'gone-q1')).toBeUndefined()
    expect(text(app.querySelector('.empty'))).toContain('Nothing due right now')
  })

  it('review sessions are scoped to a topic', async () => {
    // second topic with its own question set, to tell the scopes apart
    const other = { ...content.topics[0], id: 'other-topic', title: 'Other Topic' }
    const twoTopics: ContentData = { topics: [content.topics[0], other] }
    const twoQuizzes: QuizData = {
      questions: [
        ...quiz.questions,
        ...quiz.questions.map((q) => ({ ...q, id: `other-${q.id}`, topicId: 'other-topic' })),
      ],
    }
    const missed = quiz.questions.find((q) => q.chapterId === CHAPTER)!
    const card = (await allCards()).find(([id]) => id === missed.id)![1]
    await putCard(missed.id, { ...card, due: Date.now() - 1000 })
    await putCard(`other-${missed.id}`, { ...card, due: Date.now() - 1000 })

    await renderReview(app, twoTopics, twoQuizzes, TOPIC)
    expect(text(app.querySelector('.appbar .right'))).toBe('1/1')

    await renderReview(app, twoTopics, twoQuizzes)
    expect(text(app.querySelector('.appbar .right'))).toBe('1/2')
  })

  it('routes resolve to the right screens', () => {
    expect(parseHash('#/').name).toBe('home')
    expect(parseHash('').name).toBe('home')
    expect(parseHash('#/topic/t1')).toEqual({ name: 'topic', topicId: 't1' })
    expect(parseHash('#/topic/t1/chapter/c1')).toEqual({
      name: 'chapter', topicId: 't1', chapterId: 'c1', sectionId: undefined,
    })
    expect(parseHash('#/topic/t1/chapter/c1?s=sec')).toEqual({
      name: 'chapter', topicId: 't1', chapterId: 'c1', sectionId: 'sec',
    })
    expect(parseHash('#/review')).toEqual({ name: 'review', topicId: undefined, cardIds: undefined })
    expect(parseHash('#/review/t1?cards=a,b')).toEqual({
      name: 'review', topicId: 't1', cardIds: ['a', 'b'],
    })
  })
})
