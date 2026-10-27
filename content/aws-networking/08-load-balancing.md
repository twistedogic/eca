# Load balancing and public addresses

Load balancers sit at the edge of a VPC and decide where each request
goes. AWS offers three, and they differ in the layer they work at.

## The three load balancers

An **application load balancer** works at layer 7 and understands HTTP.
It routes by host header, path, or query string, terminates TLS, and
supports websockets, redirects, and sticky sessions. Its targets can be
instances, IP addresses, Lambda functions, or other load balancers.

A **network load balancer** works at layer 4 and forwards TCP, UDP, or
TLS. It runs in front of the layer 7 balancer, serves static content
without any compute cost, and keeps the client's IP address unmodified
for instance targets, so the target sees the real caller. For IP-type
target groups running TCP or TLS, that preservation is off by default.

A **gateway load balancer** works at layer 3 and inserts third-party
appliances — firewalls, intrusion detection, traffic analysers — into the
path. It is used with a transparent GENEVE encapsulation so the
appliance can inspect the flow.

> A **network load balancer** keeps the client IP address for instance
> targets, while an application load balancer replaces it and passes the
> original in the `X-Forwarded-For` header.

## Health checks and targets

Every target group runs **health checks** against a configurable path and
port. A target that fails the check is taken out of rotation, so the
balancer's capacity is really "targets that are currently healthy", and
the health check path must exist on the target — an application that
answers `/` but not `/health` looks permanently unhealthy and takes the
whole fleet out of service.

A network load balancer's health checks default to TCP on the traffic
port, while an application load balancer defaults to HTTP. Either way the
port has to be the one the target actually serves.

## Elastic IPs and public entry points

An **elastic IP** is a static public IPv4 address allocated to your
account, and it can be attached to a running instance or a network load
balancer. A network load balancer can be given one elastic IP per subnet
— one per zone — which keeps the entry point stable while the instances
behind it are replaced.

Static addresses matter for anything with a hard-coded allowlist —
partner firewalls, certificates pinned to an address, DNS records with a
long TTL. The alternative, letting DNS point at whatever the load balancer
currently is, breaks the moment the zone is replaced.

> An **elastic IP** keeps the same public address across stop and start,
> which is what allowlists and pinned DNS records depend on.
