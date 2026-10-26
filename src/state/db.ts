import { createStore, get, set, del, entries } from 'idb-keyval'
import type { CardState, ChapterProgress } from '../types'

const cardsStore = createStore('eca-cards', 'cards')
const chaptersStore = createStore('eca-chapters', 'chapters')
const settingsStore = createStore('eca-settings', 'settings')

/** Card key = question id (globally unique: `<topicId>-<chapterId>-q<n>`). */
export function getCard(id: string): Promise<CardState | undefined> {
  return get(id, cardsStore)
}

export function putCard(id: string, state: CardState): Promise<void> {
  return set(id, state, cardsStore)
}

export function deleteCard(id: string): Promise<void> {
  return del(id, cardsStore)
}

export function allCards(): Promise<[string, CardState][]> {
  return entries(cardsStore)
}

/** Chapter progress key = `<topicId>/<chapterId>`. */
export function getChapterProgress(key: string): Promise<ChapterProgress | undefined> {
  return get(key, chaptersStore)
}

export function putChapterProgress(key: string, p: ChapterProgress): Promise<void> {
  return set(key, p, chaptersStore)
}

export function allChapterProgress(): Promise<[string, ChapterProgress][]> {
  return entries(chaptersStore)
}

export function getSetting<T>(key: string): Promise<T | undefined> {
  return get<T>(key, settingsStore)
}

export function setSetting<T>(key: string, value: T): Promise<void> {
  return set(key, value, settingsStore)
}

/**
 * Drops stored cards whose question no longer exists (content was edited).
 * Returns the number of purged cards.
 */
export async function purgeCards(validIds: Set<string>): Promise<number> {
  const all = await allCards()
  let purged = 0
  for (const [id] of all) {
    if (!validIds.has(id)) {
      await deleteCard(id)
      purged++
    }
  }
  return purged
}
