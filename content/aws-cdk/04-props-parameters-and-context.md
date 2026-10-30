# Props, parameters, and context

A level 2 construct takes a single optional **props** object. That object is
where everything configurable goes, and it is the seam where values enter
the construct from outside.

## The props pattern

Every level 2 construct has the same shape: a scope, an id, and an optional
props bag. Props are declared as an interface with `readonly` fields, and
the construct reads only what it needs.

```ts
interface BucketProps {
  readonly versioned?: boolean
  readonly lifecycleRules?: s3.LifecycleRule[]
}
```

The alternative — a dozen optional constructor arguments — makes every call
site a guessing game about which argument is which.

## CloudFormation parameters

A **CfnParameter** is a value that CloudFormation asks the operator for at
deploy time. It becomes an input in the template's `Parameters` section:

```ts
const size = new CfnParameter(this, 'Size', {
  type: 'String',
  allowedValues: ['small', 'large'],
  default: 'small',
})
```

Parameters are right when the value is a deployment-time decision, and
wrong when it changes the shape of the template, because a parameter can
only feed a property — it cannot add a resource.

## Context and lookups

**Context** is a bag of values that the app reads at synthesis time. It
lives under the `context` key in `cdk.json`, and the app reads it with
`app.node.tryGetContext('key')`.

Some context values are produced by **lookups**: the CDK calls AWS during
synthesis to find an AMI, the availability zones of a region, an existing
VPC, or a parameter in SSM. A lookup result is cached in `cdk.context.json`
so that later syntheses do not repeat the call — and so that the template
stays reproducible.

The cache is a trap: a stale cached value keeps being used until the cache
is refreshed or cleared. The lookup also needs credentials and permissions
at synthesis time, which is why a CI job that only synthesizes often needs
the lookup role that bootstrap created.

> Context lookups run during **synthesis**, so their result is baked into
> the template rather than resolved at deploy time.

## Tokens

Not every value is known when the program runs. A bucket name, a table name,
a function ARN — these are **tokens**: placeholders that CloudFormation
fills in later.

```ts
const fn = new lambda.Function(this, 'Fn', {
  environment: { TABLE: table.tableName },
})
```

`table.tableName` is a token, and it can be used as a string anywhere a
string is expected. It cannot be used in ordinary program logic, because
its value is unknown at that moment. `Token.isUnresolved(value)` tells you
whether you are holding a token, and `stack.resolve(value)` renders a value
that can be printed or asserted on.

The distinction matters most in tests: a token is not the string it will
become, so asserting `expect(table.tableName).toBe('MyTable')` fails while
asserting on the resolved template succeeds.
