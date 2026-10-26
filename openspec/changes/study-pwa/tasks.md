# Tasks

## 1. Scaffold & Deployment

- [x] 1.1 Create Vite + TypeScript project (no UI framework), set `base: '/eca/'` for GitHub Pages, and verify `npm run build` produces a working `dist/`
- [x] 1.2 Add hash-based routing (`#/`, `#/topic/:t`, `#/topic/:t/chapter/:c`, `#/quiz/:t/:c`, `#/review`) with placeholder screens, and verify all routes navigate without errors
- [ ] 1.3 Add the GitHub Actions workflow (build → deploy to Pages) and verify the placeholder app is reachable at the Pages URL

## 2. Progress Storage

- [x] 2.1 Add a thin IndexedDB wrapper and verify write/read round-trips with a unit test
- [x] 2.2 Implement stores for per-question card state (`{ box, due }`), chapter progress, and settings, and verify unit tests cover save/load/update of each

## 3. Content Pipeline

- [x] 3.1 Write sample content: one topic with 2–3 chapters (bold key terms, marked key sentences), one hand-written `chapter.quiz.yaml`, and a `content/README.md` documenting the authoring conventions — verify all files parse as valid markdown/YAML
- [x] 3.2 Implement markdown parsing in `scripts/generate.mjs` producing `content.json` (topics → chapters → sections with stable anchor ids and pre-rendered HTML) and verify the JSON structure against the sample
- [x] 3.3 Implement deterministic question generation (bold term → definition MC with sibling-term distractors; marked key sentence → cloze) and verify with unit tests on the sample, including a chapter with no key terms producing no questions
- [x] 3.4 Implement merge with hand-written precedence, dedupe by (chapter, term/passage), stable ids, source tags, and passage refs — and verify the emitted `quiz.json` reflects precedence and tags on the sample
- [x] 3.5 Wire the pipeline into the Actions workflow ahead of the build, and verify the deployed app serves generated `content.json` + `quiz.json`
- [x] 3.6 Implement the optional LLM drafting pass (runs only when the key secret exists; writes `ai-drafts.yaml` with `status: draft`; only `status: approved` entries merge) and verify the no-key pipeline run succeeds unchanged, plus a manual with-key run writing drafts that stay excluded until approved

## 4. Topic Library UI

- [x] 4.1 Build the home screen: topic cards with progress, chapters-completed count, and due count, and verify against sample content that all three render correctly including a zero-progress topic
- [x] 4.2 Build the topic screen: ordered chapter list with status (new / in progress / done / review due) and the topic-scoped review entry with due count and estimated session length, and verify each status is reachable by driving storage into that state

## 5. Chapter Reading & Quiz

- [x] 5.1 Build the chapter reading view (rendered sections, reading position, quiz CTA at the end with question count; next-chapter offer when a chapter has no questions) and verify navigation and the no-questions path on the sample
- [x] 5.2 Build the quiz flow: one question at a time with progress indicator, immediate grading, correct-answer highlight + explanation + passage link on misses, and verify each feedback path manually against the sample quiz
- [x] 5.3 Build the results summary (score, missed questions linked to passages, misses enter the review schedule at box 1) and verify via storage inspection that misses became due cards
- [x] 5.4 Support retaking any chapter quiz from its chapter, and verify a second run updates results without duplicating card state

## 6. Spaced Review

- [x] 6.1 Implement the Leitner scheduler (correct → box + 1; wrong → box 1; ladder 1d/3d/7d/16d/35d) and verify with unit tests covering promotion, collapse, and due-date computation
- [x] 6.2 Build the review session screen: due cards one at a time, source chapter/topic with passage link, grading (Again/Good), and next-interval indication, and verify a full session against mockup screen 6
- [x] 6.3 Make review sessions scope-aware (home = all topics, topic view = that topic) and verify both entry points produce correctly scoped card queues
- [x] 6.4 Handle stale cards gracefully: a card whose `ref` no longer resolves is dropped from sessions without errors, verified by corrupting a ref in storage and running a session

## 7. Offline & Install

- [x] 7.1 Add `vite-plugin-pwa` (precache app shell + content.json + quiz.json, manifest, standalone display) and verify the built app passes PWA checks in browser devtools
- [x] 7.2 Verify end-to-end offline: after one online visit, airplane-mode sessions cover reading, quizzing, and reviewing; and a new deploy is picked up on the next online visit without losing progress

## 8. Hardening & Sign-off

- [ ] 8.1 Walk the full flow (home → topic → chapter → quiz → results → review next day simulated) against all five specs and the mockup, fixing any behavioral gaps found
- [ ] 8.2 Run `openspec validate "study-pwa"`, run the full test suite, and confirm the live Pages deployment reflects the final build; then decide whether `mockup.html` stays or goes
