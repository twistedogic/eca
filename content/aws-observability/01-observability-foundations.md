# Observability foundations

Monitoring tells you whether a condition you already know about is
true. Observability is the ability to answer questions you did not
anticipate, using nothing but the signals a system emits about its own
internals. A system is observable when its output plus its telemetry is
enough to explain any behaviour it shows.

## Signals and golden signals

A **signal** is a data point describing how the system is behaving: a
number, an event, or the record of a request. Choosing signals is the
first decision in an observability setup, and it is much easier to get
right by starting from the questions you will actually be asked at 3am.

The **golden signals** are the four that explain most failures.
**Latency** is how long a request takes. **Traffic** is how much work
arrives. **Errors** is how much of that work fails. **Saturation** is
how close the service is to running out of capacity. A metric set that
maps onto those four is already better than a thousand dashboard
widgets that do not.

## The three pillars

The three **pillars** of observability are metrics, logs, and traces.
**Metrics** are numbers aggregated over time — cheap to store, cheap to
query, poor at explaining one request. **Logs** are discrete,
timestamped events with context — they keep the detail but cost money
per gigabyte ingested. **Traces** are the record of a single request
travelling through the services it touched — they show the shape of the
call graph but are sampled, so they never tell you the totals.

> **Metrics**, **logs**, and **traces** are the three pillars: an
> aggregated number, a timestamped event, and the record of one request.

They fail in different ways, which is why teams keep all three: a
metric tells you *that* something is wrong, a trace tells you *where*,
and a log tells you *why*.

## Where AWS puts the pillars

**CloudWatch** holds the metrics, logs, alarms, and dashboards.
**X-Ray** holds the traces and the service map. **CloudTrail** is a
fourth signal rather than a pillar: the audit record of API calls, which
answers "who changed this?" rather than "is this healthy?".
**Container Insights** adds container-level metrics and logs for ECS and
EKS. **CloudWatch Application Signals** adds an objective-based view for
applications instrumented with OpenTelemetry, turning objectives into
alarms that measure what the user feels.

## Objectives, indicators, and error budgets

An **objective** is a target the service commits to. The
**indicator** is the measured value that shows whether the target was
met. The **error budget** is the difference between the two — the amount
of failure you are allowed. When the budget is gone, shipping features
stops and reliability work starts. An objective without a budget is a
wish; an objective with a budget is a contract the team can be held to.

> The **error budget** is the amount of failure a service is allowed, and
> it is what turns an **objective** from a wish into a contract.

## Instrument from the outside in

The recommended order is: write down the user-facing objective, pick the
indicators that measure it, then instrument the internals needed to
explain a breach. Teams that start by instrumenting everything end up
paying for telemetry nobody queries and still cannot answer "is the
service healthy?" — because nothing was tied to the objective.
