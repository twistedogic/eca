# The OpenTelemetry Collector

The Collector is the piece that makes OpenTelemetry useful in
production. It is a standalone binary configured in YAML, built from
three kinds of component — receivers, processors, and exporters — wired
into pipelines, with a **connector** joining pipelines together.

## Receivers, processors, exporters

A **receiver** gets data in: OTLP over gRPC or HTTP, Prometheus
scrapes, files, Kafka, a cloud API. A **processor** transforms it:
batching, filtering, adding or removing attributes, converting metric
temporality, deciding which traces to keep. An **exporter** writes it
out: OTLP to another Collector or a backend, Prometheus, Loki,
Elasticsearch, a file, the console.

A **pipeline** names a path through those components:

```yaml
receivers:
  otlp:
    protocols:
      grpc:
      http:
processors:
  memory_limiter:
  batch:
exporters:
  otlp:
    endpoint: otel-backend:4317
service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [memory_limiter, batch]
      exporters: [otlp]
```

## Connectors

A **connector** is a component that both receives and exports, which
makes it a bridge between two pipelines. The one that pays for itself
immediately is **spanmetrics**, which turns spans into metrics:
request counts, error rates, and latency histograms labelled by
service, route, and status code.

A connector is the mechanism behind most cross-signal features. If a
backend can answer a metric question about traces, someone wrote a
connector that turns traces into metrics — and a query that joins
metrics back to traces is really joining two pipelines.

## Tail sampling

**Tail sampling** decides which traces to keep after seeing the whole
trace, at the Collector. The policies include keeping traces that were
slow, traces that contain an error, traces carrying a particular
attribute, and traces that match a probability.

The trade-off is delay: the Collector has to hold traces until it can
decide, which by default means ten seconds of buffering, and a trace
that arrives late can miss its window. It also only works where the
Collector sees the whole trace, so a per-node agent cannot do it — the
gateway has to.

## Transforming data

The transform processor rewrites data with **OTTL**, the OpenTelemetry
Transformation Language: a small expression language over the context,
the resource, the attributes, and the body. It renames attributes,
sets defaults, drops high-cardinality labels, and moves values between
the resource and the span.

Two processors deserve their own names: **memory limiter**, which
refuses data instead of letting the process run out of memory, and
**batch**, which groups records into fewer, larger requests. Every
production configuration has both, in that order.

## Where it runs

The Collector runs as an **agent** next to the workload — a DaemonSet
in Kubernetes — or as a **gateway** in the cluster, or both. Agents
collect locally and forward to the gateway; the gateway does the heavy
processing: sampling, enrichment, and routing to different backends by
tenant or environment.

A gateway-only deployment is simpler and is often enough. An
agent-only deployment breaks the moment two services need to end up in
the same trace.
