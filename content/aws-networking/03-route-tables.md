# Route tables

A **route table** is a set of rules that decides where traffic leaving a
subnet goes. Every subnet is attached to exactly one route table, and one
route table can serve many subnets.

## What a route looks like

Each route is a destination CIDR and a target: an internet gateway, a NAT
gateway, a VPC peering connection, a transit gateway, a VPC endpoint, a
network interface, or another VPC. The route to the VPC's own address
space is always present — one per CIDR block — and points at the local
router. It cannot be deleted, though its target can be replaced. A more
specific route inside the VPC's range does take precedence over it, which
is how a single prefix can be sent somewhere else while the rest of the
VPC stays local.

## Main route table and associations

Every VPC has a **main route table**, and it applies to every subnet
without an explicit association. Subnets that are never explicitly
associated with a route table follow the main one, which is why a
misconfigured subnet can silently inherit routes you forgot about. The
usual practice is to make the main route table deliberately empty of
broad routes and attach explicit tables everywhere else.

> The **main route table** is the default for every subnet in a VPC that
> has no explicit route table association.

## Which route wins

When several routes could match a packet, the longest prefix wins: a
route for `10.0.1.0/24` beats a route for `10.0.0.0/16`, which beats
`0.0.0.0/0`. When prefixes are equally specific, static routes — an
internet gateway or a peering connection — come first, then prefix list
routes, then propagated routes.

A route whose target no longer exists — a deleted NAT gateway, a
disconnected peering — stays in the table and its traffic goes to the
**blackhole route**, where it is dropped without an error reaching the
sender. Blackholes are the classic symptom of a stale route table.

## Route tables and state

Route tables are stateless: they match on the packet header and say
nothing about what came back. Whether the reply is allowed is decided
elsewhere, by security groups and network ACLs. That split matters when
debugging — a route can be correct while the return path is blocked by a
firewall, or the reverse.

## Propagation and transit gateways

In a plain VPC, routes never travel between route tables; every table is
an island you maintain by hand. With a transit gateway, **route
propagation** replaces that manual work: with propagation enabled on the
attachment, the transit gateway pushes its routes into the route tables
of the attached VPCs, so a new spoke needs no hand-written entries. The
other direction is not automatic — traffic from a VPC to the hub needs a
static route in that VPC's route table.

> Routes are matched by **longest prefix**, so a more specific route always
> beats a broader one.
