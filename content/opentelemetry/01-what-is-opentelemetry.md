# What OpenTelemetry is

OpenTelemetry is an open-source project for producing telemetry —
traces, metrics, and logs — without tying your application to one
vendor. It is a **CNCF** project, and it is now the default answer to
"how do I get data out of my application without committing to a
vendor?".

The pitch is **vendor-neutral**. Before it, a tracing library belonged
to a company, and its data model, its configuration, and its export
format were that company's. Swapping vendors meant rewriting
instrumentation. OpenTelemetry splits the problem in two: a
specification and a set of libraries for *producing* telemetry, and a
**Collector** for *transporting* it.

## The signals

OpenTelemetry covers three **signals** — traces, metrics, and logs —
and each one describes a different kind of fact about the system. A
trace is the record of a single request as it moves through the
services it touches. A metric is a number aggregated over time, such
as a counter of requests or a histogram of latencies. A log is a
timestamped event with arbitrary context attached.

The three are complements. Metrics tell you *that* a service is
degrading, traces tell you *where* the time went, logs tell you *why*.
The rest of this topic is mostly about how to query the three
together instead of staring at three separate dashboards.

## Three parts, one contract

Every language has the same three parts. The **API** is the surface
your code calls: `tracer.startSpan`, `meter.createCounter`,
`logger.emit`. The **SDK** is the implementation behind that API — it
creates spans, aggregates metrics, batches data, and applies sampling.
The **Collector** is a standalone process that receives telemetry from
many sources, processes it, and exports it to backends.

The API is what your application links against, the SDK is what it
runs with, and the Collector is what it ships to. The wire format
between them is **OTLP**, the OpenTelemetry Protocol: protobuf over
gRPC or HTTP. A backend that speaks OTLP needs no agent of its own;
one that does not gets an OTLP exporter in the Collector.

## Distros and automatic instrumentation

Nobody wants to hand-instrument every service in a large fleet. Two
shortcuts exist. A **distro** is a preconfigured bundle of the API, the
SDK, the Collector configuration, and a set of exporters, shipped as
one package so that a service gets usable telemetry by changing its
start command. **Auto-instrumentation** goes further: a library or an
eBPF probe attaches to the runtime and the framework and produces spans
and metrics without a line of application code.

Both are a starting point, not the finish. Auto-instrumented spans are
named after the framework call rather than after your business
operation, and they rarely carry the attributes that make a trace
worth reading.

## What OpenTelemetry is not

OpenTelemetry is not a storage system, not a dashboard, and not a
query engine. It does not decide how long to keep a trace, it does not
draw a graph, and it does not parse PromQL. Backends do all of that.

It is also not a single program. The Collector, the language SDKs, the
protocol, and the **semantic conventions** are separate deliverables
with separate release cycles, and a version of one says little about
another.

## Maturity

The specification is stable for traces, metrics, and logs. The semantic
conventions are the moving part: an attribute moves from development
to experimental to stable over time, and a rename in one library will
not necessarily arrive in another on the same day. Check the level
before you build a dashboard on top of an attribute.
