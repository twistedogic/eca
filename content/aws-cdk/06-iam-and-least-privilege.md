# IAM and least privilege

Access management is where infrastructure code most often goes wrong, and
where the CDK helps most: the grant methods on level 2 constructs write the
policy for you, in the form the resource actually needs.

## The shape of a statement

An IAM policy statement has three parts: the **principal** who is allowed
or denied, the **actions** they may perform, and the **resources** the
actions apply to. Conditions narrow a statement further.

A role is an identity that services can assume. It carries an **assume
role policy** naming who may assume it, and its own permission policy
saying what it may do once assumed.

```ts
const role = new iam.Role(this, 'Worker', {
  assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
})

const statement = new iam.PolicyStatement({
  actions: ['s3:GetObject'],
  resources: [bucket.arnForObjects('*')],
})
role.addToPrincipalPolicy(statement)
```

## Grants instead of policies

Every level 2 construct that can be accessed ships with `grant*` methods.
`bucket.grantRead(role)` writes a policy scoped to the objects of that
bucket; `table.grantReadWriteData(role)` writes one scoped to the table and
its indexes.

The grants are better than hand-written policies for three reasons: they
name the right resource ARN, they add the extra actions a service needs
alongside the obvious one, and they stay correct when the construct changes
its shape.

> A **grant** method writes the policy for you, scoped to the exact
> resource the construct created.

## Resource policies and identity policies

An identity policy attaches to a user, group, or role. A resource policy
attaches to the resource itself and says who may reach in. A cross-account
grant needs a resource policy on the AWS side, because the other account's
identity policy is not enough on its own.

The two are evaluated together: an allow in either is enough, but an
explicit deny in either wins over everything.

## Managed policies and boundaries

A **managed policy** is a standalone policy document that can be attached
to several identities — useful for a permission set that several roles
share, and for keeping the role's own policy small.

A **permission boundary** caps what an identity can ever do, no matter
which policy grants it. Boundaries are how a security team constrains
assume-role permissions without editing every role.

## Checking the result

`cdk-nag` runs compliance rules over the synthesized template and fails
the build when a stack violates them:

```ts
Aspects.of(app).add(new AwsSolutionsChecks())
```

The checks are opinionated — they flag public buckets, wildcard
permissions, and unencrypted storage — so a project adopts them by
suppressing the findings it has deliberately accepted, with a reason
attached.
