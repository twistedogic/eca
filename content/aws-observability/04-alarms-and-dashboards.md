# Alarms and dashboards

A **metric** is a number that measures something. An **alarm** is a rule
about that number. A **dashboard** is a picture of several of them.

## The anatomy of an alarm

An alarm is built from a **metric math expression**. That expression is
compared against a **threshold** with a **comparison operator**. The
alarm is evaluated over **evaluation periods**, and it needs
**datapoints to alarm** — how many of those periods must breach before
the alarm fires. An alarm has three
states: OK, ALARM, and INSUFFICIENT_DATA when there is not enough data
to decide. The **treat missing data** setting decides what happens
then, and the default of treating missing data as breaching turns a
broken telemetry pipeline into a false page, which is why the setting
deserves a decision instead of a default.

> An **alarm** needs an **evaluation period** count and a **datapoints
> to alarm** count, and the second is what stops one spike from waking
> somebody.

## Symptom alarms, not cause alarms

The best-practice split: **symptom alarms** watch what the customer
feels — error rate, latency, availability — and **cause alarms** watch
a component that might explain it: CPU, queue depth, disk. Page on
symptoms. Cause alarms belong on a dashboard, or in a composite alarm
that only fires when the symptom is also present.

> A **symptom alarm** watches what the customer feels, so it is the
> **symptom** that pages, not the cause.

## Composite alarms

A **composite alarm** takes other alarms as input and fires on a
boolean expression over them. The classic use: one unhealthy load
balancer target is noise, but "any target unhealthy" for five minutes
is an incident. Composite alarms also give a service a single
notification target.

## Dashboards

A **dashboard** is a set of widgets on one page: graphs, numbers, text,
and log panels. Dashboards are for humans scanning state; alarms are
for machines reacting to state. The good practice is one dashboard per
service or per operational question ("is checkout healthy?"), not one
dashboard per team with everything on it.

## Wiring alarms to actions

An alarm's **action** can notify an SNS topic, reboot or stop an
instance, or invoke a Lambda function — and the Lambda function is
where the real automation goes: post to a chat channel, open a ticket,
or start a Systems Manager Automation runbook. Keep the alarm itself
dumb: detect, then delegate.

> An alarm action that invokes a **Lambda** function can start a
> Systems Manager Automation runbook, so the alarm only detects and the
> function does the work.
