# Strategies, styles, and expectancy

A trading plan that does not say what to trade is not a plan. This chapter
covers the families of strategy a retail forex trader can realistically
run, what each one is good for, what each one costs, and the arithmetic
that tells you whether an edge exists at all.

> A strategy is a bet with a stated payoff shape. If you cannot say what
> a win looks like and what a loss looks like, you do not have a strategy —
> you have a hope.

## Two families

Almost every approach falls into one of two buckets, and they behave
completely differently.

**Trend following** bets that a move in progress will continue. Its
payoff shape is lopsided: many small losses and a few large wins, so the
win rate is low — often 30% to 45% — and the winners must be several
times the size of the losers. It earns well in sustained trends and grinds
through ranges, cutting out small losses while the big move never comes.

**Mean reversion** bets that an extreme move will snap back. Its shape is
the mirror image: a higher win rate — often 55% to 70% — with small
winners and occasional large losses. It earns well in ranging markets
and gets destroyed by a trend, because every entry into the move is an
entry into the loss.

> Trend following needs many small losses and rare large wins; mean
> reversion needs many small wins and rare large losses.

Neither is better. They demand opposite behaviour from you. A trend
follower must accept a low win rate without intervening, and must let
winners run. A mean reversion trader must cut losses fast and take small
profits without hesitation. Most losing retail accounts are not losing
because the approach is wrong; they are losing because they abandon one
approach halfway and start trading the other.

A third family, the carry trade, was covered in chapter 9: it earns
the interest rate differential and is a slow, crowded position that
unwinds violently when central banks surprise.

## Case study: the Donchian breakout

The best-known documented trend-following system is the one Richard Dennis
built in 1983. He wagered with William Eckhardt that trading could be
taught, recruited a group of novices with no trading background, trained
them for two weeks on a written rule set, funded them with real capital,
and let them trade. The group is reported to have made around $175
million over four years.

The rules were mechanical:

- Enter on a break of the highest high or lowest low of the past 20
  periods. A second, slower system used 55 periods to enter and 20 to
  exit.
- Exit when price broke the opposite extreme of a shorter channel — 10
  periods in the fast system.
- Place the stop two units of volatility away from entry, where one unit
  was the 20-period average true range.
- Size each position so that a one-unit move was worth 1% of the account,
  which makes the two-unit stop a 2% risk. Add a further unit every half
  unit of favourable movement, up to a cap.
- Skip a breakout after a winning one, so a trend that had already been
  traded was not immediately re-entered.

The **Donchian channel** is simply the highest high or lowest low over a
rolling window, and it is still the basis of most breakout systems.

> The famous result was on futures and commodities, not retail spot
> currency, and the group was diversified across about twenty markets so
> that no single one decided the outcome. Treat it as a teaching case,
> not a promise.

Four things it teaches are worth more than the rules themselves:

1. The edge is asymmetric. A 35% win rate is not a broken system. The
   system is built so the few large wins pay for many small losses.
2. Volatility belongs in the sizing, not the entry. Sizing by a
   volatility unit is the same idea as the ATR-based stop distance in
   chapter 8, applied to the size of the position instead of the width of
   the stop.
3. "The setup fired" is not the same as "the trade is valid". The
   skip filter is an explicit rule for not re-entering a trend you have
   just been stopped out of. Most systems need something like it, and
   most traders skip it because it feels like leaving money on the table.
4. Diversification is part of the risk model. Betting on one pair at
   one time is a different proposition from betting on twenty uncorrelated
   markets at a small size each.

## Mean reversion in practice

The common retail version fades extremes. Sell an RSI reading that has
fallen below 30, buy one above 70. Or trade the **Bollinger bands**,
which are a 20-period moving average with bands two standard deviations
either side of it: sell a touch of the lower band and target the middle
band.

The mechanism is the same every time. Enter at an extreme, place the
stop beyond the extreme, and exit at the mean. The target is the middle
band, not the opposite band, which is why the winners are small by
design.

The failure mode is structural. In a trending market, band touches are
not reversals, they are the entries to the next leg. A mean reversion
system without a hard stop is not a system, it is a way to accumulate a
position in a move that does not reverse.

