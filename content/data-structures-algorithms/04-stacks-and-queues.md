# Stacks and queues

Stacks and queues are the two containers whose whole point is the
*order* in which they hand elements back. They are also the cheapest
structures to implement: an array plus an index, no pointers to chase.

## Stacks

A **stack** is last in, first out. Push, pop, and peek are all O(1),
because the only interesting position is the top. An array with an
index is a stack; a linked list with the tail used as the top is
another, and gives O(1) push and pop without the resize cost.

Stacks are the natural structure for anything that reverses: undo
history, matching brackets, the call stack that backs recursion.

## Queues and deques

A **queue** is first in, first out: enqueue at the back, dequeue at the
front. A naive implementation with an array and a head index leaks
memory at the front, so a **circular buffer** wraps the index around
instead. A **deque** (double-ended queue) allows adding and removing at
both ends and is the structure behind a sliding window and a
monotonic stack.

## The stack and the call stack

Recursion is a stack you did not write. Each call pushes a frame
holding the parameters and the return address; returning pops it.
This is why a recursive solution needs stack space in its complexity
analysis, and why a recursion depth of 10⁵ is a crash rather than a
slow run.

The same idea drives traversal order: depth-first search pushes the
neighbours onto a stack and pops the most recent one, so it dives as
deep as it can before backtracking.

## Specialised stacks

Two specialisations earn their own names.

A **min-stack** keeps the minimum of everything currently in it, in
O(1) per operation. The trick is to store, alongside each value, the
minimum at that point in the stack — then the minimum is always the
top of a second stack, and popping restores the previous one.

A **monotonic stack** keeps its elements in sorted order by value,
pushing and popping so that only useful elements remain. It answers
"what is the next greater element to my right?" for the whole array
in O(n), because each element is pushed once and popped at most once.

> A **monotonic stack** stays sorted by value, so the top always holds
> the element a two-pointer scan would otherwise have to search for.

## Queues as traversal tools

A breadth-first search uses a **queue**: pop the front, enqueue its
unvisited neighbours, and the queue keeps the frontier in order of
distance. A depth-first search uses a stack instead, and the two
produce completely different orders over the same graph.

Choosing between them is a real decision, not a preference. Breadth-first
search finds the shortest path in an unweighted graph, and depth-first
search is usually the better fit when you need a full traversal, a
cycle check, or an order you can compute on the way back up.
