# Reading price charts

Every technical decision in this topic starts from the same artifact: the
price chart, a visual record of what buyers and sellers actually paid. This
chapter covers the three chart types you will meet, the anatomy of the
candlestick that dominates modern trading screens, and how the timeframe
you choose changes what the same market appears to be doing.

## Three ways to draw the same data

A **line chart** connects closing prices with a line. It is the cleanest
view for spotting direction at a glance, and it hides everything else —
every open, high, and low is discarded to draw it.

A **bar chart** draws each interval as a vertical dash with two ticks: the
top of the dash is the period's high, the bottom is the low, and the
left and right ticks mark the open and the close. It carries all four
numbers per interval, at the cost of being slow to read.

A **candlestick chart** carries exactly the same four numbers as the bar
chart but draws them as a thick **body** from open to close, with thin
**wicks** — also called shadows — out to the high and low. The shape makes
the story readable at a glance: a long body says one side owned the
interval outright, long wicks say the ground was probed and given back.

> A **candlestick chart** shows the same four numbers as a bar chart, but
> the body-from-open-to-close drawing makes each interval's fight readable
> at a glance.

Candlesticks won. Every retail and professional platform defaults to them,
and the rest of this topic assumes them.

## Anatomy of a candle

Each candle covers one interval of its timeframe and compresses that
interval into four prices, abbreviated **OHLC**: open, high, low, close.

- The **open** is the first traded price of the interval.
- The **close** is the last traded price of the interval — the only one of
  the four a line chart keeps.
- The **high** is the highest price paid during the interval.
- The **low** is the lowest price paid during the interval.

<svg width="640" viewBox="0 0 640 360" role="img" aria-label="A bullish green candle and a bearish red candle, each labeled with high, open, close, low, body, and wick" xmlns="http://www.w3.org/2000/svg">
  <text x="320" y="28" text-anchor="middle" font-size="16" fill="var(--muted)">one candle = one interval = four prices</text>
  <line x1="180" y1="70" x2="180" y2="290" stroke="var(--ink)" stroke-width="2"/>
  <rect x="156" y="130" width="48" height="110" fill="var(--ok)"/>
  <line x1="460" y1="80" x2="460" y2="300" stroke="var(--ink)" stroke-width="2"/>
  <rect x="436" y="140" width="48" height="110" fill="var(--bad)"/>
  <line x1="204" y1="70" x2="240" y2="70" stroke="var(--muted)" stroke-width="1"/>
  <text x="246" y="75" font-size="14" fill="var(--ink)">high</text>
  <line x1="204" y1="130" x2="240" y2="130" stroke="var(--muted)" stroke-width="1"/>
  <text x="246" y="135" font-size="14" fill="var(--ink)">close</text>
  <line x1="204" y1="240" x2="240" y2="240" stroke="var(--muted)" stroke-width="1"/>
  <text x="246" y="245" font-size="14" fill="var(--ink)">open</text>
  <line x1="204" y1="290" x2="240" y2="290" stroke="var(--muted)" stroke-width="1"/>
  <text x="246" y="295" font-size="14" fill="var(--ink)">low</text>
  <text x="180" y="330" text-anchor="middle" font-size="14" fill="var(--ok)">bullish candle</text>
  <text x="180" y="348" text-anchor="middle" font-size="14" fill="var(--muted)">close above open</text>
  <line x1="484" y1="80" x2="520" y2="80" stroke="var(--muted)" stroke-width="1"/>
  <text x="526" y="85" font-size="14" fill="var(--ink)">high</text>
  <line x1="484" y1="140" x2="520" y2="140" stroke="var(--muted)" stroke-width="1"/>
  <text x="526" y="145" font-size="14" fill="var(--ink)">open</text>
  <line x1="484" y1="250" x2="520" y2="250" stroke="var(--muted)" stroke-width="1"/>
  <text x="526" y="255" font-size="14" fill="var(--ink)">close</text>
  <line x1="484" y1="300" x2="520" y2="300" stroke="var(--muted)" stroke-width="1"/>
  <text x="526" y="305" font-size="14" fill="var(--ink)">low</text>
  <text x="460" y="330" text-anchor="middle" font-size="14" fill="var(--bad)">bearish candle</text>
  <text x="460" y="348" text-anchor="middle" font-size="14" fill="var(--muted)">close below open</text>
  <text x="120" y="188" text-anchor="end" font-size="14" fill="var(--muted)">wick</text>
  <text x="120" y="206" text-anchor="end" font-size="14" fill="var(--muted)">body</text>
  <line x1="126" y1="184" x2="174" y2="100" stroke="var(--muted)" stroke-width="1"/>
  <line x1="126" y1="202" x2="150" y2="184" stroke="var(--muted)" stroke-width="1"/>
</svg>

A **bullish candle** closes above its open — the buyers ended the interval
ahead. A **bearish candle** closes below its open. Color conventions vary
by platform; what never varies is the geometry: body top and bottom are
always the two of open and close that fit the direction, and the wick ends
are always the high and the low.

Read bodies and wicks as a fight report. The body is who won the interval;
the wicks are the ground each side probed and lost. A candle with a small
body and wicks far out on both sides says neither side could hold
territory — indecision, in one picture.

## Timeframes

Every candle belongs to a **timeframe** — the length of the interval it
summarizes. A daily candle compresses one trading day into one shape; a
five-minute candle compresses five minutes. The market is the same; the
picture is not.

The timeframe chooses your story for you:

- Higher timeframes (daily, weekly) smooth noise, carry more meaningful
  levels, and demand less screen time. They also give fewer, slower
  signals.
- Lower timeframes (five-minute, fifteen-minute) show detail and fast
  feedback, but amplify noise: what looks like a trend on a five-minute
  chart is often a wiggle invisible on the daily.
- The honest default for learning is the daily chart. Pattern recognition
  learned on dailies transfers down; the reverse is much harder.

Whatever you choose, read one timeframe at a time. A trader who watches a
daily uptrend and a fifteen-minute selloff simultaneously has not two
views but zero.

> The **timeframe** is the interval each candle summarizes — and it
> silently decides which moves are visible and which are noise.

## What a chart does not tell you

A price chart records transactions: what was paid, and when. It does not
record size relative to the market, who was buying, or why. Every method
in this topic — levels, patterns, indicators — is arithmetic on or
geometry around these four numbers per candle. That is powerful, and it is
also the ceiling: a chart shows what markets did, never what they must do
next. Keep that limit in view from here on; each chapter ends by returning
to it.
