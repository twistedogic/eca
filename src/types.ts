export interface Section {
  id: string
  title: string
  html: string
}

export interface Chapter {
  id: string
  title: string
  sections: Section[]
  readMinutes: number
}

export interface Topic {
  id: string
  title: string
  chapters: Chapter[]
}

export type QuestionSource = 'auto' | 'ai' | 'hand'

interface QuestionBase {
  id: string
  topicId: string
  chapterId: string
  sectionId: string
  prompt: string
  explanation: string
  source: QuestionSource
  term?: string
}

export interface MCQuestion extends QuestionBase {
  type: 'mc'
  choices: string[]
  answer: number
}

export interface ClozeQuestion extends QuestionBase {
  type: 'cloze'
  answer: string
}

export type Question = MCQuestion | ClozeQuestion

export interface ContentData {
  topics: Topic[]
}

export interface QuizData {
  questions: Question[]
}

/** Per-question review memory. box 1..5, due = epoch ms. */
export interface CardState {
  box: number
  due: number
}

export interface ChapterProgress {
  opened: boolean
  scrollPct?: number
  quizTaken: boolean
  lastScore?: { correct: number; total: number }
  lastQuizAt?: number
}

export type ChapterStatus = 'new' | 'in-progress' | 'done' | 'review-due'
