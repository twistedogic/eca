import type { ChapterProgress, ChapterStatus, QuizData } from '../types'
import { allCards, allChapterProgress } from './db'
import { isDue } from './scheduler'

export function chapterKey(topicId: string, chapterId: string): string {
  return `${topicId}/${chapterId}`
}

/**
 * new -> in-progress -> done, with review-due overriding done.
 * `weakCount` = cards of that chapter that are not yet beaten (box 1) or
 * are due right now — a chapter with missed answers stays "review due"
 * until the misses have been answered correctly at least once.
 */
export function chapterStatus(
  p: ChapterProgress | undefined,
  weakCount: number,
): ChapterStatus {
  if (!p || !p.opened) return 'new'
  if (!p.quizTaken) return 'in-progress'
  return weakCount > 0 ? 'review-due' : 'done'
}

export interface TopicProgressInfo {
  completed: number
  total: number
  pct: number
}

export function topicProgress(
  keys: string[],
  progressByKey: Map<string, ChapterProgress>,
): TopicProgressInfo {
  const completed = keys.filter((k) => progressByKey.get(k)?.quizTaken).length
  const total = keys.length
  return { completed, total, pct: total === 0 ? 0 : Math.round((completed / total) * 100) }
}

export interface DueInfo {
  byTopic: Map<string, number>
  /** per chapter: cards that are due now or not yet beaten (box 1). */
  weakByChapter: Map<string, number>
  total: number
}

/**
 * Counts due cards per topic and per chapter. Cards whose question no
 * longer exists are ignored here (and purged by review sessions).
 */
export async function dueInfo(quiz: QuizData | null, now: number = Date.now()): Promise<DueInfo> {
  const byTopic = new Map<string, number>()
  const weakByChapter = new Map<string, number>()
  let total = 0
  if (!quiz) return { byTopic, weakByChapter, total }

  const questionById = new Map(quiz.questions.map((q) => [q.id, q]))
  for (const [id, card] of await allCards()) {
    const q = questionById.get(id)
    if (!q) continue
    const ck = chapterKey(q.topicId, q.chapterId)
    // box 1 = never answered correctly: still weak, even before it is due
    if (isDue(card, now) || card.box === 1) {
      weakByChapter.set(ck, (weakByChapter.get(ck) ?? 0) + 1)
    }
    if (!isDue(card, now)) continue
    total++
    byTopic.set(q.topicId, (byTopic.get(q.topicId) ?? 0) + 1)
  }
  return { byTopic, weakByChapter, total }
}

export async function progressMap(): Promise<Map<string, ChapterProgress>> {
  return new Map(await allChapterProgress())
}

/** ~13 seconds per card, rounded up to whole minutes (mockup: 14 cards ~ 3 min). */
export function estimatedMinutes(cards: number): number {
  return Math.max(1, Math.round((cards * 13) / 60))
}
