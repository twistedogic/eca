# Arrays and strings

Arrays are the default container in an interview because their costs are
predictable and index arithmetic is trivial. Most other structures in
this topic are either a wrapper around an array or a deliberate
alternative to one.

## The dynamic array

An array stores its elements in **contiguous memory**, so the address of
element `i` is the base address plus `i` times the element size. That
is why **random access** is O(1): no searching, just arithmetic.

Most languages do not hand you a fixed-length block. They give you a
**dynamic array** that grows on demand — a backing store plus a length.
When the store fills up, the array allocates a bigger one, usually
double the size, and copies the elements over. The copy is O(n), but it
happens rarely enough that the amortized cost of an append stays O(1).

The other operations are not free. Inserting or deleting in the middle
shifts every element after it, so those cost O(n) — the same reason a
linked list loses to an array on random access.

## Prefix sums and difference arrays

A **prefix sum** array stores the running total of the elements up to
each index. Once it exists, "what is the sum of the subarray from `i` to
`j`?" becomes a subtraction instead of a loop, and repeated range-sum
queries become O(1) each.

The **difference array** runs the idea backwards. To apply an increment
to a whole range, record it at the range's start and subtract it just
past its end, then take one prefix sum at the end. A million range
updates become a million O(1) writes plus one linear pass instead of a
million linear passes.

## Working in place

An **in-place algorithm** rearranges the input, or returns an index
into it, using O(1) extra space. Two pointers walking towards each
other from both ends of the same array is the classic shape: swap,
advance, repeat, until the pointers meet.

In-place does not mean free. You destroy the original order, which
matters if the caller still needs it.

## Strings and the copy trap

Strings are usually **immutable**, and that changes what "modify" can
mean. Building a result by appending to a string in a loop can copy the
whole string on every step, turning a linear algorithm into a quadratic
one. A **string builder**, or collecting characters into a list and
joining once at the end, keeps it linear.

Character access by index is not always free either. In some languages
`str[i]` is O(1) over a byte or char array; in others it is O(n) over a
rope or a grapheme-aware view. Know which one you are in before you
promise an index-based two-pointer solution.

> A **dynamic array** appends in O(1) amortized time because the
> occasional O(n) copy is spread across many O(1) appends.
