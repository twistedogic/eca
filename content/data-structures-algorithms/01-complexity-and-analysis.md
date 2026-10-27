# Complexity and analysis

Every algorithm question in an interview hides a second question: how
fast is this, and how does it get slower as the input grows? That
second question has a standard vocabulary, and using it well often
separates a candidate who knows the algorithm from one who can pick
the right algorithm.

## Big-O notation

**Big-O notation** describes how the running time or space usage of an
algorithm grows as the input grows. It is a statement about growth
rates, not about wall-clock time, and it deliberately drops constants
and lower-order terms: `3n² + 5n + 20` is written `O(n²)`.

Read it as "big O of n", and it answers one question: when `n`
doubles, roughly how much more work happens?

## The common complexity classes

The classes you meet over and over, fastest to slowest. Each one is a
statement about how the work grows, not about absolute speed.

**Constant time** — the work does not depend on the size of the input.
Array indexing, average-case hash map lookup, and pushing onto a stack
all take `O(1)`.

**Logarithmic time** — every step halves what is left to search. Binary
search takes `O(log n)`.

**Linear time** — one pass over the input, `O(n)`. This is the
baseline you try to beat.

**n log n** — the cost of comparison sorting, and the target when an
input genuinely has to be sorted.

**Quadratic time** — nested loops over the input, so doubling the input
quadruples the work: `O(n²)`.

**Exponential time** — `O(2ⁿ)`. Only acceptable on tiny inputs, and a
strong hint that a memo table or a greedy insight is missing.

> **Quadratic time** means the work grows with the square of the input
> size, so doubling the input quadruples the work.

## Best, average, and worst case

One complexity number hides a question: which case are we talking about?
The **worst case** is the guarantee you can promise. The **average
case** is what you expect over typical inputs. The best case is what
happens when everything goes well and is usually too fragile to rely
on.

Say all three out loud when you discuss an algorithm. "Hash map lookup
is O(1) on average and O(n) in the worst case, when every key lands in
one bucket" is a complete answer. "O(1)" is not.

## Amortized analysis

Some operations are not constant time, but their average cost over a
sequence of operations is. **Amortized analysis** describes that
average cost. The classic example is appending to a **dynamic array**:
most appends copy nothing, and the rare one that has to grow the
backing store copies everything, so the amortized cost of an append is
`O(1)`.

Amortized is not average case. Amortized is a guarantee over a
sequence — the total cost of `n` appends is `O(n)` no matter how the
sequence turns out. Average case is a statistical claim about inputs.

> Amortized analysis bounds the **total** cost of a sequence of
> operations, so the per-operation cost stays small even when
> individual calls are expensive.

## Space, and the cost you did not count

Space is measured the same way, and it comes in two flavours.
**Auxiliary space** is the extra memory an algorithm needs beyond the
input: the recursion stack, the output array, the visited set. Total
space includes the input itself.

Recursion is not free. Every frame costs stack space, so a recursive
solution that recurses once per element needs `O(n)` stack and can
overflow it — a real failure in Java, Python, and JavaScript alike.
Whether a solution needs linear stack space is part of the analysis,
not an afterthought.
