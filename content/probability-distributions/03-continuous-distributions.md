# Continuous distributions in practice

A continuous random variable can take any value in a range, so probability
lives in areas, not points. The probability of any single value is zero;
what has meaning is the area under a density curve, and the CDF turns those
areas into numbers.

## Uniform: the baseline you compare against

The **uniform distribution** on [a, b] has constant density:

    f(x) = 1 / (b − a)    for a ≤ x ≤ b

with E[X] = (a + b)/2 and Var(X) = (b − a)²/12.

Example. A delivery wait time is uniform on [2, 8] minutes. The expected
wait is 5 minutes. The probability of waiting more than 6 minutes is the
area of a rectangle 2 wide out of 6 total:

    P(X > 6) = (8 − 6) / (8 − 2) = 1/3

The uniform is also the default prior in Bayesian work: when you have no
information at all, a flat density is the honest encoding of that.

## Exponential: waiting times and the memoryless property

The **exponential distribution** with rate λ describes the waiting time
until the next event, where events arrive at a constant rate λ per unit
time:

    f(x) = λ · e⁻ˡˣ    for x ≥ 0

with E[X] = 1/λ and Var(X) = 1/λ².

Example. A server handles requests at a rate of 2 per second. The
probability that the next request takes more than 1 second:

    P(X > 1) = e⁻² ≈ 0.1353

The exponential's defining property is **memorylessness**: the probability
of waiting at least s + t given that you have already waited s does not
depend on s.

    P(X > s + t | X > s) = P(X > t)

Mechanically this is because e⁻ˡ⁽ˢ⁺ᵗ⁾ = e⁻ˡˢ · e⁻ˡᵗ. Practically it is why
memoryless systems are easy to reason about: a customer who has been on
hold for 10 minutes is not "closer" to being served, statistically.

## The normal distribution: the centre of gravity

The **normal distribution** with mean μ and variance σ² has density:

    f(x) = (1 / (σ · √(2π))) · exp( −(x − μ)² / (2σ²) )

with E[X] = μ and Var(X) = σ².

The **standard normal** is the special case N(0, 1). Any normal random
variable can be converted to it by subtracting the mean and dividing by the
standard deviation:

    Z = (X − μ) / σ

Example. A package weighs N(500 g, 25 g²) — that is, mean 500 g and
standard deviation 5 g. What is the probability a package weighs more than
510 g?

    Z = (510 − 500) / 5 = 2

so P(X > 510) = 1 − Φ(2) ≈ 0.0228, about 2.3%.

Two properties make the normal the most important distribution in
statistics:

- **Closure under addition**: the sum of independent normal variables is
  normal, with means and variances adding. Ten noisy measurements average
  out to something normal with a much smaller spread.
- **Central limit theorem**: the sum of many independent, finite-variance
  variables is *approximately* normal regardless of their individual
  shapes. Sums of Bernoullis (binomial), sums of Poissons (Poisson), and
  averages of any i.i.d. sample all converge to normality.

> The normal distribution is the limit that sums of independent quantities
> converge to, which is why it appears everywhere averages are taken.

## Gamma and chi-squared: sums of exponentials

The **gamma distribution** generalises the exponential to the waiting time
until the k-th event:

    f(x) = (λᵏ / Γ(k)) · xᵏ⁻¹ · e⁻ˡˣ

with E[X] = k/λ and Var(X) = k/λ².

Example. A patient needs k = 3 procedures, each taking an exponential time
with rate λ = 0.5 per day. The expected total time is 3/0.5 = 6 days, and
the variance is 3/0.25 = 12, so the standard deviation is ≈ 3.46 days.

The **chi-squared distribution** is the gamma distribution with λ = 1/2 and
integer shape — the distribution of a sum of squared standard normal
variables. It is the backbone of chi-squared tests and of the regularised
incomplete gamma function that computes Gaussian tail probabilities.

## Working with densities: the standard normal table

For the standard normal, the CDF Φ(z) = P(Z ≤ z) is tabulated. Three
values you will use constantly:

| z | Φ(z) | Tail P(Z > z) |
| --- | --- | --- |
| 0.00 | 0.5000 | 0.5000 |
| 1.00 | 0.8413 | 0.1587 |
| 1.28 | 0.8997 | 0.1003 |
| 1.64 | 0.9495 | 0.0505 |
| 1.96 | 0.9750 | 0.0250 |
| 2.00 | 0.9772 | 0.0228 |
| 2.33 | 0.9901 | 0.0099 |
| 3.00 | 0.9987 | 0.0013 |

Between them, the famous 68–95–99.7 rule: for any normal distribution,
about 68% of mass lies within one standard deviation of the mean, 95% within
two, and 99.7% within three.

Example. Exam scores are N(72, 8²). What score separates the top 10% of
students? We need z with P(Z > z) = 0.10, which is z = 1.2816.

    x = μ + z·σ = 72 + 1.2816 · 8 ≈ 82.25

## Transformations change the shape

A nonlinear transformation of a random variable produces a new random
variable whose distribution is not normal, even if the original was.

Example. If X ~ N(0, 1), then Y = eˣ is **log-normal**, with median e⁰ = 1
and a long right tail. Finance, biology and insurance all use log-normal
models because "proportional change" is symmetric on the log scale while
"absolute change" is not.

Rule of thumb: if the data are strictly positive, skewed right, and ratios
matter more than differences, take logs first and work in normal space.

## What to take away

- Continuous distributions are described by densities; probabilities are
  areas.
- The normal wins because it is closed under addition and is the limit of
  sums — the reason the EM algorithm's Gaussian components compose so
  cleanly.
- Standardising with z = (x − μ)/σ converts every normal question into a
  table lookup.
