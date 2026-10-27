# VPCs, subnets, and address space

Everything in AWS runs inside a **VPC** — a logically isolated virtual
network that belongs to one AWS account in one region. A VPC is where
addresses come from, where traffic is allowed, and where the pieces of an
application are wired together.

## The VPC and its CIDR block

A VPC is created with an **IPv4 CIDR block** such as `10.0.0.0/16`, which
is the private address space the whole network is carved out of. The block
must be between /16 and /28, and it cannot be enlarged later — only
additional CIDR blocks can be attached to a VPC.

The VPC always has a **router**, and it takes the first usable address of
the block. Each subnet also reserves five addresses: the network address,
the VPC router, the DNS resolver, one held back for future use, and the
last address of the range. That is why a /28 subnet gives you 16
addresses but only 11 usable ones.

> A **VPC** is a logically isolated virtual network that belongs to one AWS
> account in one region.

## Subnets and availability zones

A **subnet** is a contiguous range of addresses inside the VPC's CIDR
block, and it lives in exactly one **availability zone**. Subnets never
span zones, so a production layout is a set of identically sized subnets
repeated across two or three zones — `10.0.1.0/24` in `us-east-1a`,
`10.0.2.0/24` in `us-east-1b`, and so on.

The subnet is the unit that resources attach to: an EC2 instance, a load
balancer, a NAT gateway, and an interface endpoint all get an address from
a subnet and therefore live in that subnet's zone.

## Public and private subnets

Whether a subnet is public or private is not a property of the subnet
itself but of the **route table** attached to it. A subnet is public when
its route table sends `0.0.0.0/0` to an internet gateway; it is private
when no such route exists. The same subnet therefore becomes public or
private the moment you add or remove one route.

> A subnet is **public** when its route table routes `0.0.0.0/0` to an
> internet gateway.

## Managing addresses with IPAM

Handing out CIDR blocks by hand works for one VPC and stops working for a
hundred. **Amazon VPC IP Address Manager** allocates address space from
pools, hands out subnets from a parent allocation, and can reserve
public IPv4 space for accounts that need it. It also tracks IPv6 pools,
so an organisation can pull a /56 from Amazon's IPv6 space and share it
across regions.

## Planning the address space

Give the VPC room to grow: a /16 leaves 256 /24 subnets, which is enough
for most environments, and a second VPC that does not overlap the first
can later be peered with it. Overlapping CIDR blocks are the single most
common reason a peering or transit gateway attachment fails, and no
amount of routing will fix it — the address plans have to line up first.
