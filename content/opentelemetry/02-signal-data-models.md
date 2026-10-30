# The signal data models

Every OpenTelemetry signal shares the same envelope: a **resource** that
describes the process that produced the data, an **instrumentation
scope** that names the library or module that recorded it, and a
payload of typed records. The model is deliberately boring, because the
whole point is that a backend can store logs, metrics, and traces side
by side and answer questions about all three.

## One envelope for everything

A resource is the set of attributes describing the entity that produced
the telemetry: `service.name`, `service.version`,
`deployment.environment.name`, the Kubernetes pod, the cloud region.
Every data point produced by that process carries the resource with it.
It is the join key for anything that is not a request: the service, the
environment, the version.

The **instrumentation scope** identifies the library that emitted the
data — the SDK, a framework integration, a custom instrumentation. It
carries a name, a version, and optional attributes, and it lets a
backend answer "which library produced this?" without inspecting every
record.

Below the envelope sits the payload, and it differs per signal: spans
for traces, data points for metrics, log records for logs.

## Traces: spans and their relationships

A trace is a tree of **spans**. Each span has a **trace ID** shared by
every span in the trace and a **span ID** unique to that span. A span
records a name, a start and end time, a kind, an optional parent, a
status, attributes, and a list of events.

The IDs do different jobs. The trace ID identifies the whole request.
The span ID identifies one operation inside it. The **parent span ID**
points at the caller, and that is what turns a flat list of spans into a
tree. A span with no parent is a **root span**, and the root's name is
usually the operation the user asked for.

## Metrics: data points and temporality

A metric is a stream of data points, and the type of the metric decides
the shape of the point. A **gauge** holds one number that goes up and
down. A **histogram** holds a bucket distribution plus a count and a
sum, and it is the default choice for latency because a percentile
cannot be computed from an average.

Temporality is the other half of the model. A **cumulative** data point
counts since the start of time and only ever goes up; a **delta** data
point covers the interval since the previous point and resets. Backends
disagree about which they want — Prometheus wants cumulative, most
push-based systems want delta — so the Collector converts between them.

## Logs: records and severity

A **log record** is a timestamped piece of text with context: a body, a
severity, a set of attributes, and — when the log was emitted inside a
traced request — the trace ID and span ID of that request.

Severity is split in two. Severity text is the string the application
wrote, like `WARN`. The **severity number** is the number from the
log-severity table, from `TRACE` at 1 to `FATAL` at 21, and that number
is what makes severity filterable across languages.

Timestamps come in two flavours too. The event timestamp is when the
thing happened; the **observed timestamp** is when the backend received
the record. When the two disagree by more than a second or two, you are
looking at clock skew or at a batch that sat in a queue.

## Identifiers

The trace ID is 16 bytes — 32 hex characters — and the span ID is 8
bytes, 16 hex characters. The trace flags carry the sampled bit, which
is how a downstream service knows the trace is worth keeping.

That sampled bit matters for querying: a trace that was not sampled
still propagates context, but only a fraction of traces reach storage,
so a count over traces is a proportion and never a total.
