# Searching and sorting

Searching and sorting are the two algorithms every language already
ships, which makes them a strange interview topic — unless the point
is that you can build them yourself.

## Binary search

**Binary search** halves the search space at every step: compare the
target with the middle element, then keep only the half that can
contain it. On a sorted array of `n` elements it takes O(log n) steps,
which for a million elements is about twenty comparisons.

Two practical details. The midpoint must be computed as
`low + (high - low) / 2` in fixed-width languages, because
`(low + high) / 2` overflows when both are large. And the loop needs a
termination condition that cannot skip the answer — the usual shape is
`while (low <= high)`, with the search space shrinking every
iteration.

## Bound searches

The same loop with a different condition gives you a **lower bound**:
the first index whose value is greater than or equal to the target. The
first index whose value is greater than the target is the upper bound.
Insertion points, floor and ceiling, and "how many elements are
smaller than x" are all the same loop with a different predicate.

Binary search also works on things that are not arrays. If the
predicate "does this candidate work?" is monotonic, you can binary
search the space of answers instead of searching a collection — the
standard technique for "minimum capacity", "smallest number of
days", and "lowest speed that finishes the race in time".

## The sorting landscape

**Merge sort** splits the array in half, sorts both halves, and merges
them back. It is O(n log n) always, stable, and it needs O(n) extra
space for the merge.

**Quicksort** partitions around a pivot and recurses on the two sides.
It is O(n log n) on average, O(n²) in the worst case — already sorted
input with a bad pivot — in-place, and not stable.

**Heapsort** builds a heap and repeatedly takes the root. It is
O(n log n) in the worst case, O(1) extra space, and not stable.

**Insertion sort** is O(n) on nearly sorted input and O(n²) in
general, which makes it the practical choice for small arrays and for
the final merge step of a hybrid sort.

**Counting sort** is O(n + k) for a small range of integer keys, and it
is not a comparison sort at all.

## Stability and in-place

A **stable sort** keeps equal elements in their original relative
order. That matters whenever you sort by one key and then another: if
the second sort is not stable, the first ordering is destroyed. Most
standard library sorts are stable, and you should know whether yours
is.

An in-place sort uses O(1) extra space. Merge sort is not in-place;
heapsort is; introsort — what many libraries actually use — switches to
heapsort when quicksort's recursion gets too deep.

## Sorting your own objects

Sorting objects needs a **comparator**: a function that answers "is a
before b?". Two rules keep it honest. The comparator must be a strict
weak ordering — never report `a < b` and `b < a` both true — and it
must be consistent, or the sort result depends on the algorithm's
internal ordering.

For multiple keys, compare the primary key first and break ties with
the next one, rather than building a composite key by hand.
