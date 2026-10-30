# The app, the stack, and the stage

Three objects carry the whole structure of a CDK app: the **app**, the
**stack**, and the **stage**. Everything else is a tree hanging off one of
them.

## The app is the root

An `App` instance is the root of the construct tree. It holds the settings
that apply to the whole program — where to write the output, what context to
use — and it owns the **cloud assembly**, the directory of templates and
assets that the CLI deploys.

`app.synth()` performs the synthesis. Calling it is what turns the in-memory
tree into JSON templates on disk.

## Stacks are the unit of deployment

A `Stack` maps one-to-one onto a CloudFormation stack. It has its own
template, its own deployment, and its own IAM role for CloudFormation to
assume while acting on your behalf.

A stack can live directly under the app, which is the simplest layout:

```ts
const app = new App()
const stack = new Stack(app, 'MyStack')
```

## Environment-agnostic stacks

A stack created without an `env` is **environment-agnostic**. Its template
does not mention any account or region, so the same template can be deployed
to any account and region that has been bootstrapped.

The cost is the stack name: for an environment-agnostic stack the CDK
generates a name from the construct path plus a hash, such as
`MyStack-1A2B3C4D`. That name changes if the path changes, which is
sometimes a feature — a moved stack deploys as a new stack — and sometimes a
surprise.

> An environment-agnostic stack carries no account or region in its template,
> so one template serves every environment.

## Environment-specific stacks

Passing `env` pins the stack to one account and region:

```ts
const stack = new Stack(app, 'MyStack', {
  env: { account: '123456789012', region: 'eu-west-1' },
})
```

The stack name is now exactly `MyStack`, and the account and region are
baked into the template — in ARNs, in availability zone names, in anything
that needs to name a resource concretely. This is the pattern to use when
the template must reference environment-specific values.

## Stages group stacks

A `Stage` is a container for the stacks of one environment. It gives every
stack inside it the environment, and it prefixes their names with the stage
name, so `Prod-MyStack` is a different stack from `Dev-MyStack`.

```ts
const prod = new MyStage(app, 'Prod', { env: { account: '123456789012', region: 'eu-west-1' } })
```

Stages are the recommended way to run the same application in several
environments: one code path, one stage per environment.

## cdk.json and the CLI

`cdk init app --language=typescript` creates `cdk.json`, a `bin/` directory
with the entry point, and a `lib/` directory with the stacks. The `app` key
in `cdk.json` names the command that runs the app; the `context` key holds
values that the app can read.

`cdk ls` lists the stacks, `cdk synth` writes the cloud assembly to
`cdk.out`, and `cdk deploy` sends it to CloudFormation.
