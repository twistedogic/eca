import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const content = JSON.parse(readFileSync('public/content.json', 'utf8'))
const quiz = JSON.parse(readFileSync('public/quiz.json', 'utf8'))

describe('forex trading products content', () => {
  it('publishes the products chapter with quiz coverage', () => {
    const topic = content.topics.find((item) => item.id === 'forex-trading')
    const chapter = topic?.chapters.find((item) => item.id === '15-forex-trading-products')

    expect(chapter?.title).toBe('Forex trading products')
    expect(chapter?.sections.map((section) => section.id)).toEqual(
      expect.arrayContaining([
        'spot-fx',
        'outright-forwards',
        'fx-swaps',
        'currency-swaps',
        'currency-futures',
        'fx-options',
      ]),
    )

    const terms = quiz.questions
      .filter((question) => question.chapterId === chapter?.id)
      .map((question) => question.term)
    expect(terms).toEqual(
      expect.arrayContaining([
        'outright forward',
        'FX swap',
        'currency swap',
        'currency futures',
        'FX option',
      ]),
    )
  })
})
