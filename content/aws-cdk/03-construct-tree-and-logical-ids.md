# The construct tree and logical IDs

Every resource in a CDK app is a **construct**, and every construct knows
where it sits in the tree. That position is what names the resource in the
generated template.

## Scopes and the node

A construct has a **scope** — its parent — and an id that is unique among
its siblings. Together they form the construct's **path**, which the node
exposes:

```ts
const bucket = new Bucket(stack, 'Assets')
bucket.node.path        // 'MyStack/Assets' when the stack is directly under the app
bucket.node.scope       // the stack
bucket.node.id          // 'Assets'
```

The path is the human-readable address of the construct. It is also the
input to the identifier CloudFormation will know the resource by.

## Logical IDs

A CloudFormation template names each resource with a **logical ID**, which
must be unique within the template. The CDK derives it from the construct
path and appends a hash of that path, so `MyStack/Assets` becomes
`AssetsF68F3FF0`.

The hash suffix is what makes the identifier stable while the path stays
stable, and it changes as soon as the path changes. Renaming `Assets` to
`Uploads` changes the logical ID, and CloudFormation treats that as one
resource being replaced by another.

When a logical ID must not move — after a refactor that changes the path,
for example — an L2 construct accepts an explicit `logicalId` override, and
an L1 construct accepts one through `cfnOptions`.

## Levels of abstraction

CDK resources come in three levels, and knowing which one you are looking at
explains most API shapes.

A **level 1** construct is the `Cfn` class that mirrors a single
CloudFormation resource type exactly, such as `CfnBucket`. Its properties
are the raw template properties, and it creates exactly one resource.

A **level 2** construct is the friendly version, such as `Bucket` or
`Table`. It creates one or more level 1 resources, fills in sensible
defaults, and exposes `grant*` methods that write the IAM policies for you.

A **level 3** construct is a pattern that assembles many level 2 constructs
into one thing, such as an ECS service with a load balancer in front of it.

> A level 2 construct such as `Bucket` is a **facade**: it creates level 1
> resources underneath and adds behaviour on top.

## Composing your own

The real unit of reuse is your own construct. A class extending `Construct`
takes props, creates child constructs, and exposes them as properties:

```ts
interface QueueProps {
  readonly visibilityTimeout: Duration
}

export class Queue extends Construct {
  readonly queue: sqs.Queue
  constructor(scope: Construct, id: string, props: QueueProps) {
    super(scope, id)
    this.queue = new sqs.Queue(this, 'Default', {
      visibilityTimeout: props.visibilityTimeout,
    })
  }
}
```

Composing constructs — rather than reaching for a giant stack class — is
what keeps a large app readable.
