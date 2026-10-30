# CloudWatch Logs

Logs answer the question metrics cannot: not "the error rate went up"
but "here is the request that failed, with the stack trace and the user
id attached".

## Log groups and log streams

A **log group** is the container that holds related log streams. The
**retention** policy on that group decides when its events are deleted.
A **log stream** is a sequence of events from one source — one container
instance, one Lambda execution environment, one file. Log group names
usually start with `/aws/<service>/<resource>`: the convention is what
makes permissions and cost attribution possible later.

## Retention

A log group either **expires** after a fixed number of days or keeps
events forever, and the default is to keep them forever. Forever is the
most expensive default in observability, because ingestion is billed per
gigabyte and nothing tells you to stop paying until the invoice arrives.
Set retention deliberately: hot logs for a week, application logs for a
month, audit logs for a year in a dedicated group.

> A **log group** holds **log streams** and carries the **retention**
> policy that decides when its events are deleted.

## Subscription filters

A **subscription filter** copies matching events to a destination:
Kinesis Data Firehose, a Lambda function, or OpenSearch. This is the
hook for shipping logs off CloudWatch — to a SIEM, to a data lake, or to
another account's log group. A subscription filter into a log group in
another account is the usual way to build **cross-account
observability**: workload accounts filter into a log group owned by the
monitoring account.

> A **subscription filter** copies matching log events to a destination,
> which is how logs reach a central account or a SIEM.

## Metric filters and Logs Insights

A **metric filter** turns log content into a metric, which is how a log
line becomes an alarmable number. Logs Insights is the query engine:
`fields @timestamp, ... | filter ... | stats ... by ...` over every log
in the group.

**Log anomaly detection** watches the patterns in the logs themselves
and raises an anomaly when a pattern changes, which catches new error
shapes that no metric was ever defined for.

## Keeping the bill sane

Ingestion is the cost, and it is charged before anything else happens:
every byte written into a log group is billed, whether or not anyone
ever queries it. So the savings come from writing less — keeping debug
level out of production, sampling successful requests — and from storing
less, with a short retention on hot logs and the infrequent access tier
for logs nobody queries but an auditor might still ask for.
