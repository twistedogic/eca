# MetaTrader 5

MetaTrader 5 (MT5) is the platform most retail forex brokers run, and it
is where everything in this course gets clicked. This chapter is not a
tour of every button. It covers the parts of the platform that connect
directly to what the earlier chapters taught, and the handful of settings
that quietly determine what actually happens to your trades.

> MetaTrader 5 is a **platform**, not a strategy and not a broker. It is
> the tool you use to express a decision you have already made.

## The terminal

The window is built from four panels: the chart workspace in the middle,
**Market Watch** on the left with the live quotes, **Navigator** on the
left for indicators, Expert Advisors and accounts, and the **Toolbox**
along the bottom.

The Toolbox has tabs for Trade, Exposure, History, News, Signals and
Journal. Two of them matter here:

- **Trade** holds the order ticket, the open positions, and the account
  summary: balance, equity, margin, free margin and margin level. MT5
  split what MT4 showed as one tab into Orders and Positions, because an
  order still waiting to trigger is not a position, and conflating them
  is how beginners end up thinking they are protected when they are not.
- **Journal** is where the platform reports what it did and what went
  wrong: rejected orders, invalid volume, trading disabled by the broker.
  It is the first place to look when something does not happen.

The hotkeys worth learning:

- Ctrl+M, Ctrl+N, Ctrl+T — Market Watch, Navigator, Toolbox
- Ctrl+R — the Strategy Tester; Ctrl+D — the Data Window
- F9 — the New Order window; F10 — the Quotes window
- F8 — chart properties; F4 — the MetaEditor; F11 — fullscreen

MT5 offers demo, contest and real accounts on the same terminal. Contest
accounts are real-money accounts with a leaderboard, and they behave
exactly like live ones — which makes them a useful middle step.

## Charts and timeframes

MT5 offers 21 timeframes against MT4's 9, adding the in-between ones —
M2, M3, M4, M6, M10, M12, M20, H2, H3, H6, H8 and H12. Chapter 10
warned that a setup needs enough history to compute its indicators, and
the extra timeframes are how you run one at a resolution that actually
fits it.

There are 38 built-in indicators against MT4's 30, and 44 analytical
objects against 31. Chart shift — dragging the right-hand margin to
create empty space — is worth learning early, because it lets you place
a stop or a level away from the candles instead of on top of them.

MT5 also ships **Depth of Market**, the order book view, natively. It is
empty for most retail forex pairs, because those are OTC instruments
with no central book, and that absence is itself a reminder of how chapter
1 described the market.

## The symbol specification

This is the most useful dialog in the platform and the one most traders
never open. Press Ctrl+U, or right-click a symbol in Market Watch and
choose Specification.

It gives you the contract size, the tick size, the tick value, the number
of decimal digits, the minimum and maximum volume, the swap long and swap
short rates, the swap calculation method, and the margin calculation
mode — plus the trading sessions for the instrument.

> Every number in chapter 3 comes from this dialog: the **contract size**
> is the "100,000 units" of a standard lot, and the **tick size** with
> the digit count is where the pip definition comes from.

These fields are broker-specific. The same pair can carry a different
contract size, a different tick size, and a different swap at different
brokers, which is why the pip value you calculated for one broker's
EUR/USD may not hold at another's.

Two fields deserve special attention:

- The **swap calculation** mode. "In Points" charges a fixed number of
  points per lot per night; "In Percentage Terms" applies an annual
  interest rate to the notional value, which is how most brokers quote
  it now. The same headline swap number means different things under the
  two modes.
- The **three-day swap** marker, which shows on Wednesday's rollover —
  the platform-level version of the triple swap from chapter 4.

## The order ticket

Press F9. The Type field decides everything else: select an execution
mode and it is a market order; select a pending type and it waits.

Three settings determine how it executes:

- The **fill policy** adds rules for limit and stop-limit orders. Fill
  or Kill executes the whole volume or nothing at all. Immediate or
  Cancel fills what is available and cancels the rest. Return fills what
  it can and leaves the remainder working. If the server does not support
  a policy, the option is disabled rather than silently ignored.
- The **deviation** field is the maximum slippage you will accept, in
  points, on instant and request execution. On market and exchange
  execution there is no reference price to deviate from, so the fill is
  whatever the market gives.
- The **execution mode** is set by the broker per symbol — instant,
  request, market or exchange — and it determines whether you can be
  requoted.

MT5 also validates order geometry: a buy limit above the current ask is
rejected as an invalid price, because that instruction already describes
a market order.

One-click trading sends an order with a single click on the chart. It is
convenient and dangerous, and the setting to turn it off is worth finding
before you need it.

## The journal, history, and deals

The Toolbox's History tab lists your orders and your **deals** — the
actual executions — along with the running balance, equity and credit.

The deals view separates commission and swap from the price move. That
separation is exactly what chapter 5's cost model needs and exactly what
chapter 12's tax treatment needs, and it is far easier to reconcile
against a broker's own breakdown than to reconstruct from memory.

Two practical warnings. The history is stored locally in the terminal,
per account and per server, so export it before you reinstall, move
machines, or change accounts. And a platform statement is a broker's
summary, not a tax record — chapter 12 still applies.

## Algo trading and the Strategy Tester

An **Expert Advisor** is a program that places trades for you. MT5 also
runs custom indicators and one-shot scripts.

Three switches matter:

- The Algo Trading button in the toolbar gates the whole terminal. When
  it is off, no Expert Advisor can trade, even one whose own dialog has
  "Allow Algo Trading" ticked. A robot that "does nothing" is usually
  this button.
- The Allow DLL imports option lets a program call external libraries.
  It is flagged as potentially dangerous because a DLL can do anything,
  and it should be enabled only for software you trust.
- The account itself may have automated trading restricted, which shows up
  in the Journal.

The **Strategy Tester** is MT5's biggest practical advantage over MT4.
It is multi-threaded, so an optimisation run uses your CPU cores; it can
test multiple currencies and timeframes together; and it can run on
real tick data rather than generated ticks.

> The **Strategy Tester** is where the expectancy work from chapter 10 gets
> done: run the system over enough trades, check the trade count, and check
> the result on a period you did not optimise against.

The optimisation mode adds a forward pass, which re-runs the best
parameter set on a separate later period as an out-of-sample check. It is
the closest thing in the platform to the discipline chapter 9 insists on.

## MT4 versus MT5

If your broker's charts and robot ecosystem are MT4, the choice is made
for you, and everything in this course works the same either way. The
practical differences:

- Timeframes 9 against 21; indicators 30 against 38; objects 31 against
  44; pending order types 4 against 6, the additions being the stop-limit
  pair from chapter 6.
- Charts: MT4 allows four at a time, MT5 effectively unlimited.
- Strategy Tester: single-threaded and single-symbol against
  multi-threaded, multi-currency, multi-timeframe and real ticks.
- Depth of Market and the economic calendar are native in MT5 rather than
  plugin or external.
- MT5 supports both netting and hedging accounts; MT4 is hedging only.

One thing to plan for: MQL4 and MQL5 are not compatible. An Expert
Advisor, indicator or script has to be recompiled or rewritten, not
imported. That is a real cost when migrating, and worth checking before
you commit to a platform.
