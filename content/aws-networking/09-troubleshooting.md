# Troubleshooting network paths

Most networking incidents are not exotic. They are a route that points
nowhere, a security group that never matched, or a DNS name that
resolves publicly when it should resolve privately. AWS ships two tools
that answer most of these without guesswork.

## Flow logs

**VPC flow logs** capture metadata about the IP traffic crossing a
network interface: source and destination address and port, protocol,
bytes, and the verdict. Each record carries an **action**, ACCEPT or
REJECT. A rejected packet also carries a **reason** code — the flow log
field is named reject-reason, and its values include a block by VPC
Block Public Access or by endpoint encryption controls.

Flow logs are published to Amazon CloudWatch Logs, an S3 bucket, or
Amazon Data Firehose, and they can be filtered by VPC, subnet, or network
interface. They are the fastest way to answer "did the packet arrive,
and was it allowed?".

Because flow logs are sampled and aggregated, they are not a packet
capture — for the traffic that matters you still need a **packet
capture** on the instance or the network interface.

## Reachability Analyzer

**VPC Reachability Analyzer** answers "can this source reach this
destination?" without sending a single packet. Point it at two network
interfaces — or at an IP address and a security group — and it models
the path through security groups, network ACLs, and route tables, then
tells you which rule is blocking it.

It needs a troubleshooting role with the right permissions, and it works
best with concrete endpoints rather than "the database", because it
models the actual security groups and subnets of the resource.

> **VPC Reachability Analyzer** finds the blocking rule on a path without
> sending traffic, while **flow logs** tell you what actually happened to
> traffic that was sent.

## A checklist that resolves most cases

Start with DNS: does the name resolve to the address you expect inside
the VPC, or to a public one? Then check the security groups on both
sides, remembering that the return direction is automatic for stateful
rules but not for network ACLs. Then check the route table of the source
subnet, and remember that the longest matching prefix wins, not the first
rule you remember writing.

Finally, check the target itself: a service that listens on `127.0.0.1`
only, or a health check path that returns 403, will look exactly like a
network problem from the outside.
