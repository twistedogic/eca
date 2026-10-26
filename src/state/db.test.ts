import 'fake-indexeddb/auto'
import { describe, it, expect, beforeEach } from 'vitest'
import {
  getCard, putCard, deleteCard, allCards,
  getChapterProgress, putChapterProgress, allChapterProgress,
  getSetting, setSetting, purgeCards,
} from './db'

// fake-indexeddb persists between tests within a file; clear via deleteCard/known keys
beforeEach(async () => {
  for (const [id] of await allCards()) await deleteCard(id)
})

describe('card store', () => {
  it('round-trips a card state', async () => {
    expect(await getCard('t1-c1-q1')).toBeUndefined()
    await putCard('t1-c1-q1', { box: 1, due: 1000 })
    expect(await getCard('t1-c1-q1')).toEqual({ box: 1, due: 1000 })
    await putCard('t1-c1-q1', { box: 3, due: 2000 })
    expect(await getCard('t1-c1-q1')).toEqual({ box: 3, due: 2000 })
    await deleteCard('t1-c1-q1')
    expect(await getCard('t1-c1-q1')).toBeUndefined()
  })

  it('lists all cards', async () => {
    await putCard('a-q1', { box: 1, due: 1 })
    await putCard('b-q2', { box: 2, due: 2 })
    const all = await allCards()
    expect(all.length).toBeGreaterThanOrEqual(2)
    expect(all).toContainEqual(['a-q1', { box: 1, due: 1 }])
    expect(all).toContainEqual(['b-q2', { box: 2, due: 2 }])
  })
})

describe('chapter progress store', () => {
  it('round-trips chapter progress', async () => {
    const key = 'topic-a/ch01'
    expect(await getChapterProgress(key)).toBeUndefined()
    const p = { opened: true, quizTaken: false, scrollPct: 42 }
    await putChapterProgress(key, p)
    expect(await getChapterProgress(key)).toEqual(p)
    await putChapterProgress(key, { ...p, quizTaken: true })
    expect((await getChapterProgress(key))?.quizTaken).toBe(true)
  })

  it('lists all chapter progress', async () => {
    await putChapterProgress('t/c', { opened: true, quizTaken: false })
    const all = await allChapterProgress()
    expect(all).toContainEqual(['t/c', { opened: true, quizTaken: false }])
  })
})

describe('settings store', () => {
  it('round-trips a setting', async () => {
    await setSetting('theme', 'light')
    expect(await getSetting<string>('theme')).toBe('light')
    await setSetting('theme', 'dark')
    expect(await getSetting<string>('theme')).toBe('dark')
  })
})

describe('purgeCards', () => {
  it('removes cards whose question no longer exists and reports the count', async () => {
    await putCard('keep-q1', { box: 1, due: 1 })
    await putCard('keep-q2', { box: 2, due: 2 })
    await putCard('stale-q9', { box: 5, due: 3 })
    const purged = await purgeCards(new Set(['keep-q1', 'keep-q2']))
    expect(purged).toBe(1)
    expect(await getCard('stale-q9')).toBeUndefined()
    expect(await getCard('keep-q1')).toBeDefined()
  })
})
