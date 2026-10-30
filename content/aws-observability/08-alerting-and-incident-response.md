# Alerting and incident response

Telemetry that nobody is paged about is a museum. The job of alerting
is to route a signal to a human who can act on it — and to route as
little as possible to as few people as possible.

## Route by severity

The best practice is a small set of severities with clear rules. A
**page** is for a customer-facing objective breach that needs a human
now. A **ticket** is for something that needs fixing today. Everything
else stays on the **dashboard**. Every page should correspond to a
symptom a customer would notice, and should carry a link to a runbook
and to the dashboard that shows the blast radius.

## Burn-rate alerts

A **burn** rate is how fast the error budget is being consumed. A budget
of 1% of requests over 30 days lasts exactly 30 days at a burn rate of
1, three days at a burn rate of 10, and seven hours at a burn rate of
100. Alerting on burn rate rather than on the raw error rate means the
alert fires when the budget is actually in danger, and it can be tuned
per severity.

> A **burn** rate is how fast the error budget is being consumed, and
> alerting on it catches both fast outages and slow leaks.

The practice is to alert on several burn rates at once — a fast one to
page and a slow one to ticket — so that paging noise is traded for a
smaller chance of missing a real outage.

## Delivery

**SNS** topics are the transport: an alarm publishes to a topic, and
each subscription delivers to a channel — email, a phone number, or a
webhook that posts to chat. **EventBridge** rules are the router for
everything richer: they match on an event pattern, transform it, and
fan it out to Lambda, SQS, Step Functions, or another bus. The routing
table belongs in code and in version control, not in a console where
nobody can review it.

## Automating the response

An alarm action that invokes a **Lambda** function can start a Systems
Manager Automation runbook: capture a snapshot, scale the fleet, fail
over, or open a ticket. The rule is that the automation must be
reversible and safe to run twice — a responder should be able to trigger
it again during the same incident.

> Incident automation must be **idempotent** and reversible, because
> the responder will run it twice.

## Keeping the pager honest

Review what fired last month. Every page that was not actionable is a
bug in the alarm, and the fix is deletion, not a longer evaluation
period. A team that keeps a firehose of pages stops reading them, and
the one real outage is the one that gets missed.
