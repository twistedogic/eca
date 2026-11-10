# Indicators and oscillators

Every indicator is arithmetic on the four numbers of each candle from
chapter 1. Smoothing, differencing, banding — none of it adds information;
it rearranges what price already said into a slower, calmer shape. That is
genuinely useful, and it is also the ceiling: an indicator is a lamp, not
a window. This chapter covers the handful worth knowing and the two honest
ways to use them.

## Trend indicators: moving averages

A **moving average** is the mean of the last N closes, redrawn each
candle. Each new close enters the window and the oldest drops out, so the
average follows price with a lag of roughly half its length. A 20-period
MA tracks the short trend, a 50 the swing trend, and a **200-period moving
average** is watched widely enough that price interacting with it is news
in itself.

A **simple moving average** weights every close in its window equally; an
**exponential moving average** weights recent closes more heavily, so it
turns sooner and hugs price tighter. SMA for the long view, EMA when
reaction speed matters; the difference is a tuning knob, not a doctrine.

Two common readings, in descending order of usefulness:

- The ribbon: price above a rising 50 and 200 says the trend is up; price
  below both, falling, says down. The MA does not predict this — it
  *is* the definition, drawn.
- Crosses: a shorter MA crossing a longer one (a "golden" or "death"
  cross when it involves the 200) makes headlines. It is simply a
  lagging, official-sounding confirmation of a trend change you usually
  can already see in the swings.

<svg width="640" viewBox="0 0 640 240" role="img" aria-label="A price line zigzagging upward with two smooth moving-average lines following it with a lag, the slower one below the faster one" xmlns="http://www.w3.org/2000/svg">
  <polyline points="20,190 70,150 110,175 160,110 210,140 270,80 330,105 390,60 450,85 520,40 580,55 620,30" fill="none" stroke="var(--ink)" stroke-width="2" stroke-linejoin="round"/>
  <polyline points="20,200 70,180 110,172 160,155 210,142 270,122 330,108 390,90 450,76 520,62 580,50 620,42" fill="none" stroke="var(--ok)" stroke-width="3"/>
  <polyline points="20,208 70,196 110,190 160,180 210,170 270,158 330,146 390,133 450,120 520,107 580,95 620,88" fill="none" stroke="var(--accent)" stroke-width="3"/>
  <text x="540" y="80" font-size="14" fill="var(--ok)">fast MA (20)</text>
  <text x="520" y="125" font-size="14" fill="var(--accent)">slow MA (200)</text>
  <text x="70" y="228" font-size="14" fill="var(--muted)">price above a rising ribbon = uptrend, by definition</text>
</svg>

## Momentum oscillators: RSI and MACD

The **relative strength index** (RSI) compresses recent gains versus
losses into a 0–100 line, most commonly over 14 candles. Above 70 it is
conventionally called **overbought**, below 30 **oversold** — names that
have misled a generation. In a strong trend, RSI stays pinned near the
extreme for long stretches; "overbought" means *the trend is strong*, not
*sell now*. The oscillator's real use is **divergence**: price makes a new
high while RSI makes a lower high, momentum is fading under the surface
of the trend.

The **MACD** is the gap between a 12- and a 26-period exponential moving
average, plotted with a 9-period EMA of itself called the **signal
line**. The gap (the MACD line) says which way and how hard the two
trends disagree; the histogram of their difference says whether that
disagreement is growing or shrinking. Crosses of the two lines are
signals only in hindsight textbooks — momentum turns before price does,
but it turns falsely often.

<svg width="640" viewBox="0 0 640 200" role="img" aria-label="An RSI panel: the oscillator line between dashed lines at 70 and 30, spending a long stretch above 70 during a strong trend" xmlns="http://www.w3.org/2000/svg">
  <rect x="20" y="30" width="600" height="26" fill="var(--bad)" opacity="0.12"/>
  <rect x="20" y="130" width="600" height="26" fill="var(--ok)" opacity="0.12"/>
  <line x1="20" y1="43" x2="620" y2="43" stroke="var(--bad)" stroke-width="1" stroke-dasharray="6 5"/>
  <line x1="20" y1="143" x2="620" y2="143" stroke="var(--ok)" stroke-width="1" stroke-dasharray="6 5"/>
  <text x="580" y="36" font-size="14" fill="var(--bad)">70</text>
  <text x="582" y="160" font-size="14" fill="var(--ok)">30</text>
  <polyline points="20,120 70,110 110,70 160,38 210,26 260,22 310,30 360,25 410,40 460,55 510,60 560,90 620,110" fill="none" stroke="var(--accent)" stroke-width="2.5"/>
  <text x="160" y="80" font-size="14" fill="var(--muted)">strong trend: pinned near the extreme —</text>
  <text x="160" y="97" font-size="14" fill="var(--muted)">not an automatic sell</text>
</svg>

## Volatility: Bollinger Bands and ATR

**Bollinger Bands** draw an envelope around price at a moving average
plus and minus two standard deviations of recent closes. The bands widen
when volatility expands and pinch tight in a **squeeze** — a coiling that
often precedes a sharp move, in a direction the bands do not pretend to
know. Touching a band means price is statistically stretched for its own
recent past; it is not a buy or sell by itself, and in a trend price can
walk the band for a long time.

The **average true range** (ATR) is different in kind: it measures the
typical candle-to-candle travel in price units, and its job is sizing. A
stop placed closer to entry than one ATR sits inside the market's normal
breathing — it will be hit by noise, not by being wrong. Chapter 2 put
stops at levels; ATR says how much room beyond the level the noise
deserves.

## The two honest uses

Indicators earn their keep in exactly two jobs:

- Confluence: a level from chapter 2, a pattern from chapter 3 agreeing
  on the same spot — the indicator adds a second witness, not a veto.
- Regime filtering: a glance at the MA ribbon or RSI's midline to avoid
  trading range tactics inside trends and trend tactics inside ranges.

Anything beyond that — auto-trading MACD crosses, selling overbought
reads in uptrends — is the lag problem dressed as a signal. The indicator
cannot tell you what happens next; it can only tell you where you are.

> An indicator adds a second witness to a level's story — a **MACD** cross
> alone, with no level and no trend, is arithmetic looking for a job.
