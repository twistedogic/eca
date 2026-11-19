# Stops and trade management

Chapter 8 sized the position from the stop. This chapter is about the
stop itself: where it goes, why it goes there, and everything that
happens to the trade after the entry. Most of a trade's outcome is
decided here, not at the entry signal.

## Anchor the stop where the thesis breaks

A stop has one job: to end the trade when the reason for the trade is
gone. That gives the placement rule, in three parts, in order:

1. **Anchor** — find the price level that disproves the thesis. Below
   the rejection tail, below the swing low, below the value-area
   boundary. Never "what I can afford to lose".
2. **Margin of error** — add 20 to 40 pips beyond the anchor on FX.
   For limit orders, where being filled is the point, 5 to 10 pips.
   Scale up on volatile pairs; a fixed number fits no pair.
3. **Broker minimum** — if the broker's minimum stop distance exceeds
   the anchor plus margin, widen to the minimum. Never narrow back
   inside the anchor.

> The market probes visible levels hunting for clustered stops, so the
> stop belongs **beyond the anchor**, not at it.

The margin of error exists because every visible level attracts stops,
and a normal probe of the level is not a break of it. The 20–40 pip band
absorbs the probe. EUR/USD needs roughly 10–15 pips on a technical
level; the volatile majors — GBP and JPY pairs — need more; exotics need
their own calibration or the stop becomes unsizeable.

## Size pays for the stop

The companion rule that makes the anchor safe: a wider stop means a
smaller position, never a bigger risk budget. The stop distance and the
position size multiply out to the risk — one of the two must flex, and
it is always size.

If the stop is so wide that the position falls below the broker's
minimum lot, the answer is to reject the trade, not to exceed the risk
cap and not to move the stop closer. The stop is never moved to make
the risk arithmetic work. Pick the optimal stop point first, then see
how many lots that allows.

## The stop never widens

The initial stop is carved in stone. Once the trade is open, the stop
may move in favour of the position — to lock profit as the trade works
— and it may do nothing. It may never move outward, and never widen
because the trade is "going to come back".

This one rule separates the traders who survive from the ones who
don't, because widening a stop converts a planned 1R loss into an
unbounded one. Every account killed by a single trade died through a
widened stop.

## Targets come from the market

Reward at least equal to risk is a floor, not a target. The target
itself should come from the market's structure — the next structural
level, a measured move, a value-area boundary, the control price — not
from a fixed 2:1 multiple. There is no law that says the market owes
you twice your risk.

The honest way to set targets is to measure them. For each setup type,
collect the distribution of **maximum favourable excursion** — how far
price ran in your favour, as a percentage — across past instances.
Percentages scale; pips don't. If +100 pips was reached 90% of the time,
+200 62%, and +300 32%, the target belongs where the distribution says
the move usually carries, provided that still clears the reward floor.

## Scale out and trail

A complete exit plan takes profit in pieces rather than all at once:

- Half off at 2× initial risk.
- Another quarter at 3×.
- Leave a small runner — 5 to 10% of the position — with a trailing
  stop to catch the tail of the move.

Trail the runner below the most recent swing low, or 1.5× the profit
target back from the extreme, whichever is tighter. Do not cut winners
down to 1R: if a system averages 2.5× wins against losses at a 45% win
rate, trimming every winner to 1× would require 150% more winning trades
than the system produces. Cutting winners is how a good trend system
becomes a losing one.

## Cut it fast when it never works

The first bars of a trade carry real information. A trade that shows a
profit within the first two bars is measurably more likely to work; a
trade that has never been in profit after roughly six bars is not a slow
starter, it is a failed trade. Cut it rather than nurse it.

Buying strength and selling weakness — entering on stop orders as the
market moves your way — mechanically raises the odds of an immediately
profitable entry, which is exactly what this rule rewards.

## What ends a trade

| Trigger | Action |
|---|---|
| Stop hit | Exit — that is what it is for |
| Target hit | Partial exit per the scale-out plan |
| Thesis invalidated — structure broken | Exit early; don't wait for the stop |
| Never in profit after ~6 bars | Cut it fast |
| Time stop reached | Exit — the setup had its window |
| Sharp adverse reaction (>20 pips in minutes) | Tighten, reduce, or exit |
| The event passed and the market ignored it | Exit — the basis for the trade is gone |
| Friday close with an open loss | Exit — don't carry it through the weekend |
| Margin stop-out imminent | Flatten everything |

One more pairing rule from the same family: **coupled adjustment**. If
you are long and you raise the take-profit, raise the stop too. Targets
and stops move together, and only for a real reason — a central bank
surprise, a break of a major level, unusual volatility. For most trades
there may be a dozen events a year that justify changing the plan at
all.

## After the exit

When a profit is taken, the trade is over. Do not re-enter the same
position because it was working, and do not flip to the opposite side
because you were right once. That next trade is another trade entirely,
with its own thesis, its own stop, and its own risk budget — the outcome
of the last one has no bearing on it.
