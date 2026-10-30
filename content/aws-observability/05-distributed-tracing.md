# Distributed tracing with X-Ray

A **trace** is the record of one request as it moves between services.
A **segment** is the trace's entry in one service. A **subsegment** is a
piece of work inside it — a database query, a call to another service,
a job on a queue.

## The service map

The **service map** is the picture the traces draw: nodes are services,
edges are calls, and each edge is coloured and sized by latency, faults,
and throttling. It is the fastest way to see that one downstream
dependency is slow, and it is built from the traces themselves, so it
only shows what is instrumented.

> A **segment** is one service's view of a request, and a **subsegment**
> is a unit of work inside it, such as a database query.

## Getting traces into AWS

The **X-Ray SDK** instruments the code and produces segments; the
**X-Ray daemon** runs beside it on EC2, receives the segments over UDP,
and forwards them to the X-Ray service. On Kubernetes the **AWS Distro
for OpenTelemetry** collector does the same job with the OpenTelemetry
SDKs, which is the direction AWS is pushing: the **OpenTelemetry**
standard means the same instrumentation also works against another
backend.

> The **X-Ray daemon** receives segments from the SDK and forwards them
> to the X-Ray service, so the SDK never talks to the internet.

## Sampling

Traces are sampled, because storing every request is not affordable.
**Fixed rate sampling** decides at the start of the request: the SDK
asks the daemon, the daemon applies the rules, and a percentage of
requests is kept. The rules can target specific services and URLs, so
errors and slow paths can be sampled more aggressively than ordinary
traffic — that is the knob that makes sampling useful rather than
merely cheap.

> **Fixed rate sampling** decides at the start of the request, before it
> knows whether that request will be interesting.

## What to put in a trace

**Annotations** are indexed key-value pairs attached to a segment: user
id, tenant, build version. They are searchable, so they belong on the
fields you will actually filter by. **Metadata** is free-form context
that is not indexed. The best practice is to annotate with the few
fields you will query — customer, version, endpoint — and leave
everything else in the logs, where it is cheaper to keep.
