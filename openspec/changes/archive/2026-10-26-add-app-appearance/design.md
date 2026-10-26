# Design

## Context

See proposal.md - Why.

Current state that shapes the approach:

- `src/styles.css` already defines the palette as CSS custom properties on `:root` (`--bg`, `--card`, `--ink`, `--muted`, `--line`, `--accent`, `--accent-soft`, `--ok`, `--ok-soft`, `--bad`, `--bad-soft`, `--warn`, `--warn-soft`). Every view styles itself from these tokens, so a second palette is a matter of overriding the same names.
- Seven colours bypass the tokens and are hardcoded: `.chapter .section p` and `ul/ol` (`#2a2f36`), `.feedback.bad` (`#7f1d1d`), `.feedback.good` (`#14532d`), `.sched` (`#78350f`), `.misses li` (`#2a2f36`), and `.cloze-input`, which sets no background at all and therefore inherits the browser's white input box. These are what make a naive palette swap look broken.
- `src/state/db.ts` already exposes a `settings` store via `getSetting`/`setSetting`; `src/state/db.test.ts` already round-trips the key `'theme'`. There is no storage layer to add.
- The app renders nothing until `content.json` and `quiz.json` load (`src/main.ts`), so the shell is blank during boot and a theme swap during boot is not visibly disruptive.
- The archived `study-pwa` design lists "theming" as a v1 non-goal. This change reverses that.

## Goals / Non-Goals

**Goals:**
- One attribute on `<html>` switches the entire app between appearances; no per-view theme logic.
- Every colour in the app derives from a token, so a future third appearance is one more block.
- The preference is device-local, offline, and needs no account — same posture as the rest of the app.

