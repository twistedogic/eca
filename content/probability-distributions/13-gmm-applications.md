# Where GMMs are used

A GMM is a flexible density model, and flexibility is the point. This
chapter walks through the applications that actually earn their keep, with
the shape of the problem each one solves.

## Density estimation

The simplest use: you have samples and want a smooth density. This is
**density estimation**, and a GMM does it without committing to a single
parametric shape.

Why not a histogram? Because a histogram's answer depends on where you put
the bin edges. Shift the bins by one unit and the density changes. A GMM is
smooth, differentiable, and gives you a density you can differentiate,
integrate or sample from.

Why not kernel density estimation? KDE is non-parametric and needs a
bandwidth. A GMM is parametric, needs more data, but gives you components you
can interpret and act on ("cluster 2 is the short-statured group").

## Clustering

The most common use. Assign each point to its most likely component:

    label(x) = argmaxₖ rₖ(x)

That gives k-means-style partitions, but softer and better behaved:
- The assignment is derived from a density model, so you also get a
  probability, not just a label.
- The model explains the data, so you can ask questions of it.

Typical uses: customer segmentation, image segmentation, document
clustering, anomaly detection by distance to the nearest component.

> A GMM cluster is a soft region: each point carries a probability of
> belonging to each component, so borderline points are not forced into a
> side.

## Speaker verification: the UBM pattern

The canonical industrial use of GMMs, and a good illustration of how they
are used well.

A **universal background model** (UBM) is a GMM trained on speech from
thousands of speakers. It models "speech in general". To verify a claimed
speaker, you adapt the UBM to the claimant's own utterances — a Bayesian
update of the mixture weights and means — and compare the likelihood of the
test utterance under the speaker-adapted model against the UBM.

The **likelihood ratio** is the score:

    score = log p(x | speaker model) − log p(x | UBM)

A high score means the utterance looks more like the claimed speaker than
like an average speaker. This is exactly the structure of a GMM adapted by
MAP estimation, and the GMM-UBM system was the basis of the top-performing
NIST speaker-verification evaluations for years.

The design insight: the UMM supplies strong priors, so a few seconds of a
new speaker's voice is enough to adapt it.

## Background subtraction

Video surveillance: **background subtraction** models the background with
a GMM over pixel colours, then flags pixels whose likelihood under the
background model is low.

The GMM is used rather than a single Gaussian because lighting changes
(cloud, shadow, headlights) create several legitimate background states.
Each state becomes its own component, and the system learns them as it goes.
Panning objects that stay in one place for a while can get absorbed into the
background components — the standard failure mode, and the reason
implementations use learning rates and update thresholds.

## Anomaly detection

Fit a GMM to normal data. For a new point, compute its likelihood or its
Mahalanobis distance to the nearest component. A low value flags an
**anomaly**.

The subtlety is calibration: "low likelihood" needs a threshold, and the
threshold must come from held-out normal data, not from a guess. GMM-based
anomaly detection is also sensitive to the tail behaviour of the Gaussian:
heavy-tailed normal data produces a lot of false positives because a
Gaussian assigns low probability to genuine extremes.

## Segmentation of images

A GMM over pixel colours is the classic approach to interactive
**image segmentation**: the user draws a rectangle around an object, the
pixels inside and outside seed two components, and EM updates the model
until the two clusters separate the object from the background. This is the mechanism
inside the GrabCut algorithm.

## Dimensionality reduction, of a sort

Principal component analysis is the standard way to reduce dimension, and a
GMM is not a substitute for it. But a GMM adds something PCA cannot: after
projecting onto the first few principal components, you can fit a GMM in the
reduced space to capture *clusters* along those directions.

A typical pipeline for high-dimensional data:

1. Standardise the features.
2. Project onto the leading principal components (retain, say, 95% of the
   variance).
3. Fit a GMM in the reduced space.
4. Use the responsibilities as soft labels, and the posterior mean as the
   denoised representation.

The result is both a compression and a clustering.

## Model compression

Because a GMM is a sum of a handful of Gaussians, it is a cheap generative
model to store and to sample from. That makes it useful as a distilled
proxy for something expensive: fit a GMM to the output of a large model, and
you can generate similar outputs with a few hundred parameters.

## Choosing the right tool instead

Being honest about when *not* to use a GMM:

| Need | Better tool |
| --- | --- |
| Predict a continuous outcome | Regression (linear, tree-based) |
| Classify with labels | Logistic regression, SVM, boosted trees |
| Reduce dimension | PCA |
| Density in low dimensions | Histogram / KDE |
| Clusters that are not elliptical | Spectral clustering, k-means on embeddings |
| Deep non-linear structure | Neural networks |

A GMM's components are ellipses. If your clusters are crescents, spirals or
filaments, a GMM fitted to the raw data will invent structure that is not
there.

## What to take away

- GMMs are used when you need a density: for clustering, likelihood
  scoring, anomaly detection, or a cheap generative proxy.
- The UBM pattern — a strong prior model adapted to a specific case — is
  the most transferable idea here.
- The components are ellipses; if your clusters are not, do not force it.
