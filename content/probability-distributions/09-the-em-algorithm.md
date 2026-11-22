# The EM algorithm

The GMM has no closed-form maximum likelihood solution, because the
likelihood contains a log of a sum. The **EM algorithm** (Dempster, Laird and
Rubin, 1977) is the standard remedy: alternate between guessing the hidden
labels and optimising the model given those guesses. Each half is easy;
the alternation converges.

## The general shape of EM

EM is a template, not a single algorithm. It applies to any model with
hidden variables:

1. **E-step** — compute the posterior distribution over the hidden
   variables given the current parameters and the data.
2. **M-step** — maximise the expected complete-data log-likelihood with
   respect to the parameters, using those posteriors.

The magic is the guarantee: if ℓ(θ⁽ᵗ⁾) is the log-likelihood at iteration
t, then

    ℓ(θ⁽ᵗ⁺¹⁾) ≥ ℓ(θ⁽ᵗ⁾)

every iteration. The likelihood never decreases. What EM does *not* promise
is finding the global maximum — it converges to a local optimum, or to one
of the degenerate solutions discussed in chapter 10.

## Why it works: the ELBO

The derivation is worth following once, because it explains every step.

Start from the observed-data likelihood, written with the latent variables
integrated out:

    p(X | θ) = Σ_Z p(X, Z | θ)

Introduce any distribution q(Z) over the hidden variables and rewrite the
sum as an expectation:

    p(X | θ) = E_q[ p(X, Z | θ) / q(Z) ]

Now apply Jensen's inequality, since log is concave:

    log p(X | θ) ≥ E_q[ log p(X, Z | θ) ] − E_q[ log q(Z) ] = L(q, θ)

The right-hand side is the **evidence lower bound** (ELBO, also called the
**variational lower bound**). It is a lower bound on the log-likelihood, and
it is tight when q(Z) equals the true posterior p(Z | X, θ).

Since the bound is tight at the true posterior, choose

    q(Z) = p(Z | X, θ)

and then maximising the ELBO over θ in the M-step increases the true
likelihood. The ELBO also has a clean decomposition:

    L(q, θ) = log p(X | θ) − KL( q(Z) ‖ p(Z | X, θ) )

so the gap between the bound and the true log-likelihood is exactly a
**Kullback–Leibler divergence** measuring how badly q approximates the
posterior. EM tightens that gap.

> The **evidence lower bound** is the quantity EM maximises: it equals the
> log-likelihood minus a KL divergence between the approximate and true
> posteriors over the hidden variables.

## The two steps for a GMM

For a GMM the hidden variables are the labels zₙ. Write the ELBO with a
mean-field choice q(Z) = ∏ₙ q(zₙ) where q(zₙ = k) = rₙₖ. Expanding gives

    L = Σₙ Σₖ rₙₖ [ log πₖ + log N(xₙ | μₖ, Σₖ) ] − Σₙ Σₖ rₙₖ log rₙₖ

The last term does not involve θ, so the M-step only has to worry about the
first two.

### The E-step

Compute the responsibilities under the current parameters:

    rₙₖ = πₖ N(xₙ | μₖ, Σₖ) / Σⱼ πⱼ N(xₙ | μⱼ, Σⱼ)

This is the standard Bayes posterior for the label, and it is exactly the
formula from chapter 8. Nothing is being approximated here — for a GMM the
E-step is exact.

### The M-step

Maximise the expected complete-data log-likelihood. The solution is
closed form. Define the effective count for component k:

    nₖ = Σₙ rₙₖ

Then

    πₖ = nₖ / n

    μₖ = (1/nₖ) Σₙ rₙₖ xₙ

    Σₖ = (1/nₖ) Σₙ rₙₖ (xₙ − μₖ)(xₙ − μₖ)ᵀ

Read those three lines carefully. They say: count how much of each point
belongs to each component (nₖ), then compute the weighted mean, weighted
variance and weight share. **EM** is weighted averaging, done twice.

<svg width="640" viewBox="0 0 640 260" role="img" aria-label="Two Gaussian peaks at 2 and 6 with a point at x equals 4 between them, and two horizontal bars below showing responsibility 0.40 for component 1 and 0.60 for component 2." xmlns="http://www.w3.org/2000/svg">
  <line x1="40" y1="170" x2="600" y2="170" stroke="var(--ink)" stroke-width="2"/>
  <path d="M 40 170 C 60 169, 75 100, 105 80 C 135 100, 150 169, 200 170" fill="none" stroke="var(--accent)" stroke-width="2"/>
  <path d="M 440 170 C 460 169, 475 100, 505 80 C 535 100, 550 169, 600 170" fill="none" stroke="var(--accent)" stroke-width="2"/>
  <circle cx="320" cy="170" r="6" fill="var(--ink)"/>
  <text x="320" y="192" text-anchor="middle" font-size="14" fill="var(--ink)">x = 4</text>
  <text x="105" y="60" text-anchor="middle" font-size="14" fill="var(--muted)">component 1 (mu 2)</text>
  <text x="505" y="60" text-anchor="middle" font-size="14" fill="var(--muted)">component 2 (mu 6)</text>
  <text x="40" y="220" font-size="14" fill="var(--ink)">r1 = 0.40</text>
  <rect x="120" y="208" width="160" height="18" fill="var(--accent)"/>
  <text x="40" y="248" font-size="14" fill="var(--ink)">r2 = 0.60</text>
  <rect x="120" y="236" width="240" height="18" fill="var(--bad)"/>
