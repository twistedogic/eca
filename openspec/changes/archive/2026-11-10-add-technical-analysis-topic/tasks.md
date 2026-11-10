# Tasks

## 1. Figure rendering support

- [x] 1.1 Add the responsive-figure rule to `src/styles.css` (`.section :is(svg, img) { max-width: 100%; height: auto; }`) and add a jsdom test in `src/styles.test.ts` asserting the rule exists — verifiable via `npm test`
- [x] 1.2 Author a throwaway test chapter in `content/` with one inline SVG using `var(--ink)`/`var(--ok)`, run `npm run gen`, and confirm the SVG survives into `public/content.json` and renders in `npm run dev` at 360px width without horizontal scroll (then delete the throwaway chapter)

## 2. Topic scaffolding

- [x] 2.1 Create `content/technical-analysis/topic.yaml` (`title: Technical analysis`) and chapter files `01`–`06`; verify `npm run gen` emits the topic into `public/content.json` with chapters in filename order
- [x] 2.2 Document the inline-SVG figure convention in `content/README.md` (how to embed, theme variables to use, no bold text inside figures, `viewBox` required for scaling); verify by following the doc cold to add one figure

## 3. Chapters 1–3: charts, levels, patterns

- [x] 3.1 Write `01-reading-price-charts.md` — line vs bar vs candlestick, candle anatomy (body, wick, OHLC), timeframe choice; include the candlestick-anatomy SVG; verify generated quiz contains MC questions for **open**, **close**, **body**, **wick**
- [x] 3.2 Write `02-trends-support-resistance.md` — higher highs/lows, trendlines, support/resistance areas, role flip on breakout, stop placement at levels; include S/R diagram SVG; verify cloze questions generated from quoted key sentences
- [x] 3.3 Write `03-chart-patterns.md` — head & shoulders, double top/bottom, triangles, wedges, flags/pennants; continuation vs reversal vs bilateral framing; one small SVG per pattern; verify quiz questions generated per pattern term

## 4. Chapters 4–6: candles, indicators, volume

- [x] 4.1 Write `04-candlestick-patterns.md` — doji, hammer, engulfing, harami; context requirement (location beats shape); SVGs for the four patterns; verify quiz questions generated
- [x] 4.2 Write `05-indicators-oscillators.md` — MA/EMA (20/50/200), RSI (14, 70/30), MACD (12/26/9), Bollinger Bands, ATR; indicators confirm price action, don't replace it; MA-overlay and RSI-panel SVGs; verify quiz questions generated
- [x] 4.3 Write `06-volume-confirmation.md` — volume confirms breakouts, divergence, multi-timeframe context, limitations of TA; one volume-confirmation SVG; verify quiz questions generated

## 5. Integration verification

- [x] 5.1 Run `npx tsc --noEmit && npm test && npm run build` and confirm all pass, including `src/flow.test.ts` walking the new topic without changes
- [x] 5.2 Manual pass in `npm run dev`: open each of the 6 chapters, confirm every figure scales at 360px, switch to dark theme and confirm figures stay legible
