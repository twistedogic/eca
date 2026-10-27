# Problem-solving patterns

Most interview questions are one of a handful of patterns wearing
different clothes. Recognising the pattern is most of the work; the
code is then a small consequence of it.

## Two pointers

**Two pointers** walk a sequence with two indices. When they start at
opposite ends and move towards each other, the sortedness of the input
lets you discard a whole side at a time — the classic two-sum on a
sorted array, or reversing in place.

The rule that makes it work: at each step, prove that the current pair
cannot be part of any better answer, then move the pointer that
eliminates it. If you cannot prove that, the pattern does not apply.

## The sliding window

A **sliding window** keeps a range of the input under observation and
moves its bounds instead of restarting the scan. It is the right tool
whenever the question is about a contiguous range: longest substring
without repeating characters, smallest window covering all
characters, maximum sum of a subarray of fixed length.

The window has a size that may be fixed or variable. With a fixed size,
move the window one step and update the running state in O(1). With a
variable size, you need a rule for when to shrink — a maximum window
grows while the constraint holds, a minimum window shrinks as far as it
can.

## The monotonic stack

Chapter 4 covered the structure; here is the pattern. The stack keeps
values in sorted order, and every element is pushed once and popped at
most once, so an O(n²) "look to my right" question becomes O(n). It
unlocks next-greater element, largest rectangle in a histogram, and
rainwater trapping.

## Backtracking

**Backtracking** is recursion over choices: pick an option, explore
what follows, and then undo the choice. The undo is the point —
without restoring the state, the second branch inherits the first
branch's damage.

It fits problems that enumerate solutions: subsets, permutations,
combinations, N-queens, Sudoku, word search in a grid. The pruning
rules — the ones that skip branches which cannot possibly work — are
what keep it from taking exponential time on large inputs.

## Greedy versus dynamic programming

A **greedy algorithm** commits to the locally best choice and never
looks back. It is fast and often correct, but only when a local
choice can be *proved* to lead to a globally optimal answer. Sorting
intervals by start time to schedule rooms is greedy and correct;
choosing the cheapest single stock purchase per day is not.

Dynamic programming is what you fall back on when the greedy choice
cannot be justified. The test is simple: can you name the choice you
are making, and can you show that an optimal solution exists that
makes it? If not, look for a state to memoise.

## Interval problems

**Interval merging** is a family of problems about ranges: merge
overlapping intervals, find the rooms needed for meetings, count
points covered by ranges. The pattern is to sort the intervals by
start, then sweep once with a running end time and a counter.

The sorting key is the part people get wrong: intervals that touch
(`[1,3]` and `[3,5]`) either merge or stay separate depending on
whether the endpoint is inclusive, and that detail is usually stated in
the problem.

> A **sliding window** keeps a contiguous range of the input under
> observation and moves its bounds instead of restarting the scan.
