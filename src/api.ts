import type { ContentData, QuizData } from './types'

const base = import.meta.env.BASE_URL

export async function loadContent(): Promise<ContentData> {
  const res = await fetch(`${base}content.json`)
  if (!res.ok) throw new Error(`content.json: ${res.status}`)
  return res.json()
}

export async function loadQuiz(): Promise<QuizData> {
  const res = await fetch(`${base}quiz.json`)
  if (!res.ok) throw new Error(`quiz.json: ${res.status}`)
  return res.json()
}
