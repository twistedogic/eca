# Instrumenting an application

Instrumentation is where the model becomes code. The API is small —
start a span, make a counter, emit a log — and the real work is in
deciding what to name, what to attribute, and how to keep the logs you
already write linked to the trace you just started.

## Manual instrumentation

Manual instrumentation means calling the API yourself. You get full
control over span names and attributes, and you can put a span around
the operation that matters rather than around whichever function
happens to be slow.

The shape is always the same: get a **tracer** from the global
provider, start a span, do the work inside it, end it. Ending the span
in a `finally` block matters, because a span that is never ended never
appears in the trace and the parent stays open until the process
exits.

## Auto-instrumentation

**Auto-instrumentation** attaches to the runtime and the framework and
emits spans for you: an incoming HTTP request becomes a server span, an
outgoing HTTP call becomes a client span, a database query becomes a
client span with the statement in an attribute.

It is the fastest way to get traces and the standard starting point,
because the spans it produces are consistent across every service in
the fleet. Its limits are equally consistent: span names come from the
framework, the spans are shallow, and the attributes that make them
useful — the customer ID, the order ID, the business operation — are
not there.

## The three providers

The SDK exposes three entry points, one per signal. The
**TracerProvider** hands out tracers, which create spans. The
**MeterProvider** hands out meters, which create counters, gauges, and
histograms. The **LoggerProvider** hands out loggers, which emit log
records.

Each provider also owns the **exporter** that ships the data and the
**sampler** that decides which traces to keep. Configure both once at
startup: replacing a provider after startup usually leaves part of the
process uninstrumented, and the exporter you swapped out may already
have flushed the data it had.

## Correlating logs with traces

The most valuable **correlation** in an OpenTelemetry setup is between a log
line and the request that produced it. The mechanism is simple: the log
record carries the trace ID and span ID of the active span, and the
backend indexes them.

To get there from an existing logging setup, use a **logs bridge**: an
adapter that takes the records your logger already produces and copies
them into the OpenTelemetry logs API with the current context attached.
The bridge is deliberately non-blocking — logging must not fail when
the telemetry pipeline is down, and it must not make the pipeline the
critical path of a request.

The alternative is to put the IDs in the message yourself by fetching
the active context and formatting it into the line. It works with any
log backend, but it depends on every log call site remembering to do
it, which is exactly what a bridge is for.

## Code attributes

**Code attributes** describe the source location of the telemetry:
file, line number, and function name. The Collector can attach them
automatically from source information, which turns a span name into a
pointer back to the code that produced it.

They are the cheapest possible upgrade to an existing instrumentation:
the spans do not change, but every one of them now points at the exact
line that emitted it.
