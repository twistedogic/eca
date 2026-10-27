# Hybrid connectivity

Placing a VPC next to a corporate data centre raises the same question
every time: how does traffic cross the internet safely, and what happens
when the link is down.

## Site-to-Site VPN

A **site-to-site VPN** is an IPsec tunnel between your VPC and your remote
network. On your side you configure a **customer gateway**, which is the
device in your own network that AWS represents in your account. The AWS
side is a virtual private gateway or a transit gateway, and it provides
two tunnels for automatic failover.

The tunnel runs over the public internet, needs a static public IP at
your end, and is set up in minutes. It carries only the prefixes you
advertise, so on-premises clients reach private addresses in the VPC
without a public address anywhere. It is the cheapest hybrid option and
the right default for low-volume traffic, backups, and administration.

## Direct Connect

**AWS Direct Connect** is a dedicated private connection from your
network to AWS over a private network, at an AWS Direct Connect location
or through a partner. A **virtual interface** on top of the connection
attaches to a **virtual private gateway** for a single VPC, or to a
**Direct Connect gateway** for a transit gateway and many VPCs.

Direct Connect gives predictable bandwidth, lower latency, and a private
path that does not traverse the internet. It also costs more and takes
weeks to provision, which is why teams often run both: Direct Connect for
steady traffic, VPN as a backup.

> A **virtual interface** on a Direct Connect connection attaches to a
> virtual private gateway or to a Direct Connect gateway.

## Client access

For people rather than networks, **AWS Client VPN** provides a managed
VPN endpoint and client for laptops and phones, with authentication
against your directory and a split-tunnel or full-tunnel policy.

## Filtering and inspection

Hybrid networks need inspection in the middle. **AWS Network Firewall**
is a managed stateful firewall: rule groups, signature-based threat
detection, and deployment in every zone that needs it.

> **AWS Network Firewall** plugs into the transit gateway in appliance
> mode, so every on-premises flow through the hub is inspected.
