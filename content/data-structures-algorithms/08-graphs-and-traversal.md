# Graphs and traversal

A graph is a set of nodes with connections between them, with no
restriction on how many connections a node may have. It is the most
general structure in this topic, and most interview problems that look
impossible are really graph problems wearing a disguise.

## What a graph is

A **graph** is made of **vertex** (or node) and **edge** objects. An
edge may be **directed** — one-way, like a follow — or **undirected**,
like a friendship. It may carry a **weight**, like a travel time, or
carry nothing at all. A graph with no cycles is **acyclic**, and a
directed acyclic graph is a special case with a lot of useful
properties.

## Representations

An **adjacency matrix** is a table where `matrix[u][v]` says whether
there is an edge. It is O(1) to test for an edge, but it always costs
O(V²) space, which is far too much for a sparse graph.

An **adjacency list** stores, for each vertex, the list of its
neighbours. It costs O(V + E) space, which is what a real graph uses,
and it makes "who are the neighbours of this vertex?" a direct answer.
Almost every interview solution uses an adjacency list, and the code is
usually "for each neighbour of v".

## Breadth-first search

**Breadth-first search** uses a queue. Start at a vertex, pop it, and
enqueue its unvisited neighbours; the queue keeps the frontier in order
of distance, so the graph is explored level by level.

Two things follow. The first vertex reached at each level is at the
minimum number of edges from the start, so breadth-first search gives
the shortest path in an **unweighted** graph. The second is that the
first time you meet a cycle you can detect it — a neighbour you have
already visited that is not the parent you came from.

## Depth-first search

**depth-first search** uses a stack, or more often recursion: visit the
vertex, then immediately recurse into its first unvisited neighbour. It
dives as deep as possible before backtracking.

Depth-first search is the better fit when you need a full exploration:
counting connected components, checking whether a graph is bipartite,
detecting cycles, or collecting every reachable node. It also produces
the pre-order, in-order, and post-order traversals of chapter 6 when
the graph is a tree.

## Visited sets and components

Both searches need a **visited set** — a hash set of the vertices
already seen. Without it, a cycle means infinite recursion; with it,
each vertex is processed once and the whole search is O(V + E).

The **connected component** is the set of vertices reachable from a
starting vertex. One depth-first or breadth-first search over a graph
finds one component; running it again from every unvisited vertex finds
them all, and the number of runs is the number of components.

> A **breadth-first search** explores a graph level by level, while a
> **depth-first search** follows one branch as far as it can before
> backtracking.

## Grids as implicit graphs

Many problems never build a graph at all. A maze, a grid of rooms, a
board of tiles — each cell is a vertex and each legal move is an edge.
You generate the neighbours on the fly with the four directions, apply
the boundary checks, and the rest of the traversal code is unchanged.
