import { getSetting, setSetting } from './db'

export type Theme = 'light' | 'dark'

const KEY = 'theme'

/** The stored choice, or the device preference while the user has not chosen. */
export async function loadTheme(): Promise<Theme> {
  const stored = await getSetting<Theme>(KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return deviceTheme()
}

/** The appearance currently applied to the document. */
export function currentTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

/** Applies the appearance: token override, UA surfaces, browser chrome colour. */
export function applyTheme(theme: Theme): void {
  const root = document.documentElement
  root.dataset.theme = theme
  root.style.setProperty('color-scheme', theme)
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', theme === 'dark' ? '#0d1117' : '#2563eb')
}

/**
 * Flips the appearance that is on screen and saves the choice.
 * Reads the applied appearance, never the stored one, so the control always
 * changes what the user can see.
 */
export function toggleTheme(): Theme {
  const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark'
  applyTheme(next)
  void setSetting(KEY, next).catch((err) => console.error('theme save failed', err))
  return next
}

function deviceTheme(): Theme {
  const dark = typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches
  return dark ? 'dark' : 'light'
}
