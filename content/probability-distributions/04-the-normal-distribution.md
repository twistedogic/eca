# The normal distribution in depth

The normal distribution is the workhorse of the whole topic, and the only
component you need to build a Gaussian mixture model. This chapter goes
past the density formula: why the normal shows up everywhere, what the
multivariate version means, and how to do real calculations with it.

## Where the normal comes from

Three different roads lead to the same place.

**As a limit of the binomial**: take the number of successes in n fair
coin flips, X_n ~ Bin(n, 0.5). Write it as a proportion X_n/n. As n grows,
the proportion does not wander off; it tightens around 0.5. The limit of
that tightening curve is a normal density. This is the **de Moivre–Laplace
theorem**, and it is why the normal approximates the binomial.

**As a limit of the general sum**: the **central limit theorem** says: for
independent, identically distributed variables with finite mean and
variance, the standardised sum converges in distribution to the standard
normal, no matter what the individual variables look like. Skewed, heavy
tailed, bounded — it does not matter.

**As a physical law**: many microscopic effects (molecular motion, measurement
error) add up. Sums of tiny independent effects look Gaussian. That is why
"Gaussian error" became the default model of noise in physics and, later, in
every measurement device.

> The **central limit theorem** says that the standardised sum of many
> independent variables converges to the normal distribution, whatever the
> individual distributions are.

## Properties that make the normal tractable

The normal density

    f(x) = (1 / (σ · √(2π))) · exp( −(x − μ)² / (2σ²) )

looks like a formula with nothing to prove. Its usefulness comes from a
handful of algebraic properties.

**Addition**: if X ~ N(μ₁, σ₁²) and Y ~ N(μ₂, σ₂²) are independent, then

    X + Y ~ N(μ₁ + μ₂, σ₁² + σ₂²)

**Averages**: since X/n is just a rescaling, the mean of n independent
N(μ, σ²) variables is N(μ, σ²/n). This is the single most important
sentence in statistics: averaging n independent observations divides the
variance by n, so the standard error of the mean is σ/√n.

**Transformation**: if X ~ N(μ, σ²), then aX + b ~ N(aμ + b, a²σ²) for any
constant a.

**Symmetry and unimodality**: the curve is symmetric about μ and has a
single maximum there.

## The 68–95–99.7 rule, drawn

<svg width="640" viewBox="0 0 640 340" role="img" aria-label="A bell-shaped normal curve with dashed guides at one, two and three standard deviations from the mean, and brackets below the axis showing that 68 percent of the mass lies within one standard deviation, 95 percent within two and 99.7 percent within three." xmlns="http://www.w3.org/2000/svg">
  <text x="320" y="24" text-anchor="middle" font-size="16" fill="var(--muted)">mass of a normal within k standard deviations</text>
  <line x1="40" y1="235" x2="600" y2="235" stroke="var(--ink)" stroke-width="2"/>
  <path d="M 80 228 Q 120 214 160 190 Q 200 162 240 126 Q 280 78 320 50 Q 360 78 400 126 Q 440 162 480 190 Q 520 214 560 228" fill="none" stroke="var(--accent)" stroke-width="3"/>
  <line x1="80" y1="228" x2="80" y2="235" stroke="var(--muted)" stroke-width="1" stroke-dasharray="4 4"/>
  <line x1="160" y1="190" x2="160" y2="235" stroke="var(--muted)" stroke-width="1" stroke-dasharray="4 4"/>
  <line x1="240" y1="126" x2="240" y2="235" stroke="var(--muted)" stroke-width="1" stroke-dasharray="4 4"/>
  <line x1="400" y1="126" x2="400" y2="235" stroke="var(--muted)" stroke-width="1" stroke-dasharray="4 4"/>
  <line x1="480" y1="190" x2="480" y2="235" stroke="var(--muted)" stroke-width="1" stroke-dasharray="4 4"/>
  <line x1="560" y1="228" x2="560" y2="235" stroke="var(--muted)" stroke-width="1" stroke-dasharray="4 4"/>
  <text x="80" y="252" text-anchor="middle" font-size="14" fill="var(--muted)">-3σ</text>
  <text x="160" y="252" text-anchor="middle" font-size="14" fill="var(--muted)">-2σ</text>
  <text x="240" y="252" text-anchor="middle" font-size="14" fill="var(--muted)">-1σ</text>
  <text x="320" y="252" text-anchor="middle" font-size="14" fill="var(--ink)">mean</text>
  <text x="400" y="252" text-anchor="middle" font-size="14" fill="var(--muted)">+1σ</text>
  <text x="480" y="252" text-anchor="middle" font-size="14" fill="var(--muted)">+2σ</text>
  <text x="560" y="252" text-anchor="middle" font-size="14" fill="var(--muted)">+3σ</text>
  <path d="M 240 272 H 400 M 240 266 V 278 M 400 266 V 278" fill="none" stroke="var(--ink)" stroke-width="1.5"/>
  <text x="410" y="276" font-size="14" fill="var(--ink)">68%</text>
  <path d="M 160 296 H 480 M 160 290 V 302 M 480 290 V 302" fill="none" stroke="var(--ink)" stroke-width="1.5"/>
  <text x="490" y="300" font-size="14" fill="var(--ink)">95%</text>
  <path d="M 80 320 H 560 M 80 314 V 326 M 560 314 V 326" fill="none" stroke="var(--ink)" stroke-width="1.5"/>
  <text x="570" y="324" font-size="14" fill="var(--ink)">99.7%</text>
