# Security groups and network ACLs

AWS gives you two firewalls, and they sit at different layers. A **security
group** filters traffic at the resource, a **network ACL** filters traffic
at the subnet boundary. Most real estates use both.

## Security groups

A security group is a virtual firewall attached to the network interface
of a resource — an instance, a load balancer, a NAT gateway. Its rules
can only allow traffic; anything not explicitly allowed is denied, so
there is no deny rule to write.

Security groups are **stateful**: once a connection is allowed in, its
reply leaves without any extra rule. That is also why a rule that allows
only port 443 inbound works for HTTPS responses without adding a rule for
high-numbered ports.

> Security groups are **stateful**: return traffic for an allowed
> connection is permitted automatically.

Rules can name other security groups as the source or destination
instead of listing addresses. Referencing the security group of the
database tier means the rule keeps working when the database gets a new
IP, and it works across peering connections and transit gateway
attachments as well.

## Network ACLs

A **network ACL** is a subnet-level firewall. Unlike a security group it
is stateless, supports both allow and deny rules, and evaluates them in
rule number order — the lowest matching rule wins, and there is an
implicit deny at the end of every list.

Because NACLs are stateless, you must also allow the reply traffic
explicitly, and that reply leaves from an **ephemeral port**. The range
depends on the client: Linux uses 32768–60999 by default, and AWS
recommends opening 1024–65535 to cover every kind of client. A rule that
allows inbound port 443 but not that range lets the request in and hangs
the response.

The **default network ACL** allows everything in both directions, and the
default security group allows all traffic between resources in the same
VPC. Both are convenient and both are worth tightening in a production
account.

## Which one to use

Use security groups for the bulk of the work: they are stateful, they
attach to the resource, and they can reference each other. Use network
ACLs for the things they alone can do — a subnet-wide deny of a known bad
source range, or an ordered list that blocks a protocol before a later
rule allows the rest.

> Network ACLs are **stateless**: return traffic must be allowed
> explicitly, including the ephemeral port range 49152–65535.
