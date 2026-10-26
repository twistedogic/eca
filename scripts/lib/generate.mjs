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
 * MC distractors are sibling key terms from the same topic; a term with
 * no siblings produces no MC (a question needs at least one distractor).
 */
export function generateAutoQuestions(chapters) {
  const topicTerms = []
  const seen = new Set()
  for (const ch of chapters) {
    for (const t of ch.terms) {
      const key = t.term.toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      topicTerms.push(t.term)
    }
  }

  return chapters.map((ch) => {
    const mcs = []
    for (const t of ch.terms) {
      const distractors = pickDistractors(t.term, topicTerms)
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

/** Up to 3 sibling terms from the same topic, in topic document order. */
function pickDistractors(term, topicTerms) {
  return topicTerms.filter((t) => t.toLowerCase() !== term.toLowerCase()).slice(0, 3)
}

/** Deterministic rotation so the answer is not always the first choice. */
function rotate(arr, by) {
  const n = arr.length
  const k = ((by % n) + n) % n
  return [...arr.slice(k), ...arr.slice(0, k)]
}
