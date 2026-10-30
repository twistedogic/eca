# Deploying and pipelines

Synthesis is only half of the job. This chapter covers the other half:
bootstrapping an account, shipping templates, and automating the whole
thing so that deploying is a pull request rather than a ritual.

## Bootstrapping

Before the CDK can deploy to an account and region, that account and region
need a **bootstrap stack**, created by `cdk bootstrap aws://123456789012/eu-west-1`.

The bootstrap stack sets up the roles the CLI needs: the **execution role**
CloudFormation assumes to act on your behalf, the **file publishing role**
that uploads assets, and the **cdk-lookups** role that context lookups
assume. Without it, the first deploy fails with a confusing error about a
missing role.

Bootstrap once per account and region. `--trust` marks additional accounts
allowed to deploy, and `--cloudformation-execution-policies` narrows what
the execution role may do — worth setting, because the default is broad.

## The commands

`cdk synth` writes the cloud assembly to `cdk.out`. `cdk diff` compares the
synthesized template with the deployed stack and prints the change, which
needs credentials for the target account. `cdk deploy` sends it, and
`cdk destroy` deletes the stack — honouring the removal policies, so
resources marked `RETAIN` survive.

`cdk watch` re-synthesizes whenever a file changes and shows the diff
against what is deployed, which is the fastest way to see what a change
does.

The CLI can deploy directly or through a CloudFormation change set with
`--method changeset`, which shows exactly what will happen before it
happens.

## Failures and rollback

A failed update is rolled back by CloudFormation automatically, restoring
the previous version of the stack. `cdk deploy --no-rollback` leaves the
failed state in place for inspection instead, and `cdk rollback` restores
the last good version later.

A deploy that fails half way is often a permissions problem, and the
message in the CloudFormation events is the place to look. `cdk` surfaces
the same events, but the console shows more of them.

## Environments and accounts

An account and region pair is an **environment**. Each one needs its own
bootstrap, and each one gets its own deploy roles.

Multi-account setups usually keep a central deployment account that holds
the pipeline, with the workload accounts trusting it. The stacks are still
environment-agnostic or environment-specific as before; the difference is
which account the CLI authenticates against.

## Pipelines

`aws-cdk-lib/pipelines` turns the app into its own deployment pipeline. A
`CodePipeline` takes a source, runs steps, and deploys:

```ts
const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
  crossAccountKeys: true,
  stages: [
    { stageName: 'Source', actions: [new pipelines.ShellStep('Synth', { commands: ['npm ci', 'npm test'] })] },
  ],
})
```

The pipeline synthesizes the app itself, in a role it manages, and deploys
using the bootstrap roles of the target environment — so the pipeline does
not need long-lived credentials of its own.

> A CDK pipeline deploys using the **bootstrap roles** of the target
> environment, so no separate deployment credentials are needed.

## Importing what already exists

`cdk import` brings resources that were created outside the CDK under its
management. It generates a change set that imports the resource by matching
its properties against the template, so the properties have to agree
exactly — a mismatch is reported as an error listing what differs.

Importing is the safe way to adopt the CDK on an existing stack: nothing is
recreated, and the resource simply starts being managed by the template.
