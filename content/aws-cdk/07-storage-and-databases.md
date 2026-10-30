# Storage and databases

Two resources carry most application state: an object store and a table.
Both have level 2 constructs with opinionated defaults, and both have
destructive details worth understanding before you rely on them.

## Buckets

A CDK v2 bucket is created with S3-managed encryption, with all public
access blocked, and with TLS enforced. **Versioning** is not enabled unless
you ask for it.

```ts
const bucket = new s3.Bucket(this, 'Assets', {
  versioned: true,
  encryption: s3.BucketEncryption.KMS_MANAGED,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
})
```

The **removal policy** decides what happens to the bucket when the stack is
deleted. `RETAIN` leaves it, `DESTROY` deletes it, `SNAPSHOT` takes a
backup first. State constructs default to `RETAIN`, which is the safe
default and the reason a first `cdk destroy` often surprises nobody.

## Emptying a bucket

CloudFormation cannot delete a bucket that still holds objects, so a bucket
with `RemovalPolicy.DESTROY` fails to delete unless it is emptied first.
`autoDeleteObjects: true` solves it by adding a custom resource — a
Lambda-backed handler that empties the bucket during deletion.

That handler is a real Lambda with real permissions and a real running
cost, and it only works if the removal policy destroys the bucket. It is
also asynchronous: deletion takes minutes while the handler works through
the objects.

> `autoDeleteObjects` adds a **custom resource** that empties the bucket
> during stack deletion, at the cost of a Lambda and a slower delete.

## Tables

A DynamoDB table needs a partition key, and optionally a sort key:

```ts
const table = new dynamodb.Table(this, 'Items', {
  partitionKey: { name: 'accountId', type: dynamodb.AttributeType.STRING },
  sortKey: { name: 'itemId', type: dynamodb.AttributeType.STRING },
  billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
})
```

**On-demand billing** pays per request instead of per provisioned capacity,
which is the right default for unpredictable traffic and the wrong one for a
steady, high-volume workload where provisioned capacity is cheaper.

CDK v2 enables **point-in-time recovery** on tables by default, which is how
you restore a table to any second in the last 35 days.

## Secrets and parameters

A secret's value is stored encrypted and returned by CloudFormation as a
dynamic reference, which means it never appears in the template and never
appears in plain text in the console output of the deploy.

```ts
const secret = new secretsmanager.Secret(this, 'DbPassword')
fn.addEnvironment('DB_PASSWORD', secret.secretValue)
```

`secret.grantRead(role)` writes the policy that lets the function fetch it
at runtime. `Secret.fromSecretName` attaches to a secret that already
exists, without managing it.

SSM parameters are the cheaper cousin: `StringParameter` for values you
manage, and `StringParameter.valueForStringParameter` for a parameter that
already exists and is read at deploy time.
