# CloudWatch Omni

**CloudWatch Omni** is an AI-powered observability experience inside
Amazon CloudWatch, for applications and AI agents together. It is built
on OpenTelemetry, so telemetry you already send to CloudWatch shows up
in Omni with nothing to reconfigure, and it reaches you as a standalone
web experience or as an IDE extension.

> Omni is an interface and a set of workflows on top of CloudWatch, not
> a replacement: your metrics, logs, alarms, dashboards, and APIs keep
> working exactly as they are.

## Domain, space, and dataset

Three concepts decide where telemetry lives and who can reach it. A
**domain** is your organization's entry point — the identity and access
boundary, with your sign-in URL in the form
`https://<domain-name>.cloudwatch-omni.global.app.aws`. A **space** is
where you actually work: it maps to one account and one Region, and
that boundary is what separates spaces rather than a filter applied at
query time. A **CloudWatch Dataset** is how Omni brings the telemetry
together — it makes logs, metrics, and traces queryable and correlated
across signals. You keep managing ingestion and storage through the
existing CloudWatch resources, such as log groups.

## Two setup paths

A single account creates an account domain and a space in one console
session. An AWS Organization creates an **organization domain** once
from the management account, and every member account then creates its
own space inside it — one sign-in URL and one identity provider
configuration for the whole organization. That path needs **trusted
access** between AWS Organizations and CloudWatch. If you sign in with
IAM Identity Center, its instance must be in the same Region as the
domain.

Creating a space enables the capabilities that make Omni work: the
**Dataset integration** forwards your logs and traces into the space's
dataset, OTel metrics enrichment makes AWS metrics queryable with
PromQL, and OTel span ingestion lets Omni receive traces. On first
enablement the space backfills up to seven days of existing logs and
traces.

## Sending telemetry

Telemetry reaches Omni through CloudWatch **OTLP endpoints**, signed
with SigV4. The traces endpoint accepts SigV4 only; the metrics and
logs endpoints also accept a bearer token for the cases where
short-lived credentials are not possible. The CloudWatch agent is the
recommended collection path, an upstream OpenTelemetry collector can
point its exporters at the same endpoints, and AI agents export their
traces directly from the ADOT SDK with no collector at all. One
prerequisite catches people out: enable **Transaction Search** in the
Region first, or no spans arrive.

## The Omni agent and the application map

The **Omni agent** answers questions in plain language from your own
telemetry. It writes the query for you — SQL for logs and traces,
PromQL for metrics — and shows the exact query it ran, so you can check
it, refine it, or run it yourself in Explore. Without any manual
configuration Omni discovers your services and their dependencies from
the telemetry and reports the RED metrics of each one: request rate,
errors, and duration.

## Omni alerts

**Omni alerts** are separate from CloudWatch alarms, and both keep
running. An alert wraps a query, a threshold, and an evaluation
schedule. A threshold can compare a named field from each returned row
or the number of rows returned, and an alert carries a warning
threshold, a critical threshold, or both. The states are OK, WARNING,
CRITICAL, and NODATA. When a query returns one row per service, each
series is a **contributor** with its own state, and the alert's state
reflects its worst contributors — one alert covers a whole fleet.
Notifications route by state to a Slack channel or an SNS topic.

## AI agents and evaluations

For AI agents, Omni scores responses with **evaluators** — continuously
in production and on demand against a dataset. This catches the
failures an error rate cannot see: an agent can return a well-formed
response that is wrong. The scores appear next to latency, errors, and
token usage on the same trace, and you can bring your own evaluators,
including custom criteria scored by a judge model. Agents built on
LangGraph, CrewAI, the OpenAI Agents SDK, the Vercel AI SDK, or Strands
are supported, and an IDE extension for VS Code, Cursor, and Kiro
covers the development-time loop.

## Investigations with the DevOps Agent

Root cause analysis is delegated to the **AWS DevOps Agent**. You start
an investigation yourself — from a firing alert, from the Omni agent, or
with `/investigation new` — and it runs with the permissions of its own
agent space, not yours. It reads CloudWatch Logs log groups directly
rather than through the dataset, so Omni data scopes do not filter its
results; only a Space Admin can connect that integration.

## What it costs

Omni charges on three dimensions: ingestion per gigabyte, storage per
gigabyte-month, and analysis — per gigabyte scanned for logs and traces
and per million samples for PromQL queries. Dashboards and alerts are
included within service quotas, and you can scan up to five times your
monthly eligible log and span ingestion at no cost. Existing CloudWatch
rates for ingest and store still apply, and there is a $1,000 credit
trial for 30 days.
