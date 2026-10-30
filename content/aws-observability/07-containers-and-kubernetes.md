# Containers, Kubernetes, and Prometheus

Applications that run in containers emit metrics per pod, and a pod is
the least useful unit to alert on — it is replaced constantly. The best
practice is to instrument the **workload**, not the instance of it.

## Container Insights

**Container Insights** collects, aggregates, and summarises container
metrics and logs from ECS and EKS, and it runs the CloudWatch agent for
you on the cluster nodes. The **enhanced container insights** mode for
ECS on EC2 goes deeper — it collects per-task and per-container logs
from the agent's log file — at the cost of turning on ECS Exec.

## The collector as the instrument

The **AWS Distro for OpenTelemetry** collector is a single binary that
receives telemetry, processes it, and exports it. Its configuration is
three lists. **Receivers** take telemetry in — otlp, prometheus,
hostmetrics. **Processors** reshape it — batch, attributes, transform.
**Exporters** send it out — awsemf for CloudWatch, prometheusremotewrite
for a Prometheus backend, otlp for anything else. One collector per node,
configured in a ConfigMap, replaces per-language instrumentation for
the metrics you already scrape.

> The OpenTelemetry collector is configured with **receivers**,
> **processors**, and **exporters**: take telemetry in, reshape it, send
> it out.

## Prometheus in AWS

The CloudWatch agent can run in **Prometheus mode**, scraping
`/metrics` endpoints and writing the results as CloudWatch metrics,
which means an existing Prometheus setup can keep its configuration and
move its storage into CloudWatch. The alternative —
**Amazon Managed Service for Prometheus** — is a managed Prometheus
with the same PromQL, scale, and availability, and it is the better
answer for a cluster whose metrics need to be queried with PromQL over
long ranges.

> In **Prometheus** mode the CloudWatch agent scrapes `/metrics`
> endpoints and writes the results as CloudWatch metrics.

## Kubernetes specifics

`kube-state-metrics` exposes the state of the cluster's objects, and
`metrics-server` serves the resource usage the scheduler needs. Both
are the minimum for a cluster that anyone can operate, and both are
things to check before blaming the cluster for a latency spike.