**Non-Goals:**
- A separate settings screen. One row on the home screen is the whole control surface.
- Per-appearance branding (icons, accent colours, illustrations).
- Scheduled appearance ("dark from 8pm"). The device preference covers the common case.
- Theming of the content itself (chapter markdown renders in the app's palette, unchanged).

## Decisions

### D10 — One attribute on `<html>`, one dark token block
The active appearance is a `data-theme` attribute on the root element. `:root` keeps the light values; `:root[data-theme="dark"]` overrides the same token names.

*Alternative:* CSS `light-dark()` — one palette, no duplication, but it needs Safari 17.5+ / Chrome 123+ (March 2024). An older iPhone would silently lose all styling, and this is a night-reading app on personal phones. One extra block of CSS is cheaper than that failure.
*Alternative:* a `prefers-color-scheme` media query — it cannot express "the user explicitly chose light on a dark device", which the spec requires.

### D11 — The device preference is resolved in JS, not CSS
Until the user chooses, the appearance follows `matchMedia('(prefers-color-scheme: dark)')`, evaluated at load. A stored choice, once present, overrides it.

Doing this in JS rather than CSS keeps the stylesheet to a single dark block (D10) while still honouring the device preference on every load, not only on first run.

### D12 — The preference lives in the existing IndexedDB settings store
`getSetting('theme', ...)` / `setSetting('theme', ...)`, matching design decision D7 (all device-local state in IndexedDB). The existing db test already exercises this exact key.

*Alternative:* `localStorage` — synchronously readable, so it could be applied before first paint and avoid a brief flash. Rejected: it introduces a second storage system for a non-progress value, contradicts D7, and buys a few milliseconds of flash on a blank shell.

*Accepted consequence:* the stored preference is read asynchronously, so the empty shell paints in the light appearance for a few milliseconds before the stored appearance is applied. The app renders no content until its JSON loads, so there is nothing to read during that window.

### D13 — Fills and text need separate accent and status tokens
Several tokens are used in two roles: as a fill behind white text (`--accent` on `.btn`, `--ok` on `.chip.done`) and as text on the page background (`a`, `.pill`, `.feedback.good`). A fill must stay dark to keep white text readable; text on a dark background must go light. One token cannot serve both, so four tokens are added:

| token | light | dark | role |
|---|---|---|---|
| `--accent-text` | `#2563eb` | `#79b8ff` | accent-coloured text on the page background |
| `--on-accent` | `#ffffff` | `#ffffff` | text on an accent fill (`.btn`, `.quizcta`, the due banner) |
| `--accent-deep` | `#1e40af` | `#1e40af` | the dark end of the due-banner gradient |
| `--ok-ink` | `#14532d` | `#7ee787` | text on `--ok-soft` (`.feedback.good`) |
| `--bad-ink` | `#7f1d1d` | `#ffa198` | text on `--bad-soft` (`.feedback.bad`) |
| `--warn-ink` | `#78350f` | `#e3b341` | text on `--warn-soft` (`.sched`) |
| `--body` | `#2a2f36` | `#c9d1d9` | chapter body text and `.misses li` |
| `--shadow` | `rgba(0,0,0,.05)` | `rgba(0,0,0,.4)` | the topic-card drop shadow |

`--on-accent` and `--accent-deep` exist so that no colour is written literally outside the token blocks: the accent fill needs a named text colour and the banner gradient needs a named second stop.

### D14 — The control is a row on the home screen
The home screen's app bar `.right` slot is already used for "offline ready ✓", the topic screen's for the progress percentage, and the review screen's for the position counter. A global app-bar button would either displace that information or force a restructure of five screens.

A row beneath the topic list keeps the control to one file (`src/views/home.ts`) and leaves every other screen untouched. The row reports the active appearance and switches to the other one when activated.

*Alternative:* a button on every screen — better reachable mid-chapter, at the cost of a structural change to every app bar and to the meaning of `.right`.

### D15 — `color-scheme` follows the appearance
`color-scheme` is set alongside the token override so that UA-rendered surfaces — form controls, scrollbars, the canvas behind the page — match. `.cloze-input` additionally gets explicit `background`/`color` from tokens so it does not rely on UA behaviour.

### D16 — The `theme-color` meta tag is updated at runtime
`<meta name="theme-color">` in `index.html` currently pins the accent colour, which would leave the installed app's status bar light in dark appearance. Its `content` is updated when the appearance is applied. The web app manifest's `theme_color`/`background_color` are build-time constants and are left alone — they describe the install moment, not the running app.

### D17 — The control reads the appearance that is on screen
The Appearance row reports and flips the theme applied to the document (the `data-theme` attribute), never a freshly read preference. The stored preference decides the look on the next launch; the applied attribute decides what the user sees now.

If the two disagree — the device switched to dark mode at sunset while the app was open, so the page is still light while the phone now says dark — a control reading the preference would show "Dark" over a light screen and a tap would compute the appearance already on display, changing nothing. Reading the applied attribute keeps the label honest and every tap effective.

The flip applies the new appearance first and saves the choice in the background, so the control responds immediately and a failed save cannot swallow the tap.

## Risks / Trade-offs

- [Hardcoded colours survive the swap and become unreadable] → The token audit is part of the change, not a follow-up: every one of the seven hardcoded colours gets a token, and the dark values are chosen for contrast against their own backgrounds.
- [Contrast pairs are eyeballed rather than measured] → Check the pairing on a real device once; the dark accent-text on the dark background is the one most likely to need adjusting.
- [The stored appearance lands after first paint] → Accepted (D12). Nothing is rendered during that window.
- [This reverses a recorded non-goal] → Stated explicitly in this design so the reversal is visible rather than silent.
- [An old browser without `data-theme` support] → Not applicable; attribute selectors and custom properties are universally supported. The floor is set by the *values*, not the mechanism.

## Migration Plan

No data migration. The appearance preference is a new key in an existing store; a device that has never chosen one falls back to the device preference and starts storing a choice only when the user acts. Rolling back is a revert of the commit — the leftover setting is ignored by the old code and reused by the new.

## Open Questions

- Whether the topic card's drop shadow is worth keeping in the dark appearance, where it is nearly invisible. Deferrable; the shadow token makes it a one-line change either way.
