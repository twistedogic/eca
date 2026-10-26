# Proposal

## Why

The app is read at night — in bed, on a plane, on a commute — and a white page at 11pm is the single biggest reason to stop studying. The app is already offline-first and device-local, so a light/dark switch needs no backend, no account, and no network: it is a stylesheet variant plus one preference on the device.

This also reverses an explicit v1 non-goal. `design.md` (archived change `study-pwa`) listed "theming" as out of scope for the first release. That was the right call for a first cut, but the app has shipped and the gap is now the most visible rough edge.

## What Changes

- The app gains a dark appearance alongside the existing light one, applied across every screen: home, topic list, chapter reading, chapter quiz, quiz results, and review sessions.
- A row on the home screen exposes the appearance choice; tapping it flips between light and dark.
- The appearance preference is stored on the device and restored on the next visit. Until the user chooses explicitly, the app follows the device's own light/dark preference.
- The stylesheet gains the dark values for the existing colour tokens, plus tokens for the handful of colours that are currently hardcoded in `styles.css` and therefore would not follow a theme change.
- The browser/OS chrome colour (`<meta name="theme-color">`) follows the active appearance, so the installed app's status bar does not stay light in dark mode.

No content, question, scheduling, or progress behaviour changes. No new dependency. No network call.

## Capabilities

### New Capabilities

- `app-appearance`: light and dark appearance for the whole app, a single control to switch between them, and a device-local preference that survives restarts and defaults to the device's own preference.

### Modified Capabilities

(none — no existing requirement changes its behaviour)

## Impact

- New code: `src/state/theme.ts` (load/apply/toggle the preference), a row in `src/views/home.ts`, and a theme application step in `src/main.ts` before the first render.
- Styles: `src/styles.css` gains a dark token block and replaces the hardcoded colours that currently bypass the tokens.
- Storage: reuses the existing `settings` store in `src/state/db.ts` (`getSetting`/`setSetting`) — no new storage layer, no change to design decision D7.
- `index.html`: the `theme-color` meta tag is updated at runtime to match the active appearance.
- Design history: the archived `study-pwa` design lists "theming" as a v1 non-goal; the new change's `design.md` records that reversal and why it is now worth the small cost.
