# Sessions and liquidity

The forex market runs around the clock from Sunday evening to Friday
evening, but it does not move at a constant rate. Volume pools in
**trading sessions** that follow the business day of each financial centre,
and the handoffs between them create the patterns most traders actually
trade.

## The four sessions

Approximate UTC hours, using northern-hemisphere winter as the baseline:

- **Sydney session** (21:00–06:00 UTC) — opens the week, thin liquidity,
  AUD and NZD active.
- **Tokyo session** (00:00–09:00 UTC) — the Asian session, JPY and the
  regional pairs active, still thin by western standards.
- **London session** (08:00–17:00 UTC) — the largest single session, the
  deepest liquidity in the majors, EUR/GBP/CHF active.
- **New York session** (13:00–22:00 UTC) — USD active, and the window in
  which US data releases hit the market.

The session hours shift by an hour with daylight saving. The
**London–New York overlap**, roughly 13:00–17:00 UTC in winter and
12:00–16:00 UTC in summer, is the highest-volume window of the week and
usually the tightest spreads.

> The London–New York overlap is the highest-volume window of the week and
> the tightest spreads.

## Liquidity is a cost, not just a speed

**Liquidity** is the depth available at the current price. Deep liquidity
means tight spreads, fast fills, and small slippage. Thin liquidity means
the opposite, and it is where retail accounts get hurt most often: the
hours around the weekly open, the last hour before Friday's close, and any
period when a major central bank or government is making an unscheduled
announcement.

Practical consequence: a stop-loss is executed into that thin book. A
strategy that only works in the busy overlap, and then gets traded by
accident at 22:00 UTC, is not the strategy that was tested.

## The rollover

Spot forex settles two business days forward, so a position held overnight
pays or receives **rollover** interest at the broker's daily cutoff, which
is typically around 5 p.m. New York time. Because the weekend is folded
into one settlement, **triple swap** is charged on Wednesday for most
pairs: three days of interest at once.

> Spot FX settles two business days forward, so **triple swap** is charged
> on Wednesday for most pairs.

Rollover can be a meaningful cost — or a meaningful credit — on any trade
held for more than a day, and it is usually larger than the difference
between two brokers' headline spreads. Chapter 5 covers the full cost of a
trade, and chapter 9 covers the interest-rate differential that drives it.
