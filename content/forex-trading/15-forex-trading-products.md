# Forex trading products

The EUR/USD price on a chart does not identify the product you are trading.
The same quote can sit inside an over-the-counter spot deal, a retail
contract for difference, an exchange-traded future, a forward, or an
option. Those products can share a chart and still differ in settlement,
counterparty, financing, maximum loss, and tax treatment.

> A market price is not a contract. Read the **product terms** before
> reading the chart.

The useful first question is not "which one makes money?" It is "what
obligation did I take, and how is it settled?"

## Spot FX

**Spot FX** is the exchange of one currency for another at the current
market rate. The trade is agreed on the trade date and normally settles
two business days later, although the economic exposure begins as soon as
the trade is done. There is no fixed contract expiry and no future date
baked into the instrument.

Most spot FX is over-the-counter. You buy the base currency and sell the
quote currency from a dealer, and your profit depends on the path between
the entry rate and the rate at which you close. The costs are more than
the headline spread: a position held across the daily rollover can also
pay or receive a **swap**, and a leveraged account must finance the
margin.

> A **spot FX** trade exchanges two currencies near the current market
> price rather than fixing a rate for a future date.

Spot is the default product for short-term directional trading. The
analysis in chapters 9, 10, and 14 applies directly, provided the position
is sized from the stop as described in chapter 8.

## Outright forwards

An **outright forward** is a bilateral agreement to exchange two currencies
at a fixed rate on an agreed future date. The amount, currencies, date,
and rate are negotiated between the counterparties. It is the standard way
to hedge a known invoice: a company expecting dollars in three months can
lock today's rate without funding the full amount now.

A forward that exchanges the two currencies is called **deliverable**. A
**non-deliverable forward**, or NDF, instead settles the difference
between the agreed rate and an agreed fixing rate in cash. NDFs are common
where a currency is restricted or difficult to deliver. The fixing source,
settlement currency, and holiday rules are contractual details, not
small print: they decide which rate and which date determine the result.

> An **outright forward** fixes both the future exchange date and the rate
> at which the two currencies will be exchanged or cash-settled.

The rate difference between spot and forward is quoted as **forward
points**. For liquid currencies, it mainly reflects the interest-rate
difference between the two currencies, not a free forecast of where spot
will go. A forward creates bilateral counterparty exposure and often
requires credit support or collateral; it does not create the daily cash
flows of an exchange-traded future.

## FX swaps

An **FX swap** combines two opposing currency exchanges. The **near leg**
exchanges the currencies at or near spot, and the **far leg** reverses the
exchange at a pre-agreed future rate. Both legs are with the same
counterparty.

The near leg lets a bank borrow one currency and lend another. The far leg
repays the first loan and unwinds the second. That makes FX swaps the
workhorse for short-term cross-currency funding and for rolling a currency
position from one settlement date to the next.

> An **FX swap** exchanges currencies near spot and reverses the exchange
> at a pre-agreed rate on a future date.

After the near leg settles, the remaining far leg behaves like an outright
forward with the same counterparty. An FX swap is therefore not normally a
directional trade. Its economics come from funding, the interest-rate
difference, and the forward points embedded in the far rate.

## Currency swaps

A **currency swap**, also called a cross-currency swap, exchanges aspects
of a loan in one currency for equivalent aspects of a loan in another.
Depending on the structure, the parties exchange principal, interest
payments, or both according to a formula.

This is a longer-term financing instrument rather than a way to express a
view on the next chart candle. A company with dollar debt and euro
revenues can use one to match its currency of repayment and its currency
of cash flow. The risks are counterparty risk, interest-rate risk, and
**basis risk**—the exchange rate implied by the swap may differ from the
market rate at which the underlying cash flow can actually be converted.

> A **currency swap** exchanges principal and/or interest across two
> currencies; unlike an FX swap, it describes a longer-term loan exchange.

The words are easy to confuse because both are swaps. An FX swap exchanges
principal today and reverses it later. A currency swap describes the
principal and interest obligations of two loans over time.

## Currency futures

**Currency futures** are standardised contracts traded on an exchange.
The exchange specifies the contract size, expiry, tick size, and settlement
method. A clearing house stands between buyer and seller, so the two
traders do not carry each other's direct counterparty risk.

The contract is marked to market each day. If the price moves against a
trader, cash is credited or debited from the margin account rather than
waiting for delivery months later. This daily **variation margin** is why
a futures position cannot be treated as an ordinary forward with an
exchange ticker.

Futures prices can differ from spot and outright forwards before expiry;
the difference is the **basis**. Interest rates, contract month, and
liquidity all affect it. A trader holding a futures position past its
expiry must roll it, which adds execution and financing costs. Some
currency futures settle in cash, while deliverable contracts can exchange
the underlying currencies.

> **Currency futures** use a fixed contract size and expiry, trade on an
> exchange, and settle through a clearing house and daily margin.

