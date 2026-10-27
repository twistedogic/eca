# Shortest paths and ordering

Graph problems split into two families: those that ask for an order on
the vertices, and those that ask for a path with minimum weight. Each
has a standard algorithm, and both rely on structures you already know.

## Topological sort

A **directed acyclic graph** has an ordering of its vertices such that
every edge points forwards in that order. Producing it is a
**topological sort**, and it exists only for acyclic graphs — a cycle
would demand a vertex come before itself.

**Kahn's algorithm** is the standard implementation: compute each
vertex's **indegree**, put the zero-indegree vertices in a queue, and
repeatedly remove one, emit it, and decrement the indegrees of its
neighbours. If the queue empties before every vertex is emitted, the
graph has a cycle.

Topological sorting is how you answer "in what order can these tasks
run?", "can this course schedule work?", and "how do I compile this
dependency graph?".

## Dijkstra's algorithm

**Dijkstra's algorithm** finds the shortest path from a source in a
graph with non-negative weights. It keeps a priority queue of frontier
vertices keyed by their current best distance, always expanding the
cheapest one, and relaxes each edge out of it.

The cost is O((V + E) log V) with a binary heap. The restriction that
weights are non-negative is not cosmetic: Dijkstra assumes that a path
through a more expensive vertex can never become cheaper later, and a
negative edge breaks that assumption.

## Bellman-Ford

**Bellman-Ford** relaxes every edge, `V - 1` times, in any order. That
is O(V · E), which is worse than Dijkstra, and it buys two things:
it handles negative edge weights, and it detects **negative cycles** by
checking whether a further relaxation is still possible.

Negative cycle detection is the standard way to answer "is there no
solution?" in problems about money, arbitrage, or transactions.

## Minimum spanning trees

A **minimum spanning tree** connects every vertex of a connected graph
with the smallest possible total edge weight, using exactly `V - 1`
edges and no cycles.

**Kruskal's algorithm** sorts the edges by weight and adds them one
by one, skipping any edge that would create a cycle. The cycle check
is a **union-find** structure: two endpoints are in the same component
already, so skip. **Prim's algorithm** grows one tree at a time,
repeatedly taking the cheapest edge that leaves the current tree.

## Union-find

A **union-find** (disjoint set union) supports two operations: merge
two sets, and test whether two elements are in the same set. With path
compression and union by rank, both take effectively constant time —
amortized O(α(n)), where α is the inverse Ackermann function and is
smaller than 5 for any input you will ever see.

It is the quiet helper behind Kruskal's algorithm, behind "is this
graph connected?", and behind accounts and interval merging.

> A **topological sort** orders the vertices of a directed acyclic graph
> so that every edge points forwards in that order.
