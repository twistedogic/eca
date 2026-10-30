# Lambda and APIs

Serverless is where the CDK pays off fastest, because a function, its
permissions, its environment, and its event sources are all one object
graph instead of four separate files.

## A function

```ts
const fn = new lambda.Function(this, 'Handler', {
  runtime: lambda.Runtime.NODEJS_20_X,
  handler: 'index.handler',
  code: lambda.Code.fromAsset('src'),
  timeout: cdk.Duration.seconds(30),
  memorySize: 256,
  environment: { TABLE: table.tableName },
})
```

The environment value is a token, so the template says "the name of the
table created in this stack" rather than a literal. The same is true of
`fn.functionArn`, `fn.role`, and every other attribute the construct
exposes.

The timeout and memory size are not free knobs: memory is billed, and the
timeout is the ceiling on how long one invocation can hold a concurrency
slot.

## Bundling

`Code.fromAsset` uploads the folder as it is. That works for a plain
script, but Node projects usually want a single file with dependencies
resolved.

**NodejsFunction** from `aws-cdk-lib/aws-lambda-nodejs` bundles with esbuild
during synthesis, producing one file and a much faster cold start. It needs
esbuild installed as a dev dependency, and it should not bundle the AWS SDK,
because the Lambda runtime already provides it:

```ts
const fn = new lambda_nodejs.NodejsFunction(this, 'Handler', {
  entry: 'src/handler.ts',
  runtime: lambda.Runtime.NODEJS_20_X,
})
```

## Event sources

`aws-cdk-lib/aws-lambda-event-sources` connects a function to a queue,
stream, or schedule, and creates the **event source mapping** that makes the
connection real:

```ts
fn.addEventSource(new SqsEventSource(queue, { batchSize: 10 }))
```

For SQS, enabling `reportBatchItemFailures` lets the function report which
items in a batch failed, so only those items return to the queue. Without
it, one failed item means the whole batch is retried.

## HTTP APIs

REST APIs are served by `aws-apigateway`: a `RestApi` resource with
methods, each backed by a `LambdaIntegration`.

HTTP APIs are served by `aws-apigatewayv2`, which is cheaper and simpler
and, at the time of writing, still an alpha package. A `HttpApi` with a
`HttpLambdaIntegration` is a handful of lines.

For something smaller still, `fn.addFunctionUrl()` gives a function an
HTTPS endpoint with no gateway in front of it — no API keys, no throttling
controls, no custom domains.

## Delivering content

CloudFront sits in front of a bucket or an API. The modern way to give it
access to a private bucket is an **origin access control**, which is the
policy CloudFront signs requests with; the older origin access identity is
still supported but is on the way out.
