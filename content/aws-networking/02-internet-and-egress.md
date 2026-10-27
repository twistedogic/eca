# Internet access and egress

Two questions decide almost every architecture review: how does traffic
leave the VPC, and how does it come back. AWS gives each direction its
own component.

## The internet gateway

An **internet gateway** is a VPC-wide component that lets resources with a
public IP address reach the internet, and lets the internet reach those
resources. It is attached to the VPC, not to a subnet, and it does
nothing at all until a route table points at it: `0.0.0.0/0` to the
gateway on the public subnets' route table.

A public subnet normally carries two routes — the local route for the VPC
address space, and the default route to the internet gateway. Everything
else in the VPC reaches the gateway through those routes.

## The NAT gateway

A **NAT gateway** is an AWS-managed network appliance that gives instances
in private subnets outbound internet access without giving them a public
address. It sits in a public subnet, is addressed by an elastic IP, and
translates the private source address of outbound packets to that public
one.

Inbound connections are not possible: a NAT gateway has no route back into
the private subnet, so the answer to a packet arriving from the internet
is always "no". Instances keep their private addresses, which is exactly
what you want for databases and internal services.

NAT gateways come in two types. A public one reaches the internet and
owns an elastic IP; a private one reaches only other VPCs and on-premises
networks through a transit gateway or a virtual private gateway, and has
no elastic IP at all.

> A **NAT gateway** translates outbound traffic from private subnets to a
> public address and cannot accept inbound connections.

## Elastic IPs and egress-only gateways

An **elastic IP** is a static public IPv4 address allocated to your
account, and it can be moved between resources. It is what makes a NAT
gateway's public identity stable. A launch-type "auto-assign" public address
changes every time an instance stops and starts; an elastic IP does not.

IPv6 works differently. Instances in an IPv6-enabled subnet get a public
IPv6 address directly, and private IPv6 subnets that need internet access
use an **egress-only internet gateway** with a `::/0` route. There is no
NAT for IPv6 — addresses are not scarce — so the gateway only blocks
inbound connections.

## Choosing a path for each direction

Public subnets host anything that accepts inbound traffic: load balancers,
bastions, NAT gateways. Private subnets host the workloads themselves:
application servers, databases, queues. The classic four-route setup
gives public subnets a default route to the internet gateway and private
subnets a default route to the NAT gateway, which in turn sits in a public
subnet.

Two mistakes show up constantly. A private subnet whose route table
points `0.0.0.0/0` at the internet gateway instead of the NAT gateway is
simply a public subnet, and every instance launched there with
auto-assign public IPv4 turned on gets a public address with nothing in
front of it. And a NAT gateway in a private subnet has nowhere to send
traffic, because it needs a route to the internet gateway of its own.
