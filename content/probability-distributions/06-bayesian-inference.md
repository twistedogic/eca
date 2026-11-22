# Bayesian inference

Maximum likelihood asks what parameters best explain the data. Bayesian
inference asks a different question: given the data, what is the
distribution over parameters? It is the same arithmetic with one extra
ingredient — a prior belief — and it changes what the answer means.

## Bayes' rule

**Bayes' rule** inverts the conditional probability from chapter 1:

    P(θ | D) = P(D | θ) · P(θ) / P(D)

Read left to right in the standard three-part vocabulary:

- The **prior** P(θ) is what you believed before seeing any data.
- The **likelihood** P(D | θ) is how probable the data would be if θ were
  true.
- The **posterior** P(θ | D) is what you believe after seeing the data.

The normalising constant P(D) does not depend on θ, so for optimisation you
can ignore it — which is exactly what makes the Bayesian version of a GMM
computable.

> The **posterior** is the prior updated by the likelihood: the posterior
> is proportional to the prior times the likelihood.

## A worked example: the coin

Suppose a coin comes up heads 6 times and tails 4 times. Two things are
missing: the prior probability of heads, and what "6 heads out of 10" tells
us.

Start with a **uniform prior** on p (the flat density from chapter 3) and
likelihood P(6 heads | p) = C(10,6) p⁶ (1−p)⁴. Ignoring constants, the
posterior is proportional to p⁶ (1−p)⁴ — a **Beta distribution** with
parameters α = 7 and β = 5.

Its mean is α/(α+β) = 7/12 ≈ 0.583, so the posterior estimate of the coin's
bias is 58% heads rather than the MLE's 60%.

Now bring in a prior. Suppose a second, older coin from the same mint is
known to be fair — treat its 5 heads and 5 tails as 10 extra pseudo-observations.
The posterior becomes Beta(7+5, 5+5) = Beta(12, 10), with mean 12/22 ≈
0.545. The prior and the data averaged, weighted by how much evidence each
carried.

## Conjugacy: priors that stay tractable

A **conjugate prior** is a prior whose functional form is preserved by the
likelihood, so the posterior has a closed form. The classic pairs:

| Likelihood | Conjugate prior | Posterior |
| --- | --- | --- |
| Bernoulli(p) | Beta(α, β) | Beta(α + successes, β + failures) |
| Poisson(λ) | Gamma(a, b) | Gamma(a + count, b + n) |
| Normal(μ, σ²) known σ² | Normal(m, τ²) | Normal, closed form |
| Normal(μ, σ²) unknown | Normal-Inverse-Gamma | Normal-Inverse-Gamma |

Conjugacy is not just convenience — it is the reason Bayesian analysis of
simple models was practical before computers. It also shows up again in the
Bayesian GMM, where a Dirichlet prior on the mixing weights produces a
Dirichlet posterior with the same shape.

## Worked example: estimating a normal mean with a prior

Suppose a machine fills bottles with a liquid, and the fill volume is normal
with unknown mean μ and known variance σ² = 1. You have a prior belief that
μ ~ N(10, 4) — that is, prior mean 10 and prior variance 4 (sd 2). You then
measure three bottles: 11, 12, 9. The sample mean is x̄ = 10.667, with
likelihood variance σ²/n = 1/3.

The posterior for μ is normal with

    posterior mean = (prior precision · prior mean + data precision · sample mean) / (sum of precisions)
                   = (0.25 · 10 + 3 · 10.667) / (0.25 + 3)
                   = (2.5 + 32.0) / 3.25
                   ≈ 10.615

    posterior variance = 1 / (0.25 + 3) ≈ 0.3077

The posterior mean is a precision-weighted average of the prior mean and the
sample mean. The prior had precision 0.25 (variance 4) and the data had
precision 3 (variance 1/3), so the data dominates 12 to 1 — as you would
hope with three measurements. The posterior standard deviation is 0.555,
smaller than either the prior's 2 or the sample's own standard error of
0.82, because the two sources of uncertainty are combined rather than
chosen between.

## From posterior to prediction

The posterior over parameters is not the final answer; the question you
usually care about is about *new* data. The **posterior predictive**
distribution integrates the uncertainty in θ over the data:

    p(x_new | D) = ∫ p(x_new | θ) · p(θ | D) dθ

Example, the coin again. With posterior Beta(7, 5), the predictive
probability that the next flip is heads is

    E[p | D] = 7/12 ≈ 0.583

which is the posterior mean — the beta–binomial conjugacy makes the
prediction trivially available. Note this is *not* the plug-in estimate
6/10 = 0.6; the predictive averages over parameter uncertainty, which is
the difference between a Bayesian forecast and a plug-in forecast.

## Credible intervals

A **credible interval** is an interval in the parameter space containing a
stated amount of posterior probability. This is the Bayesian answer to the
frequentist confidence interval, and the difference is philosophical as well
as practical:

- A confidence interval is a random interval that covers the parameter in a
  fixed proportion of repeated experiments.
- A credible interval is a fixed interval you compute once, given the data,
  and then interpret as containing 95% of the probability mass.

For the coin with posterior Beta(7, 5), a 95% credible interval is roughly
[0.33, 0.81]. After seeing the data, you can say there is 95% probability the
coin's bias lies in that range. That statement is not available from the
frequentist side.

## Priors, done properly

A prior is a commitment, so it deserves care.

- A weakly informative prior (broad but finite) regularises without
  dominating the data.
- A strongly informative prior is appropriate when you have real prior
  knowledge — for example, a physical constraint.
- An improper prior (like the uniform over all of ℝ for a mean) is only
  acceptable when the posterior turns out proper, which is the case here.
- Always check **prior predictive** implications: what data would this prior
  generate? If the prior implies impossible observations, it is wrong.

## What to take away

- Bayes' rule is the same conditional probability, used in the other
  direction.
- The posterior is prior × likelihood; the prior is where your assumptions
  enter, so it must be stated, not hidden.
- Conjugate priors keep everything closed form; the Bayesian GMM uses
  exactly this trick.
- Predictive distributions integrate over parameter uncertainty — the thing
  the plug-in estimate cannot do.
