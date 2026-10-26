/**
 * Optional LLM drafting pass (design D5). Direct HTTPS call, no SDK.
 * Drafts only — the pipeline never publishes them without `status: approved`.
 */

const DEFAULT_MODEL = 'claude-haiku-4-5'

function baseUrl() {
  return process.env.LLM_BASE_URL ?? 'https://api.anthropic.com'
}

/**
 * Draft MC questions for one chapter.
 * @returns {Promise<Array>} validated `{chapterId, type:'mc', prompt, choices, answer, explanation}` entries
 */
export async function draftQuestionsForChapter({ apiKey, model, topicTitle, chapterMarkdown }) {
  const res = await fetch(`${baseUrl()}/v1/messages`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: model || DEFAULT_MODEL,
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: `You write study quiz questions for the topic "${topicTitle}".

Below is a chapter of study material. Draft 3 to 5 multiple-choice questions that test *understanding*, not trivia recall: "which trade-off", "what happens when", "which strategy fits".

Return ONLY a JSON array, no prose, in the shape:
[{"prompt": "...", "choices": ["...", "...", "...", "..."], "answer": 0, "explanation": "..." }]
"answer" is the 0-based index of the correct choice. Exactly one correct choice per question.

<chapter>
${chapterMarkdown}
</chapter>`,
        },
      ],
    }),
  })
  if (!res.ok) {
    throw new Error(`LLM API ${res.status}: ${(await res.text()).slice(0, 300)}`)
  }
  const data = await res.json()
  const text = (data.content ?? []).map((b) => b.text ?? '').join('')

  const parsed = extractJsonArray(text)
  if (!Array.isArray(parsed)) throw new Error('LLM response contained no JSON array')

  return parsed
    .filter((q) => q && typeof q === 'object' && typeof q.prompt === 'string')
    .map((q) => ({
      type: 'mc',
      prompt: q.prompt,
      choices: Array.isArray(q.choices) ? q.choices.map(String) : [],
      answer: Number.isInteger(q.answer) ? q.answer : -1,
      explanation: typeof q.explanation === 'string' ? q.explanation : '',
    }))
    .filter((q) => q.choices.length >= 2 && q.answer >= 0 && q.answer < q.choices.length)
}

/** Pull the first JSON array out of model output (models like to add prose). */
function extractJsonArray(text) {
  const start = text.indexOf('[')
  const end = text.lastIndexOf(']')
  if (start === -1 || end <= start) return null
  try {
    return JSON.parse(text.slice(start, end + 1))
  } catch {
    return null
  }
}
