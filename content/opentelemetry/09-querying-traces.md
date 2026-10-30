# Querying traces

A trace is the only signal that shows you the shape of a request. It is
also the smallest and the most expensive per byte, because it carries
the most context per record — and because only a sample of them is
kept.

## The span

A **span** is one operation: a name, a start and end time, a kind, a
**status**, attributes, events, and links. The **span kind** says what role
the span played: `server` for an inbound request, `client` for an
outbound call, `producer` and `consumer` for messaging, `internal` for
everything else. The kind is what lets a backend draw the call graph
correctly, and what a query filters on to find only the server-side
work.

A span's **duration** is its end time minus its start time. Duration is
the one number every trace query needs, because it is usually the thing
you are looking for: the slow request, the service that took too long,
the dependency that blew its budget.

A **span event** is a timestamped moment inside the span — a retry, a
cache miss, a state change — and events carry their own attributes.

## TraceQL

**TraceQL** is Tempo's query language, and it is the closest thing the
ecosystem has to a vendor-neutral trace query language.

```traceql
{ resource.service.name = "checkout" && span.http.response.status_code >= 500 }
{ duration > 1s && kind = server }
{ .name = "GET /cart" }
```

The braces hold the filter. Attributes are namespaced by where they
live: `resource.` for resource attributes, `span.` for span attributes,
`event.` for span events, and a bare `.name` for a trace intrinsic.

## Intrinsics

An **intrinsic** is a field the backend computes rather than stores:
the span's name, duration, status, and kind, plus the root span's name
and service. Intrinsics are what a query uses when it wants "a span"
rather than "a span with attribute x".

`status = error` is the usual first filter when hunting an incident,
and it works because the SDKs set the span status to error from the
exception that escaped the handler.

## Aggregations

TraceQL can aggregate, which is what turns a trace search into an
analysis:

```traceql
{ resource.service.name = "checkout" } | by (resource.service.name) | count() > 10
```

The pipeline after the braces counts matching spans, groups them by an
attribute, and filters the groups. `sum()`, `avg()`, `max()`, and
`min()` work the same way.

## Sampling and what you can count

**Sampling** decides which traces are kept, so a count of traces is a
proportion, not a total.
**Head sampling** in the SDK keeps every trace or a fraction of them;
tail sampling in the Collector keeps the interesting ones and drops the
rest.

This is why a trace backend is the wrong place to ask "how many requests
did we serve?" — that is a metrics question. Traces answer "what did
this request look like?", and metrics answer "how many were there?".

## Other trace backends

Jaeger, Elastic APM, Datadog, and Honeycomb each have their own filter
syntax over the same span data. The fields they expose are the same —
service, name, duration, status, attributes — and the join key is the
same. Only the query language and the UI differ.
