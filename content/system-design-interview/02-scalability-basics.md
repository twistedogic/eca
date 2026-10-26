# Scalability basics

Scalability is the ability of a system to handle more work by adding
resources. It is the heartbeat of every system design discussion.

## Vertical and horizontal scaling

**Scalability** questions ask what happens when traffic grows tenfold.
**Vertical scaling** means making one machine bigger: more CPU, more RAM.
It is simple but has a hard ceiling and no fault tolerance. **Horizontal
scaling** means adding more machines. It scales far past a single box but
introduces coordination problems.

## Load balancing

> A **load balancer** distributes incoming traffic across many servers so
> that no single machine gets overwhelmed.

A **load balancer** sits in front of your servers and decides, per request,
which server handles it. Common strategies are round robin, least
connections, and consistent hashing when session stickiness matters.
Health checks remove dead servers from the pool automatically.
