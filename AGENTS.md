# Repository Guidelines

## Project Structure & Module Organization

`eca` is a framework-free TypeScript PWA (Vite + vite-plugin-pwa) for reading study material, taking chapter quizzes, and reviewing on a Leitner schedule.

- `content/<topic-id>/` — source material: `NN-chapter.md` files (filename order = chapter order), optional `topic.yaml`, hand-written `<chapter>.quiz.yaml` sidecars, `ai-drafts.yaml` (LLM output, human-approved).
- `scripts/` — content pipeline. `scripts/generate.mjs` writes `public/content.json` and `public/quiz.json`; `scripts/lib/*.mjs` holds pure helpers (`parse`, `generate`, `merge`, `llm`) with colocated tests.
- `src/` — app code: `main.ts` (boot/render), `router.ts` (hash routes), `dom.ts` (`h`/`clear`), `api.ts`, `types.ts`; `src/state/` (`db.ts` IndexedDB via idb-keyval, `scheduler.ts`, `progress.ts`, `theme.ts`); `src/views/` (`home`, `topic`, `chapter`, `quiz`, `review`); `src/styles.css`.
- `openspec/` — spec-driven workflow: `openspec/changes/<name>/` in flight, `openspec/specs/` the shipped baseline.
- `public/` — generated JSON (gitignored) plus PWA icons.

## Build, Test, and Development Commands

- `npm run gen` — rebuild `public/content.json` + `public/quiz.json` from `content/`.
- `npm run dev` — regenerate, then start the Vite dev server (base path `/eca/`).
- `npm test` — Vitest run; `pretest` regenerates content, so `src/flow.test.ts` always reads fresh JSON.
- `npm run build` / `npm run preview` — production build to `dist/`, and serve it.
- `npm run icons` — regenerate `public/icons/icon-{192,512}.png`.
- `npx tsc --noEmit` — typecheck (strict).

## Coding Style & Naming Conventions

Two-space indent, single quotes, no semicolons, trailing commas in multiline literals. ESM throughout; use `import type` for type-only imports. camelCase for functions and variables, PascalCase for types, SCREAMING_SNAKE for constants, kebab-case for CSS classes and file names. Comments explain *why*, not *what*. No linter is configured — match the surrounding file.

## Testing Guidelines

Vitest, with tests colocated as `*.test.ts` / `*.test.mjs` beside their source. Name cases by behavior: `it('promotes one box per correct answer')`. DOM tests add `// @vitest-environment jsdom`; IndexedDB tests import `fake-indexeddb/auto`. `src/flow.test.ts` walks home → topic → chapter → quiz → review as one continuous session, so its cases share state and are order-dependent. No coverage threshold is set.

## Commit & Pull Request Guidelines

Conventional Commits with a short lowercase subject: `feat:`, `chore:`, `docs:`. The body explains the why, then bullet-lists touched files (`- src/state/theme.ts: ...`). Name the OpenSpec change when one exists.

PRs should state the user-visible change, call out any shift in question ids or stored cards, and include screenshots for UI changes. CI runs generate → test → build → GitHub Pages deploy on `main`.

## Security & Configuration

`LLM_API_KEY` (plus optional `LLM_MODEL`, `LLM_BASE_URL`) enables the AI drafting pass; drafts publish only after a human sets `status: approved` in `ai-drafts.yaml`. Never commit the key or the generated `public/*.json`.

## Content Authoring Notes

Question ids are positional (`<topic>-<chapter>-q<n>`: auto MCs, clozes, hand-written, approved AI). Inserting content earlier in a chapter shifts later ids and orphans that chapter's review cards — append at the end when possible. See `content/README.md`.