</svg>

## A complete worked example

Data: four observations from a one-dimensional problem.

    X = {1.0, 1.5, 4.5, 5.0}

Initial parameters (a deliberately poor start — both components wide and
overlapping):

    π = (0.5, 0.5),  μ = (1, 5),  σ₁² = σ₂² = 4

### Iteration 1, E-step

With σ² = 4 the density is N(x | μ, 4) = 0.19947 · exp(−(x − μ)²/8).

| x | π₁N(x\|μ₁) | π₂N(x\|μ₂) | r₁ | r₂ |
| --- | --- | --- | --- | --- |
| 1.0 | 0.09974 | 0.01350 | 0.8808 | 0.1192 |
| 1.5 | 0.09668 | 0.02157 | 0.8176 | 0.1824 |
| 4.5 | 0.02157 | 0.09668 | 0.1824 | 0.8176 |
| 5.0 | 0.01350 | 0.09974 | 0.1192 | 0.8808 |

Effective counts: n₁ = n₂ = 2.000.

### Iteration 1, M-step

    μ₁ = (1.0·0.8808 + 1.5·0.8176 + 4.5·0.1824 + 5.0·0.1192) / 2 = 1.762
    μ₂ = (1.0·0.1192 + 1.5·0.1824 + 4.5·0.8176 + 5.0·0.8808) / 2 = 4.238

    σ₁² = σ₂² = [Σₙ rₙ₁(xₙ − 1.762)²] / 2 = 1.592
    π₁ = π₂ = 0.5

The means moved inward (1 → 1.762, 5 → 4.238) and the variances shrank
from 4 to 1.59. That is EM reacting to the responsibilities: because every
point has some probability of belonging to the wrong component, the update
pulls the components towards each other.

### Iteration 2

Recomputing responsibilities with the new parameters gives a much sharper
split:

| x | r₁ | r₂ |
| --- | --- | --- |
| 1.0 | 0.9572 | 0.0428 |
| 1.5 | 0.9116 | 0.0884 |
| 4.5 | 0.0884 | 0.9116 |
| 5.0 | 0.0428 | 0.9572 |

And the M-step then gives

    μ₁ = 1.468,  μ₂ = 4.532,  σ₁² = σ₂² = 0.779,  π₁ = π₂ = 0.5

### Iteration 3

| x | r₁ | r₂ |
| --- | --- | --- |
| 1.0 | 0.9996 | 0.0004 |
| 1.5 | 0.9973 | 0.0027 |
| 4.5 | 0.0027 | 0.9973 |
| 5.0 | 0.0004 | 0.9996 |

The assignment is now essentially hard. One more iteration moves the
parameters to μ = (1.255, 4.745) with σ² = 0.079, and the iteration after
that reaches the fixed point

    μ = (1.25, 4.75),  σ₁² = σ₂² = 0.0625,  π = (0.5, 0.5)

which is exactly the sample mean and sample variance of the two recovered
clusters {1.0, 1.5} and {4.5, 5.0}. EM has found the answer.

### Watching the likelihood climb

Evaluating the log-likelihood Σₙ log p(xₙ) at each parameter set:

| After | Parameters | Log-likelihood |
| --- | --- | --- |
| initial | μ = (1, 5), σ² = 4 | −8.63 |
| iteration 1 | μ = (1.76, 4.24), σ² = 1.59 | −7.51 |
| iteration 2 | μ = (1.47, 4.53), σ² = 0.78 | −6.22 |
| iteration 3 | μ = (1.25, 4.75), σ² = 0.08 | −2.96 |
| converged | μ = (1.25, 4.75), σ² = 0.06 | −2.90 |

Monotone increase, exactly as the theory guarantees. This is the single
best diagnostic for a working EM implementation: plot the log-likelihood and
it must never go down.

## What EM is actually doing

Look at the loop again with fresh eyes:

1. The E-step computes, for every point, how much it belongs to each
   component.
2. The M-step treats those fractional memberships as hard memberships and
   computes the ordinary mean and variance of each "virtual" cluster.

The soft assignment is what makes this work. A hard-assignment clustering
algorithm (assign each point to the nearest component, then recompute) is
the same idea with rₙₖ ∈ {0, 1}, and it oscillates: a point near the
boundary flips sides, the means move, and the next iteration flips it back.
Fractional memberships remove the oscillation, because a borderline point
contributes a little to both clusters and therefore changes neither much.

> **EM** alternates between a soft assignment of points to components (the
> E-step) and a weighted recomputation of the component parameters (the
> M-step), and it never decreases the likelihood.

## Cost and scaling

One E-step is O(nKd²) for full covariance (dominated by the matrix
operations). One M-step is the same order. With n = 1,000,000 points, K = 20
components and d = 10 dimensions, that is roughly 4·10⁹ operations per
iteration — which is why implementations use mini-batches, subsampling, or
the online variants of EM that update parameters from batches rather than
the full dataset.

## What to take away

- EM is a general template: guess the hidden variables, optimise given the
  guess.
- The ELBO explains why it works and why the likelihood is monotone.
- For a GMM both steps are closed form, and the M-step is just weighted
  averaging.
- Always monitor the log-likelihood; a decreasing step means a bug.
