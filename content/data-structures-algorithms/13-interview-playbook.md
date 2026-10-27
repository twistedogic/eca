# The interview playbook

Knowing the algorithms is half of an interview. The other half is
showing the interviewer how you think: how you reduce a problem, how you
test your solution, and how you talk while you code.

## Read the problem out loud

Restate the problem in your own words before writing anything. Then ask
the questions that change the answer:

- What are the input and output types, and what do the constraints look
  like? "Up to 10⁵ elements" and "up to 10 elements" mean different
  algorithms.
- Are duplicates allowed, and do they matter? Does order matter?
- Is the input sorted, and may you modify it in place?
- What should happen on empty input, and is that case allowed?

Each of these is an **assumption** you make explicit. Stating them
costs ten seconds and prevents a solution built on the wrong one.

## Start with the brute force

Write the **brute force** solution first, even if you know it is too
slow. It gives you a baseline to test against, and it makes the
optimisation visible: "this is O(n²) because we rescan for every
element; a hash map turns it into one pass."

Interviewers are not grading the brute force. They are watching
whether you can see the cost and decide what to change.

## Narrate while you code

Say what you are about to do before you do it. Name the **invariant**:
the property that holds at every step of your loop. "At the start of
each iteration, the window contains no repeated character and the left
pointer is at the earliest valid position" is a sentence that makes the
code checkable — and checkable code is code you can debug when it
fails.

If you get stuck, say what you know, what you assume, and what you are
unsure about. A visible train of thought is worth more than silent
guessing.

## Test the edges

A solution that passes the sample but breaks on the edges is not done.
The **edge case** list is short and worth memorising: empty input, a
single element, two elements, all elements equal, already sorted and
reverse sorted, one element different from the rest, the largest
possible input.

Walk one of them through your code out loud. Then check the complexity
answer: does it match the constraint you were given?

## Common mistakes

**Ignoring the constraint** is the usual one: an O(n²) solution on 10⁵
elements is wrong even though it is correct on paper.

**Mutating the input** when the caller may still need it, or when the
problem says not to.

**Off-by-one** errors at the boundaries: an empty array, the first
element, the last element.

**Assuming uniqueness** when duplicates are possible.

**Optimising too early**, before the brute force runs.

**Silent coding** for ten minutes, followed by a rewrite.

## When you are stuck

Say out loud that you are stuck, then work in this order: fall back to
the brute force and make it correct; simplify the problem to a smaller
version and solve that; look at the structure of the input for a
pattern; consider what the answer would be if you asked the problem
backwards.

Then ask the interviewer for a hint — that is what hints are for, and
using one is not a failure. Naming the **trade-off** you were weighing
("I could make this O(n) with a hash map, or O(1) extra space with
sorting") is exactly the kind of thinking the interview is measuring.

> The **brute force** solution is not a throwaway: it is the baseline
> you improve and the safety net you test against.
