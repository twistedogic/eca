# Proposal

## Why

The app's type sizes are fixed at authoring time — body text is 14px, captions 11–13px — so a reader who needs bigger text has no way to get it, on a phone held close or read in bright daylight. The app already stores device-local preferences for the appearance, so a text size setting is the same pattern again: one attribute on the root element, one value in the settings store, no account, no network.

## What Changes

- The home screen gains a text size control offering four steps (small, default, large, extra large). Choosing a step resizes the text on every screen — topics menu, chapter list, chapter reading, chapter quiz, quiz results, review.
- The chosen size is stored on the device and restored the next time the app is opened. Until the user picks one, the current size stays in effect.
- The stylesheet expresses every font size in `rem`, so the whole interface scales from a single root value instead of each rule scaling itself.
- No content, question, scheduling, progress, or appearance behaviour changes. No new dependency. No network call.

## Capabilities

### New Capabilities

- `text-size`: a user-chosen text size, applied across every screen, stored on the device and surviving restarts.

### Modified Capabilities

(none — no existing requirement changes its behaviour)

## Impact

- New code: `src/state/textsize.ts` (load/apply/set the size), a row in `src/views/home.ts`, and an application step in `src/main.ts` before the first render.
- Styles: `src/styles.css` gains a `--text-scale` token on `:root` and converts its font sizes from `px` to `rem`.
- Storage: reuses the existing `settings` store in `src/state/db.ts` (`getSetting`/`setSetting`) under the key `textSize` — no new storage layer.
