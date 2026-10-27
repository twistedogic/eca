# Order types in depth

Chapter 5 covered the four order types you will use most. This chapter
covers the rest of the order vocabulary: the pending orders, the
trailing stop, the paired orders, and the platform mechanics that decide
what actually happens when you click.

> The order type you choose decides which failure you accept: no fill, or
> a bad fill. There is no order type that removes both.

## Pending orders

A **pending order** sits on the platform with a trigger price and does
nothing until price reaches it. The logic is simple and worth getting
straight, because the naming follows it:

- A limit order at a price *better* than the current one, to enter
  when price comes back to you. Buy limit below the market, sell limit
  above it.
- A stop order at a price *worse* than the current one, to enter when
  price breaks out. Buy stop above the market, sell stop below it.
- A stop-limit order does both in sequence: when price touches the
  stop price, a limit order is placed at the limit price. It is the
  "breakout entry that will not chase" order — you get the entry only if
  price comes back to your level.

> A limit order wants a better price and may never fill; a stop order
> wants a worse price and will fill at whatever the market gives.

On MetaTrader 5 these appear as six distinct types: Buy Limit, Sell
Limit, Buy Stop, Sell Stop, Buy Stop Limit, and Sell Stop Limit. Most
retail platforms offer the same set under different names. Chapter 13
covers where they live in the ticket and how they execute.

### The naming trap

Watch what your platform calls a plain stop. MetaTrader calls the
market-on-trigger order "Stop Loss" in the order ticket and "Stop" in the
pending list, which is a market order once triggered. Some brokers and
some charting platforms use the word "stop" for a stop-limit. The two
behave differently when price gaps, and you will not find out which one
you have on the day it matters.

Check the platform's own documentation before you rely on a stop's
behaviour, and test it on a demo account with a visible order history.

## Expiry, rejection, and the gap

Pending orders do not live forever unless you let them. MetaTrader 5
offers good-till-cancelled, today, a specified date and time, and a
specified day. A good-till-cancelled stop stays armed through the
weekend and through holidays — which means it can be triggered by a
Sunday gap, or by the first print after a central bank announcement, at
the worst possible price.

> A good-till-cancelled stop stays armed through the weekend, and can be
> triggered by the first print after a gap.

An order can also fail. The normal lifecycle is started,
placed, partially filled, filled — or cancelled, expired, or rejected. A
rejection is usually the broker refusing to accept the order at all:
trading disabled for the instrument, a stop level too close to the
current price, or an invalid volume. A rejected stop is not a stop. If
your protection was rejected, you have no protection and no error message
in the heat of the moment, so check your order history after placing
stops.

## Trailing stops

A **trailing stop** is a stop that follows price. Set a trailing stop
20 pips below your entry on a long position and it stays 20 pips below
the best price reached; as price rises, the stop rises with it, and it
never moves back down.

It solves a real problem: a fixed stop either gets hit by noise or sits
too far away. A trailing stop follows the trade as it works, so you can
start with a wider stop and tighten it automatically as the position
moves in your favour. That lets a trend trade breathe while still
protecting the open profit.

Two things to know:

- On MetaTrader the trailing distance is set in points rather than pips,
  and one pip is ten points on a five-digit quote. A 200-point trail on
  EUR/USD is 20 pips.
- The trailing stop can be maintained by the broker's server or by your
  own platform. A client-side trail stops working if the terminal or the
  connection drops — which is exactly when a fast market needs it. A
  server-side trail keeps working, but it cannot be tightened by hand
  while the trade is open.

A trailing stop is a stop, so it can still fill worse than its level in a
gap. And it never helps a losing trade: it only ever follows price
favourably.

## Paired orders

Two order types exist to manage the exit as a unit:

- **One-cancels-other** (OCO) attaches two orders to one position, and
  when one fills the other is cancelled. Attach a stop and a take-profit
  to a position and they cannot both fire.
- **One-triggers-other** (OTO) chains them: when the first order fills,
  the second is placed.

Most platforms will place a stop and a target together for you, which is
the practical form of an OCO. Its value is not speed — it is that the
protection cannot be left behind by accident, and that the two exit
levels cannot both fill in a fast market.

## Partial closes, hedging, and netting

A **partial close** takes some of the position off and leaves the rest
running, which is how you scale out of a winner without giving up the
whole position. The trade-off is that the remaining size is now smaller
than your original risk, and the closed part no longer participates in
the move.

The platform's accounting model decides what happens when you trade the
same pair twice:

- In **netting** mode, each symbol has one position. A second trade in
  the same direction adds to it, an opposite trade reduces it, an equal
  opposite trade closes it, and a larger opposite trade reverses it. Only
  one stop and one target exist per position, and a new order's levels
  replace the old ones.
- In **hedging** mode, every order is its own position, so you can be long
  and short the same pair at once, each with its own stop and target.

The mode is set by the broker when the account is opened and cannot be
switched in the terminal. Most forex brokers use hedging because that is
what traders expect; stock-focused brokers tend to use netting.

> In **netting** mode you hold one position per symbol and a new order
> replaces the old stop and target; in **hedging** mode every order is
> its own position.

The practical consequence: on a hedging account, "closing" a position by
trading the opposite direction can leave you holding two positions
instead of one. Check the position list, not just the order ticket.
