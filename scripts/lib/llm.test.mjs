import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createServer } from 'node:http'
import { draftQuestionsForChapter } from './llm.mjs'

// A local stand-in for the LLM API (LLM_BASE_URL points the pipeline at a
// proxy) so the drafting flow is testable without a real key.
let server
let lastRequest

beforeAll(async () => {
  server = createServer((req, res) => {
    let body = ''
    req.on('data', (c) => (body += c))
    req.on('end', () => {
      lastRequest = JSON.parse(body)
      res.setHeader('content-type', 'application/json')
      res.end(
        JSON.stringify({
          content: [
            {
              type: 'text',
              text:
                'Here are your questions:\n' +
                JSON.stringify([
                  { prompt: 'Good question?', choices: ['a', 'b', 'c', 'd'], answer: 1, explanation: 'because' },
                  { prompt: 'Bad answer index?', choices: ['a', 'b'], answer: 9, explanation: '' },
                  { prompt: 'Too few choices?', choices: ['a'], answer: 0, explanation: '' },
                  { prompt: 'Another good one?', choices: ['x', 'y', 'z'], answer: 2, explanation: 'sure' },
                ]),
            },
          ],
        }),
      )
    })
  })
  await new Promise((r) => server.listen(0, r))
  process.env.LLM_BASE_URL = `http://localhost:${server.address().port}`
})

afterAll(async () => {
  delete process.env.LLM_BASE_URL
  await new Promise((r) => server.close(r))
})

describe('draftQuestionsForChapter', () => {
  it('calls the API with the configured model and keeps only valid questions', async () => {
    const questions = await draftQuestionsForChapter({
      apiKey: 'test-key',
      model: 'test-model',
      topicTitle: 'Test Topic',
      chapterMarkdown: '# Chapter\n\nSome content.',
    })
    expect(questions).toHaveLength(2) // invalid entries filtered out
    expect(questions[0]).toMatchObject({ type: 'mc', prompt: 'Good question?', answer: 1 })
    expect(questions[1].prompt).toBe('Another good one?')
    expect(lastRequest.model).toBe('test-model')
    expect(lastRequest.messages[0].content).toContain('# Chapter')
  })

  it('fails clearly when the API errors', async () => {
    const failing = createServer((req, res) => {
      res.statusCode = 500
      res.end('boom')
    })
    await new Promise((r) => failing.listen(0, r))
    const saved = process.env.LLM_BASE_URL
    process.env.LLM_BASE_URL = `http://localhost:${failing.address().port}`
    try {
      await expect(
        draftQuestionsForChapter({ apiKey: 'k', model: 'm', topicTitle: 'T', chapterMarkdown: 'x' }),
      ).rejects.toThrow('LLM API 500')
    } finally {
      process.env.LLM_BASE_URL = saved
      await new Promise((r) => failing.close(r))
    }
  })
})
