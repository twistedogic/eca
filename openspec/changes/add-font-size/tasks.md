# Tasks

## 1. Text Size State

- [x] 1.1 Create `src/state/textsize.ts` with the four steps, `loadTextSize()`, `applyTextSize()`, `currentTextSize()`, and `setTextSize()` over the existing `getSetting`/`setSetting` store — verify with a unit test that the default, the stored, and an unknown stored value all behave as specified
- [x] 1.2 Apply the stored size before the first render in `src/main.ts`, alongside the appearance — verify a reload opens at the stored size

## 2. Stylesheet

- [x] 2.1 Add the `--text-scale` token to `:root`, derive the root font size from it, and add one rule per size step — verify each step changes the root font size and the default step leaves it unchanged
- [x] 2.2 Convert every font size in `src/styles.css` from `px` to `rem` so the whole interface follows the root size — verify no `font-size` in the stylesheet is still in `px` and that the layout does not shift

## 3. Home Screen Control

- [x] 3.1 Add a text size row under the appearance row in `src/views/home.ts` offering the four steps, marking the one in effect — verify the row renders on the topics menu and marks the current size
- [x] 3.2 Choosing a step applies it straight away and persists it — verify the root attribute changes and the value is stored

## 4. Verification

- [x] 4.1 Extend `src/flow.test.ts` with a case that picks a larger size on the home screen and asserts the root attribute, the stored value, and that the choice survives a re-render — verify `npm test` passes
- [x] 4.2 Run `npm test`, `npx tsc --noEmit`, and `npm run build`, and check the four steps on a narrow phone across the home screen, chapter reading, quiz, and review

## 5. Typography

- [x] 5.1 Define a named type scale on `:root` and map every font size in `src/styles.css` to it — verify `src/styles.test.ts` fails when a raw size is added
- [x] 5.2 Give prose, questions, controls, captions, and headings their own steps, and give headings a tighter line height — verify the chapter, quiz, and review screens at the standard size
- [x] 5.3 Move the text on coloured fills to the ink tokens so every text-on-fill pair clears 4.5:1 in both appearances — verify the measured ratios
