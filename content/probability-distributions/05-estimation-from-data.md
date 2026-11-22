# Estimation: from data to parameters

A distribution is a description with parameters in it. Real data is a
finite sample. This chapter is about the gap between the two: how
parameters are estimated, what uncertainty comes with the estimate, and
which of the several ways to estimate them you should use.

## The likelihood: parameters as a search direction

Fix some data x₁, …, xₙ and treat the parameters θ as unknowns. The
**likelihood** is the probability of the observed data, viewed as a function
of θ:

    L(θ) = p(x₁, …, xₙ | θ) = ∏ᵢ p(xᵢ | θ)

For independent samples the product is right. For numerical work you take
logs, because products of many small numbers underflow and because the log
turns the product into a sum:

    ℓ(θ) = log L(θ) = Σᵢ log p(xᵢ | θ)

The **maximum likelihood estimate** (MLE) is the θ that maximises ℓ. It has
a clean interpretation: among all parameter settings, pick the one under
which the observed data is most likely. The maximum likelihood estimator
is the procedure that produces it.

> The **maximum likelihood estimate** is the parameter value under which the
> observed data is most probable — the data is fixed, the parameters vary.

## Worked example: estimating a normal

Suppose you measure five reaction times: 10.2, 12.1, 9.8, 11.5, 10.9
seconds. Model them as N(μ, σ²).

For a normal, the log-likelihood is

    ℓ(μ, σ²) = −(n/2) log(2π) − (n/2) log σ² − (1/2σ²) Σᵢ (xᵢ − μ)²

Differentiate with respect to μ: the derivative is (1/σ²) Σᵢ (xᵢ − μ),
which vanishes when μ is the sample mean. Differentiate with respect to σ²
and you get the sample variance. So for a normal, the MLE is the sample mean
and sample variance:

    x̄ = Σxᵢ / n = 54.5 / 5 = 10.9
    s² = Σ(xᵢ − x̄)² / (n − 1) = 3.50 / 4 = 0.875

The maximum is found in closed form, which is the good case. For a GMM it
is not, and that difficulty is the entire reason the EM algorithm exists.

## Unplugged estimator versus biased estimator

A detail that bites people: the maximum likelihood variance estimator uses
n in the denominator, not n − 1:

    σ²_MLE = Σ(xᵢ − x̄)² / n

That estimator is biased: E[σ²_MLE] = ((n−1)/n)·σ². The **unbiased
estimator** divides by n − 1 and has the property you actually want:

    s² = Σ(xᵢ − x̄)² / (n − 1),   E[s²] = σ²

With the five measurements above: 3.50/5 = 0.70 (MLE) versus 3.50/4 = 0.875
(unbiased). For large n the difference is negligible, which is why the
distinction is usually mentioned and then ignored. For a GMM with a
thousand parameters it is not negligible.

## Standard error: how precise is the estimate?

The **standard error** is the standard deviation of the estimator itself.
For a sample mean from a normal population:

    SE(x̄) = σ / √n

Example. With n = 5 and σ² = 0.875, SE(x̄) = √0.875 / √5 ≈ 0.418 seconds.
Double the sample to n = 20 and the SE falls to √0.875/√20 ≈ 0.209. Quadruple
the sample and you halve the uncertainty again. Precision buys with sample
size at a square-root rate, which is why the last few percent of accuracy
is so expensive.

## Confidence intervals

A **confidence interval** is a range computed from the data that, under the
model, covers the true parameter with a stated probability. For the mean of
a normal with known variance:

    x̄ ± z·(σ/√n)

Example. n = 25 measurements with sample mean 10.9 and s = 0.935. A 95%
interval uses z = 1.96:

    10.9 ± 1.96 · (0.935/√25) = 10.9 ± 0.367

So the interval is roughly [10.53, 11.27] seconds. Read it carefully: if
you repeat the whole experiment many times and compute an interval each
time, about 95% of those intervals will contain the true mean. A particular
interval either contains it or it does not — the 95% refers to the
procedure, not to this specific number.

## Method of moments: a cheap, general estimator

The **method of moments** picks parameters so that the sample moments match
the population moments. For a normal, matching the first two moments gives
exactly the sample mean and sample variance. For a Poisson, matching the
first moment gives λ̂ = x̄. For a GMM with K components in one dimension, the
first 2K moments are enough to identify all the parameters — though solving
the resulting polynomial system is unpleasant, which is why EM is preferred.

Method of moments is mostly useful as a sanity check on a fancier estimator:
if EM returns a mean of 10.9 and the method of moments also says 10.9, that
is reassuring.

## Regularisation: when the data runs out

With few observations relative to parameters, the maximum likelihood
estimate can run away. Add a **regularisation** term to the objective — a
penalty that discourages extreme parameter values:

    ℓ_reg(θ) = ℓ(θ) − λ · R(θ)

with R(θ) a penalty such as the squared norm of the mean vector or the log
determinant of the covariance. The Bayesian version of this is a prior; the
frequentist version is a penalty. Both do the same job: keep the estimate
honest when the data is thin.

For mixtures there is a specific pathology here — a component that collapses
onto a single data point, with variance → 0 and likelihood → ∞. Chapter 10
is about that failure and its standard fix.

## What to take away

- The likelihood turns estimation into optimisation over parameters.
- For a normal, the MLE is the sample mean and variance; for a GMM, no
  closed form exists.
- Always carry an uncertainty estimate: standard error, then interval.
- When parameters outnumber observations, regularise.
