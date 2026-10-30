# Testing constructs

A CDK app is a program, so it can be tested like one. The unit under test
is not the deployed infrastructure but the **template** the app synthesizes.

## The assertions module

`aws-cdk-lib/assertions` builds a **Template** from a stack and lets you
assert on it:

```ts
import { Template, Match } from 'aws-cdk-lib/assertions'

const template = Template.fromStack(stack)
template.hasResourceProperties('AWS::S3::Bucket', {
  BucketEncryption: {
    ServerSideEncryptionConfiguration: [
      { ServerSideEncryptionByDefault: { SSEAlgorithm: 'AES256' } },
    ],
  },
})
template.resourceCountIs('AWS::SQS::Queue', 1)
```

`hasResourceProperties` matches a subset of the properties; **Match** covers
the rest — `Match.objectLike`, `Match.anyValue`, `Match.absent()` for
properties that must not be there, and `Match.stringLikeRegexp` for values
you only want to recognise by shape.

## Snapshot testing

When the exact template matters — for example to review a change in a pull
request — take a **snapshot** of the whole thing. Synthesize into a
temporary directory, read the JSON, and compare it with a committed file:

```ts
const template = Template.fromStack(stack)
expect(template.toJSON()).toMatchSnapshot()
```

The snapshot makes an unintended change visible: a changed logical ID, a
changed default, a policy that quietly grew. It also makes intended
changes noisy, so it works best next to targeted assertions that say what
the change is supposed to be.

## What to assert

A test that asserts the whole template is brittle; a test that asserts
nothing is worse. The middle ground is to assert the properties the code
controls: that the bucket is encrypted, that the function reads from the
queue it was given, that the policy is scoped to one table.

Because the constructs are just objects, plain unit tests work too: assert
that the construct sets `props.versioned` when you pass `versioned: true`.
That fails fast and points at the line that caused it.

## Checking the template beyond the code

`cdk-nag` runs security rules over the synthesized template, and
`cfn-lint` and `checkov` do the same from the CloudFormation side. They
catch what assertions do not: a wildcard permission, a public bucket, a
resource type that is valid but not what you meant.
