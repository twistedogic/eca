# Random variables and distributions

Probability is the study of uncertainty. This chapter builds its vocabulary:
a **random variable** is a number attached to an uncertain outcome, and a
**probability distribution** is the rule that says which numbers are likely
and how likely. Everything later in the topic — the normal distribution, the
Bayesian update, the mixture model — is a variation on these two ideas.

## From outcomes to numbers

Start with a sample space: the set of everything that could happen. A fair
die has six outcomes. An experiment that produces a number we care about is
a **random variable**, written X, that maps each outcome to a number.

Two kinds of random variable show up in practice:

- A **discrete random variable** takes values from a countable set — dice
  faces, email counts, the number of customers in an hour.
- A **continuous random variable** takes values on the real line — waiting
  time, temperature, a person's height.

The distinction is not about the numbers themselves but about how the
probability is spread out. Discrete variables put lumps of probability on
individual points. Continuous variables spread probability thinly over
intervals, so the probability of any single exact value is zero.

## The three ways to describe a distribution

Every distribution can be described in three equivalent ways.

The **probability mass function** (PMF) gives the probability of each
individual value for a discrete variable:

    P(X = 3) = 1/6     for a fair die

The **probability density function** (PDF) gives a density for a continuous
variable. A PDF can exceed 1; what matters is the area under the curve:

    P(a ≤ X ≤ b) = ∫ from a to b of f(x) dx

The **cumulative distribution function** (CDF) gives the probability that X
falls at or below a value, and it works for both kinds:

    F(x) = P(X ≤ x)

The CDF is the workhorse. Everything you might want to ask a distribution
is a difference of two CDF values:

    P(a < X ≤ b) = F(b) − F(a)
    P(X > a)     = 1 − F(a)

> A **cumulative distribution function** answers "how likely is X at most
> this?", and every interval probability is a difference of two of its
> values.

<svg width="640" viewBox="0 0 640 320" role="img" aria-label="Left: a discrete probability mass function drawn as five vertical bars over a number line. Right: a continuous probability density function drawn as a smooth bell-shaped curve over a number line." xmlns="http://www.w3.org/2000/svg">
  <text x="160" y="28" text-anchor="middle" font-size="16" fill="var(--muted)">discrete: mass on points</text>
  <line x1="40" y1="270" x2="280" y2="270" stroke="var(--ink)" stroke-width="2"/>
  <rect x="60" y="150" width="26" height="120" fill="var(--accent)"/>
  <rect x="102" y="90" width="26" height="180" fill="var(--accent)"/>
  <rect x="144" y="210" width="26" height="60" fill="var(--accent)"/>
  <rect x="186" y="120" width="26" height="150" fill="var(--accent)"/>
  <rect x="228" y="180" width="26" height="90" fill="var(--accent)"/>
  <text x="73" y="292" text-anchor="middle" font-size="14" fill="var(--muted)">1</text>
  <text x="115" y="292" text-anchor="middle" font-size="14" fill="var(--muted)">2</text>
  <text x="157" y="292" text-anchor="middle" font-size="14" fill="var(--muted)">3</text>
  <text x="199" y="292" text-anchor="middle" font-size="14" fill="var(--muted)">4</text>
  <text x="241" y="292" text-anchor="middle" font-size="14" fill="var(--muted)">5</text>
  <text x="480" y="28" text-anchor="middle" font-size="16" fill="var(--muted)">continuous: area over intervals</text>
  <line x1="360" y1="270" x2="600" y2="270" stroke="var(--ink)" stroke-width="2"/>
  <path d="M 360 270 C 400 268, 420 90, 460 70 C 500 90, 520 268, 600 270" fill="none" stroke="var(--accent)" stroke-width="3"/>
  <text x="380" y="292" font-size="14" fill="var(--muted)">0</text>
  <text x="580" y="292" font-size="14" fill="var(--muted)">10</text>
  <text x="376" y="64" font-size="14" fill="var(--ink)">f(x)</text>
</svg>

## Expectation: the average you would actually see

The **expectation** of a random variable is its long-run average: if you
repeated the experiment forever, the values would pile up around it.

For a discrete variable it is a weighted sum:

    E[X] = Σ x · P(X = x)

For a fair die:

    E[X] = (1+2+3+4+5+6) · (1/6) = 21/6 = 3.5

The expectation of a fair die is 3.5 even though a die never shows 3.5.
Expectation is a summary, not a prediction.

Expectation is linear — a fact worth memorising because it is used
constantly later:

    E[aX + bY] = a·E[X] + b·E[Y]

The linearity does not require independence. Even if X and Y are wildly
dependent, E[XY] is *not* generally E[X]·E[Y], but E[X + Y] = E[X] + E[Y]
always holds.

## Variance: how spread out

The **variance** measures spread around the expectation:

    Var(X) = E[(X − E[X])²]

Equivalently, Var(X) = E[X²] − (E[X])², and the square root of the
variance is the **standard deviation**.

For the fair die:

    Var(X) = E[X²] − (E[X])² = (1²+2²+3²+4²+5²+6²)/6 − 3.5²
           = 91/6 − 12.25 = 15.1667 − 12.25 = 2.9167

so σ = √2.9167 ≈ 1.708.

Variance is also linear in the same useful sense:

    Var(X + Y) = Var(X) + Var(Y) + 2·Cov(X, Y)

The extra term is why independence matters: if X and Y are **independent**,
the covariance vanishes and variances simply add.

## Conditioning: the most useful idea in the subject

**Conditioning** is the act of restricting to the part of the sample space
where some information holds, and renormalising:

    P(A | B) = P(A ∩ B) / P(B)

A worked example, because this one is worth having in muscle memory. You
draw from a bag with 3 red and 1 blue marble. You draw two marbles without
replacement. What is the probability both are red?

Total outcomes: C(4,2) = 6 unordered pairs, of which 3 are both red.
So P(both red) = 3/6 = 1/2.

Now the conditional version. Suppose you know the first marble was red. Then
3 marbles remain, 2 of them red, so:

    P(second is red | first was red) = 2/3

> Conditioning shrinks the sample space to the outcomes consistent with the
> information, then renormalises the probabilities to sum to one again.

## Law of total probability and total expectation

The final tool of this chapter ties the pieces together. If B₁, …, Bₖ
partition the sample space, then for any event A:

    P(A) = Σ P(A | Bᵢ) · P(Bᵢ)

And with expectations:

    E[X] = Σ E[X | Bᵢ] · P(Bᵢ)

> The **law of total probability** decomposes an unconditional probability
> into a weighted sum of conditional probabilities over a partition.

Worked example. Suppose 60% of your customers are on the free plan and 40%
are paying. The free plan churns at 10% per month, the paying plan at 3%.
What is the overall monthly churn rate?

    P(churn) = 0.10 · 0.60 + 0.03 · 0.40 = 0.06 + 0.012 = 0.072

So 7.2% of all customers churn each month. Notice that the weighted average
is *not* the average of the two rates (6.5%) — it is pulled toward the
larger group. This exact computation reappears in the mixture model, where
"which group did this customer belong to" replaces "which plan".

## What to take away

- A distribution answers "how likely is each value?"; the CDF is the most
  useful single representation.
- Expectation and variance summarise the centre and the spread; both are
  linear in the ways that matter later.
- Conditioning is the engine of inference: it is how evidence updates
  knowledge, and it is the step the EM algorithm automates.
