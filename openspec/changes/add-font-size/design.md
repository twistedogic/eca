# Design

## Context

See proposal.md - Why.

Current state that shapes the approach:

- `src/styles.css` sizes every piece of type in `px` — body text 14px, captions 11–13px, headings 16–22px — so no single value controls how large the app reads.
- `src/state/theme.ts` already solves the same shape of problem for light/dark: a `data-theme` attribute on the root element, a value in the existing IndexedDB `settings` store, applied before the first render in `src/main.ts`.
- The home screen already carries one settings row (`.appear-row`), so a second row is the established control surface; there is no settings screen.

## Goals / Non-Goals

**Goals:**
- One value on the root element scales the whole interface.
- The size is device-local, offline, and needs no account — the same posture as the appearance.
- The change is invisible to every existing screen's logic: views keep rendering the same markup.

**Non-Goals:**
- A separate settings screen. Two rows on the home screen are the whole control surface.
- Scaling the layout — padding, borders, and the 480px column stay as they are; only text grows.
- Free-form sizing. Four fixed steps instead of a slider or a pixel entry.
- Per-screen text sizes, or sizes stored per device profile.

## Decisions

### D14 — One root font size, `rem` everywhere
The root element's font size is `calc(16px * var(--text-scale))`, and every font size in the stylesheet is expressed in `rem`. One attribute on `<html>` therefore rescales the whole interface, and the `px` sizes become relative to the chosen scale.

*Alternative:* `zoom` on the app container — one line, no stylesheet churn. Rejected: it scales padding, borders, and the column width as well, so the layout breaks rather than reflows, and `zoom` interacts badly with the sticky app bar.
*Alternative:* `calc(14px * var(--text-scale))` on each rule — same edit count, but every rule keeps a magic pixel number and the scale has to be threaded through each declaration.

### D15 — Four fixed steps, named in CSS
The sizes are `sm` (0.9), `md` (1), `lg` (1.15), and `xl` (1.3), applied as a `data-text-size` attribute on the root element with one rule per step. The stored value is the step's name, not its factor, so the stored preference stays meaningful if the factors are retuned later.

### D16 — The size lives in the existing settings store
`getSetting('textSize')` / `setSetting('textSize')`, matching the appearance preference and design decision D7 (all device-local state in IndexedDB). No new storage layer, no second settings system.

*Accepted consequence:* like the appearance, the size is read asynchronously, so the empty shell paints once at the standard size before the stored size is applied. The app renders no content until its JSON loads, so nothing is readable during that window.

### D17 — The control is a row on the home screen
The text size row sits under the appearance row and offers the four steps as buttons, the one in effect marked `aria-pressed`. A row keeps the control discoverable where the appearance control already is, and avoids a settings screen for one setting.

### D18 — One type scale, named by role
Seven steps live on `:root` (`--fs-xs` 12px … `--fs-display` 44px) and every font size in the stylesheet is one of them. The scale multiplies with the text size, so a step stays a step at every setting.

*Alternative:* keep the sizes the stylesheet already had (twelve of them, from 10px to 44px) and only scale the root. Rejected: near-identical sizes (11/12/13/14/15/16/17px) drift apart as soon as one rule is touched, and the role a size plays is invisible in the stylesheet. A test in `src/styles.test.ts` fails the build when a raw size is introduced.

### D19 — Ink tokens for text on coloured fills
Chips, tags, feedback blocks, and the "next in" badge carry their text in the `-ink` variant of their colour (`--ok-ink`, `--bad-ink`, `--warn-ink`, and a new `--accent-ink`); the bright variants stay on borders, dots, and progress bars.

*Evidence:* measured against WCAG, the bright variants on their soft fills gave 3.0:1 (`--ok`), 2.9:1 (`--warn`), 4.0:1 (`--bad`), and 4.2:1 (`--accent-text`) — below the 4.5:1 small text needs. The ink variants give 7.1–8.3:1 in the light appearance and 7.3–10.4:1 in the dark one.

## Risks / Trade-offs

- [Type set in `px` outside `styles.css`] → the inline `style` widths used for progress bars are lengths, not type; `grep` for `font-size` in `src/` to confirm none remain outside the stylesheet.
- [The largest step overflows tight rows] → the steps top out at 1.3, and every fixed-height element that holds text (`.chapters .num`) has room for its scaled type; check the choice rows and the app bar at `xl` on a narrow phone.
- [A stale stored value] → an unknown stored name falls back to the standard size rather than leaving the app unstyled.
- [A raw font size sneaks back in] → `src/styles.test.ts` fails when a stylesheet sets a size outside the scale.
