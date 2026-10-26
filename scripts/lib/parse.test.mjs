import { describe, it, expect } from 'vitest'
import { parseChapter, slugify } from './parse.mjs'

const MD = `# Caching

A cache stores copies of data. When a request is served from the cache, that is a **cache hit**. Otherwise it is a **cache miss**.

## Strategies

The application manages the cache itself in **cache-aside**.

> A **cache hit** means the request was served from the cache
> without hitting the origin.

## Eviction

No bold terms here, just plain text.
`

describe('parseChapter', () => {
  const ch = parseChapter({ markdown: MD, topicId: 't', chapterId: '03-caching' })

  it('extracts the h1 title', () => {
    expect(ch.title).toBe('Caching')
  })

  it('splits sections at h2 with slug ids, intro included', () => {
    expect(ch.sections.map((s) => s.id)).toEqual(['intro', 'strategies', 'eviction'])
    expect(ch.sections[0].title).toBe('Caching')
    expect(ch.sections[1].title).toBe('Strategies')
  })

  it('renders section html', () => {
    expect(ch.sections[0].html).toContain('cache stores copies of data')
    expect(ch.sections[0].html).toContain('<strong>cache hit</strong>')
  })

  it('collects key terms in document order with first-occurrence section', () => {
    expect(ch.terms.map((t) => t.term)).toEqual(['cache hit', 'cache miss', 'cache-aside'])
    expect(ch.terms[0].sectionId).toBe('intro')
    expect(ch.terms[2].sectionId).toBe('strategies')
  })

  it('captures the sentence containing each term', () => {
    expect(ch.terms[0].rawSentence).toContain('**cache hit**')
  })

  it('makes one cloze per quoted key sentence, multi-line quotes joined', () => {
    expect(ch.clozes).toHaveLength(1)
    expect(ch.clozes[0].term).toBe('cache hit')
    expect(ch.clozes[0].sectionId).toBe('strategies')
    expect(ch.clozes[0].rawSentence).toContain('without hitting the origin')
  })

  it('quotes without a bold term produce no cloze', () => {
    const md = '# T\n\n> Just a quote, no bold.\n'
    const parsed = parseChapter({ markdown: md, topicId: 't', chapterId: 'x' })
    expect(parsed.clozes).toHaveLength(0)
  })

  it('computes read minutes of at least 1', () => {
    expect(ch.readMinutes).toBeGreaterThanOrEqual(1)
  })
})

describe('slugify', () => {
  it('slugifies headings', () => {
    expect(slugify('What is caching?!')).toBe('what-is-caching')
    expect(slugify('  Load  balancing ')).toBe('load-balancing')
  })
})
