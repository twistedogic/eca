# Discrete distributions in practice

Discrete variables show up constantly: a coin flip, the number of support
tickets in an hour, the number of clicks on a page. This chapter covers the
four distributions that cover almost all of it, and shows the arithmetic of
each on real numbers.

## The Bernoulli distribution: one trial, two outcomes

The **Bernoulli distribution** is the distribution of a single yes/no trial.
It has one parameter, p, the probability of success:

    P(X = 1) = p
    P(X = 0) = 1 − p

Its moments are E[X] = p and Var(X) = p(1 − p).

Example. A traffic light turns green with probability p = 0.3. Over one
hour you see 100 lights. The expected number of green lights is 100 · 0.3 = 30,
and the standard deviation is √(100 · 0.3 · 0.7) ≈ 4.58.

The important structural fact about Bernoulli is not the numbers but the
algebra: sums of independent Bernoullis are Bernoulli-like, and that is
what produces the next distribution.

## The binomial distribution: many independent trials

The **binomial distribution** counts successes in n independent trials, each
with success probability p:

    P(X = k) = C(n, k) · pᵏ · (1 − p)ⁿ⁻ᵏ

with E[X] = np and Var(X) = np(1 − p).

The intuition is worth spelling out. For each trial, write down either a 1
(success) or a 0 (failure). The sum of those n digits is X. Because the
trials are independent, the probability of any particular pattern of k
successes is pᵏ(1−p)ⁿ⁻ᵏ, and there are C(n, k) ways to choose which trials
succeed.

Example. A machine produces items with a 5% defect rate. In a batch of 20,
what is the probability of exactly 3 defects?

    P(X = 3) = C(20, 3) · 0.05³ · 0.95¹⁷
             = 1140 · 0.000125 · 0.4181
             ≈ 0.0596

So about a 6% chance of exactly three defects. The expected number is
20 · 0.05 = 1, and the standard deviation is √(20 · 0.05 · 0.95) ≈ 0.975.
The distribution is heavily right-skewed: the mode is at 0 or 1, but the tail
runs to 20.

## The Poisson distribution: counting events in a fixed window

The **Poisson distribution** counts how many times an event happens in an
interval, when the events arrive independently at a constant average rate λ:

    P(X = k) = e⁻λ · λᵏ / k!

with E[X] = λ and Var(X) = λ.

The equality of mean and variance is the distribution's signature: Poisson
events are "balanced" between being unusually busy and unusually quiet.

Example. A support desk receives calls at an average rate of 3 per hour.
What is the probability of exactly 5 calls in an hour?

    P(X = 5) = e⁻³ · 3⁵ / 5!
             = 0.049787 · 243 / 120
             ≈ 0.1008

About a 10% chance. Note the connection to the binomial: for large n and
small p, a Binomial(n, p) behaves like a Poisson with λ = np. That is why
Poisson shows up wherever "many trials, rare event" shows up — defects in a
large production run, typos per page, insurance claims per policy.

## The geometric distribution: waiting for the first success

The **geometric distribution** models the number of trials until the first
success, with success probability p per trial:

    P(X = k) = (1 − p)ᵏ⁻¹ · p,    k = 1, 2, 3, …

with E[X] = 1/p and Var(X) = (1 − p)/p².

Example. A query succeeds with probability p = 0.2. The expected number of
attempts until the first success is 1/0.2 = 5 attempts.

The **exponential distribution** is the continuous analogue of the geometric
one — the waiting *time* rather than the waiting *count* — and it comes
back in the next chapter.

## Choosing the right one

A short decision guide, in the order you will actually reach for it:

| Situation | Distribution |
| --- | --- |
| One yes/no outcome | Bernoulli(p) |
| Successes out of n fixed independent trials | Binomial(n, p) |
| Events in a fixed window at constant rate | Poisson(λ) |
| Trials until the first success | Geometric(p) |
| Waiting time between events at constant rate | Exponential(λ) |

Two questions separate the binomial from the Poisson: is the number of
trials fixed (binomial) or the window of time fixed (Poisson)? And
is the event probability constant across trials (binomial) or is the rate
constant in time (Poisson)?

## Sum, mixture, and why the Poisson limit matters

One more property to carry forward, because the mixture model depends on it.
Binomial variables add when the trials are independent:

    X ~ Bin(n₁, p),  Y ~ Bin(n₂, p)  ⟹  X + Y ~ Bin(n₁ + n₂, p)

The binomial coefficients combine, and the probabilities multiply. This
"sum of independent things stays in the family" property is what makes the
normal distribution the limit of the binomial and the Poisson the limit of a
large-sample binomial — and it is the reason the normal is so central.

> The binomial distribution adds over independent trials with the same
> success probability, which is why the normal distribution appears as its
> large-sample limit.

## What to take away

- Bernoulli is the atom; binomial, geometric and Poisson are the standard
  compounds built from it.
- Poisson is the counting distribution with mean equal to variance; the
  binomial is the fixed-trial counting distribution.
- Know the moments of each — E and Var in closed form — because the
  estimation chapter uses them constantly.
