# Content conventions

Study content lives here, one directory per topic:

```
content/<topic-id>/
  topic.yaml          optional: { title: "My Topic" } (falls back to the dir name)
  01-chapter.md       one file per chapter; filename order = chapter order
  01-chapter.quiz.yaml  optional: hand-written questions for that chapter
  ai-drafts.yaml      optional: AI-drafted questions, created by the pipeline
                      when LLM_API_KEY is set; only entries with
                      `status: approved` are published
```

## Chapter markdown

- `# Heading` — chapter title (one per file)
- `## Heading` — section boundary; quiz feedback links back to the section
  a question came from
- `**bold term**` — key term. Each key term automatically becomes a
  multiple-choice question ("which term is described here?") with
  distractors drawn from the other key terms of the same topic.
- `> A quoted sentence containing a **bold term**.` — key sentence. It
  automatically becomes a fill-in-the-blank question with the bold term
  as the answer.

A chapter with no key terms simply produces no generated questions —
that is not an error.

## Hand-written questions (`<chapter>.quiz.yaml`)

```yaml
questions:
  # `term` is optional. When set, hand-written questions take precedence:
  # generated questions for the same term in that chapter are dropped.
  - term: LRU
    type: mc
    prompt: Which eviction policy is the usual default?
    choices: [LRU, FIFO, Random, TTL]
    answer: 0
    explanation: LRU evicts the least recently used entry first.
  - type: cloze
    prompt: "____ is the usual default eviction policy."
    answer: LRU
    explanation: LRU evicts the least recently used entry first.
```

## AI drafts

The pipeline (with `LLM_API_KEY` set) writes drafts to `ai-drafts.yaml`
once, then never touches the file again — it is yours. Review each entry,
set `status: approved` (or delete it). Approved entries are published with
source tag `ai`; drafts are never published.

## Pipeline

`npm run gen` reads this directory and writes `public/content.json` and
`public/quiz.json`, which the app loads. Question ids are deterministic
(`<topic>-<chapter>-q<n>`, in order: generated MCs, generated clozes,
hand-written, approved AI) — but inserting content before existing
content shifts ids, which orphans that chapter's review cards. Edit at
the end of a chapter when possible.
