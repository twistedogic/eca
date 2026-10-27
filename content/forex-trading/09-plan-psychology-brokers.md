# Plan, psychology, and brokers

The last chapter is about the part that decides results: a repeatable
process, a record of what happened, and the judgement to stop when the
process says to.

## Write the plan down first

A **trading plan** is a short document that fixes the decisions in
advance: which pairs you trade, which session you trade them in, what
setup qualifies, where the stop goes, what the target is, how much you
risk, and what you do when the stop is hit. Its purpose is to move
execution out of the moment of decision.

Include a hard daily loss limit and a rule to stop trading for the day
when it is reached. That single rule removes most revenge trades, because
revenge trading is almost always an attempt to win back money you have
already decided you cannot risk again.

## Test it before you trust it

A **backtest** replays your rules over historical data. It is the only way
to see whether a plan works without risking money, and it is also the
easiest way to fool yourself.

> The four classic backtest errors are **look-ahead bias**, **survivorship
> bias**, **curve fitting**, and ignoring real costs.

- **Look-ahead bias** is using information that would not have existed at
  the decision point — revised data, or a signal computed from the bar
  you are trading.
- **Survivorship bias** is testing only the pairs and instruments that
  still exist today.
- **Curve fitting** is adjusting a parameter until the historical result
  looks perfect. If a small change to the setting destroys the edge, the
  edge was the fit, not the market.
- **Ignoring costs** means the backtest never paid the spread, the
  commission, or the rollover.

Keep data you never looked at until the end, and require the result to
hold up on it. Then run a **forward test** in real time on small size or
a demo account, where slippage and psychology are real even if the money
is not.

## Journal the process, not just the profit

A trading journal records the plan, the entry, the stop, the target, the
result in R, and — most importantly — whether you followed your rules.
Without that last column you cannot tell a bad system from a bad day.
Judging a strategy by its profit alone is how traders keep a losing system
for years.

## The behavioural traps

- **Revenge trading**: immediately re-entering larger to recover a loss.
  This is the most expensive habit in the market and it is entirely
  preventable with the daily loss limit.
- **Overtrading**: taking marginal setups because the account is idle.
  More trades means more costs, and costs are the one variable that never
  improves.
- **Moving the stop**: widening a stop to avoid a loss converts a planned
  loss into an unplanned larger one.
- **Cutting winners early**: closing a winner at the first sign of
  movement, then watching it run without you.

None of these are fixed by willpower. They are fixed by rules set before
the position is open and by a stop-out that ends the session.

## Choose the broker carefully

Broker failure is a real and recurring risk to retail accounts, and it is
cheap to check in advance:

- Verify the firm on the regulator's own public register, not on its
  website. Search the legal entity name, not the trading name — they are
  often different, and the trading name is the one the marketing uses.
- Look for **segregated client funds**: client money must sit in separate
  accounts from the firm's own money.
- Check for **negative balance protection**, which caps your loss at your
  deposit even if the market gaps against you. It is required in several
  jurisdictions and is not universal — ask.
- Test a small withdrawal early. A firm that cannot release a small
  amount promptly is telling you something.
- Compare all-in cost, execution quality, and the rollover schedule — not
  the advertised spread.

## Keep the perspective

Most retail accounts lose money, and the reasons are boring and
structural: too much leverage, no position sizing rule, no plan, and
reactionary behaviour after losses.

None of that is fixed by a better indicator. It is fixed by writing the
plan, sizing from the stop, and following it when it is uncomfortable. The
last chapter covers what happens to the profit once you do keep it.
