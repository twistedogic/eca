# Design

## Context

Greenfield repository (only an OpenSpec skeleton and `mockup.html`, the approved design sketch). Hard constraints from the proposal: static hosting on GitHub Pages, no backend, no accounts, solo author, TypeScript. The product goal is retention through reading → self-testing → spaced review, organized topic-first. See proposal.md for motivation; specs/ for required behavior.

## Goals / Non-Goals

**Goals:**
- Smallest toolchain that satisfies all five specs on day one.
- Authoring workflow = edit markdown/YAML and push; everything else is automated.
- The app stays pure presentation: it consumes static JSON and never writes anywhere but device-local storage.

**Non-Goals:**
- Multi-device sync, accounts, or any server-side state (progress is device-local by design).
- An authoring UI (git-as-CMS; revisit only if authoring actually hurts).
- Analytics, theming, multi-language, media-heavy content in v1.

## Decisions

### D1 — Build: Vite + TypeScript, no UI framework
Six screens, list/detail navigation, no complex state. Vanilla TS modules with plain DOM rendering keep the bundle tiny (fast first load on mobile, less precache) and the dependency surface near zero.
*Alternative:* React/Preact — rejected: framework churn and build weight for an app this size; nothing here needs a virtual DOM.

### D2 — Routing: hash-based
`#/`, `#/topic/:t`, `#/topic/:t/chapter/:c`, `#/quiz/:c`, `#/review`. Works on GitHub Pages with zero server configuration.
*Alternative:* History API + 404.html redirect hack — rejected: extra moving part for no user-visible gain.

### D3 — Data model: two generated static files
The pipeline emits:
- `content.json` — topics → chapters → sections, each section with a stable anchor id and pre-rendered HTML (markdown is parsed at build time, never in the browser),
- `quiz.json` — the single question set, one schema regardless of source:
  `{ id, type: "mc" | "cloze", topicId, chapterId, ref (section anchor), prompt, choices?, answer, explanation, source: "auto" | "ai" | "hand" }`
Stable ids: `slug-of-file` + `-q` + sequence, regenerated deterministically so review state survives content edits wherever possible.

### D4 — Pipeline: one Node script, run by GitHub Actions on push
`scripts/generate.mjs`:
1. Parse each `content/<topic>/*.md` → sections, anchors, key terms (bold spans), key sentences (blockquote/marker convention).
2. Deterministic generation: bold term → definition MC (distractors = sibling bold terms from the same topic); marked key sentence → cloze.
3. Load sidecar `*.quiz.yaml` (hand-written) and `ai-drafts.yaml` (AI drafts, see D5).
4. Merge with precedence: hand-written wins over generated for the same term/section; dedupe by (chapter, term/passage) key.
5. Emit `content.json` + `quiz.json` into the build.
Markdown via `marked`, YAML via `yaml`. No LLM SDK dependency — direct HTTPS calls if/when the LLM pass is enabled.

### D5 — AI drafting: opt-in, drafts-only, file-gated
If an `LLM_API_KEY` secret exists, the pipeline additionally asks the model to draft reasoning questions per chapter and writes them to `content/<topic>/ai-drafts.yaml` with `status: draft`. A draft becomes publishable only when the maintainer edits that file to `status: approved` (or deletes it). The pipeline never promotes a draft on its own; PR review is the human gate.
*Alternative:* CI opens a drafts PR per run — rejected: PR machinery and notification noise for a solo author; a committed file with a status field is simpler to review as a diff.

### D6 — Scheduler: Leitner boxes
Per-card state: `{ box: 1..5, due: timestamp }`. Correct → box + 1; wrong → box 1. Box ladder maps to intervals 1d, 3d, 7d, 16d, 35d. Chapter-quiz misses enter at box 1, due immediately after the session (or next day — tuning is an open question).
*Alternative:* SM-2 (Anki's algorithm) — rejected for v1: ease-factor state and tuning for marginal gain at this scale. The per-card state shape (`{ box, due }` → `{ ease, interval, due }`) makes upgrading later mechanical.

### D7 — Progress storage: IndexedDB
`idb-keyval`-style thin wrapper. Keys: per-question card state, per-chapter progress (read position, quiz results), settings. Browser-local by spec; nothing leaves the device.
*Alternative:* localStorage — rejected: 5 MB cap and synchronous access on the UI thread; quiz history grows.

### D8 — Offline & install: vite-plugin-pwa
Precache the full app shell, `content.json`, `quiz.json` (Workbox under the hood). New deploys are picked up on the next online visit via the plugin's auto-update flow; IndexedDB progress is untouched by cache swaps. Web app manifest for standalone, chrome-less launching. Note: GitHub Pages serves a project site under `/eca/` — Vite `base` must be set accordingly.

### D9 — Repo layout
```
content/<topic>/chapter.md          authoring (any editor)
content/<topic>/chapter.quiz.yaml   hand-written questions
content/<topic>/ai-drafts.yaml      CI-written drafts, human-approved
scripts/generate.mjs                pipeline (D4/D5)
src/                                PWA app (D1/D2/D7/D8)
.github/workflows/deploy.yml        generate → build → Pages
```

## Risks / Trade-offs

- [AI drafts are subtly wrong or trivial] → Drafts never auto-publish (D5); human approval is the gate; a bad question costs one review glance, not user trust.
- [Editing content shifts anchors → broken `ref` links or orphaned review cards] → Pipeline regenerates ids deterministically; a `ref` that no longer resolves drops the card gracefully at runtime (card vanishes, app never crashes). Sharper drift detection can be added later.
- [Bold-term convention is an implicit authoring contract] → A short `content/README.md` documents the conventions; the generator is conservative (no key terms → no questions, never a failure).
- [Clearing browser data loses all progress] → Accepted for v1 (non-goal: sync). Export/import of progress as JSON is a small future add on the same storage layer.
- [Service worker serves stale content after deploys] → Handled by plugin auto-update; worst case the user gets new content on the next online session.

## Migration Plan

Greenfield: land the app and workflow on `main`; GitHub Actions deploys Pages from `main` on every push. Rollback = revert commit and push (Pages redeploys). No user data or prior releases to migrate. The existing `mockup.html` stays as reference until the app matches it, then can be deleted.

## Open Questions

- Exact Leitner interval values and whether chapter-quiz misses are due immediately or next day — tuning, no structural impact (D6).
- Auto-scroll the reading position resume vs. simple "continue" affordance — UX polish, deferrable.
- Export/import format for progress backup — schema follows D7, can be decided when built.
