# Risk management

This is the chapter that decides whether you are still trading in three
years. Everything before it is preparation; everything after it is
execution.

## Size the position from the stop

The right order of operations is: find where the trade is wrong, measure
the distance to that level in pips, then compute how many units fit your
risk budget.

**Position sizing** is that computation: lots = (account equity x risk %)
divided by (stop distance in pips x pip value per lot).

Worked example. A $10,000 account, risking 1% = $100, on EUR/USD with a
50-pip stop. A standard lot carries $500 of risk across 50 pips, so the
position is 100 / 500 = 0.20 lots. On a micro lot the same $100 risk over
50 pips is 20 micro lots — the same trade, sized for a smaller account.

> **Position sizing** works backwards from the stop: the position is (equity x
> risk %) divided by (stop pips x pip value per lot).

## Risk per trade

The most widely used guideline is to risk between 0.5% and 2% of equity per
trade, with 1% the common default. Risk here means the amount you lose
if the stop is hit — not the margin used and not the notional size.

Two reasons this works. A losing streak is normal, and at 1% per trade
twenty consecutive losses cost about 18% of the account, which is painful
but recoverable. At 5% per trade, the same streak costs over half the
account.

> **Risk per trade** of 1% means twenty consecutive losses cost about 18% of
> equity; at 5% per trade the same streak costs more than half.

## Portfolio heat

Risk per trade is not the whole budget. What matters is the total amount
of money that stops being yours if every open position goes against you
at once — the **portfolio heat**.

Five positions at 1% each is 5% of the account at risk, not 1%. If they
are correlated, it is worse: three dollar-short positions at 1% each are
one 3% dollar position wearing three different hats. Set a cap on total
open risk — commonly 3% to 6% of equity — and count correlated trades
once, at the size of the combined exposure.

## Define risk in R

Measure every trade in **R multiples**, where 1R is the amount you
intended to risk. A +2R trade made twice as much as planned. A -1R trade
hit its stop. This removes the noise of lot size from your journal and
lets you evaluate decisions rather than outcomes: did the process follow
the plan?

## Stops and volatility

Place the stop where the trade thesis is wrong — below structure, not at a
round number. Then check that the stop distance makes sense against
current **volatility**, measured by the average true range. A stop one
tenth of the daily range will be hit by noise; a stop five times the daily
range will never be hit and will eventually consume the account through
per-trade risk alone.

## Correlation is hidden size

Two positions that look unrelated are not. EUR/USD and USD/CHF are both
dollar-short: long one and short the other is close to a single large
dollar position. Before adding a trade, check what it does to your total
exposure per currency. **Correlation** means sizing each position as if it
were the only one, and then discovering the account was carrying three
times the intended risk.

## Drawdown is asymmetric

**Drawdown** is the peak-to-trough decline in equity. Recovering it is
not symmetric: a loss of *d* requires a gain of *d* / (1 - *d*) on what
remains. A 10% drawdown needs an 11.1% gain, a 20% drawdown needs 25%, and
a 50% drawdown needs a full 100% — you have to double what's left.

> A 10% **drawdown** needs an 11.1% gain to recover, and a 50% drawdown
> needs a full 100%.

This is why survival comes before growth. A trader who loses 50% has to
double a smaller account to get back to zero, while a trader who lost 10%
needs a modest gain. A daily loss limit and a hard stop on trading after
it are cheap insurance against the asymmetry.

## Balance, equity, and the peak

**Balance** is the cash in the account. **Equity** is balance plus the
open profit or minus the open loss. Drawdown is measured from the highest
equity the account has ever reached, not from the starting balance — which
means an account that grew to $20,000 and fell to $15,000 is 25% down
even though it is still up on its original $10,000.

The practical point: your risk budget should be a percentage of current
equity, and your daily loss limit should be measured against the day's
starting equity. A trader whose peak was $20,000 and is now trading a
$15,000 account is running a bigger position than the numbers suggest if
they size off the original deposit.

## Risk of ruin

A drawdown is recoverable. Ruin is not, and the difference is worth
understanding.

A fixed fraction of equity risks a fixed fraction of equity, so the
account can never lose everything in one trade — but a large enough
fraction risks it over a sequence. The mathematics of this is the
geometric growth of the account. Compounding rewards the path, not the
average: the same set of trades in a different order ends at a different
balance, and a large enough risk fraction turns the growth rate negative
however good the average result looks. If you risk 50% per trade, one loss leaves you half the account
and you need to double it to recover; risk 100% and one loss ends it.

The practical rule falls out of the growth arithmetic rather than a rule
of thumb: the growth-optimal risk fraction is given by the Kelly
criterion, *f* = (*bp* − *q*) / *b*, where *p* is the win probability,
*q* = 1 − *p*, and *b* is the average win divided by the average loss.
Risking more than that fraction lowers long-run growth and raises the
chance of ruin; risking less is safe but grows the account more slowly.

Nobody sizes at full Kelly, because the estimate of *p* is always wrong
and full Kelly is violently exposed to being wrong. The 1% guideline from
earlier in this chapter sits far below it for that reason.

> Risking more than the Kelly fraction lowers long-run growth and raises
> the probability of ruin. Nobody sizes at full Kelly.

## Respect the math

The rules above are not opinions about markets. They are arithmetic about
compounding. Chapter 11 covers the behavioural side — the part where the
arithmetic gets sabotaged.
