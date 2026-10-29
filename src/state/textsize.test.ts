// @vitest-environment jsdom
import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { applyTextSize, currentTextSize, loadTextSize, setTextSize } from './textsize'
import { deleteSetting, getSetting, setSetting } from './db'

beforeEach(async () => {
  await deleteSetting('textSize')
  document.documentElement.removeAttribute('data-text-size')
})

describe('text size', () => {
  it('falls back to the standard size when nothing is stored', async () => {
    expect(await loadTextSize()).toBe('md')
  })

  it('prefers the stored choice', async () => {
    await setSetting('textSize', 'xl')
    expect(await loadTextSize()).toBe('xl')
  })

  it('falls back to the standard size for an unknown stored value', async () => {
    await setSetting('textSize', 'huge')
    expect(await loadTextSize()).toBe('md')
  })

  it('applies the size as an attribute on the root element', () => {
    applyTextSize('lg')
    expect(document.documentElement.dataset.textSize).toBe('lg')
  })

  it('reports the size that is on screen', () => {
    expect(currentTextSize()).toBe('md')
    applyTextSize('sm')
    expect(currentTextSize()).toBe('sm')
  })

  it('applies the size and saves the choice', async () => {
    setTextSize('xl')
    expect(document.documentElement.dataset.textSize).toBe('xl')
    await vi.waitFor(async () => expect(await getSetting('textSize')).toBe('xl'))
    expect(await loadTextSize()).toBe('xl')
  })
})
