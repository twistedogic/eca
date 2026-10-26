import { describe, it, expect } from 'vitest'
import { mergeQuestions, validateQuestion, QuestionValidationError } from './merge.mjs'

const mc = (term, n = 'q') => ({
  type: 'mc', sectionId: 's1', term, prompt: `P ${n}`,
  choices: [term, 'other'], answer: 0, explanation: 'e', source: 'auto',
})
const hand = (over = {}) => ({
  type: 'mc', prompt: 'hand q', choices: ['a', 'b'], answer: 1,
  explanation: 'hand expl', source: 'hand', ...over,
})

describe('mergeQuestions', () => {
  it('drops generated questions for terms a hand-written question targets', () => {
    const merged = mergeQuestions({
      topicId: 't', chapterId: 'c1',
      auto: [mc('LRU', 'a'), mc('cache hit', 'b')],
      hand: [hand({ term: 'LRU' })],
    })
    expect(merged.some((q) => q.source === 'auto' && q.term === 'LRU')).toBe(false)
    expect(merged.some((q) => q.source === 'auto' && q.term === 'cache hit')).toBe(true)
    expect(merged.some((q) => q.source === 'hand')).toBe(true)
  })

  it('drops generated clozes for overridden terms too', () => {
    const cloze = { type: 'cloze', sectionId: 's', term: 'LRU', prompt: '____ x', answer: 'LRU', explanation: '', source: 'auto' }
    const merged = mergeQuestions({
      topicId: 't', chapterId: 'c1',
      auto: [cloze], hand: [hand({ term: 'lru' })], // case-insensitive
    })
    expect(merged).toHaveLength(1) // only the hand question survives
    expect(merged[0].source).toBe('hand')
  })

  it('keeps hand questions without a term alongside generated ones', () => {
    const merged = mergeQuestions({
      topicId: 't', chapterId: 'c1',
      auto: [mc('LRU')], hand: [hand()],
    })
    expect(merged).toHaveLength(2)
  })

  it('dedupes identical generated prompts', () => {
    const merged = mergeQuestions({
      topicId: 't', chapterId: 'c1',
      auto: [mc('a', 'same'), mc('a', 'same')],
    })
    expect(merged).toHaveLength(1)
  })

  it('assigns stable sequential ids in source order: auto, hand, ai', () => {
    const merged = mergeQuestions({
      topicId: 'sys', chapterId: 'c1',
      auto: [mc('a', 'a'), mc('b', 'b')],
      hand: [hand()],
      ai: [hand({ prompt: 'ai q', source: 'ai' })],
    })
    expect(merged.map((q) => q.id)).toEqual([
      'sys-c1-q1', 'sys-c1-q2', 'sys-c1-q3', 'sys-c1-q4',
    ])
    expect(merged.map((q) => q.source)).toEqual(['auto', 'auto', 'hand', 'ai'])
  })

  it('stamps topicId and chapterId on every question', () => {
    const merged = mergeQuestions({
      topicId: 't', chapterId: 'c1', auto: [mc('a')], hand: [hand()],
    })
    for (const q of merged) {
      expect(q.topicId).toBe('t')
      expect(q.chapterId).toBe('c1')
    }
  })
})

describe('validateQuestion', () => {
  it('accepts a well-formed mc question', () => {
    expect(() => validateQuestion(hand())).not.toThrow()
  })

  it('accepts a well-formed cloze question', () => {
    expect(() => validateQuestion({ type: 'cloze', prompt: '____?', answer: 'x' })).not.toThrow()
  })

  it('rejects mc without enough choices', () => {
    expect(() => validateQuestion({ type: 'mc', prompt: 'p', choices: ['only'], answer: 0 }))
      .toThrow(QuestionValidationError)
  })

  it('rejects mc with answer out of range', () => {
    expect(() => validateQuestion({ type: 'mc', prompt: 'p', choices: ['a', 'b'], answer: 2 }))
      .toThrow(QuestionValidationError)
  })

  it('rejects unknown types and missing prompts', () => {
    expect(() => validateQuestion({ type: 'essay', prompt: 'p' })).toThrow(QuestionValidationError)
    expect(() => validateQuestion({ type: 'cloze', prompt: '', answer: 'x' })).toThrow(QuestionValidationError)
  })
})
