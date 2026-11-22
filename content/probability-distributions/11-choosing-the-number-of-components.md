# Choosing the number of components

Adding a component to a GMM always improves the fit on the training data —
the likelihood is monotone in K, and with full covariances a single point
can be fit almost perfectly by its own component. So the question is never
"does K = 5 fit better?" It always does. The question is which K will
predict well on data the model has never seen.

## The overfitting mechanism

Suppose you fit a GMM with K = 20 to 500 points in one dimension. Each
component can shrink to capture a tiny group of points. The training
log-likelihood will be excellent, and the model will be a set of narrow
spikes that memorises the sample. Ask it for the density at a new point and
it will give you an arbitrary value, because the gaps between spikes have
no structure.

This is **overfitting**, the standard bias–variance trade-off, and mixtures
sit on the spectrum:

| K | Bias | Variance | Behaviour |
| --- | --- | --- | --- |
| too small | high | low | cannot represent the true shape; smooths over real structure |
| right | balanced | balanced | captures the structure that generalises |
| too large | low | high | memorises noise; wild predictions between points |

## Information criteria: penalise complexity

An information criterion trades fit against complexity with a fixed
formula. The **Akaike information criterion** is

    AIC = 2p − 2 log L̂

The **Bayesian information criterion** is

    BIC = p·log(n) − 2 log L̂

where p is the number of free parameters and n the sample size. In both
cases, lower is better, and the extra data needed to justify one more
parameter grows with n.

Note the shape of the penalty: AIC charges 2 per parameter, BIC charges
log n per parameter. For n = 1000, log n ≈ 6.9, so BIC penalises new
components more than three times as hard as AIC does. BIC therefore tends
to select fewer components; AIC tends to select more.

### Worked example

Say you fit GMMs with K = 1 … 6 to n = 1000 points and get these maximum
log-likelihoods. With full covariance in 2 dimensions, p = 6K − 1:

| K | log L̂ | p | AIC | BIC |
| --- | --- | --- | --- | --- |
| 1 | −4200 | 5 | 8410 | 8434 |
| 2 | −3900 | 11 | 7822 | 7876 |
| 3 | −3800 | 17 | 7634 | 7717 |
| 4 | −3760 | 23 | 7566 | 7679 |
| 5 | −3740 | 29 | 7538 | 7680 |
| 6 | −3730 | 35 | 7530 | 7702 |

AIC selects K = 6; BIC selects K = 4. Read the table carefully to see why.
Going from K = 4 to K = 6 buys 30 nats of log-likelihood — 60 nats of
doubled log-likelihood, which is what the criteria actually trade. But each
extra component costs 6 parameters in two dimensions with full
covariances, and BIC charges log(1000) ≈ 6.9 per parameter: 83 nats of
penalty against 60 nats of gain, so BIC says no. AIC charges only 2 per
parameter: 24 nats of penalty against 60 nats of gain, so AIC says yes.

That is the difference between the two criteria in one line — AIC rewards
fit almost regardless of cost, BIC charges enough that on a large sample
the extra structure has to earn its place.

## Cross-validation: the honest test

Information criteria are approximations of what you want. **Cross-validation**
measures it directly: hold out a fraction of the data, fit on the rest, and
score the held-out points.

For a generative model, the natural score is the held-out log-likelihood:

    CV(K) = Σ_{i in held-out} log p(xᵢ | θ̂_K)

A model that overfits scores badly here, because the spikes it memorised
give near-zero density to unseen points. K-fold cross-validation, or a
simple train/test split, is the most reliable way to choose K.

The subtlety worth knowing: comparing held-out likelihoods across different
K is fair only if the models are fitted the same way, and only if the
held-out points are genuinely exchangeable with the training points. If
your data has a time order, a random split leaks the future into the
training set and the comparison is meaningless — use forward-chaining
instead.

## Likelihood ratio tests for nested models

When K = 2 versus K = 1 is the question, there is a classical test. The
**likelihood ratio test** statistic is

    Λ = 2 (log L̂₂ − log L̂₁)

and under the null hypothesis (one component), Λ is asymptotically
distributed as chi-squared with degrees of freedom equal to the number of
extra parameters.

For the 2-D example above: Λ = 2(−3900 + 4200) = 600, with 6 extra
parameters. The p-value is astronomically small, so one component is
overwhelmingly rejected.

Two caveats that matter in practice:

- The asymptotic theory assumes regularity, which fails near degenerate
  solutions. If the fitted components are nearly identical, the reference
  distribution is not chi-squared.
- Testing "K = 1 vs K = 2" and "K = 2 vs K = 3" separately, then picking
  the largest K that is rejected, is not the same as testing K = 1 vs K = 3
  directly. Test the specific comparison you care about.

> The **likelihood ratio test** compares nested models through twice the
> difference in log-likelihoods, and is asymptotically chi-squared under
> the null hypothesis.

## Practical rules of thumb

- Start with the number of components the domain suggests. If you have four
  known customer segments, start at K = 4.
- Fit K = 1 … 10 and plot BIC and cross-validated log-likelihood against K.
  Look for the elbow, and prefer the smaller K when the curve is flat.
- Watch the effective counts nₖ. A component holding 0.5% of the data is
  almost always noise.
- In high dimensions, prefer fewer components with richer covariances
  (spherical → diagonal → full) over many components with simple shapes.
- Use the marginal likelihood, not the training likelihood, to compare
  across different covariance structures.

## The Bayesian answer

The Bayesian treatment removes the guessing: put a prior on the mixing
weights and the component parameters, and let the data decide how many
components are actually needed. With a Dirichlet prior on the weights,
components with negligible posterior weight are effectively removed, and
the number of components can be inferred rather than chosen. That is the
subject of the next chapter.

## What to take away

- More components always fit the training data better; only held-out
  performance counts.
- BIC penalises complexity harder than AIC and picks fewer components.
- Cross-validation on held-out likelihood is the most direct answer, with
  time-ordered data handled by forward chaining.
- A likelihood ratio test settles specific nested comparisons, with caveats
  about degeneracy.
