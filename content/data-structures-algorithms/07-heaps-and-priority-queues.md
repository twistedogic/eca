# Heaps and priority queues

A heap is a tree that only cares about the order between a node and its
direct children. That single constraint buys the cheapest possible
"always give me the most important thing" structure.

## The binary heap

A **binary heap** is a complete binary tree — filled left to right, with
the last level possibly incomplete.

On top of that sits the **heap property**, a single rule about parents
and their children. In a **min-heap** every parent is smaller than or
equal to its children. In a **max-heap** every parent is larger than or
equal to its children.

Nothing else is ordered. Two elements in different subtrees can be in
any relation, which is why a heap is not a sorted structure.

## The array representation

A complete binary tree has no holes, so it needs no pointers. Store the
level order in an array and the children of the node at index `i` are
at `2i + 1` and `2i + 2`, and its parent is at `(i - 1) / 2`. The
structure is an array with a rule about where things sit.

That representation is why heaps are cheap: no allocation per node, and
perfect cache locality when the array is large.

## Sift up and sift down

Two operations maintain the heap property. **Sift up** moves a node
towards the root while it is smaller than its parent (min-heap).
**Sift down** moves a node towards the leaves while it is larger than
one of its children. Both are O(log n), and together they are what
**heapify** does: restore the heap property for a subtree.

Building a heap from an array is therefore: treat the array as a heap
and sift down every internal node from the bottom up. The total cost is
O(n), not O(n log n), because most nodes are near the leaves and sift
very little.

## What heaps are good for

A **priority queue** is the interface: insert an element, remove the
top one. A binary heap implements it in O(log n) per operation.

The classic problems it unlocks:

- The k largest or k smallest elements of a stream, by keeping a heap
  of size k: O(n log k) time and O(k) space.
- Merging k sorted lists by keeping a heap of their current heads.
- Dijkstra's shortest-path algorithm, which is a priority queue over
  frontier vertices.
- Anything scheduling-like: tasks by priority, events by timestamp.

> A **priority queue** hands back the highest-priority element first,
> and a binary heap implements it in O(log n) per insert and remove.
