import { describe, it, expect } from 'vitest'
import { newCard, onCorrect, onWrong, isDue, nextIntervalDays, BOX_INTERVALS_DAYS } from './scheduler'

const T0 = 1_700_000_000_000
const DAY = 24 * 60 * 60 * 1000

describe('Leitner scheduler', () => {
  it('enters missed answers at box 1, due tomorrow', () => {
    expect(newCard(T0)).toEqual({ box: 1, due: T0 + 1 * DAY })
  })

  it('promotes one box per correct answer and schedules further out each time', () => {
    let c = newCard(T0) // box 1
    const seenDue = [c.due]
    for (const expectedBox of [2, 3, 4, 5]) {
      c = onCorrect(c, T0)
      expect(c.box).toBe(expectedBox)
      seenDue.push(c.due)
    }
    // strictly increasing gaps
    for (let i = 1; i < seenDue.length; i++) {
      expect(seenDue[i] - T0).toBeGreaterThan(seenDue[i - 1] - T0)
    }
    expect(seenDue).toEqual([
      T0 + 1 * DAY,
      T0 + 3 * DAY,
      T0 + 7 * DAY,
      T0 + 16 * DAY,
      T0 + 35 * DAY,
    ])
  })

  it('caps at the top box', () => {
    const top = { box: 5, due: T0 }
    expect(onCorrect(top, T0).box).toBe(5)
    expect(onCorrect(top, T0).due).toBe(T0 + 35 * DAY)
  })

  it('collapses to box 1, due in about a day, on a wrong answer', () => {
    const c = { box: 4, due: T0 + 100 * DAY }
    const wrong = onWrong(c, T0)
    expect(wrong).toEqual({ box: 1, due: T0 + 1 * DAY })
  })

  it('isDue compares against now', () => {
    const c = { box: 1, due: T0 + DAY }
    expect(isDue(c, T0 + DAY - 1)).toBe(false)
    expect(isDue(c, T0 + DAY)).toBe(true)
    expect(isDue(c, T0 + DAY + 1)).toBe(true)
  })

  it('exposes the interval ladder', () => {
    expect(BOX_INTERVALS_DAYS).toEqual([1, 3, 7, 16, 35])
    expect(nextIntervalDays(3)).toBe(7)
    expect(nextIntervalDays(99)).toBe(35) // clamped
    expect(nextIntervalDays(0)).toBe(1) // clamped
  })
})
