# Latent variables and the idea of a mixture

Everything so far assumed one distribution describes the data. This chapter
shows what goes wrong when that assumption fails, and introduces the one
idea that fixes it: a hidden label that says which population a point came
from. That idea is the whole of the mixture model, and the whole of the
Gaussian mixture model.

## The failure of a single Gaussian

Take a survey of adult heights, in centimetres. Suppose the data is a
mixture of two populations — say two different age groups, or in the classic
example, two populations modelled separately — and the mixture is
**bimodal**: a tall cluster centred at 180 cm and a shorter cluster centred at
160 cm, with a genuine dip in the histogram between them.

Fit a single normal to that data and you get something like μ = 170, σ = 12.
The fit is a disaster even though the parameters were optimised:

- The model claims 16% of people are between 158 and 182 cm (the ±1σ band
  around 170), but the real data has a *hole* there and its mass is
  concentrated at 160 and 180.
- It predicts a density of nearly zero near 170, when the truth there is
  small but not that small.
- One broad blob cannot represent "two populations".

> A single normal distribution cannot represent a **bimodal** density: its
> best fit to two separated clusters is one wide bell in the wrong place.

<svg width="640" viewBox="0 0 640 300" role="img" aria-label="A histogram with two tall separated peaks and a dip in the middle, with a single wide normal curve fitted over the top that matches neither peak." xmlns="http://www.w3.org/2000/svg">
  <line x1="40" y1="250" x2="600" y2="250" stroke="var(--ink)" stroke-width="2"/>
  <rect x="80" y="110" width="30" height="140" fill="var(--line)"/>
  <rect x="110" y="70" width="30" height="180" fill="var(--line)"/>
  <rect x="140" y="90" width="30" height="160" fill="var(--line)"/>
  <rect x="170" y="150" width="30" height="100" fill="var(--line)"/>
  <rect x="200" y="200" width="30" height="50" fill="var(--line)"/>
  <rect x="230" y="225" width="30" height="25" fill="var(--line)"/>
  <rect x="380" y="225" width="30" height="25" fill="var(--line)"/>
  <rect x="410" y="200" width="30" height="50" fill="var(--line)"/>
  <rect x="440" y="150" width="30" height="100" fill="var(--line)"/>
  <rect x="470" y="90" width="30" height="160" fill="var(--line)"/>
  <rect x="500" y="70" width="30" height="180" fill="var(--line)"/>
  <rect x="530" y="110" width="30" height="140" fill="var(--line)"/>
  <path d="M 40 250 C 120 240, 190 150, 320 100 C 450 150, 520 240, 600 250" fill="none" stroke="var(--accent)" stroke-width="3" stroke-dasharray="8 6"/>
  <text x="320" y="24" text-anchor="middle" font-size="16" fill="var(--ink)">one fitted normal over two real clusters</text>
  <text x="320" y="278" text-anchor="middle" font-size="14" fill="var(--accent-text)">dashed: the single-Gaussian fit</text>
</svg>

Two ways out. Either model each population separately and combine them
afterwards — but you do not know which population each point came from, so
you cannot. Or admit that the label is missing and model it as a hidden
variable.

## Latent variables

A **latent variable** is an unobserved quantity that explains the observed
data. Here it is the group membership zᵢ ∈ {1, …, K}: for each observation
xᵢ there is a hidden label saying which component generated it.

The generative story becomes:

1. Draw a label zᵢ with probabilities π₁, …, πₖ (the **mixing weights**).
2. Draw xᵢ from component k = zᵢ, whose parameters are θₖ.

This two-step story is exactly what "mixture" means, and it is the reason
mixtures are so natural: the model says nothing about the labels, only
about the components and the weights.

## The mixture density

Combining the two steps gives the density of x:

    p(x) = Σₖ πₖ · p(x | θₖ)

Each component is any distribution you like — that is what makes it a
**mixture model** rather than a Gaussian mixture model. The weights satisfy
πₖ ≥ 0 and Σₖ πₖ = 1, so the result is a proper density: a convex
combination of densities.

Two immediate consequences:

- The mixture can represent shapes no single component can: bimodal, skewed,
  heavy-tailed, or a mixture of all three.
- Every property of a mixture is a weighted average of the components'
  properties. The mean of the mixture is Σₖ πₖ μₖ, and the variance is
  Σₖ πₖ (σₖ² + μₖ²) − (Σₖ πₖ μₖ)² — the extra spread coming from the
  separation of the component means.

> A **mixture model** writes the density as a weighted sum of component
> densities, and the weights must be non-negative and sum to one.

## Worked example: a two-component mixture in one dimension

Suppose heights are generated as follows: with probability 0.3 you are drawn
from N(160, 25) (a shorter group), and with probability 0.7 from N(180, 25)
(a taller group). Then

    p(x) = 0.3 · N(x | 160, 25) + 0.7 · N(x | 180, 25)

The density at x = 170 is:

    p(170) = 0.3 · (1/5) · exp(−(10)²/(2·25)) + 0.7 · (1/5) · exp(−(10)²/(2·25))
           = (1/5) · exp(−2) · (0.3 + 0.7)
           = 0.2 · 0.1353 = 0.0271

Note what happened: both components contribute, and the weights are what
mix them. Here the two Gaussians happen to be symmetric about 170, so their
densities are equal there and the answer is just the density of a single
N(170, 25) — one of the rare cases where the mixture looks exactly like
one Gaussian at that point. Move to x = 165 and the picture changes:

    p(165) = 0.3 · 0.2 · exp(−25/50) + 0.7 · 0.2 · exp(−225/50)
           = 0.3 · 0.2 · 0.6065 + 0.7 · 0.2 · 0.0111
           = 0.0364 + 0.0016 = 0.0380

The shorter group dominates the left side, exactly as it should.

## The generative view in reverse

The two-step story can be run backwards. Given a value x and the current
parameters, you can ask: which component most likely produced it? The
answer is a **responsibility**, a soft probability:

    rₖ(x) = πₖ p(x | θₖ) / Σⱼ πⱼ p(x | θⱼ)

It is a posterior: the probability that the label is k given the data x,
under the current parameters. It sums to 1 over k, and it is the object
that the EM algorithm estimates and then uses.

> A **responsibility** rₖ(x) is the posterior probability that point x came
> from component k, given the current parameters of the model.

This is the conceptual core of the whole rest of the topic. Chapter 8 writes
the GMM formally; chapter 9 turns responsibilities into a learning
algorithm.

## What to take away

- One Gaussian cannot fit a bimodal population; the failure is structural,
  not a matter of optimisation.
- A latent group label, sampled first, is the minimal fix.
- A mixture density is a convex combination of component densities; every
  summary statistic becomes a weighted average.
- Responsibilities turn the generative story into a posterior — the
  quantity every fitting algorithm computes.
