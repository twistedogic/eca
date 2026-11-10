# Design

## Context

Verified in code: `scripts/lib/parse.mjs` runs `marked.parse()` with no sanitizer, so raw HTML in chapter markdown flows into `section.html`; `src/views/chapter.ts` injects it via `h('div', { html: section.html })` (dom.ts sets `innerHTML`). Inline SVG therefore already works end to end — the only gap is styling: `src/styles.css` has no rules for `svg`/`img`, so an oversized SVG would overflow the reading column on phones. The app deploys under the GitHub Pages base path `/eca/` and runs offline as a PWA. Theme colors live as CSS custom properties (`--ink`, `--body`, `--muted`, `--line`, `--accent`, `--ok`, `--bad`) set on `:root` and re-defined for dark theme.

## Goals / Non-Goals

**Goals:**
- Static schematic figures inside chapter content, authored once in markdown, delivered through the existing generate pipeline unchanged.
- Figures legible in both themes and on narrow screens.

**Non-Goals:**
- Interactive charts (zoom, pan, crosshair), real-time or live market data, a charting library (Chart.js, D3, lightweight-charts).
- Raster images (`<img src>`) and the asset pipeline they'd need.
- Changes to quiz/review views — figures appear in reading view only.

## Decisions

**1. Inline SVG in chapter markdown, not `<img>` files.**
- No new asset pipeline: `content.json` stays one self-contained file; nothing to path-resolve under the `/eca/` base (an absolute `/icons/...`-style path breaks on Pages, a relative one depends on the current hash route).
- Offline-safe: no extra requests for the PWA to precache.
- Alternative considered: PNGs in `public/` (needs path handling + precache entries + binary churn in git) — rejected as strictly more work.

**2. Schematic diagrams, not real market data.**
- The goal is teaching pattern *shape*: candlestick anatomy, head-and-shoulders silhouette, triangle convergences. Hand-authored coordinates make each figure minimal and pedagogically exaggerated. Real chart screenshots would be licensing-heavy (research sources like IG/Investopedia are copyrighted) and visually noisy.
- SVGs carry an `aria-label`/`<title>` describing the pattern.

**3. One CSS rule for responsiveness: `.section :is(svg, img) { max-width: 100%; height: auto; }`.**
- Matches the existing flat, kebab-class styling; `height: auto` preserves aspect ratio when the SVG declares a `viewBox`.

**4. Theme via CSS variables — SVGs use `var(--ink)`, `var(--ok)` (bullish), `var(--bad)` (bearish), `var(--line)` in `stroke`/`fill` attributes.**
- Inline SVG participates in the document cascade, so this is free; alternatives (`currentColor` everywhere, or dark-mode duplicate figures) are less expressive or double the authoring.

**5. Figures carry no `**bold**` text.**
- Bold terms in body text are the question-generation signal; keeping figures plain prevents accidental quiz terms. Documented in `content/README.md`.

**6. Chapter set follows the researched beginner curriculum** (Investopedia candlestick guide, IG's 10-pattern taxonomy, Fidelity pattern primer): 01 candlestick anatomy → 02 trends/S&R → 03 chart patterns → 04 candlestick patterns → 05 indicators → 06 volume & confirmation. Cross-links to `forex-trading/09-market-analysis.md` avoided; the topic stands alone and forex keeps its overview role.

## Risks / Trade-offs

- [Marked passes raw HTML unsanitized] → All content is authored in-repo by maintainers and rendered at build time, not user input; no new exposure is introduced. LLM-drafted content is quiz questions only, never chapter HTML.
- [Hand-drawn SVG coordinates are tedious to author/tweak] → Keep each figure ≤ ~20 shapes; schematic quality is the bar, not pixel realism.
- [Wide SVGs on tiny screens could shrink text labels below legibility] → Design figures at ~640×360 with ≥14px-equivalent labels; verify on a 360px viewport during implementation.
- [SVG bloat in `content.json`] → ~6 topics × few KB each, gzipped fine; acceptable.

## Migration Plan

Additive only. Ship chapters incrementally; `npm run gen` picks up whatever exists. Rollback = delete the directory. No stored-progress or question-id impact on existing topics.