## Grid and martingale

Two approaches are worth naming because they are everywhere and because
their arithmetic is worth understanding.

**Grid trading** places a series of orders at fixed price intervals, all
in the same direction, at the same size. Each favourable step closes a
level for a small profit. An adverse move leaves every level open at once,
accumulating a position far larger than the one you thought you had.

**Martingale** is the same idea with escalating size: double after each
loss, so a win recovers everything.

> Grid and martingale produce a high percentage of winning trades. That
> is the appeal, and it is the trap.

The reason they lose is arithmetic. In a grid, the small winners total
roughly one spread plus a little per level, while the loss if price runs
through the whole grid is the sum of every open position — far larger
than the accumulated wins once the spread is paid on each level. Doubling
the size does not fix this; it changes the failure from "a long grind" to
"a loss larger than the account" when the move exceeds the capital base.

Neither is a strategy with an edge. Both are a transfer of risk from the
broker to the account holder, which pays out steadily for a long time and
then takes everything at once. Grid systems are a real product category
and a great many of them work for years — which is exactly what makes the
mathematical argument hard to hear.

## Styles and timeframes

The same strategy logic behaves very differently at different speeds:

- **Scalping** holds positions for seconds to minutes and needs many
  trades per day. It lives or dies on cost.
- Day trading holds positions intraday and closes them by the end of the
  session.
- Swing trading holds for days to weeks, typically a handful of trades a
  week.
- Position trading holds for weeks or months.

Size scales inversely with the style, because a longer timeframe means a
wider stop: the wider the stop, the smaller the position for the same
money at risk. That is chapter 8's formula again.

The chart has to fit the strategy too. A system using a 200-period moving
average needs 200 bars of history before it can produce a signal, so
running it on a five-minute chart is not the same strategy at all.

## The cost constraint

Every trade pays: the spread, the commission, and whatever slippage you
get. Compare that to what the trade risks. The **cost-to-stop ratio** is
the fraction of your planned risk that goes to costs before the trade
moves a pip, and it decides which styles are viable.

Take a $10,000 account risking 1% per trade, on EUR/USD, with a 1.0 pip
spread and $7 round-turn commission per standard lot.

A 5-pip stop on this account risks $100, which is two standard lots.
Those lots pay $14 in commission and $20 in spread — $34 of cost on a
$100 trade, 34% of the risk, before anything happens. The strategy has
to make back 34% of its stop just to break even.

The same account, the same risk percentage, the same pair, with a 50-pip
stop takes 0.2 standard lots. Those pay $1.40 in commission and $2.00 in
spread — $3.40, or 3.4% of the risk.

> The same account and the same risk percentage pay 34% of the trade in
> costs on a 5-pip stop and 3.4% on a 50-pip stop.

Nothing about the trader changed — only the stop distance and therefore
the size. This is why short timeframes need institutional spreads and
why most retail scalping systems lose money before they evaluate the
strategy at all.

## Expectancy: does the edge exist?

**Expectancy** is the average result of one trade, and it is the only
number that answers whether a strategy is worth trading.

Measure wins and losses in R, where 1R is the amount risked. If the
average win is W, the average loss is L, the win rate is p, and the cost
per trade is C (also in R), then:

    expectancy = (p x W) - ((1 - p) x L) - C

Set expectancy to zero and you get the **break-even win rate**:

    p* = (L + C) / (W + L)

Without costs, a strategy whose average win is 1.5 times its average loss
needs a 40% win rate to break even. Add 0.1R of cost per trade and it
needs 44%. A strategy that looks profitable at 45% win rate and loses
money at 40% has an edge, but not one that survives the spread.

Three rules follow:

1. Costs come out of the win rate, not out of a separate budget. A
   system with a thin edge can be turned negative purely by costs.
2. Test the edge on enough trades. The commonly cited floor is 200 to
   300 trades; below that, a high win rate may be noise. Check the result
   on data you did not use to build it.
3. Then, and only then, decide how much to risk. Expectancy tells you
   whether the edge exists. How much you risk, and what happens to the
   account when you are wrong, is chapter 8.
