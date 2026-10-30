# Querying logs

Logs keep the detail that metrics throw away and traces sample away.
They are also the messiest signal to query, because the same fact can
be stored as a JSON object, a logfmt line, or an English sentence — and
each backend invented its own query language for that.

## The log data model

An OpenTelemetry log record has a body, a severity, a timestamp, and a
set of attributes, plus the trace and span IDs of the request it was
emitted in. In practice a backend sees one row per record, with the
resource attributes flattened alongside the record's own attributes.

The consequence is that a log query is always three things at once: a
label filter to pick the streams, a text filter to pick the lines, and
a parser to pull fields out of the line.

## LogQL

**LogQL** is Loki's query language, and it is the most widely used way
to query OpenTelemetry logs, because the Grafana stack is the common
destination.

A query has three optional parts: a **stream selector** that picks the
log streams, **line filters** that match the raw line, and parsers
that turn the line into fields.

```logql
{service_name="checkout"} |= "timeout" != "debug"
```

The stream selector picks every stream labelled `checkout`. The line
filter keeps lines containing "timeout" and drops lines containing
"debug". The line filters are `|=` for contains, `!=` for does not
contain, `|~` for regex match, and `!~` for regex does not match; they
run against the raw line before any parsing, which makes them fast and
blunt.

## Parsers and labels

A **parser** extracts structured fields from the line:

```logql
{service_name="checkout"} | json | status_code >= 500
{service_name="checkout"} | logfmt | duration_ms > 1000
{service_name="checkout"} | regexp "(?P<method>[A-Z]+) (?P<path>\S+)"
```

**logfmt** is the `key=value` format that structured Go logging
produces. `json` parses a JSON body. `regexp` extracts named groups,
and the `(?P<name>...)` syntax is what makes it useful.

After parsing you have fields, and fields can be filtered — but they
are not labels. To turn a field into a label, so that it can be
grouped and counted, use **label_format**:

```logql
{service_name="checkout"} | json | status_code >= 500 | label_format status=code
```

**line_format** rewrites the line itself with a Go template, which is
how a JSON body becomes something a human wants to read.

## Time and volume

Log queries are expensive because they scan text. Two controls keep
them honest. The **offset** modifier walks backwards in time from now,
which is what you want in an incident: `|= "error" offset -1h`. And
every query should be bounded by a time range in the UI, because the
cost of a log query is proportional to how much it read.

## Other backends

The same log data reaches other places with different syntax.
Elasticsearch and OpenSearch index the OpenTelemetry fields under their
dotted names, so the trace ID is `trace.id` and the service is
`service.name`; **ES|QL** reads `FROM logs-* | WHERE trace.id == "..."`,
while the older query DSL uses `trace.id: "..."`. Splunk uses **SPL**,
where the same question is `index=app_logs trace_id=...`. CloudWatch
Logs Insights uses a small SQL-like form:
`fields @timestamp, message | filter trace_id = "..."`.

The data model is the same everywhere. Only the query language changes,
which is why knowing the field names matters more than knowing any one
query language.
