# A complete worked example

Everything so far has been pieces. This chapter assembles them into one
end-to-end session: a real-looking dataset, a real decision, and the full
chain of reasoning from raw numbers to an answer.

## The problem

A product team wants to understand user sessions on their app. They log the
length of every session in minutes:

    X = {3.2, 4.1, 3.8, 4.5, 3.9, 4.3, 11.2, 12.5, 10.8, 13.1, 11.9, 12.2}

Twelve sessions, and the histogram is obviously bimodal: six short sessions
around 4 minutes and six long ones around 12. The question is not "is it
bimodal" — it is what to do with it. The team's working question: *are there
two kinds of session, and if so, what are they?*

That is a modelling question with a decision attached: the team plans to
build a "quick task" flow for short sessions and a "deep work" flow for long
ones. If the two groups are real and distinct, both flows are worth
building. If they are one continuum, splitting the product would be a
mistake.

## Step 1: what the data says before any model

    n = 12,  mean = 7.958,  sample variance = 17.80,  sd = 4.22

The single-Gaussian summary already shows the problem. The mean sits at
about 8 minutes, which is not where any session is. The standard deviation
is inflated by the gap between the two groups. A single normal would
predict a peak at 8 minutes where the data has a hole.

## Step 2: the K = 1 baseline

Fit one Gaussian by maximum likelihood. For a normal the MLE is the sample
mean and variance:

    μ̂ = 7.958,   σ̂² = 16.317,   σ̂ = 4.040

Log-likelihood:

    ℓ₁ = Σ log N(xᵢ | 7.958, 16.317) = −33.78

This is the number every richer model has to beat. Keep it: it is the
baseline that tells you whether the extra machinery is justified.

## Step 3: fit a two-component GMM

Initialise from k-means: two clusters, means at the cluster centroids
3.967 and 11.950, equal weights, variances from the cluster spreads. Then
run EM.

First E-step. The responsibilities are already essentially hard: every
short session gets 1.0000 / 0.0000 and every long one the mirror image. The
two clusters are eight minutes apart with spreads under a minute, so there
is almost no overlap for the responsibilities to express.

First M-step. With **effective counts** n₁ = n₂ = 6.000, the update
reproduces the initialisation exactly:

    π = (0.5, 0.5)
    μ = (3.967, 11.950)
    σ₁² = 0.172,  σ₂² = 0.596

Convergence. The second iteration changes nothing at all — the
likelihood is already at its fixed point. That is what a good
initialisation buys: EM converged in one step because k-means had already
found the right partition.

    Component 1: π = 0.500, μ = 3.967, σ = 0.415
    Component 2: π = 0.500, μ = 11.950, σ = 0.772

    Log-likelihood: ℓ₂ = −18.51

The likelihood improved by 15.3 nats over the single Gaussian. The
components tell a clean story: half the sessions are short and tightly
clustered around 4 minutes (sd 0.42), half are long and more spread out
around 12 minutes (sd 0.77).

## Step 4: should it be K = 3?

Fit a third component. The optimiser obligingly finds one: a spike sitting
exactly on the point 3.2, with the variance pinned at the numerical floor —
the **variance floor** from chapter 10.

    K = 3: π = (0.083, 0.417, 0.500)
             μ = (3.200, 4.120, 11.950)
             σ² = (1e-6, 0.066, 0.596)
             ℓ₃ = −12.28

Now the information criteria, with p = K(2d+1) − 1 = 3K − 1 free parameters
in one dimension, and n = 12:

| K | log L̂ | p | AIC | BIC |
| --- | --- | --- | --- | --- |
| 1 | −33.78 | 2 | 71.56 | 72.53 |
| 2 | −18.51 | 5 | 47.03 | 49.45 |
| 3 | −12.28 | 8 | 40.55 | 44.43 |

Read the table honestly: both criteria prefer K = 3 — the **information
criteria** cannot tell a real third mode from a spike. The third
component buys 12.48 nats of doubled log-likelihood, and BIC's penalty for
three extra parameters at n = 12 is only 3 · log 12 ≈ 7.5. The improvement
outweighs the penalty.

Note how sample-size dependent that is. The likelihood gain of the spike is
roughly fixed — it is one point being fitted exactly — while BIC's penalty
grows with log n. At n = 1000 the same three parameters cost 3 · log 1000 ≈
20.7, more than the 12.5 nats they buy, and BIC would select K = 2. So the
criterion's answer here is an artefact of the tiny sample, and no criterion
can tell you the difference between a real third mode and a spike.

