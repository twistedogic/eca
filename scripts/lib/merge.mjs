/**
 * Merge question sources per chapter (design D4 step 4):
 * hand-written > generated for the same term; approved AI joins;
 * one stable sequential id per chapter.
 */

export class QuestionValidationError extends Error {}

/**
 * Validates a hand-written or AI-drafted question. Throws
 * QuestionValidationError describing the problem; the CLI attaches
 * the file name.
 */
export function validateQuestion(q) {
  const where = q.term ? `question for term "${q.term}"` : 'question'
  if (!q || typeof q !== 'object') throw new QuestionValidationError(`${where}: not an object`)
  if (q.type === 'mc') {
    if (!Array.isArray(q.choices) || q.choices.length < 2) {
      throw new QuestionValidationError(`${where}: "choices" must be an array of at least 2`)
    }
    if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.choices.length) {
      throw new QuestionValidationError(`${where}: "answer" must be an index into "choices"`)
    }
  } else if (q.type === 'cloze') {
    if (typeof q.answer !== 'string' || !q.answer.trim()) {
      throw new QuestionValidationError(`${where}: cloze needs a non-empty "answer" string`)
    }
  } else {
    throw new QuestionValidationError(`${where}: "type" must be "mc" or "cloze"`)
  }
  if (typeof q.prompt !== 'string' || !q.prompt.trim()) {
    throw new QuestionValidationError(`${where}: needs a non-empty "prompt"`)
  }
  return true
}

/**
 * @param {string} topicId
 * @param {string} chapterId
 * @param {Array} auto    generated questions (mc/cloze, source 'auto')
 * @param {Array} hand    hand-written questions, validated
 * @param {Array} ai      approved AI questions, validated
 * @returns merged array with stable ids `<topicId>-<chapterId>-q<n>`
 *   in order: generated MCs, generated clozes, hand-written, approved AI.
 */
export function mergeQuestions({ topicId, chapterId, auto = [], hand = [], ai = [] }) {
  const overridden = new Set(
    hand.filter((q) => q.term).map((q) => q.term.toLowerCase()),
  )

  const keptAuto = auto.filter((q) => {
    if (q.term && overridden.has(q.term.toLowerCase())) return false
    return true
  })

  // drop duplicate generated prompts (same sentence quoted twice, etc.)
  const seenPrompt = new Set()
  const dedupedAuto = keptAuto.filter((q) => {
    if (seenPrompt.has(q.prompt)) return false
    seenPrompt.add(q.prompt)
    return true
  })

  return [...dedupedAuto, ...hand, ...ai].map((q, i) => ({
    ...q,
    id: `${topicId}-${chapterId}-q${i + 1}`,
    topicId,
    chapterId,
  }))
}
