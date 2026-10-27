# Dynamic programming

Dynamic programming is the technique people reach for when the obvious
recursion keeps solving the same subproblems over and over. It is less
a specific algorithm than a way of organising one: define a state, and
make sure each state is computed once.

## When to use it

Two properties signal that dynamic programming applies. The problem has
**overlapping subproblems**, so the same inputs are solved repeatedly by
naive recursion. And it has **optimal substructure**, so the answer to
a problem can be assembled from the answers to smaller problems.

Compare factorial by naive recursion — each call recomputes the same
smaller factorials — with the same recurrence and a table. The first
is exponential, the second is linear. That gap is the entire point.

## The four-step recipe

Every dynamic programming solution is written in the same four moves.

**The state**: write down what one entry of your table means — "the
minimum cost to reach step `i`", "the number of ways to make the sum
`s`". If you cannot say what the state means in one sentence, you do
not understand the problem yet.

**The transition**: the recurrence that expresses the state in terms of
smaller states. This is where the problem's cleverness lives.

**The base case**: the states that are known without any recursion — an
empty prefix, a single element, a zero-length target.

**The order**: fill the table so that every dependency is already
computed, increasing index for a 1-D table and row by row for a 2-D
one.

The state definition is where most dynamic programming goes wrong. If
the transition needs information the state does not hold, you have to
widen the state, not patch the transition.

## Memoization and tabulation

**Memoization** is the top-down version: write the recursive solution
and cache each result on the way down. **Tabulation** is the bottom-up
version: fill a table iteratively, in the order you choose.

Top-down is easier to write and only computes the states you actually
need. Bottom-up has no recursion overhead, and it is the version that
lets you compress the table: when the transition only looks at the
previous row, you keep two rows instead of all of them, turning O(n²)
space into O(n).

> **Memoization** caches the result of a recursive call, while
> **tabulation** fills the same table bottom-up.

## Common shapes

The shapes you will meet again and again.

The **0/1 knapsack** problem gives items with weights and values and a
capacity `W`. The state is the best value using the first `i` items
with capacity `c`, and the time is O(n · W).

**Coin change** asks for the minimum coins to make an amount, or the
number of ways to make it. The same shape as knapsack, one asking for a
minimum and one counting.

**Longest increasing subsequence** keeps state over the position and
the best length seen so far: O(n²) dynamic programming, or O(n log n)
with patience sorting.

**Longest common subsequence** keeps state over the two positions in
the two sequences, O(n · m).

**Grid paths** keep state over the cell, with up and left transitions,
and the same one-dimensional space optimisation as above.

## The pitfalls

The state does not capture what you need. If two different histories
lead to the same state but need different answers, the state is too
narrow — widen it.

An off-by-one in the base case. Decide whether "empty" is `0` or `1`
before you start, and be consistent.

Recomputing across test cases. A table built for one input cannot be
reused for another unless the state is independent of it.

Not checking the constraint. Dynamic programming is often O(n · W) or
O(n · m); if `n` is a million, the table does not fit and you need a
different formulation.
