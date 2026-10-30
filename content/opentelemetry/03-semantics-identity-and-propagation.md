# Semantics, identity, and propagation

Telemetry is only useful if everyone agrees what the fields mean.
OpenTelemetry settles that in two places: **semantic conventions** for
the names and shapes of attributes, and **W3C Trace Context** for how a
trace ID crosses a process boundary.

## Semantic conventions

A **semantic convention** is an agreed name, type, unit, and meaning
for an attribute. `http.request.method`, `http.response.status_code`,
`db.system.name`, `messaging.system` — the name is chosen so that a
query written against one language works against another.

Conventions have a maturity level: development means "we are still
arguing", experimental means "usable but may change", and stable means
"we will not break it". Reading the level is part of using a
convention correctly, because an experimental attribute can be renamed
out from under your dashboard.

## Resource attributes versus span attributes

A **resource attribute** describes the process — the service, the
version, the cluster. It is constant for the lifetime of the process
and is set on the provider, not on individual spans. A **span attribute**
describes one operation and is set on the span.

The rule of thumb: if the value is the same for every request the
process serves, it is a resource attribute; if it varies per request,
it is a span attribute. Choosing correctly is what keeps label
cardinality down, because a per-request value on the resource becomes a
new time series for every value it takes.

## Identity

**service.name** is the one attribute that must be right. It is the
primary key of the whole system: dashboards group by it, logs are
labelled by it, traces are attributed to it, and exemplars point back
at it. Set it explicitly from configuration — never let it default to
the process name, or the same service will appear under several names.

The rest of the identity attributes build on it: `service.version` and
`service.namespace` group a service's versions, and
`deployment.environment.name` separates production from staging.

## W3C Trace Context

**W3C Trace Context** is the propagation format: a **traceparent** header
carrying the trace ID, the parent span ID, and the sampled flag, and an
optional **tracestate** header for vendor-specific data.

The format is fixed: `00-<32 hex trace id>-<16 hex span id>-<2 hex
flags>`. A service that receives it creates a child span with that
parent span ID, so the tree grows without any shared memory.
Propagating the header over HTTP, gRPC, Kafka, or a database column is
the only work required to join a distributed trace.

## Baggage and span links

**Baggage** is a set of key-value pairs propagated with the request for
values every service needs — a tenant ID, a feature flag, a session
token. It rides in the `baggage` header and is deliberately separate
from attributes: baggage is data you propagate, attributes are data you
record.

**Span links** point at spans that are not the parent: the work item
this message came from, the transaction this request belongs to. Links
keep causal relationships that a parent-child tree cannot express, such
as a batch job that fans out into many traces. They are carried inside
the trace itself, so they survive in backends that have no separate
link store.
