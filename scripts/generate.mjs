#!/usr/bin/env node
/**
 * Content pipeline CLI (design D4/D5).
 * Reads content/, writes public/content.json + public/quiz.json.
 *
 * LLM drafting (opt-in): with LLM_API_KEY set, creates ai-drafts.yaml
 * once per topic (status: draft). The file is then maintainer-owned;
 * only `status: approved` entries are published.
 */
import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { parse as parseYaml } from 'yaml'
import { parseChapter } from './lib/parse.mjs'
import { generateAutoQuestions } from './lib/generate.mjs'
import { mergeQuestions, validateQuestion, QuestionValidationError } from './lib/merge.mjs'
import { draftQuestionsForChapter } from './lib/llm.mjs'

const CONTENT_DIR = 'content'
const OUT_DIR = 'public'

function titleCase(id) {
  return id.split('-').map((w) => w[0]?.toUpperCase() + w.slice(1)).join(' ')
}

async function loadTopics() {
  const entries = await readdir(CONTENT_DIR, { withFileTypes: true })
  const topics = []
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const dir = join(CONTENT_DIR, entry.name)
    const files = (await readdir(dir)).filter((f) => f.endsWith('.md')).sort()
    if (files.length === 0) continue

    let title = titleCase(entry.name)
    const metaPath = join(dir, 'topic.yaml')
    if (existsSync(metaPath)) {
      const meta = parseYaml(await readFile(metaPath, 'utf8'))
      if (meta?.title) title = meta.title
    }
    topics.push({ id: entry.name, title, dir, chapterFiles: files })
  }
  return topics
}

async function loadHandQuestions(topicDir, chapterFile) {
  const sidecar = join(topicDir, chapterFile.replace(/\.md$/, '.quiz.yaml'))
  if (!existsSync(sidecar)) return []
  const doc = parseYaml(await readFile(sidecar, 'utf8'))
  const questions = Array.isArray(doc?.questions) ? doc.questions : []
  for (const q of questions) {
    try {
      validateQuestion(q)
    } catch (err) {
      if (err instanceof QuestionValidationError) {
        throw new Error(`${sidecar}: ${err.message}`)
      }
      throw err
    }
  }
  return questions.map((q) => ({ ...q, sectionId: q.sectionId ?? 'intro', explanation: q.explanation ?? '', source: 'hand' }))
}

async function loadAiQuestions(topicDir) {
  const draftsPath = join(topicDir, 'ai-drafts.yaml')
  if (!existsSync(draftsPath)) return { approved: [], draftsPath }
  const doc = parseYaml(await readFile(draftsPath, 'utf8'))
  const questions = Array.isArray(doc?.questions) ? doc.questions : []
  const approved = []
  for (const [i, q] of questions.entries()) {
    if (q?.status !== 'approved') continue
    try {
      validateQuestion(q)
    } catch (err) {
      if (err instanceof QuestionValidationError) {
        throw new Error(`${draftsPath} [${i}]: ${err.message}`)
      }
      throw err
    }
    approved.push({ ...q, sectionId: q.sectionId ?? 'intro', explanation: q.explanation ?? '', source: 'ai' })
  }
  return { approved, draftsPath }
}

async function maybeDraftAiQuestions(topic, chapters, apiKey, model) {
  const draftsPath = join(topic.dir, 'ai-drafts.yaml')
  if (!apiKey || existsSync(draftsPath)) return
  console.log(`  drafting AI questions for "${topic.title}" (drafts only, review ${draftsPath})`)
  const drafts = []
  for (const chapter of chapters) {
    try {
      const markdown = await readFile(join(topic.dir, `${chapter.chapterId}.md`), 'utf8')
      const drafted = await draftQuestionsForChapter({
        apiKey, model, topicTitle: topic.title, chapterMarkdown: markdown,
      })
      for (const q of drafted) {
        drafts.push({ status: 'draft', ...q, chapterId: chapter.chapterId })
      }
    } catch (err) {
      console.warn(`  ! LLM drafting failed for ${chapter.chapterId}: ${err.message}`)
    }
  }
  if (drafts.length > 0) {
    await writeFile(draftsPath, '# AI-drafted questions — review each entry, set status: approved to publish.\n' +
      '# The pipeline never touches this file again after creating it.\n' +
      (await import('yaml')).stringify({ questions: drafts }), 'utf8')
  }
}

async function main() {
  const apiKey = process.env.LLM_API_KEY
  const model = process.env.LLM_MODEL

  const topics = await loadTopics()
  if (topics.length === 0) {
    console.warn(`No topics found in ${CONTENT_DIR}/`)
  }

  const content = { topics: [] }
  const questions = []

  for (const topic of topics) {
    const chapters = []
    for (const file of topic.chapterFiles) {
      const markdown = await readFile(join(topic.dir, file), 'utf8')
      chapters.push(parseChapter({
        markdown,
        topicId: topic.id,
        chapterId: file.replace(/\.md$/, ''),
      }))
    }

    const auto = generateAutoQuestions(chapters)
    const { approved } = await loadAiQuestions(topic.dir)
    await maybeDraftAiQuestions(topic, chapters, apiKey, model)

    for (const [i, ch] of chapters.entries()) {
      const hand = await loadHandQuestions(topic.dir, `${ch.chapterId}.md`)
      const aiForChapter = approved
        .filter((q) => q.chapterId === ch.chapterId)
        .map(({ chapterId, ...q }) => q)
      questions.push(...mergeQuestions({
        topicId: topic.id,
        chapterId: ch.chapterId,
        auto: auto[i],
        hand,
        ai: aiForChapter,
      }))
    }

    content.topics.push({
      id: topic.id,
      title: topic.title,
      chapters: chapters.map((ch) => ({
        id: ch.chapterId,
        title: ch.title,
        readMinutes: ch.readMinutes,
        sections: ch.sections,
      })),
    })

    console.log(`Topic "${topic.title}": ${chapters.length} chapters`)
  }

  await mkdir(OUT_DIR, { recursive: true })
  await writeFile(join(OUT_DIR, 'content.json'), JSON.stringify(content), 'utf8')
  await writeFile(join(OUT_DIR, 'quiz.json'), JSON.stringify({ questions }), 'utf8')

  const bySource = { auto: 0, hand: 0, ai: 0 }
  for (const q of questions) bySource[q.source] = (bySource[q.source] ?? 0) + 1
  console.log(
    `Generated ${questions.length} questions ` +
    `(auto: ${bySource.auto}, hand: ${bySource.hand}, ai: ${bySource.ai}) ` +
    `across ${topics.length} topics -> ${OUT_DIR}/`,
  )
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
