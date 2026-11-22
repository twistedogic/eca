# The Gaussian mixture model

Now the specific model. A **Gaussian mixture model** (GMM) is a mixture
model whose components are Gaussians. This chapter writes it down
precisely, computes its responsibilities and likelihood by hand, and counts
its parameters — the number that drives everything about how it is fitted
and compared.

## The definition

For K components with parameters θₖ = (μₖ, Σₖ):

    p(x) = Σₖ₌₁..K πₖ · N(x | μₖ, Σₖ)

with **mixing weights** πₖ ≥ 0 summing to 1, mean vectors μₖ, and covariance
matrices Σₖ.

In one dimension the density is

    p(x) = Σₖ πₖ · (1 / (σₖ √(2π))) · exp( −(x − μₖ)² / (2σₖ²) )

Every GMM is a linear combination of bells. Choosing the covariance type is
a modelling decision with real consequences:

- **Full covariance**: each component can be an arbitrarily oriented
  ellipse. Most flexible, most parameters.
- **Tied covariance**: every component shares the same Σ, but each may have
  its own mean. Used when the clusters have similar shapes.
- **Diagonal covariance**: each component has an axis-aligned ellipse.
  The common choice when data has many loosely related features.
- **Spherical covariance**: one variance per component, shared across
  dimensions. Fewest parameters.

## The latent indicator formulation

There is a second, equivalent way to write the model that makes the algebra
much easier. Introduce a latent **indicator variable** zₙ ∈ {1, …, K} for
each data point, with

    P(zₙ = k) = πₖ

Then the joint model is

    p(xₙ, zₙ) = π_{zₙ} · N(xₙ | μ_{zₙ}, Σ_{zₙ})

and the observed-data density is obtained by marginalising z out:

    p(xₙ) = Σₖ p(xₙ, zₙ = k) = Σₖ πₖ N(xₙ | μₖ, Σₖ)

Nothing new, but the indicator form is what lets us use the standard
missing-data machinery: the **complete-data likelihood** treats the zₙ as
if they were observed and factorises,

    p(X, Z | θ) = ∏ₙ ∏ₖ [ πₖ N(xₙ | μₖ, Σₖ) ]^(zₙₖ)

where zₙₖ = 1 if zₙ = k and 0 otherwise. This product form is what the EM
algorithm differentiates.

## Responsibilities

For a single point xₙ, the **responsibility** of component k is the
posterior probability that it came from k:

    rₙₖ = πₖ N(xₙ | μₖ, Σₖ) / Σⱼ πⱼ N(xₙ | μⱼ, Σⱼ)

Properties worth knowing: 0 ≤ rₙₖ ≤ 1, Σₖ rₙₖ = 1, and Σₖ rₙₖ = 1 for each
n. The responsibilities are a soft assignment — every point belongs to every
component in proportion, and the proportions are what get updated.

### Worked example: responsibilities by hand

One-dimensional model, K = 2:

    π₁ = 0.4, μ₁ = 2.0, σ₁ = 1.0
    π₂ = 0.6, μ₂ = 6.0, σ₂ = 1.0

Take the point x = 4.0, exactly between the two means.

    π₁ N(4 | 2, 1) = 0.4 · (1/√(2π)) · exp(−4/2) = 0.4 · 0.3989 · 0.1353 = 0.02159
    π₂ N(4 | 6, 1) = 0.6 · (1/√(2π)) · exp(−4/2) = 0.6 · 0.3989 · 0.1353 = 0.03239

    r₁ = 0.02159 / (0.02159 + 0.03239) = 0.02159 / 0.05398 = 0.40
    r₂ = 0.03239 / 0.05398 = 0.60

The point is assigned 40% to component 1 and 60% to component 2. It is
*not* 50/50, even though x sits exactly halfway between the means, because
the components have different weights. Geometry plus prior knowledge of
the component sizes decides the split.

Now take x = 5.0, closer to the second mean:

    π₁ N(5 | 2, 1) = 0.4 · 0.3989 · exp(−9/2) = 0.4 · 0.3989 · 0.0111 = 0.00177
    π₂ N(5 | 6, 1) = 0.6 · 0.3989 · exp(−1/2) = 0.6 · 0.3989 · 0.6065 = 0.14516

    r₁ = 0.00177 / 0.14693 = 0.012,   r₂ = 0.988

Now the assignment is nearly hard. This is the mechanism by which a GMM
discovers clusters: points near one mean get that component's
responsibility, points in the overlap get split.

> The **responsibility** of component k for point n is its posterior
> probability, and summing responsibilities over points is how a GMM counts
> how many members each component has.

## The likelihood

The log-likelihood of the whole dataset X = {x₁, …, xₙ} is

    ℓ(θ) = Σₙ log [ Σₖ πₖ N(xₙ | μₖ, Σₖ) ]

Note the structure: a log of a sum. That is the whole reason the estimation
problem is hard. If the components were assigned (each point belonging to
exactly one component, labels known), the log-likelihood would be a sum of
logs and could be optimised component by component. The unknown labels are
what make the mixture problem non-convex.

Compare with the complete-data log-likelihood, which is a sum of logs:

    ℓ_complete(θ, Z) = Σₙ Σₖ zₙₖ [ log πₖ + log N(xₙ | μₖ, Σₖ) ]

If you knew Z, this would be trivially optimisable. The EM algorithm's
strategy is to *guess* Z with the responsibilities, optimise the
complete-data objective, and repeat.

## Counting the parameters

For K components in d dimensions:

- Means: K·d
- Full covariances: K·d(d+1)/2
- Weights: K − 1 (the last is fixed by the sum-to-one constraint)

Total for full covariance:

    p = K·d + K·d(d+1)/2 + (K − 1)

For d = 2 and K = 5: 10 + 15 + 4 = 29 parameters.

For diagonal covariance in d dimensions: K·d means + K·d variances +
(K − 1) weights = K(2d + 1) − 1.

For d = 1, K = 2, diagonal: 2(2·1 + 1) − 1 = 5 parameters — which is
exactly the π₁, π₂, μ₁, μ₂, σ₁, σ₂ of the example above minus one for the
weight constraint.

> The parameter count of a GMM grows linearly in K and quadratically in
> dimension, which is why the number of components and the covariance type
> are the two decisions that determine whether the model is identifiable
> from your data.

## What the model can and cannot do

A GMM is a **generative model**: it gives you p(x) for new points, and
p(x | label) for each component. It is not a classifier — though Bayes'
rule turns it into one:

    P(component k | x) = rₖ(x)

and a hard clustering is just the argmax of the responsibilities.

It also has a serious limitation that appears the moment you fit it: the
likelihood is unbounded. A component can shrink onto a single data point,
its variance going to zero, and the likelihood with it. That pathology,
and its fixes, are the subject of chapter 10.

## What to take away

- A GMM is a weighted sum of Gaussian densities; the weights are the
  mixing weights and must sum to one.
- The indicator formulation makes the complete-data likelihood a product of
  simple factors — the key that unlocks EM.
- Responsibilities are posteriors; they are the soft assignment and the
  object the fitting algorithm updates.
- Parameter count grows as K(2d + 1) for diagonal covariances, which bounds
  how large K can sensibly be for a given dataset.
