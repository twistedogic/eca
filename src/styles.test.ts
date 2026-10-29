import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const css = readFileSync('src/styles.css', 'utf8')

describe('stylesheet', () => {
  it('takes every font size from the type scale', () => {
    const sizes = [...css.matchAll(/font-size:\s*([^;]+);/g)].map((m) => m[1].trim())
    expect(sizes.length).toBeGreaterThan(20)
    for (const size of sizes) {
      // the scale steps, or the root size the scale multiplies
      expect(size).toMatch(/^var\(--fs-|var\(--text-scale\)/)
    }

    const defined = new Set([...css.matchAll(/(--fs-[\w-]+):/g)].map((m) => m[1]))
    const used = new Set([...css.matchAll(/var\((--fs-[\w-]+)\)/g)].map((m) => m[1]))
    expect(used.size).toBeGreaterThan(3)
    for (const name of used) expect(defined.has(name)).toBe(true)
  })
})
