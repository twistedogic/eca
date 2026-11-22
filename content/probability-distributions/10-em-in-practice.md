# EM in practice

EM is easy to implement and easy to get subtly wrong. This chapter is about
the four things that actually go wrong in practice: a bad starting point, a
local optimum, a degenerate component that chews up the likelihood, and a
silent overfit.

## Initialisation decides where you land

The likelihood surface of a GMM has many local maxima, and EM finds one of
them — the one closest to where you started. **Initialisation** is therefore
not a detail; it is most of the algorithm.

The usual cascade:

1. Initialise from **k-means**. Run k-means with K clusters, then set each
   component's mean to a cluster centroid and its covariance to the cluster
   covariance. This is by far the most effective default, because k-means
   gives you a partition that is already approximately right, and EM only
   has to refine it.
2. Initialise from quantiles. For one-dimensional data, place the
   means at equally spaced quantiles of the data. Simple, and surprisingly
   decent for unimodal-ish data.
3. Random restarts. Initialise from random data points or random draws
   and keep the best final likelihood.
4. Split the largest component. Start with K = 1, fit it, split its
   largest component in two (offset along its principal axis), refit, and
   repeat. This is the classic approach for automatic model selection.

> **Initialisation** decides which local maximum EM converges to, which is
> why k-means initialisation plus random restarts is the standard recipe.

### Multiple restarts

The cheap insurance policy: run EM from several different initialisations
and keep the solution with the highest final log-likelihood. Because EM
never decreases the likelihood, the comparison is fair — every run returns
a valid local optimum, and you simply take the best.

Ten restarts on a small dataset costs ten times the fitting time and
removes most of the sensitivity to the starting point. In practice this is
almost always worth it.

## Degenerate solutions: the likelihood is unbounded

Here is the serious problem with maximum likelihood for mixtures.

Take any component k and any single data point x₁. Consider shrinking that
component onto x₁: set μₖ = x₁ and let σₖ² → 0. The density of component k
at x₁ grows like 1/σₖ, so its contribution to p(x₁) diverges. The
likelihood therefore goes to infinity.

Such a solution is a **degenerate solution** — a component collapsed onto a
single point — and the MLE does not exist. This is not a numerical
accident; it is a property of the model class. (A single Gaussian does not
have this problem, because one component must explain all the data and
cannot be dominated by one point.)

What it looks like in practice: EM reports a "perfect" fit with one
component having variance ≈ 1e-12, sitting on top of one observation, and
the rest of the data fitted by the other components. If you plotted the
result, one point would be surrounded by an infinitely thin spike.

### The fix: a variance floor

The standard remedy is to bound the smallest allowed variance:

    Σₖ ← max(Σₖ, ε·I)

for a small ε (1e-6 is typical), applied after every M-step. Some
implementations instead add εI to the covariance, which is smoother:

    Σₖ ← Σₖ + ε·I

A third option is a **regularised M-step**, which adds a penalty term to the
objective so the likelihood is bounded by construction:

    Σₖ ← (Σₙ rₙₖ (xₙ − μₖ)(xₙ − μₖ)ᵀ + ε·I) / (nₖ + ε)

The regularised form is the MAP estimate with a Gaussian prior on the
covariance (chapter 12 comes back to this), and it is the one that gives
sensible answers on real data.

> A **degenerate solution** is a component whose covariance collapses onto a
> single point; the mixture likelihood is unbounded there, so a variance
> floor or regularisation is mandatory in practice.

### Detecting it

Three cheap checks:

- Any component with variance below a threshold (say 1e-6 of the data's
  overall variance) is suspect.
- A component whose effective count nₖ is below 1 is fitting almost nothing.
- The log-likelihood will jump enormously in the last iteration and then
  stop moving. Plot it: a sudden spike at the end is the signature.

## Convergence criteria

EM stops when the parameters stop moving. In practice you track the
log-likelihood and stop when the relative improvement falls below a
tolerance:

    |ℓ⁽ᵗ⁾ − ℓ⁽ᵗ⁻¹⁾| / (|ℓ⁽ᵗ⁾| + ε) < 1e-6

A tolerance of 1e-6 on the relative change is usually enough; running
longer rarely helps because EM converges slowly along flat directions of the
likelihood surface, and the parameters barely change while the likelihood
creeps upward.

Set a **maximum iteration count** (a few hundred is typical) as a backstop.
If EM is still moving substantially after 500 iterations, the problem is
usually a badly conditioned covariance, not a need for more iterations.

## Numerical stability

Two standard tricks, both necessary in production code.

Work in log space. The density of a point under a component can
underflow to zero for extreme values, and then the responsibilities become
0/0. Compute log πₖ + log N(xₙ|μₖ,Σₖ) and subtract the maximum before
exponentiating — the log-sum-exp trick. Then

    rₙₖ = exp(log pₙₖ − logsumexp_k(log pₙₖ))

Guard the covariance. A covariance matrix can become singular or
non-positive-definite through floating-point error. Compute the Cholesky
factorisation of Σₖ rather than its inverse, and add a small ridge to the
diagonal before decomposing.

> The **log-sum-exp trick** subtracts the largest log-term before
> exponentiating, so that computing responsibilities never underflows to
> zero divided by zero.

## When EM is the wrong tool

EM is the right tool when the components are Gaussians and the model is a
mixture. It becomes awkward when:

- The number of components is large and the data is huge. Use mini-batch
  or online variants of EM.
- You need uncertainty over the parameters, not just a point estimate. Use
  the Bayesian version (chapter 12) or bootstrap the fitting.
- The data is not really generated by Gaussians. EM will happily fit a
  mixture of Gaussians to a heavy-tailed distribution, giving you a model
  that is wrong in the tails where it matters most.

## A checklist before you trust a fit

- Log-likelihood plotted and monotonically increasing.
- No component with near-zero variance.
- Effective counts nₖ all sensible — none near zero, none equal to n.
- Several restarts, all landing on similar likelihoods.
- Responsibilities inspected: do the clusters make sense, or did EM find
  something that only makes sense numerically?
- The model checked on held-out data, not just on the likelihood.

## What to take away

- Initialisation decides the answer; use k-means plus restarts.
- Maximum likelihood for mixtures is unbounded — you must floor or
  regularise the variances.
- Monitor the log-likelihood; a spike at the end means degeneracy.
- Work in log space, guard the covariance, and validate on held-out data.
