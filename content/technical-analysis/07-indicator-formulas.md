# The formulas behind the indicators

Chapter 5 said an indicator is arithmetic on the four numbers of each
candle. This chapter writes the arithmetic down, because the formula is
what decides the number on your screen. Two platforms can compute "RSI
14" from the same closes and print different values, and the difference is
always in a convention: the period, the smoothing, the seed, or the
standard deviation. Knowing which convention you are reading is the
difference between using an indicator and being used by it.

## Why the formula matters

Every indicator in this topic is one of three shapes:

- an **average** over a window of past values (SMA, EMA, and the average
  inside RSI and ATR).
- a **difference** between two such averages (MACD).
- a **spread** around an average, measured in units of dispersion
  (Bollinger Bands).

That is the whole family. Everything else — the colours, the signals,
the names — is interpretation layered on one of those three.

Two things have to be pinned down for every indicator, and they are where
platforms disagree:

- **Period** — how many bars the window covers. The window sets the lag:
  a 20-period average cannot turn sooner than roughly ten bars.
- **Smoothing** — how much weight each new bar gets relative to the
  history. A simple average gives every bar the same weight; an
  exponential one gives the newest bar more.

> The same close, the same period, and a different smoothing gives a
> different indicator. The formula is the contract.

## Moving averages

Let Cₜ be the close of bar t, and N the window length.

    SMAₜ = (1/N) · Σ Cₜ₋ᵢ           for i = 0 … N−1

    EMAₜ = α · Cₜ + (1 − α) · EMAₜ₋₁        α = 2 / (N + 1)

The **smoothing factor** α is the whole difference between the two. For a
20-period EMA, α = 2/21 ≈ 0.095: each new close carries about 9.5% of
the value, and the remaining 90.5% is yesterday's average carried
forward. That recursion is why an EMA needs a **seed value** — the first
value is normally the SMA of the first N closes, and every later value
depends on that seed.

Note what the recursion implies: an EMA never "forgets" completely, but it
forgets exponentially fast, so a decade-old close contributes a share
that is arithmetically present but practically zero.

## RSI

The **relative strength index** compares smoothed gains with smoothed
losses over N bars (14 by convention). First the per-bar gains and
losses:

    gainₜ = max(Cₜ − Cₜ₋₁, 0)
    lossₜ = max(Cₜ₋₁ − Cₜ, 0)

Then **Wilder smoothing** — an EMA with α = 1/N, not 2/(N+1):

    avgGainₜ = (avgGainₜ₋₁ · (N−1) + gainₜ) / N
    avgLossₜ = (avgLossₜ₋₁ · (N−1) + lossₜ) / N

And finally the ratio, mapped onto 0–100:

    RS  = avgGain / avgLoss
    RSI = 100 − 100 / (1 + RS)

The 70 and 30 lines are conventions, not thresholds in the mathematics.
Two readings matter more than the lines: RSI above 50 means smoothed
gains beat smoothed losses over the window, and the distance from 50 is a
measure of how lopsided that is.

Edge case worth knowing: when avgLoss is zero, RS is undefined and the
formula is read as RSI = 100. That is why an unbroken run of higher
closes pins RSI at 100 rather than exploding.

## MACD

    MACD    = EMA(12) − EMA(26)
    signal  = EMA(MACD, 9)
    histogram = MACD − signal

Three lines, two parameters, one knob: 12 and 26 are the fast and slow
windows, 9 is the smoothing of the difference. The MACD line is a
**spread** between two averages — it is zero exactly where the 12- and
26-period trends agree. The signal line is an average of that spread, and
the histogram is the gap between the spread and its own average.

Change 12/26/9 to 5/35/5 and you get a slower, lazier MACD that stays
out of the noise but arrives later. The parameters are a tuning choice,
not a law.

## Bollinger Bands

    mid   = SMA(N)                    N = 20 by convention
    σ     = √( (1/N) · Σ (Cₜ − mid)² )
    upper = mid + k·σ                  k = 2
    lower = mid − k·σ

Here σ is the **standard deviation** of the closes in the window, and the
bands sit k of them away from the middle. The default k = 2 puts about
95% of a normal distribution inside the envelope — but closes are not
normally distributed, and the bands widen exactly when the market is
volatile, which is why a band touch is not a signal by itself.

One convention to check: the formula above uses the **population**
standard deviation, dividing by N. Some platforms divide by N−1 (the
sample standard deviation), which makes the bands about 0.5% wider on a
20-period window. Small, but it is why two charts of the same market can
look different.

## Average true range

The **true range** is the biggest single move in a bar, including the gap
from the previous close:

    TRₜ = max( Hₜ − Lₜ ,  |Hₜ − Cₜ₋₁| ,  |Lₜ − Cₜ₋₁| )

The first bar has no previous close, so TR₁ is conventionally H₁ − L₁.
Then Wilder smoothing again:

    ATRₜ = (ATRₜ₋₁ · (N−1) + TRₜ) / N        N = 14

ATR is the indicator that has the clearest job: it is a unit of distance.
A stop placed one ATR from entry gives the market room to breathe; a
stop at half an ATR sits inside the noise and gets taken out by a
ordinary wiggle.

