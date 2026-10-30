# Escape hatches and level 1 resources

Sometimes a level 2 construct does not expose what CloudFormation can do.
There are two ways to reach further: use the level 1 construct directly, or
use an **escape hatch** to patch the generated template.

## When the level 2 falls short

Level 2 constructs cover the common cases and improve over time, but they
lag behind CloudFormation — new service features appear in the template
first and in the library later. When that happens there are three options,
in increasing order of how much they cost you later.

## Using a level 1 construct

A **level 1 construct** maps one-to-one onto a CloudFormation resource type.
Its props are the raw template properties, nested exactly as CloudFormation
expects them:

```ts
const bucket = new s3.CfnBucket(this, 'Bucket', {
  bucketEncryption: {
    serverSideEncryptionConfiguration: [
      { serverSideEncryptionByDefault: { sseAlgorithm: 'AES256' } },
    ],
  },
})
```

Nothing is hidden: one construct, one resource, the properties you see are
the properties in the template. The cost is that you lose the defaults, the
`grant*` methods, and the props validation.

## Reaching the level 1 child

A level 2 construct creates its level 1 children underneath itself. The
usual one is called `Resource` and is reachable through the **default
child**:

```ts
const cfnBucket = bucket.node.defaultChild as s3.CfnBucket
cfnBucket.addOverride('Properties.VersioningConfiguration.Status', 'Enabled')
```

`addOverride` takes a path inside the raw resource, `Properties.` included.
`addPropertyOverride` takes the path within the properties only. Both write
on top of whatever the level 2 construct already produced, so the override
and the construct can disagree — the override wins.

## Other level 1 knobs

`cfnOptions` is where the level 1 metadata lives: a `condition` that gates
the resource, a `description`, `metadata`, and `logicalId` for pinning the
identifier.

`node.tryFindChild('Resource')` finds a child by id when the default child
is not the one you want, and `node.findChild` throws instead of returning
undefined.

## The cost

An escape hatch is invisible to the level 2 API. The library cannot
validate it, cannot upgrade it, and cannot tell you later that the property
you patched has been renamed. It also survives upgrades in the worst way:
the patch keeps applying to a property that no longer exists, and the
failure surfaces as a template error at deploy time.

Use it for a single property the level 2 does not expose, reach for a level
1 construct when you want the whole resource, and keep both to a minimum —
every escape hatch is a piece of infrastructure that has to be understood
twice.
