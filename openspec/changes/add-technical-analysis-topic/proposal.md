# Proposal

## Why

The app has no study material on technical analysis — the closest is a prose overview in `forex-trading/09-market-analysis.md` and `14-price-action.md`, with no visuals. Technical analysis is inherently visual (candlesticks, patterns, indicators); teaching it without charts doesn't work. Research (Investopedia, IG Academy, Fidelity) confirms every beginner curriculum is organized around chart anatomy, support/resistance, chart patterns, and indicators — all diagram-first material.

## What Changes

- New topic `content/technical-analysis/` with ~6 chapters: reading price charts (candlestick anatomy), trends & support/resistance, chart patterns (head & shoulders, double top/bottom, triangles, wedges, flags), candlestick patterns (engulfing, doji, hammer, harami), indicators (MA/EMA, RSI, MACD, Bollinger, ATR), and volume & context. Standard conventions (`**key terms**`, quoted key sentences) generate the quiz questions.
- Chapters include hand-drawn inline SVG schematic diagrams (candlestick anatomy, S/R levels, each pattern, indicator overlays) embedded directly in the chapter markdown.
- One CSS rule so inline SVG/`<img>` figures scale within the reading column on narrow screens.
- `content/README.md` documents the inline-SVG figure convention.
- No new dependencies, no new views, no interactivity — figures are static build-time schematics.

## Capabilities

### New Capabilities
- `chapter-figures`: chapter sections render inline SVG figures embedded in source markdown, responsive to the reading column and theme.

### Modified Capabilities

(none — adding a topic directory is content, not a requirement change; `topic-library` already treats any generated topic generically)

## Impact

- `content/technical-analysis/` — new topic directory (6 chapters + `topic.yaml`).
- `src/styles.css` — one responsive-figure rule.
- `content/README.md` — figure authoring convention.
- No code-path changes: `scripts/lib/parse.mjs` already passes raw HTML through `marked.parse`, and `src/views/chapter.ts` injects `section.html` via `innerHTML` — verified. No sanitizer runs in the pipeline, so inline SVG already flows end to end.
- Question ids for the new topic are new (`technical-analysis-<chapter>-q<n>`); no existing ids or stored cards shift.