## Momentum and rate of change

The simplest momentum measures, no smoothing required:

    ROC(N) = (Cₜ − Cₜ₋N) / Cₜ₋N · 100%
    ROC(N)ₜ = ROC(N)ₜ₋₁ + (Cₜ − Cₜ₋N) / Cₜ₋N · 100%

The **rate of change** is the percentage move over N bars; its own
first difference is the rate at which that rate is accelerating. This is
the "second derivative" a chart reader feels as acceleration or stall.

Stochastic %K compares the close with the range of the last N bars:

    %K = (Cₜ − LowestLow(N)) / (HighestHigh(N) − LowestLow(N)) · 100

## The same indicator, two conventions

When two platforms disagree, look here first:

| Convention | Options in the wild | Effect on the number |
| --- | --- | --- |
| RSI smoothing | Wilder (α = 1/N) vs simple average | Wilder reacts more slowly and is the usual default |
| EMA seed | SMA of first N vs first close vs first price | Divergence in the first dozens of bars |
| Bollinger σ | population (N) vs sample (N−1) | Sample makes bands slightly wider |
| ATR period | 14 vs 20 vs the chart's own | Scales every "one ATR" stop distance |
| True range on the first bar | H − L vs H − C | Only the first bar of a series |

None of these is a bug. They are conventions, and the practical rule is
simple: compare like with like, and state the convention when you compare
a number from one platform with a number from another.

## A worked example

Six bars, one instrument, all numbers in the same price units:

| t | O | H | L | C |
| --- | --- | --- | --- | --- |
| 1 | 100 | 103 | 99 | 102 |
| 2 | 102 | 106 | 101 | 105 |
| 3 | 105 | 107 | 104 | 104 |
| 4 | 104 | 108 | 103 | 107 |
| 5 | 107 | 109 | 105 | 106 |
| 6 | 106 | 104 | 100 | 101 |

**SMA(3)** is the average of the last three closes:

    t=3: (102 + 105 + 104) / 3 = 103.67
    t=4: (105 + 104 + 107) / 3 = 105.33
    t=5: (104 + 107 + 106) / 3 = 105.67
    t=6: (107 + 106 + 101) / 3 = 104.67

**EMA(3)** has α = 2/4 = 0.5, seeded with the first SMA(3) = 103.67:

    t=4: 0.5·107 + 0.5·103.67 = 105.33
    t=5: 0.5·106 + 0.5·105.33 = 105.67
    t=6: 0.5·101 + 0.5·105.67 = 103.33

At t=6 the two averages disagree by 1.34 in favour of the EMA: the last
close fell hard, and the exponential average reacted to it sooner. That
gap is the entire reason for having two moving averages.

**True range and ATR(3)**, with Wilder smoothing:

    TR:  t=1: 103−99 = 4
         t=2: max(5, 4, 1) = 5
         t=3: max(3, 2, 1) = 3
         t=4: max(5, 4, 1) = 5
         t=5: max(4, 2, 2) = 4
         t=6: max(4, 2, 6) = 6      ← the gap down from the previous close

    ATR₃ = (4 + 5 + 3) / 3 = 4.00
    ATR₄ = (4.00·2 + 5) / 3 = 4.33
    ATR₅ = (4.33·2 + 4) / 3 = 4.22
    ATR₆ = (4.22·2 + 6) / 3 = 4.81

**RSI(3)**, Wilder smoothing, α = 1/3:

    gains:  +3, 0, +3, 0, 0        losses: 0, 1, 0, 1, 5
    seed:  avgGain = 1.00,  avgLoss = 0.33  →  RS = 3.00 → RSI = 75.0
    t=4:   avgGain = 1.67,  avgLoss = 0.22  →  RS = 7.50 → RSI = 88.2
    t=5:   avgGain = 1.11,  avgLoss = 0.48  →  RS = 2.31 → RSI = 69.8
    t=6:   avgGain = 0.74,  avgLoss = 1.99  →  RS = 0.37 → RSI = 27.2

RSI sat above 69 for three bars and reached 88 at t=4; the last bar — a
gap down — took it to 27 in one step. The oscillator did not predict the
drop; it registered it. Pinning near an extreme is what chapter 5 meant
by "overbought means the trend is strong".

## Quick reference

| Indicator | Formula | Period | Smoothing |
| --- | --- | --- | --- |
| SMA | (1/N)·Σ C | 20 | none |
| EMA | α·Cₜ + (1−α)·EMAₜ₋₁, α = 2/(N+1) | 20 | exponential |
| RSI | 100 − 100/(1 + avgGain/avgLoss) | 14 | Wilder |
| MACD | EMA(12) − EMA(26) | 12/26 | exponential |
| Bollinger | mid ± 2σ, σ = population stdev of closes | 20 | none |
| ATR | Wilder average of true range | 14 | Wilder |
| ROC | (Cₜ − Cₜ₋N)/Cₜ₋N · 100 | 9 | none |

> Read the formula before you trust the line: the period, the smoothing,
> and the seed decide what the indicator is saying.
