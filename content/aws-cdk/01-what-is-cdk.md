# What the CDK is

The **Cloud Development Kit** is an open-source framework for describing
cloud infrastructure as code. You write an ordinary program — in TypeScript,
Python, Java, or C# — and the CDK turns that program into a **CloudFormation**
template that AWS deploys on your behalf.

## Infrastructure as code

**Infrastructure as code** means every resource — a bucket, a function, a
database table — is defined in a file that lives in version control. The
definition is reviewed like code, applied like code, and rolled back like
code.

Writing raw CloudFormation YAML means maintaining thousands of lines of
boilerplate for a stack of twenty resources. Writing raw Terraform HCL
means a provider plugin ecosystem, a state file that has to be kept in sync
with reality, and an `import` dance for anything that already exists.

> The CDK is a **framework**, and CloudFormation is the **engine** that
> deploys what the CDK produces.

## The CDK sits in the middle

The CDK never deploys anything itself. It performs **synthesis** — turning the
program into a deployment artifact — and hands the resulting template to
CloudFormation, which owns the actual API calls, the rollback behaviour,
and the change history.

Because CloudFormation is the engine, a CDK app inherits everything
CloudFormation offers: rollback on failure, change sets, resource import,
and no separate state file to lose.

## Why use the CDK

The payoff is that the CDK is a **programming language** for
infrastructure. Loops generate fleets of identical resources, conditions
model environments, and the compiler rejects a misspelled property before
anything is deployed.

The other payoff is **refactoring**. Because a resource's identity comes
from its position in the construct tree, code can be reorganised without
guessing what CloudFormation will call the resource afterwards.

## What an app looks like

A CDK app is a normal Node or Python project. The entry point builds an
**app**, the app holds **stacks**, and stacks hold constructs:

```ts
import { App, Stack } from 'aws-cdk-lib'
import { Bucket } from 'aws-cdk-lib/aws-s3'

const app = new App()
const stack = new Stack(app, 'MyStack')
new Bucket(stack, 'Assets')
app.synth()
```

The two packages that matter are **aws-cdk-lib**, the framework itself, and
**constructs**, the tree library the framework is built on. CDK v2 ships the
command line tool inside the `aws-cdk` package, so there is no separate
global install that can drift away from the library version.

> **aws-cdk-lib** is the CDK v2 framework package, versioned independently of
> the CLI that synthesizes from it.
