# Querying metrics

Metrics are the cheapest signal to store and the easiest to query badly.
The query language is nearly universal — PromQL and its clones cover
most of the ecosystem — but the mapping from OpenTelemetry's metric
model onto a time series database is where the surprises live.

## What OTel metrics look like

OpenTelemetry defines a handful of instrument types. A **counter** is a
monotonic total; use it for events that accumulate. A **gauge** is a
value that goes up and down, such as a queue depth. A **histogram**
records a distribution as cumulative bucket counts plus a count and a
sum, and it is the default choice for latency because a percentile
cannot be recovered from an average.

The data points of a metric differ in temporality: cumulative points
count since the process started, delta points count since the previous
point. The counter itself is identical either way — only the accounting
differs.

Names carry units. `http.server.request.duration` with unit `s` becomes
`http_server_request_duration_seconds` in Prometheus: dots replaced by
underscores, the unit appended.

## PromQL basics

**PromQL** is the query language of Prometheus, and most other metric
backends either speak it or something very close.

The two workhorses are **rate** and **increase**.
`rate(http_requests_total[5m])` gives the per-second rate over the last
five minutes, and `increase(...[1h])` gives the total growth over the
last hour. Both need a range vector, because a counter has to be
differenced over time before it means anything.

`sum by (le) (...)` is the grouping form: it sums series that share the
labels in the parentheses and drops every other label.

## Latency with histograms

The standard latency query is a **histogram_quantile** over a sum of
buckets:

```promql
histogram_quantile(
  0.95,
  sum by (le, service_name) (
    rate(http_server_request_duration_seconds_bucket[5m])
  )
)
```

The `le` label is the bucket boundary and it must survive the
aggregation, which is why it is in the `by` list. Without it the
quantile is meaningless.

Percentiles are computed at query time from the bucket counts, so a
histogram's precision is set by its bucket boundaries, not by the
storage. Native histograms — the exponential kind — keep the whole
distribution and answer better, at the cost of a storage format only
some backends support.

## Labels, resources, and cardinality

A Prometheus **label** is a key-value pair on a series, and a time
series is the unique combination of all of them. The mapping from
OpenTelemetry is usually: resource attributes become labels, and span or
data point attributes become labels too.

That mapping is where cost lives. Every distinct label combination is
another series, stored forever and scanned by every panel.
**Cardinality** — the number of distinct label combinations — is the
number that decides your bill and your query latency. A `user_id` or a
`request_id` attribute on a metric is a cardinality bomb, and the fix
is to not record it on metrics at all, or to drop it in the Collector.

## Exemplars

An **exemplar** is a metric data point that also carries a trace ID and
span ID, so a spike on a graph points at the exact request that caused
it. In Prometheus an exemplar is attached to a bucket and holds the
trace ID in a label.

Exemplars only work if every stage preserves them: the SDK has to
sample them, the Collector has to pass them through, and the backend
has to store them. The classic scrape path drops them, so a Prometheus
reading directly from an exporter sees none. Prometheus's exemplar API
and the Grafana UI read them back, and Grafana turns an exemplar into a
link into the trace.