This is exactly the moment where a criterion alone is not enough. Look at
*what* the third component is: a component of weight 0.083 whose variance is
1e-6, centred on a single observation. It is not a mode of the data — it is
one data point wearing a component as a costume. The likelihood improvement
it buys is real (the model is allowed to place infinite density on an
observed point) but it will not generalise: the model now assigns
essentially zero density to any *new* value near 3.2.

The decision is K = 2, and the reason is not the information criterion. It is
that the third component fails the inspection test from chapter 10: variance
at the floor, effective count of one, no interpretation.

## Step 5: use the model

Now the model earns its keep.

Segmenting a new session. A user closes the app after 9.0 minutes, and the
model's **responsibilities** are hard:

    p(9.0) = 0.5·N(9.0 | 3.967, 0.172) + 0.5·N(9.0 | 11.95, 0.596)
           ≈ 1.74 × 10⁻⁴

    responsibilities: 0.0000 / 1.0000

Two things to notice. The responsibility is hard — this session is
unambiguously in the long group. But the density under *both* components is
tiny. A 9-minute session is not a compromise between the two modes; it is
an unusual session by either account. The right call is to flag it, not to
file it.

Sizing the two groups. The mixing weights say the two groups are equal
in size here — 50% of sessions each. On a larger sample the weights would
be the estimate of how common each behaviour is.

Generating plausible new sessions. Sampling from the fitted model gives
realistic session lengths: draw a component with probabilities (0.5, 0.5),
then draw a normal with that component's mean and variance. That is how you
build a simulator for capacity planning.

## The implementation

The smallest thing that does the job — twenty lines, one file, no
dependencies beyond a linear-algebra routine:

```python
def fit_gmm(X, K, iters=200, var_floor=1e-6, seed=0):
    rng = np.random.default_rng(seed)
    # init from k-means
    labels = KMeans(K, n_init=10, random_state=seed).fit_predict(X)
    means = np.array([X[labels == k].mean(0) for k in range(K)])
    covs = np.array([np.cov(X[labels == k].T) for k in range(K)])
    weights = np.array([(labels == k).mean() for k in range(K)])

    for _ in range(iters):
        # E-step: responsibilities, computed in log space
        logp = np.log(weights)[None, :] + norm.logpdf(
            X[:, None, :], means[None, :, :], covs[None, :, :, :]
        )
        resp = np.exp(logp - logsumexp(logp, axis=1, keepdims=True))

        # M-step: weighted means, covariances, weights
        nk = resp.sum(axis=0)
        means = (resp.T @ X) / nk[:, None]
        covs = np.array([
            (resp[:, k, None] * (X - means[k])).T @ (X - means[k]) / nk[k]
            for k in range(K)
        ])
        covs += var_floor * np.eye(X.shape[1])   # the floor that prevents degeneracy
        weights = nk / len(X)

    return weights, means, covs
```

Three details in that code are load-bearing, and each one corresponds to a
failure mode from earlier chapters:

- `logsumexp` in the E-step, because the naive ratio underflows to 0/0
  (chapter 10).
- `var_floor` added to every covariance, because the likelihood is
  unbounded and a component will otherwise collapse onto one point
  (chapter 10).
- k-means initialisation plus the restart loop below, because EM finds
  whichever local maximum it starts nearest (chapter 10).

```python
best = max((fit_gmm(X, K, seed=s) for s in range(10)),
           key=lambda m: loglik(X, m))
```

And the model-selection wrapper, which is where the K = 2 decision above
comes from:

```python
for K in range(1, 8):
    w, m, c = best_for(K)
    p = K * (2 * X.shape[1] + 1) - 1
    bic = p * np.log(len(X)) - 2 * loglik(X, (w, m, c))
    print(K, bic)
```

## The checklist, one last time

1. Look at the data before modelling it. The bimodality was visible in the
   histogram, and the single-Gaussian baseline gave the number to beat.
2. Fit the simplest model that could possibly work (K = 1) and record its
   likelihood.
3. Initialise EM from k-means, run several restarts, keep the best.
4. Compare candidate K with BIC and cross-validation — but then inspect the
   components and reject the ones that are degenerate.
5. Check the log-likelihood is monotone; a spike at the end means a
   collapsed component.
6. Use the model on the thing you actually care about, and remember that a
   point can be confidently assigned and still be an outlier.

## What to take away

- The full pipeline is: baseline, fit, compare, inspect, use.
- The information criteria are a useful tie-breaker, not a decision-maker;
  components must be inspected before you believe them.
- A hard responsibility does not mean a typical point — check the density
  under the model as well.
- Once you have the model, it is a simulator, a segmenter and an anomaly
  detector, all at once.
