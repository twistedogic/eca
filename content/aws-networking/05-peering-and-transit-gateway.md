# Peering and the transit gateway

A VPC is isolated by design. To let it talk to another VPC you either
pair them one to one or build a hub that many VPCs share.

## VPC peering

A **VPC peering connection** is a private link between two VPCs that can
span accounts and regions. Each side needs a route in its route table
pointing at the peering connection, and the CIDR blocks of the two VPCs
must not overlap.

Peering is not transitive. If A peers with B and B peers with C, then A
cannot reach C unless A also peers with C directly. This surprises people
who expect a mesh to happen automatically; with a dozen VPCs the mesh
needs 66 connections, which is where the hub wins.

> **VPC peering** is one-to-one and non-transitive: A can reach B and B
> can reach C, but A needs its own peering with C to reach it.

## The transit gateway

A **transit gateway** is a regional hub. Each VPC, on-premises network,
or VPN connection attaches to it, and the hub routes between the
attachments according to its own routing tables. The hub is transitive:
A, B, and C attached to the same transit gateway reach each other with
no peering between them.

Attachments belong to **transit gateway route tables**, and those tables
decide which attachments may talk to which. Putting the database VPC in
its own route table keeps it unreachable from the marketing VPC even
though both share the hub — segmentation without separate VPC peering
policies.

> A **transit gateway** route table decides which attachments can reach
> each other, which is how segmentation works on a shared hub.

## Transit gateway internals

The transit gateway is a layer 3 router. It reads the destination IP and
sends the packet to the next-hop attachment, and it keeps no flow state —
which is why stateful inspection has to live inside the VPC, and why a
stateful appliance needs **appliance mode** to keep a flow pinned to one
Availability Zone for its lifetime.

The hub does support **equal cost multipath** for most attachment types,
so several paths to the same prefix can share the traffic. VPC
attachments are the exception: two VPCs with overlapping CIDR blocks
cannot both be attached and load balanced, because the destination
address would be ambiguous.

Costs are per attachment hour plus a per-gigabyte processing charge, and
limits apply to attachments, routes per route table, and the number of
prefixes advertised from on-premises.

## Choosing between them

Peering is the cheapest and simplest way to join two VPCs that have a
simple, often unidirectional relationship. The transit gateway costs
more per hour but scales to dozens of VPCs, supports many on-premises
connections through a single point, and adds segmentation through its
routing tables.

For a small estate, one peering is often enough. The point of no return
is when the number of required connections stops being a small number.
