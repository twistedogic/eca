# Candlestick patterns

Chapter 1 read one candle; this chapter reads them in short sequences.
Candlestick patterns are the smallest patterns in the topic — one to three
candles that supposedly telegraph a turn. They are the most popular and
the most oversold tool in the kit, so this chapter teaches the shapes and
the statistics in the same breath.

## Single-candle signals

A **doji** is a candle whose open and close nearly meet: the body shrinks
to a slash while both wicks reach out. Neither side could hold territory
by the end of the interval — balance, or indecision. After a long directional
run, that balance is interesting; in the middle of a range it is just
Tuesday.

A **hammer** is a small body perched at the top of a long lower wick.
Price probed far down and was pushed all the way back: sellers tested a
level and the level answered. The mirror image after a rally — a small
body at the bottom of a long upper wick — is a **shooting star**: buyers
probed up and got rejected.

> A **hammer** is a small body atop a long lower wick — price probed down
> and was pushed back, so the wick records rejection.

## Two-candle signals

A **bullish engulfing** candle is a green body that swallows the previous
red body whole: the buyers not only won their interval, they erased the
sellers' previous one. A **bearish engulfing** is the mirror — a red body
consuming the green before it. Initiation changed hands at that price.

A **harami** is the opposite posture: a large candle followed by a small
one entirely inside its body. Momentum did not reverse — it stalled,
which is read as a warning for the trend rather than a signal against it.

<svg width="640" viewBox="0 0 640 230" role="img" aria-label="Four panels: a doji with a tiny body and two long wicks, a hammer with a small body above a long lower wick, a bullish engulfing pair where a green candle swallows the prior red one, and a harami pair where a small candle sits inside the prior large body" xmlns="http://www.w3.org/2000/svg">
  <line x1="70" y1="40" x2="70" y2="180" stroke="var(--ink)" stroke-width="2"/>
  <rect x="62" y="105" width="16" height="8" fill="var(--ink)"/>
  <text x="70" y="210" font-size="14" fill="var(--muted)" text-anchor="middle">doji — balance</text>
  <line x1="230" y1="40" x2="230" y2="180" stroke="var(--ink)" stroke-width="2"/>
  <rect x="222" y="48" width="16" height="26" fill="var(--ok)"/>
  <text x="230" y="210" font-size="14" fill="var(--muted)" text-anchor="middle">hammer — rejection below</text>
  <line x1="380" y1="60" x2="380" y2="150" stroke="var(--ink)" stroke-width="2"/>
  <rect x="372" y="75" width="16" height="50" fill="var(--bad)"/>
  <line x1="430" y1="30" x2="430" y2="190" stroke="var(--ink)" stroke-width="2"/>
  <rect x="422" y="45" width="16" height="120" fill="var(--ok)"/>
  <text x="405" y="215" font-size="14" fill="var(--muted)" text-anchor="middle">bullish engulfing</text>
  <line x1="540" y1="35" x2="540" y2="185" stroke="var(--ink)" stroke-width="2"/>
  <rect x="532" y="50" width="16" height="110" fill="var(--bad)"/>
  <rect x="534" y="88" width="12" height="30" fill="var(--ok)"/>
  <text x="555" y="215" font-size="14" fill="var(--muted)" text-anchor="middle">harami — stall</text>
</svg>

## Context beats shape

Every pattern above carries an asterisk the size of the literature.
Tested standalone, candlestick rules mostly fail: bootstrap studies of
candlestick rules on Dow stocks (Marshall, Young and Rose, 2006) and
follow-up work on other markets find little to no value once costs are
paid. The shape is not the signal.

What survives is the shape *in location*:

- A hammer is evidence at the third test of a support level from chapter
  2. The same hammer mid-range is a coin flip with better marketing.
- An engulfing candle matters when it engulfs *something that mattered* —
  a swing high, a level break — not when it erases one nothing candle.
- At a minimum, demand agreement: the pattern plus the level, or the
  pattern plus volume, or the pattern plus a higher-timeframe turn. One
  witness is not a case.

> A candlestick pattern is a single vote; the level, the volume, and the
> higher timeframe are the rest of the ballot.

The working rule for entries: let the candle pattern pick the *moment*
inside the level's story, never let it invent a story of its own. The
level decides whether a trade exists; the candle only decides when.
