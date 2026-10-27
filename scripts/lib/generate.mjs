/**
 * Deterministic question generation from parsed chapters (design D4).
 * No LLM anywhere in this module: same content in, same questions out.
 */

function maskTerm(sentence, term) {
  const re = new RegExp(`\\*\\*${escapeRe(term)}\\*\\*`, 'i')
  return sentence.replace(re, '____')
}

function stripBold(text) {
  return text.replace(/\*\*(.+?)\*\*/g, '$1')
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Generates auto questions per chapter, in document order:
 * definition MCs for every key term, then clozes for quoted key sentences.
 * MC distractors are sibling key terms, preferring the ones from the same
 * chapter; a term with no siblings produces no MC (a question needs at
 * least one distractor).
 */
export function generateAutoQuestions(chapters) {
  const topicTerms = collectTerms(chapters)

  return chapters.map((ch) => {
    const chapterTerms = collectTerms([ch])
    const mcs = []
    for (const t of ch.terms) {
      const distractors = pickDistractors(t.term, chapterTerms, topicTerms)
      if (distractors.length === 0) continue
      const choices = rotate([t.term, ...distractors], mcs.length)
      mcs.push({
        type: 'mc',
        sectionId: t.sectionId,
        term: t.term,
        prompt: `Which key term fits: "${stripBold(maskTerm(t.rawSentence, t.term))}"`,
        choices,
        answer: choices.indexOf(t.term),
        explanation: stripBold(t.rawSentence),
        source: 'auto',
      })
    }

    const clozes = ch.clozes.map((c) => ({
      type: 'cloze',
      sectionId: c.sectionId,
      term: c.term,
      prompt: stripBold(maskTerm(c.rawSentence, c.term)),
      answer: c.term,
      explanation: stripBold(c.rawSentence),
      source: 'auto',
    }))

    return [...mcs, ...clozes]
  })
}

/** Key terms of the given chapters, deduped case-insensitively, in document order. */
function collectTerms(chapters) {
  const terms = []
  const seen = new Set()
  for (const ch of chapters) {
    for (const t of ch.terms) {
      const key = t.term.toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      terms.push(t.term)
    }
  }
  return terms
}

/**
 * Up to 3 sibling terms as distractors. Chapter siblings come first: a
 * reader choosing between "hash map" and "adjacency list" is answering a
 * question about that chapter, not about complexity classes. The rest of
 * the topic tops the list up so every MC keeps four choices.
 */
function pickDistractors(term, chapterTerms, topicTerms) {
  const isOther = (t) => t.toLowerCase() !== term.toLowerCase()
  const picked = chapterTerms.filter(isOther).slice(0, 3)
  if (picked.length === 3) return picked
  for (const t of topicTerms) {
    if (picked.length === 3) break
    if (!isOther(t) || picked.includes(t)) continue
    picked.push(t)
  }
  return picked
}

/** Deterministic rotation so the answer is not always the first choice. */
function rotate(arr, by) {
  const n = arr.length
  const k = ((by % n) + n) % n
  return [...arr.slice(k), ...arr.slice(0, k)]
}