Exchange-traded currency options are often options on futures. Exercising
one normally creates the corresponding futures position rather than
delivering currency directly.

## FX options

An **FX option** gives its holder the right, but not the obligation, to
exchange two currencies at a specified strike rate by a specified expiry.
The buyer pays a **premium** for that right. A call is the right to buy
the base currency; a put is the right to sell it.

European-style options can be exercised only at expiry. American-style
options can be exercised before it. The option may deliver the currencies
or settle its value in cash, and it may be negotiated OTC or listed on an
exchange.

> An **FX option** gives the right, not the obligation, to exchange
> currencies at a fixed rate; the premium is the buyer's maximum loss.

A long vanilla option has a simple risk boundary: the premium paid is the
most it can lose, while favourable movement can still produce a profit.
The trade-off is that the premium may expire worthless, and time works
against the buyer. Selling an option receives the premium but creates a
potentially very large loss if the currency moves far against the seller.

Option value depends on more than direction. **Implied volatility** is
the volatility priced into the premium. A long option can lose value when
implied volatility falls even if the exchange rate barely moves, and it can
gain value from rising volatility. This is why an option is not just a
spot trade with a stop attached.

## What brokers call forex

Retail platforms often label several different instruments simply as
"forex". The contract documents decide which one you have.

- A **contract for difference**, or CFD, tracks the difference between the
  opening and closing price and settles that difference in cash. The
  trader does not receive or deliver the base currency. Most retail
  "spot forex" is this kind of synthetic exposure.
- A rolling spot account creates or closes a short-lived position around
  the daily rollover, often with a financing charge. Its price may look
  exactly like spot FX while its contract and cost structure are different.
- Exchange-traded futures and options provide direct access to centrally
  cleared contracts, subject to the exchange's contract rules.
- Broker-specific leveraged products, sometimes called tickets or
  structured forex products, have their own payoff formulas and may charge
  an upfront fee. Their names do not identify their legal terms.

The CFTC's warning to US retail traders is blunt: unless the product is
futures or options on a regulated exchange, the trader is dealing only
with the broker. In an OTC CFD or spot account, the broker controls the
platform, the price feed, and the price at which it will close the
position. Check the legal entity, regulator, client-money segregation,
negative-balance protection, and all-in costs—not merely the advertised
leverage.

## Where the risk lives

Different products fail in different ways.

- Spot FX and CFDs pay the spread and financing or rollover cost, and OTC
  versions add dealer-counterparty risk.
- Forwards and NDFs add bilateral credit risk, collateral requirements,
  and fixing or holiday risk.
- FX swaps and currency swaps add funding and basis risk to counterparty
  risk.
- Futures add margin-call and gap risk to roll and basis risk.
- Options add premium, time-decay, and implied-volatility risk; a short
  option can create a large loss.

Leverage amplifies these risks, but it does not create the product's legal
structure. A 100:1 CFD and a 100:1 futures position have different
settlement mechanics even when their charts and effective leverage match.

## Choosing the product

Choose from the exposure that actually exists:

- Currency needed now: spot FX or a retail spot CFD.
- A known receipt or payment in another currency: an outright forward or
  NDF.
- Temporary cross-currency funding: an FX swap.
- Long-term debt whose currency does not match cash flow: a currency swap.
- A fixed-size, exchange-traded position: currency futures.
- A hedged position that should still benefit from a favourable move: an
  FX option.

For most learners, spot FX or a CFD is the relevant choice because it is
the only one in this list they can analyse with the course's chart and
risk methods. Before using it, confirm the contract specification, then
apply chapter 3's position-size arithmetic, chapter 7's leverage limits,
and chapter 8's stop-based sizing. The product determines what can happen;
the risk process determines how much of it you are allowed to survive.

> Choose the product that matches the obligation, then size the position
> from the loss you can afford — never from the broker's leverage cap.

## Sources and further reading

- [Bank for International Settlements: Global FX markets when hedging takes centre stage](https://www.bis.org/publications/qr-202512/global-fx-markets-when-hedging-takes-centre-stage)
- [ISDA: Global FX Derivatives Market Overview — Size, Structure and Uses](https://isda.org/a/P1tiE/Global-FX-Derivatives-Market-Overview-Size-Structure-and-Uses.pdf)
- [CME Group: Futures vs. Forwards](https://cmegroup.com/articles/2025/futurization-futures-vs-forwards.html)
- [CFTC: Eight Things You Should Know Before Trading Forex](https://cftc.gov/LearnAndProtect/AdvisoriesAndArticles/CustomerAdvisory_MustKnowForex.html)
- [SEC Investor.gov: Foreign Currency Exchange Trading for Individual Investors](https://investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/foreign)
- [Bank for International Settlements: Foreign exchange risk definitions](https://www.bis.org/bcbs/basel_consolidated_guidelines/module/rma/20)
