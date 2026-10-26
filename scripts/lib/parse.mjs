import { marked } from 'marked'

export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function stripBold(text) {
  return text.replace(/\*\*(.+?)\*\*/g, '$1')
}

/**
 * Parse one chapter markdown file.
 *
 * Conventions (see content/README.md):
 *   `# H1`   chapter title
 *   `## H2`  section boundary (ref target for quiz feedback links)
 *   `**x**`  key term -> generated definition MC
 *   `> quote with **term**` -> generated cloze
 *
 * Returns { topicId, chapterId, title, readMinutes,
 *           sections: [{id, title, html}],
 *           terms: [{term, sectionId, rawSentence}],
 *           clozes: [{term, sectionId, rawSentence}] }
 */
export function parseChapter({ markdown, topicId, chapterId }) {
  const lines = markdown.split('\n')

  const sections = []
  let title = null
  let current = { id: 'intro', title: null, md: [] }
  const quoteBlocks = []
  let inQuote = false

  const pushSection = () => {
    if (current.md.some((l) => l.trim())) sections.push(current)
  }

  for (const line of lines) {
    const h1 = line.match(/^#\s+(?!#)(.*)$/)
    const h2 = line.match(/^##\s+(?!#)(.*)$/)
    const quote = line.match(/^>\s?(.*)$/)

    if (h1) {
      if (!title) title = h1[1].trim()
      continue
    }
    if (h2) {
      pushSection()
      current = { id: slugify(h2[1]), title: h2[1].trim(), md: [] }
      inQuote = false
      continue
    }
    if (quote) {
      if (!inQuote) {
        quoteBlocks.push({ section: current, lines: [] })
        inQuote = true
      }
      quoteBlocks[quoteBlocks.length - 1].lines.push(quote[1])
      continue
    }
    inQuote = false
    current.md.push(line)
  }
  pushSection()

  title = title ?? chapterId
  if (sections.length && sections[0].id === 'intro') sections[0].title = title

  const words = markdown.split(/\s+/).filter(Boolean).length
  const readMinutes = Math.max(1, Math.round(words / 200))

  // key terms: first occurrence per term, in document order — scanned per
  // paragraph (joined lines), because markdown wraps sentences across lines
  const terms = []
  const seenTerms = new Set()
  for (const section of sections) {
    const paragraphs = section.md
      .join('\n')
      .split(/\n\s*\n+/)
      .map((p) => p.replace(/\s+/g, ' ').trim())
      .filter(Boolean)
    for (const para of paragraphs) {
      for (const m of para.matchAll(/\*\*(.+?)\*\*/g)) {
        const term = m[1].trim()
        if (seenTerms.has(term.toLowerCase())) continue
        seenTerms.add(term.toLowerCase())
        terms.push({ term, sectionId: section.id, rawSentence: findSentence(para, term) })
      }
    }
  }

  // clozes: one per quote block containing a bold term (first term in the block)
  const clozes = []
  const seenCloze = new Set()
  for (const block of quoteBlocks) {
    const text = block.lines.join(' ')
    const m = text.match(/\*\*(.+?)\*\*/)
    if (!m) continue
    const key = text.replace(/\s+/g, ' ').trim()
    if (seenCloze.has(key)) continue
    seenCloze.add(key)
    clozes.push({ term: m[1].trim(), sectionId: block.section.id, rawSentence: text })
  }

  return {
    topicId,
    chapterId,
    title,
    readMinutes,
    sections: sections.map((s) => ({
      id: s.id,
      title: s.title ?? s.id,
      html: marked.parse(s.md.join('\n'), { async: false }),
    })),
    terms,
    clozes,
  }
}

/** The sentence (not the whole line) containing the term's first occurrence. */
function findSentence(termLine, term) {
  const clean = termLine.trim().replace(/\s+/g, ' ')
  const parts = clean.split(/(?<=[.!?])\s+/)
  return parts.find((p) => p.includes(`**${term}**`)) ?? clean
}
