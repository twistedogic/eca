import type { CardState } from '../types'

/** Leitner ladder (design D6): box 1..5 -> review interval in days. */
export const BOX_INTERVALS_DAYS = [1, 3, 7, 16, 35]

const DAY_MS = 24 * 60 * 60 * 1000

/** A missed answer enters the schedule at box 1, due tomorrow. */
export function newCard(now: number = Date.now()): CardState {
  return { box: 1, due: now + intervalMs(1) }
}

/** Correct: promote one box, next review at the new box's interval. */
export function onCorrect(c: CardState, now: number = Date.now()): CardState {
  const box = Math.min(c.box + 1, BOX_INTERVALS_DAYS.length)
  return { box, due: now + intervalMs(box) }
}

/** Wrong: collapse to box 1, due tomorrow. */
export function onWrong(_c: CardState, now: number = Date.now()): CardState {
  return { box: 1, due: now + intervalMs(1) }
}

export function isDue(c: CardState, now: number = Date.now()): boolean {
  return c.due <= now
}

/** Interval in days a card graded now would wait, per its (new) box. */
export function nextIntervalDays(box: number): number {
  return BOX_INTERVALS_DAYS[Math.min(Math.max(box, 1), BOX_INTERVALS_DAYS.length) - 1]
}

function intervalMs(box: number): number {
  return nextIntervalDays(box) * DAY_MS
}
