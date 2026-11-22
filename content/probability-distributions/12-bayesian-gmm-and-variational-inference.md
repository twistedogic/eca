# The Bayesian GMM and variational inference

Maximum likelihood gives you one point estimate of the parameters and no
account of your uncertainty about them. It also, as chapter 10 showed, has
degenerate solutions with no finite optimum. The Bayesian formulation fixes
both problems — and, as a bonus, it can decide the number of components for
itself.

## The model

Put priors on everything:

    π ~ Dirichlet(α₀)
    μₖ ~ N(μ₀, (τ₀Σ₀)⁻¹)
    Σₖ ~ Inverse-Wishart(ν₀, Ψ₀)

The **Dirichlet distribution** is the natural prior for mixing weights: it
lives on the simplex (non-negative, summing to one), it is conjugate to the
categorical counts, and it is the distribution over probability vectors
that most directly expresses "each component has some mass, and the masses
sum to one".

Conjugate priors matter here for the same reason they mattered in chapter
6: they keep the posterior in a family you can write down.

## The posterior

Bayes' rule gives

    p(π, μ, Σ | X) ∝ p(X | π, μ, Σ) · p(π) · p(μ) · p(Σ)

which is intractable to normalise. But because the priors are conjugate, the
posterior has the *same form* as the prior, with updated parameters:

    π | X ~ Dirichlet(α₀ + n₁, …, α₀ + nₖ)
    μₖ | X ~ Normal(mₖ, (τₖ Σₖ)⁻¹)
    Σₖ | X ~ Inverse-Wishart(νₖ, Ψₖ)

where nₖ = Σₙ rₙₖ is the effective count of component k, and mₖ, τₖ, νₖ, Ψₖ
are the posterior parameters.

> A **conjugate prior** makes the posterior the same functional family as
> the prior with updated parameters, which is what keeps the Bayesian GMM
> computable at all.

## Variational inference: the practical algorithm

Even with conjugate priors, the posterior for the full mixture involves a
sum over all latent configurations, so it is not exactly tractable. The
standard approach is **variational inference**: posit a simpler family for
the posterior and pick the member that best approximates it.

The mean-field family factorises:

    q(Z, π, μ, Σ) = ∏ₖ q(zₖ) q(π) q(μₖ) q(Σₖ)

and the approximation is chosen to maximise the ELBO from chapter 9 — the
same bound, now over both the latent variables *and* the parameters.

The resulting algorithm is EM with two changes:

1. **Parameter averaging**: the E-step averages over parameter
   uncertainty instead of plugging in a point estimate. With mean-field factorisation, the responsibilities
   become

       rₙₖ = E[ πₖ N(xₙ | μₖ, Σₖ) | xₙ ]

   which in practice is approximated by the plug-in form using the posterior
   means π̄ₖ, μ̄ₖ, Σ̄ₖ.

2. **Shrinkage**: the M-step includes the prior, which turns the update
   into a MAP estimate with a shrinkage term.

### The variational M-step, univariate

For a one-dimensional GMM with prior means μ₀, prior precision τ₀ and prior
concentration ν₀, the updates are:

    αₖ = α₀ + nₖ
    π̄ₖ = αₖ / Σⱼ αⱼ

    μ̄ₖ = ( Σₙ rₙₖ xₙ + μ₀/τ₀ ) / ( nₖ + 1/τ₀ )

    τₖ = τ₀ + nₖ

    Σ̄ₖ = ( Σₙ rₙₖ (xₙ − μ̄ₖ)² + ν₀σ₀² + nₖ(μ̄ₖ − μ₀)² ) / ( ν₀ + nₖ + 1 )

Read the mean update carefully: it is the weighted sample mean plus the
prior mean, combined as a precision-weighted average. With a strong prior
(τ₀ small) the component mean is pulled towards μ₀; with a weak prior the
data dominates. That is the shrinkage you wanted and did not get from
maximum likelihood.

## Why the Bayesian version fixes the degeneracy

The unbounded-likelihood problem came from a component shrinking onto a
single point with no resistance. The prior provides the resistance:

- The prior on the covariance penalises a component that collapses.
- The prior on the mixing weights penalises a component with almost no mass.
- The prior on the means penalises a component flying off to an extreme
  value.

Formally, the log marginal likelihood is bounded above for a proper prior,
so there is no infinite-likelihood corner to fall into. The degenerate
solution simply becomes very unlikely rather than infinitely likely.

> The Bayesian GMM trades the unbounded maximum likelihood for a bounded
> marginal likelihood: the priors make a collapsed component improbable
> instead of infinitely good.

## Automatic model selection: pruning

This is the payoff. The Dirichlet posterior over the weights is

    α = (α₀ + n₁, …, α₀ + nₖ)

and the posterior mean weight of component k is αₖ / Σⱼ αⱼ. A component that
the data does not support has a small nₖ, so its posterior weight is small.

If αₖ < some threshold (a common choice is α₀/2, or an absolute number
like 1), the component is removed — this **pruning** step deletes it and
the model is refitted.
Start with K larger than you think you need, fit, prune, refit, and repeat.

The model-selection story is Bayesian in the proper sense: the number of
components is not chosen by a heuristic penalty but inferred from the
posterior. Components that deserve to be there keep weight; components that
do not lose it.

## Uncertainty, not just point estimates

The other thing the Bayesian version gives you is a distribution over
parameters. Two practical consequences:

Predictive uncertainty. The predictive density for a new point
integrates over parameter uncertainty:

    p(x_new | X) = ∫ p(x_new | θ) p(θ | X) dθ

For a GMM this is a mixture of normals with slightly wider components than
the plug-in fit — the model admits it does not know the parameters exactly.

Model averaging. Instead of picking one K, you can average the
predictive densities over the posterior distribution of K and weight them
by their posterior probability. This is a better answer than picking the
argmax, and it is not much more work once the machinery exists.

## Cost and comparison

| | Maximum likelihood (EM) | Bayesian (VB) |
| --- | --- | --- |
| Output | point estimate | posterior distribution |
| Degenerate solutions | possible, must floor | suppressed by priors |
| Number of components | chosen by AIC/BIC/CV | inferred by pruning |
| Per-iteration cost | lower | slightly higher |
| Tuning | ε for the variance floor | α₀, τ₀, ν₀, threshold |

The tuning burden moves rather than disappears: instead of a variance floor
you choose prior strengths, and a prior that is too strong drags every
component towards the prior mean.

## What to take away

- Conjugate priors (Dirichlet for weights, Normal and Inverse-Wishart for
  components) keep the posterior in a tractable family.
- Variational inference maximises the same ELBO as EM, but over parameters
  as well as labels.
- Priors remove the unbounded-likelihood pathology, at the price of
  assumptions you must state.
- Posterior weights let the model prune its own components, so K becomes an
  output instead of an input.
