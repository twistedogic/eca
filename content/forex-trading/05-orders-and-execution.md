# Orders and execution

Choosing an order type is choosing which risk you accept: fill at any
price, or fill only at your price. Retail platforms offer four that matter.

## The four order types

- A **market order** fills at the best price available immediately. It
  guarantees execution, not price.
- A **limit order** fills only at your price or better. It caps your entry
  or exit price, but there is no guarantee it fills at all.
- A **stop order** is a trigger that becomes a market order. Use it as a
  protective stop, or as a breakout entry.
- A **stop-limit order** combines both: it triggers at the stop price, then
  behaves as a limit order. It caps the price but risks never filling.

> A **stop order** triggers into a market order, so it guarantees execution
> but not price; a **stop-limit order** caps the price but may never fill.

The protective stop is the one most beginners get wrong. A stop-loss is
not a maximum loss — it is a trigger.

## Slippage

**Slippage** is the difference between the price you triggered at and the
price you filled at. It is normally small: one to three pips on a routine
fill in liquid conditions.

It is not small in fast markets. When price gaps, or when liquidity
vanishes around a major release, a triggered stop can fill well past its
level. The same applies to **requote**, where a dealer declines the quoted
price on a market order and offers a new one — something you will meet on
platforms that route to a single dealing desk.

> A stop-loss is a trigger, not a guarantee: in a fast market it can fill
> well past the level you set.

## What a trade actually costs

The spread is only the visible part. The full cost of a round turn is:

- the spread, one per round turn, because you buy at the ask and sell at
  the bid;
- the broker's commission, quoted per side or round turn — always check
  which;
- the rollover, if the position is held overnight;
- any conversion cost if the profit is paid out in a currency other than
  the account currency.

On EUR/USD, a raw-spread account with a $7 round-turn commission and a
0.2 pip spread lands at roughly $9 all-in per standard lot. A
commission-free account quoting a 1.2 pip spread lands at roughly $12.
The label on the account matters far less than the total.

> The **all-in cost** of a trade is the spread plus the commission plus the
> rollover, not the advertised spread alone.

## Execution quality

Two questions to ask any broker: who provides the liquidity, and how are
orders routed? A dealing desk that hedges internally, and a platform that
routes to multiple liquidity providers, will fill differently in the same
conditions. Judge execution on the worst fills you got, not the best.
