# Prometheus metrics and OpenTelemetry metrics

Two different things get called "metrics", and they overlap enough to
be confused and different enough to matter. **Prometheus** is a
monitoring system: it stores time series, it has a query language, it
decides how long to keep data. OpenTelemetry metrics is a producer-side
data model and API: it decides what an instrument means and how the
numbers leave the process. You can run either one without the other.

## Two different jobs

Prometheus owns the whole monitoring loop. It discovers targets, it
**scrapes** them over HTTP, it stores what it reads, it answers PromQL,
it evaluates alerting rules, and it draws the graphs. A Prometheus server
is the database of record for your operational metrics.

OpenTelemetry owns the other end. The SDK defines instruments, the
Collector transports the resulting data points, and then somebody else's
system stores them. There is no OpenTelemetry query engine, no
OpenTelemetry alerting, and no OpenTelemetry storage — by design, because
that is the part the vendor should own.

The consequence is that "should I use Prometheus or OpenTelemetry" is
usually the wrong question. The common setup uses both: instrument with
OpenTelemetry, and let the Collector feed Prometheus.

## The data model

Prometheus identifies a series by a name and a set of labels, and it
knows four types: counter, gauge, histogram, and summary. The classic
histogram is a set of cumulative bucket series plus a sum and a count,
and the summary computes quantiles inside the application process at
scrape time.

OpenTelemetry splits the instrument from the data point. The
instruments are counter, **up-down counter**, gauge, histogram, and
**exponential histogram**; the data model additionally carries a summary
point for compatibility, although no SDK ships a summary instrument,
because computing quantiles in the process is exactly what you want to
avoid. A data point also carries the unit, the resource attributes, the
instrumentation scope, and its own attributes — none of which Prometheus
has a place for.

## Temporality

Prometheus counters are cumulative: the target exposes the running total
and Prometheus computes the rate by differencing two scrapes. The
contract is that a counter never decreases.

OpenTelemetry data points are either cumulative or **delta**, and the
exporter chooses. Push-based OTLP exporters normally send delta points,
because a delta is what the receiver can aggregate without keeping
per-process state. Feeding delta counters to Prometheus breaks its
contract, which is why the Collector has a `deltatocumulative` processor
that converts them before the Prometheus exporter serves them.

## Names and labels

Prometheus naming is a convention that everyone follows by hand:
snake_case, base units, `_total` on counters. OpenTelemetry names are
dotted and carry the unit separately, so `http.server.request.duration`
with unit `s` is one name plus one unit, not a name that encodes both.

The Collector translates between the two when it exposes metrics to
Prometheus: dots become underscores, the unit becomes a suffix, and a
monotonic sum becomes `_total`. The same metric therefore arrives as
`http_server_request_duration_seconds`. Two details catch people out:
resource attributes are not turned into labels unless
`resource_to_telemetry_conversion` is switched on, and the unit suffix
is only added if `add_metric_suffixes` is left enabled.

The other difference is type. Prometheus labels are strings; OpenTelemetry
attributes are typed, and the semantic conventions say what the type
means. A conversion that turns a boolean attribute into the string
`true` loses nothing today and will lose the type tomorrow.

## Push and pull

Prometheus pulls. OpenTelemetry pushes, over OTLP, to the Collector.
The Collector is the piece that reconciles the two. Prometheus
**remote write** is the interesting path, because it carries exemplars:
the SDK sends OTLP, the Collector forwards it with remote write, and a
Prometheus-compatible store such as Mimir or VictoriaMetrics takes it
directly.

The usual shapes are:

- OTel SDK to OTLP to the Collector, whose Prometheus exporter serves
  the data for Prometheus to scrape.
- Prometheus to the Collector's Prometheus receiver, which scrapes it
  and forwards it as OTLP to a storage backend.
- OTel SDK to the Collector to Prometheus remote write, straight into a
  Prometheus-compatible store.

The classic scrape path drops exemplars, so an OTel-instrumented
histogram whose exemplars matter needs either remote write or a trace
backend that speaks the exemplar API.

## Histograms

An OpenTelemetry explicit-bucket histogram maps onto a Prometheus
classic histogram: one `_bucket` series per boundary, plus `_sum` and
`_count`. An **exponential histogram** maps onto a Prometheus **native
histogram**, a single series that encodes the whole distribution.

Native histograms keep more information, so they estimate quantiles
better and can be re-bucketed cheaply at query time. The cost is
compatibility: some backends and some dashboards do not support them,
and the conversion from the OpenTelemetry exponential histogram is not
lossless in every detail — the scales and the zero-threshold handling
differ between the two models.

## What only Prometheus gives you

PromQL, alerting rules, **recording rules** that precompute expensive
queries under a new name, service discovery, the TSDB with its
compaction, and an ecosystem that every dashboard tool already speaks.
OpenTelemetry gives you none of that, and does not try to.

## The usual setup

Instrument with the OpenTelemetry SDK, send OTLP to the Collector, and
let the Collector expose Prometheus metrics. Keep exemplars flowing
through remote write where the backend supports them, and use the
spanmetrics connector to get request rate, error rate, and latency
histograms derived from the traces themselves.

The failure mode to avoid is instrumenting twice — once with the
Prometheus client library and once with OpenTelemetry. You then have two
series for the same measurement under two different names, two
dashboards to keep in sync, and no way to tell which one an alert was
built on. Pick one source of truth per metric.
