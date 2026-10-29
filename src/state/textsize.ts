import { getSetting, setSetting } from './db'

export type TextSize = 'sm' | 'md' | 'lg' | 'xl'

const KEY = 'textSize'

/** The sizes on offer, smallest first. `md` is the standard size. */
export const TEXT_SIZES: TextSize[] = ['sm', 'md', 'lg', 'xl']

/** The stored choice, or the standard size while the user has not chosen. */
export async function loadTextSize(): Promise<TextSize> {
  const stored = await getSetting<TextSize>(KEY)
  return isTextSize(stored) ? stored : 'md'
}

/** The size currently applied to the document. */
export function currentTextSize(): TextSize {
  const applied = document.documentElement.dataset.textSize
  return isTextSize(applied) ? applied : 'md'
}

/** Applies the size: one attribute on the root element scales the whole app. */
export function applyTextSize(size: TextSize): void {
  document.documentElement.dataset.textSize = size
}

/**
 * Applies the size and saves the choice.
 * Reads the applied size, never the stored one, so the control always changes
 * what the user can see.
 */
export function setTextSize(size: TextSize): void {
  applyTextSize(size)
  void setSetting(KEY, size).catch((err) => console.error('text size save failed', err))
}

function isTextSize(value: unknown): value is TextSize {
  return TEXT_SIZES.includes(value as TextSize)
}
