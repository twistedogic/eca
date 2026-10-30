# Querying across logs, traces, and metrics

The three signals answer different questions, and the most useful
**correlation** happens when you move between them: a graph says the error rate
doubled, a trace shows which service broke, and a log line explains
why. Doing that by hand means copying identifiers between tabs. Doing
it by query means knowing how the three signals are joined.

## Three ways to join

There are exactly three join mechanisms in practice, and they differ in
what they can and cannot find.

Joining by trace ID is exact and complete. One trace is one request
across every service that touched it, so the logs of that request and
the metrics of that service can be retrieved by ID. What it cannot do
is cover requests that were never sampled, or metrics that were
aggregated before you could look at them.

Joining by **identity** is a join on resource attributes plus a time
window: "the logs of `checkout` in the ten minutes around this spike".
It always works, because resource attributes are on every record, but
it is fuzzy — it returns everything the service did in that window,
including requests that had nothing to do with the incident.

Joining by **exemplar** is the precise version of the identity join. An
exemplar is a metric point that carries the trace ID of a request that
moved the number, so the path from a spike to the exact request is
already recorded in the data.

## The trace ID as join key

The **trace ID** is the spine of the whole thing. It is generated once, at
the root span, propagated by W3C Trace Context, and attached to every
log record and every span in the request.

To use it as a **join key**, three things have to be true. The trace ID
has to be present in the logs, which means the logging setup must
attach the active context — the logs bridge does this. The trace ID has
to be present in the metrics, which means exemplars. And the trace has
to have been sampled and stored, which is a sampling decision someone
made before you needed the answer.

> A trace ID in a log line is only a **join key** when the trace was
> sampled, the ID was propagated, and the backend indexes it.

## Exemplars end to end

An exemplar travels with a metric data point: the trace ID and span ID
of the request that produced the value, plus the attributes worth
keeping. The SDK samples exemplars — by default, at most one per metric
per collection interval — and the Collector passes them through.

In Prometheus an exemplar is attached to a histogram bucket and is
fetched through the exemplar API rather than through PromQL. Grafana
reads exemplars from the time series and turns each one into a link
into the trace.

The catch is that the exemplar points at a trace that must exist in the
trace backend, and the two backends are often different systems with
different retention. An exemplar whose trace has expired is a dead
link. The other catch is that exemplars attach to histogram buckets, so
a plain counter spike has no exemplar unless the metric is instrumented
as a histogram or the backend supports exemplars on sums.

## The investigation workflow

The flow these joins enable is worth writing down, because it is the
reason to care about cross-signal query at all.

1. A metric alert fires: the error rate for `checkout` is above budget.
2. You open the graph, see the spike, and look for exemplars on the
   histogram. One exemplar is the trace of a request that failed.
3. You open that trace: the failing request, its spans, the service
   that took three seconds.
4. You search the logs by trace ID — or follow the trace-to-logs link —
   and read the error the service actually logged.
5. You compare with the previous deploy: an identity join over
   `service.version` shows the new version is the only one failing.

Steps 2 and 4 are the cross-signal joins. Everything else is ordinary
tooling, but the whole flow takes seconds only when the joins are
already wired.

## Data links

A **data link** is the UI mechanism that automates the joins: a link on
a metric panel that opens a log query filtered by the labels and the
time range of the graph, and a link on a trace that opens the logs of
that service in that time window.

The difference between a data link and a query join is scope. A data
link carries labels and time; it does not carry the trace ID, so it
gives you the identity join, not the exact one. To get the exact
request, the trace ID has to be in the data — which is what exemplars,
and a trace-to-logs integration configured to search the trace ID tag,
are for.

## Where the joins break

Cross-signal queries fail in a small number of recognisable ways, and
each one has a fix.

Different pipelines. Metrics go to Prometheus, logs to Elasticsearch,
traces to Tempo, and none of them agree on the service name: one calls
it `checkout`, another `checkout-service`, another `checkout_v2`. The
join returns nothing. The fix is to set `service.name` once, from
configuration, and enforce it in the Collector.

**Clock skew**. A metric spike at 10:03 and a log line at 09:58 are
five minutes apart in the join, which is why a time-window join needs a
window wider than the clock skew and narrower than the incident.

Missing logs. The log pipeline dropped records under load, so the trace
points at a request whose logs were never written.

Unsampled traces. The exemplar points at a trace that was never
stored, because head sampling dropped it.

Cardinality. The identity join fans out to every series of that
service in that window, and a query over a million series is not a
query.
