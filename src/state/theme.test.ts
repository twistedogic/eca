// @vitest-environment jsdom
import 'fake-indexeddb/auto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { applyTheme, currentTheme, loadTheme, toggleTheme } from './theme'
import { deleteSetting, getSetting, setSetting } from './db'

/** jsdom has no matchMedia; stand in for a device with the given preference. */
function stubDevice(dark: boolean): void {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: dark && query.includes('dark'),
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent: () => false,
  }))
}

beforeEach(async () => {
  await deleteSetting('theme')
  document.documentElement.removeAttribute('data-theme')
  document.documentElement.style.removeProperty('color-scheme')
  document.head.innerHTML = '<meta name="theme-color" content="#2563eb">'
  stubDevice(false)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('appearance', () => {
  it('falls back to the device preference when nothing is stored', async () => {
    stubDevice(true)
    expect(await loadTheme()).toBe('dark')
  })

  it('prefers the stored choice over the device preference', async () => {
    stubDevice(true)
    await setSetting('theme', 'light')
    expect(await loadTheme()).toBe('light')
  })

  it('applies the attribute, the UA scheme and the chrome colour together', () => {
    applyTheme('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(document.documentElement.style.getPropertyValue('color-scheme')).toBe('dark')
    expect(document.querySelector('meta[name="theme-color"]')?.getAttribute('content')).toBe('#0d1117')

    applyTheme('light')
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(document.documentElement.style.getPropertyValue('color-scheme')).toBe('light')
    expect(document.querySelector('meta[name="theme-color"]')?.getAttribute('content')).toBe('#2563eb')
  })

  it('reports the appearance that is on screen', () => {
    expect(currentTheme()).toBe('light')
    applyTheme('dark')
    expect(currentTheme()).toBe('dark')
  })

  it('flips the appearance that is on screen and saves the choice', async () => {
    applyTheme('dark')
    expect(toggleTheme()).toBe('light')
    expect(document.documentElement.dataset.theme).toBe('light')
    await vi.waitFor(async () => expect(await getSetting('theme')).toBe('light'))
    expect(await loadTheme()).toBe('light')
  })

  it('flips what is on screen even when the device preference says otherwise', async () => {
    stubDevice(true) // the device prefers dark
    applyTheme('light') // the app is showing light
    expect(toggleTheme()).toBe('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
  })
})
