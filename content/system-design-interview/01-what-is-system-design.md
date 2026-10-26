# What is system design

System design is the process of defining the architecture, components, and
data flows of a software system so that it meets its requirements at scale.
In interviews you are typically asked to sketch such a system on a white
board and defend your choices.

## Requirements first

Every design starts with requirements. **Functional requirements** describe
what the system must do: which features exist, who uses them, and what the
inputs and outputs are. **Non-functional requirements** describe how well
the system must do it: latency, throughput, availability, and consistency.

> **Functional requirements** describe what the system must do, while
> non-functional requirements describe how well it must do it.

Strong candidates spend the first minutes of an interview pinning both
down, because every later decision — database choice, caching, replication —
traces back to a requirement.

## Thinking in trade-offs

There is no perfect design, only designs that fit a set of requirements
better or worse. **System design** interviews reward the ability to name
the trade-off you are making ("we accept eventual consistency in exchange
for availability") instead of reciting buzzwords.
