# CloudTrail and the audit trail

**CloudTrail** records the API calls made against AWS services: who
called what, when, from where, and what the response was. It is the
signal that answers "who did this?" and "did this happen?", and it is
not a substitute for CloudWatch metrics.

## Three kinds of events

**Management events** cover control-plane calls — creating a bucket,
attaching a security group, changing a role. They are recorded by
default and delivered to every trail. **Data events** cover the calls
that touch data — `PutObject`, `InvokeFunction`, `GetItem` — and they
are *not* recorded by default: each resource type has to be enabled
explicitly, which is why so many audits discover that object-level
logging was never switched on.

> **Data events** are off by default and must be enabled per resource
> type, while **management events** are recorded by default.

## Trails and destinations

A **trail** is the configuration that says which events to record and
where to put them: an S3 bucket for the durable copy, CloudWatch Logs
for searching and alarming, and SNS for notifications. An
**organization trail** applies to every account in the organization,
which is the only way to get complete coverage; a per-account trail is
what you have before that exists.

## Integrity and immutability

CloudTrail writes **digest files** — signed checksums of the log files
— so tampering can be detected, and the S3 bucket can be locked with
**object lock** so the logs cannot be deleted, not even by the account
owner. That combination is what an auditor asks for.

## Querying the trail

**CloudTrail Insights** runs event-based analytics — API call rate, API
error rate, the principals using an IAM policy — without exporting
anything. **CloudTrail Lake** puts the events in a queryable store, so
"who changed this bucket's policy last quarter" becomes a SQL query
instead of a weekend of downloading S3 objects.