</svg>

For any normal distribution, roughly:

- 68% of the mass lies within one standard deviation of the mean
- 95% within two
- 99.7% within three

Worked example. Daily returns of a stock are approximately N(0.01, 0.02²)
(mean 1%, standard deviation 2%). What is the probability of a day worse
than −5%?

    z = (−0.05 − 0.01) / 0.02 = −3

P(Z < −3) ≈ 0.00135, so about 1 day in 740. Multiply by 250 trading days a
year and you get roughly a 29% chance of at least one such day per year —
which is a fair description of how often "bad days" actually arrive.

## The multivariate normal

Real data has several columns, and a GMM component needs to describe a whole
vector at once. The **multivariate normal** (or Gaussian) density on d
dimensions is:

    p(x) = (1 / ((2π)^(d/2) · |Σ|^(1/2))) · exp( −(x − μ)ᵀ Σ⁻¹ (x − μ) / 2 )

where μ is a d-dimensional **mean vector** and Σ is a d×d **covariance
matrix** holding variances on the diagonal and covariances off it.

The exponent is a squared distance. Define the **Mahalanobis distance**:

    d(x, μ) = √( (x − μ)ᵀ Σ⁻¹ (x − μ) )

Then the density can be written p(x) ∝ exp(−d²/2), and the contour sets of
the Gaussian are ellipses: circles in standardised coordinates, stretched
and rotated back to the original space.

> A **covariance matrix** encodes the variance of each coordinate and the
> linear relationship between every pair, and its inverse defines the
> **Mahalanobis distance** that measures how many standard deviations a
> point is from the mean.

Worked example, two dimensions. Suppose x₁ is height in cm and x₂ is
weight in kg, with

    μ = (170, 70),  Σ = [ 25 , 20 ; 20 , 9 ]

The 25 is the variance of height (sd 5 cm), the 9 the variance of weight
(sd 3 kg), and the 20 the covariance (height and weight move together).
The correlation is 20 / (5 · 3) = 0.667.

A point (175, 80) is not "1 standard deviation" away in both coordinates;
its Mahalanobis distance is what says how unusual it is.

## Consequences of the multivariate form

Three facts do most of the work later:

1. **Linear transformations**: if x is normal with mean μ and covariance Σ,
   then Ax + b is normal with mean Aμ + b and covariance AΣAᵀ. This is how
   PCA-style projections of a GMM work: project each component, keep the
   mixture structure.
2. **Marginals**: projecting a multivariate normal onto any coordinate or
   linear combination gives a univariate normal with the corresponding mean
   and variance. Every marginal of a GMM is therefore itself a mixture of
   normals — the "shadow" plots of a GMM are exact, not approximations.
3. **Conditioning**: conditioning one normal on another gives another
   normal. This is what makes Gaussian belief propagation possible, and it
   is why the Bayesian GMM in a later chapter has such clean closed-form
   updates.

## What to take away

- The normal appears as a limit of sums; that is its reason for existence.
- Sums and averages of normals are normal, with variances adding.
- The multivariate normal is the right building block for a GMM: mean
  vector, covariance matrix, and a distance that measures standardised
  deviation.
