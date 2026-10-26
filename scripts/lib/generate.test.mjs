import { describe, it, expect } from 'vitest'
import { parseChapter } from './parse.mjs'
import { generateAutoQuestions } from './generate.mjs'

function chapter(md, id) {
  return parseChapter({ markdown: md, topicId: 't', chapterId: id })
}

describe('generateAutoQuestions', () => {
  it('generates a definition MC per key term with sibling distractors', () => {
    const md = `# T
A **cache hit** is serving from the cache. A **cache miss** is not.
B **load balancer** spreads traffic. C **LRU** evicts old entries.
`
    const auto = generateAutoQuestions([chapter(md, 'c1')])
    expect(auto).toHaveLength(1)
    const qs = auto[0]
    expect(qs).toHaveLength(4) // one MC per term, no clozes

    const hit = qs.find((q) => q.term === 'cache hit')
    expect(hit.type).toBe('mc')
    expect(hit.choices).toContain('cache hit')
    expect(hit.choices).toContain('cache miss') // sibling distractor
    expect(hit.choices).toContain('load balancer')
    expect(hit.answer).toBe(hit.choices.indexOf('cache hit'))
    expect(hit.source).toBe('auto')
    expect(hit.prompt).toContain('____')
    expect(hit.prompt).not.toContain('**cache hit**')
    expect(hit.prompt).toContain('Which key term fits')
    expect(hit.explanation).toContain('cache hit')
  })

  it('never repeats a choice', () => {
    const md = `# T
A **x** is one. B **y** is two.
`
    const [qs] = generateAutoQuestions([chapter(md, 'c1')])
    for (const q of qs) {
      expect(new Set(q.choices).size).toBe(q.choices.length)
    }
  })

  it('generates a cloze from a quoted key sentence with the term blanked', () => {
    const md = `# T
Body text. **term one** here, **term two** there.

> A **term one** does the thing well.
`
    const [qs] = generateAutoQuestions([chapter(md, 'c1')])
    const cloze = qs.find((q) => q.type === 'cloze')
    expect(cloze).toBeDefined()
    expect(cloze.prompt).toBe('A ____ does the thing well.')
    expect(cloze.answer).toBe('term one')
    expect(cloze.explanation).toBe('A term one does the thing well.')
  })

  it('produces no questions for a chapter without key terms', () => {
    const md = `# T
Just plain text, nothing bold, nothing quoted.
`
    const [qs] = generateAutoQuestions([chapter(md, 'c1')])
    expect(qs).toHaveLength(0)
  })

  it('skips the MC when a term has no siblings in the topic', () => {
    const md = `# T
Only **one lonely term** exists here.
`
    const [qs] = generateAutoQuestions([chapter(md, 'c1')])
    expect(qs).toHaveLength(0)
  })

  it('spreads the answer position deterministically', () => {
    const md = `# T
A **a** is 1. B **b** is 2. C **c** is 3. D **d** is 4.
`
    const [qs] = generateAutoQuestions([chapter(md, 'c1')])
    const answers = qs.map((q) => q.answer)
    expect(new Set(answers).size).toBeGreaterThan(1) // not all index 0
    // deterministic: same input, same output
    const [qs2] = generateAutoQuestions([chapter(md, 'c1')])
    expect(qs2).toEqual(qs)
  })

  it('is deterministic across runs', () => {
    const md = `# T
A **x** is one. B **y** is two.

> A **y** does things.
`
    const a = generateAutoQuestions([chapter(md, 'c1')])
    const b = generateAutoQuestions([chapter(md, 'c1')])
    expect(a).toEqual(b)
  })
})
