# Proposal

## Why

Studying a topic for retention — e.g. preparing for a job interview — requires more than reading: knowledge sticks through active recall and spaced repetition, in short sessions on the go. There is no simple, free, offline-friendly study tool that runs on my own markdown content; a static PWA on GitHub Pages gives zero-cost hosting with no backend to operate, and turns the repo itself into the authoring interface.

## What Changes

Greenfield build (no existing code affected):

- New TypeScript PWA deployed to GitHub Pages: mobile-first, offline-capable, pure presentation (no write path, no accounts, no backend — ever).
- Home screen is a topics menu with per-topic progress; each topic is a list of chapters with per-chapter status (new / in progress / done / review due).
- Chapters are read as markdown-rendered content with a quiz at the end of each chapter by default; wrong answers show an explanation and deep-link back to the passage they came from.
- Questions come from three sources, all normalized to one schema and merged by CI (GitHub Actions) into a static `quiz.json`:
  - deterministic generation from the content itself (bold terms → definition multiple-choice with sibling-term distractors; key sentences → cloze),
  - an optional LLM pass drafting higher-reasoning questions for human review in a PR diff (repo-secret key; drafts only, never auto-published),
  - hand-written questions in sidecar files.
- Wrong answers enter a spaced-repetition scheduler: due cards resurface in short review sessions; correct answers stretch the interval (1d → 3d → 7d → 16d …), wrong answers collapse it.
- All study progress is stored device-locally (IndexedDB); no login, no sync in this change.

## Capabilities

### New Capabilities

- `topic-library`: topics menu with progress, chapter lists with per-chapter status, navigation between them.
- `chapter-quiz`: reading a chapter and taking its end-of-chapter quiz, with per-question feedback and a results summary.
- `spaced-review`: the retention engine — scheduling of missed/shaky answers into due review sessions with stretching/collapsing intervals.
- `question-pipeline`: repo content and question sources in, merged static `quiz.json` out — deterministic generation, optional LLM drafting, hand-written merge, CI behavior.
- `offline-progress`: offline availability (PWA) and device-local persistence of all study progress.

### Modified Capabilities

(none — greenfield)

## Impact

- All new code: PWA app, CI generation workflow, content directory conventions (`content/<topic>/`).
- External dependency: optional LLM API key stored as a GitHub repo secret; the pipeline degrades gracefully without it.
- Hosting: GitHub Pages (static only).
- `mockup.html` in the repo root is the approved design sketch (fake data, not app code); it is reference material for this change.
