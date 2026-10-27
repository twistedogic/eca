# Linked lists

A linked list is the other classic container: a sequence of nodes, each
holding a value and a link to the next node. It trades random access for
cheap insertion, and it is the structure interviewers reach for when the
problem is about pointers rather than lookup speed.

## Nodes and links

A **node** holds the data and a reference to the next node. The list
keeps a **head pointer** to the first node, and often a **tail pointer**
to the last one. There is no index arithmetic: the `i`-th node is `i`
steps away, so indexing and searching are both O(n) — slower than an
array, and that is the trade you make.

A **singly linked list** links each node only forward. A **doubly linked
list** also links backwards, which costs one extra pointer per node and
buys O(1) deletion of a node you already hold, plus backwards
iteration.

## Reversing and merging

Reversing a list in place is the canonical first linked-list problem.
Keep three pointers — previous, current, and next — and swap them as
you walk. It is O(n) time and O(1) extra space. The recursive version
is shorter but costs O(n) stack.

Merging two sorted lists is the other one. Walk both with two pointers,
take the smaller head each time, and keep a tail pointer to append the
winner. Also O(n) time.

## Cycle detection

A **cycle** is a list that loops back on itself, and it turns every
naive traversal into an infinite loop. **Cycle detection** can be done
with **fast and slow pointers**: the fast pointer moves two nodes per
step, the slow one moves one, and if the fast pointer ever lands on
the slow one, the list loops. The same trick finds the middle node of a
list, and the entry point of a cycle if you restart the slow pointer at
the head after they meet.

## The dummy head trick

Pain in linked-list code comes almost entirely from the empty list and
the one-element list. A **dummy head node** — a throwaway node whose
`next` points at the real head — removes both cases, because the list
always has at least one node and the first real node always has a
predecessor. Deleting the first element, inserting at the front, and
merging two lists all collapse to the same three lines.

> A **dummy head node** gives every real node a predecessor, which
> removes the special cases for the empty list and the first element.
