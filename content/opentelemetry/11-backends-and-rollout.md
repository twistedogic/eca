# Backends, cost, and a rollout plan

OpenTelemetry defines the data, not the storage. Choosing where the data
lives is choosing a query language, a retention policy, and a bill — so
it helps to know what each family of backends is actually good at.

## The Grafana stack

**Loki** stores logs and queries them with LogQL. **Tempo** stores
traces and queries them with TraceQL. **Prometheus** and **Mimir**
store metrics and query them with PromQL. **Grafana** sits on top and
is where the cross-signal links live: data links from a metric panel to
a log query, from a trace to its logs, and exemplars from a graph into
a trace.

The stack is open source and is the most common destination for
OpenTelemetry data. Its weakness is that the joins are configured in
the UI rather than in the query, so they are convenient rather than
precise.

## Search-based and columnar backends

**Elasticsearch** and **OpenSearch** index all three signals in one
index family, which means a single query language over logs, metrics,
and traces — and the trace ID is a field like any other. **ClickHouse**
does the same with columns instead of an inverted index, and is the
basis of several cost-efficient OpenTelemetry backends.

These are the backends to choose when the question is "show me
everything about this request" rather than "show me this service's
latency distribution".

## Vendor platforms

Datadog, New Relic, Dynatrace, Splunk, and Honeycomb all accept OTLP,
and all correlate their own signals internally: the log line carries
the trace ID, the trace carries the metrics, and the UI links them. The
cost is that the correlation, the query language, and the price are the
vendor's.

**Honeycomb** is the exception worth naming, because it was built
around OpenTelemetry. Traces, logs, and metrics share one query model
with the trace ID as a first-class field.

## Cost

Cost is a cardinality problem wearing a hat. The price of a metric
backend is roughly the number of distinct label combinations times the
retention window. The price of a log backend is bytes ingested times
retention. The price of a trace backend is spans stored times retention.

So the three levers are: keep cardinality down, sample traces
aggressively, and set **retention** per signal according to what people
actually query. A trace kept for a month that is never queried is money
spent on the chance that someone might need it.

## A rollout that works

1. Turn on the Collector with OTLP in and OTLP out, and instrument one
   service. Do not start with a fleet-wide rollout.
2. Pick the semantic conventions you will commit to — service name,
   HTTP attributes, database attributes — and write them down. Renaming
   them later costs a migration.
3. Set `service.name` from configuration everywhere, and make it
   impossible to leave it as the default.
4. Add the spanmetrics connector so the trace backend can answer metric
   questions, and so exemplars have somewhere to point.
5. Wire the logs bridge so that logs carry the trace ID, then check it
   by searching for a trace ID you already know.
6. Add the data links — metric to log, metric to trace, trace to log —
   and click them once, from a graph, in a real incident.
7. Only then roll out to the fleet, with the sampling policy decided
   before the volume arrives.
