# Trees and binary search trees

A tree is a structure with a root and children, no cycles, and one
parent per node. The binary tree — at most two children per node — is
the one that shows up in interviews, because it maps directly onto
recursion.

## Vocabulary

The **root** is the top node. A **leaf** is a node with no children.
The **depth** of a node is its distance from the root, counted in
edges; the **height** of the tree is the length of the longest path
from the root down to a leaf. Both are counted in edges, not nodes, so
a single node has height 0 and depth 0.

These two numbers are what you report at the end of a tree problem, and
they are usually the input to the recursion.

## The three traversals

Three depth-first traversals visit the same nodes in different orders.
**Pre-order traversal** visits the node, then the left subtree, then the
right. **In-order traversal** visits the left subtree, the node, then
the right. **Post-order traversal** visits the left subtree, the right,
then the node.

Pre-order suits copying or serialising a tree, post-order suits
deleting one or computing summaries bottom-up, and in-order is the one
that produces sorted output — which is exactly what a **binary search
tree** is built for.

## Recursion on trees

Almost every tree algorithm has the same recursive shape: do something
with the node, then recurse into the children. The base case is a null
child, and the answer for a node is usually combined from the answers
for its children — a sum, a maximum, a boolean.

That pattern is worth internalising because it also covers binary trees
that are not search trees, N-ary trees, and directory structures.

## The binary search tree property

A **binary search tree** keeps a strict order: everything in the left
subtree of a node is smaller than the node, everything in the right
subtree is larger. Search, insert, and delete then follow one path
down the tree, comparing at each node.

The payoff is the in-order traversal: run it and the keys come out
sorted, in O(n) time.

The risk is that the tree grows into a list. Insert 1, 2, 3, 4, 5 in
that order and every node has only a left child, the height becomes n,
and every operation degenerates to O(n) — the same cost as a linear
scan, with more pointer chasing.

## Balanced trees

A **self-balancing tree** rebalances itself on insert and delete so
the height stays O(log n): AVL trees are strictly height-balanced, and
red-black trees relax that to a looser bound. Either way, lookup,
insert, and delete stay O(log n) no matter the insertion order.

Databases and file systems use **B-trees** instead, which are balanced
the other way round — wide nodes with many children, keeping the number
of disk reads low. The interface is the same: a sorted map with
O(log n) operations.

> A **binary search tree** keeps every key in the left subtree smaller
> than the node and every key in the right subtree larger, so in-order
> traversal yields the keys in sorted order.
