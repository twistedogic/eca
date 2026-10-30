# CloudWatch metrics

A **metric** in CloudWatch is a named value published at a point in
time. The **namespace** is where it is published — `AWS/EC2`,
`AWS/RDS`, `AWS/Lambda`, `AWS/ApplicationELB` — and your code publishes
**custom metrics** into `Custom` or a namespace of your own.

## Dimensions and time series

A **dimension** is a name-value pair that identifies one time series
inside a namespace. `InstanceId` is a dimension for EC2, `FunctionName`
for Lambda, `DBInstanceIdentifier` for RDS. The combination of metric
name and dimension set is unique: publishing `CPUUtilization` with
`InstanceId=i-1` and `InstanceId=i-2` produces two separate series, not
one averaged series. That is the most important thing to internalise,
because it is also the most expensive mistake — every extra dimension
value multiplies the number of series you pay for.

> Each combination of metric name and dimension values is its own time
> series, so a **dimension** is what turns one metric into many.

## Standard metrics and custom metrics

**Standard metrics** are the ones AWS publishes for its services, and
they are free. **Custom metrics** are yours, and they are charged per
metric published, which is why the standardisation rules matter. A
custom metric published with a `UserId` dimension is charged per user:
ten thousand users means ten thousand series, every minute, forever.

## Resolution and statistics

**Resolution** is how often a datapoint is recorded. AWS service
metrics arrive once a minute by default; the **detailed monitoring**
option raises EC2 metrics to one-second resolution for an extra charge.
**Statistics** are the aggregations CloudWatch keeps for each series:
Average, Sum, Minimum, Maximum, SampleCount, and percentiles such as
p50, p90, and p99. Averages hide tails; for latency the percentile is
the number that matters, and `Sum` and `Average` are the wrong tools.

> The **resolution** of a metric is how often its datapoints are
> recorded, and every additional **dimension** value multiplies the
> number of series you are billed for.

## Getting metrics out of your code

`PutMetricData` is the plain API, and it accepts up to a thousand
metrics per call. The **Embedded Metric Format** is the smarter route:
a JSON log line carrying an `_aws` object is turned into a metric by the
CloudWatch agent, so the measurement travels with the log line instead
of costing a separate call. **Metric Streams** then push every metric to
Kinesis Data Firehose or Kinesis Data Streams, which is the way to get
metrics into a lakehouse without polling the API.

> The **Embedded Metric Format** turns a structured log line into a
> CloudWatch metric, so one call carries both the detail and the
> measurement.

## Querying and the cost of cardinality

**Metrics Insights** is a query engine over metric data — you ask for
`SELECT AVG(CPUUtilization) ... GROUP BY InstanceId` instead of writing
one `GetMetricData` call per series. That is how you keep a dashboard
from becoming a thousand API calls.

The cost ceiling is cardinality, and the fix is aggregation: emit one
metric with the dimensions you will actually group by, and put the rest
in logs. If a metric needs a dimension you will never group by, it is a
log line, not a metric.
