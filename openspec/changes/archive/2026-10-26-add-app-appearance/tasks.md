# Tasks

## 1. Appearance State

- [x] 1.1 Create `src/state/theme.ts` with `loadTheme()`, `applyTheme()`, and `toggleTheme()` over the existing `getSetting`/`setSetting` store — `loadTheme()` returns the stored choice, falling back to `matchMedia('(prefers-color-scheme: dark)')` when none is stored — and verify with a unit test covering both the stored and the fallback path
- [x] 1.2 Have `applyTheme()` set `data-theme` on the root element, set `color-scheme` to match, and update the `theme-color` meta tag's `content` — verify the attribute, the `color-scheme`, and the meta tag all change together
- [x] 1.3 Have `toggleTheme()` flip the active appearance, persist it under the `theme` key, and re-apply — verify the stored value flips and survives a fresh read

## 2. Stylesheet

- [x] 2.1 Add the dark token block for `:root[data-theme="dark"]` covering the 13 existing tokens plus the new `--accent-text`, `--ok-ink`, `--bad-ink`, `--warn-ink`, `--body`, and `--shadow` tokens, and set `color-scheme` per appearance — verify every token has a dark value
- [x] 2.2 Replace the seven hardcoded colours with tokens: `.chapter .section p` and `ul/ol` → `--body`, `.feedback.bad` → `--bad-ink`, `.feedback.good` → `--ok-ink`, `.sched` → `--warn-ink`, `.misses li` → `--body`, and `.cloze-input` → explicit `background`/`color` — verify no hardcoded colour remains in `src/styles.css` outside the token blocks
- [x] 2.3 Verify legibility in both appearances on a real device across all screens — home, topic list, chapter reading, chapter quiz, quiz results, and review session — checking body text, feedback blocks, choice rows, and the cloze input

## 3. Home Screen Control

- [x] 3.1 Add an appearance row beneath the topic list in `src/views/home.ts` that reports the active appearance and switches to the other one when activated — verify the row renders on the topics menu and that activating it flips the app
- [x] 3.2 Apply the stored appearance before the first render in `src/main.ts` so no screen is ever painted in the wrong appearance — verify a reload opens directly in the stored appearance

## 4. Verification

- [x] 4.1 Extend `src/flow.test.ts` with a case that renders the home screen, activates the appearance control, and asserts the root attribute flips and the choice persists across a re-render — verify `npm test` passes
- [x] 4.2 Run `openspec validate "add-app-appearance"` and the full test suite, and confirm the built app serves the new appearance offline after one online visit
- [x] 4.3 Report and flip the appearance that is on screen rather than the stored preference, apply the flip before saving it, and cover it with a regression test — verify the new tests fail against the previous logic and pass against the fix
