# The setup playbook

Everything above is a checklist once it has been reduced to steps. This
is the order that works: telemetry first, then storage rules, then
alarms, then notification routing, then the dashboards that go with the
alarms.

## Choose the shape of the account

The recommended topology is a dedicated **observability account** that
owns the log groups, the alarms, and the dashboards, with the workload
accounts feeding it. Metrics, logs, alarms, dashboards, and
cross-account observability can live in the central account while the
workload accounts keep their resources. Workloads then hold no read
access to the monitoring account, and the monitoring account has no
credentials into the workloads.

## Install the agents

On **EC2**, the CloudWatch agent is installed with the
`AWS-ConfigureCloudWatchAgent` Systems Manager document, driven by a
JSON configuration that names the log groups to ship to and the metrics
to collect. The same document can be attached to an instance at launch,
so a new instance is never unmonitored.

> Install the CloudWatch agent with the
> `AWS-ConfigureCloudWatchAgent` Systems Manager document, attached at
> launch, so no instance is ever running without telemetry.

On **Kubernetes**, the collector runs as a DaemonSet with a ConfigMap
holding the receivers, processors, and exporters. On **ECS**, the agent
runs as a sidecar in the task definition. On **Lambda**, nothing is
needed at all — the execution role already has permission to write logs
and metrics, and the platform publishes them for you.

## Write the storage rules first

Before a single alarm exists, decide the **retention** of every log
group, and set it in the template so it cannot be forgotten: hot logs
for a week, application logs for a month, audit logs for a year. Set the
**tagging** in the same template — team, service, environment — because
it is what makes the cost attributable later.

## Then the alarms, then the routing

Start with one customer-facing alarm per service: the error rate and
the latency percentile that the objective names. Wire it to an SNS topic
per severity, not per team, so the routing can change without touching
the alarms. Add a **composite alarm** per service that groups the
underlying alarms, so a single notification reaches the on-call.

## Put it in version control

CloudFormation or Terraform owns the log groups, the metric filters,
the alarms, the dashboards, and the SNS topics. Hand-edited alarms
drift, drift is invisible, and drift is how an alarm ends up pointing
at a decommissioned topic. A pipeline that deploys the observability
stack on the same commit as the service is the whole trick.

## Review it

Once a month, look at the bill and at what fired. The two numbers worth
watching are cost per service and pages per week per service; both
should be falling as the service matures.
