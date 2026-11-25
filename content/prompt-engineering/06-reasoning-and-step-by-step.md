# Reasoning and step-by-step work

Some questions fail when the model answers too fast. Not because it cannot
solve them, but because it commits to a line of attack in the first token
and then rationalises it. The techniques here buy it room to think before
it commits.

## Chain of thought

**Chain of thought** is the simplest and still the most useful: ask for the
reasoning before the answer.

```
Work through this step by step:
1. List the candidate root causes.
2. For each, state the evidence for and against it.
3. Choose the cause best supported by the evidence.
Then give the final answer on its own line as: ANSWER: <cause>
```

Three details carry the benefit. The reasoning happens *before* the answer
rather than alongside it, so the answer cannot constrain the reasoning
backwards. The steps are enumerated, so each one is a place where the
model can be checked. And the final answer has a **stop token** — a fixed
marker such as `ANSWER:` — which makes it trivial to extract and gives
the model a clean place to commit.

Chain of thought helps most when the task has structure to expose:
arithmetic over several quantities, rule lookups with conditions, code
traces, and multi-constraint decisions. It helps least on tasks where the
answer is a lookup and the reasoning would just be padding.

## Scratchpads and reasoning models

Asking for reasoning in the answer has a cost: the chain is visible to the
user and it bloats the output. A **scratchpad** keeps the working out
private. Modern reasoning models do this natively — they spend tokens
thinking before replying, and the thinking is not part of the answer you
show.

```
messages = [
  {"role": "system", "content": "Solve the problem. Reply with only the final answer."},
  {"role": "user", "content": problem},
]
```

If you are using a model that does not think by default, the practical
substitute is a two-call pattern: one call to work the problem out, one
call to produce the final answer using that work. It costs an extra round
trip, so it is worth it only for problems where reasoning demonstrably
changes the answer.

Whatever the mechanism, the **reasoning budget** is a tunable cost knob.
Asking for more deliberation raises the token bill and the latency; asking
for less risks a premature commit on hard problems. Set it per task
difficulty, not globally.

## Decomposition

**Decomposition** splits one hard prompt into a chain of easier ones.

```
Step 1: Extract every date, amount, and account id from the complaint.
        Output as a table.
Step 2: Using only that table, list the transactions that appear duplicated.
Step 3: For each suspected duplicate, state whether the merchant description
        matches exactly.
Step 4: Return the confirmed duplicates as JSON.
```

Why it works: each step has a smaller question, a narrower context, and a
checkable output. When step 3 goes wrong you can see exactly which rows it
misread, instead of staring at a wrong final answer.

The cost is error propagation. A mistake in step 1 becomes step 2's
premise. Two habits keep that in check: make each step's **output
structured** so the next step reads data rather than prose, and keep the
steps few enough that you can inspect them.

A good default is to decompose only along lines where the intermediate
result is checkable. Three steps of "extract, reason, format" beats eight
steps of "reason in many small ways".

## Self-consistency and voting

When a problem is hard enough that the model is uncertain, one sample is
one draw from a distribution. **Self-consistency** takes several samples and
picks the answer they agree on, which usually beats any single sample.

```
Sample the answer 5 times with different reasoning paths.
If all five agree, return that answer.
If they disagree, return the majority answer and a note naming the
dissenting answers.
```

The gain comes from variance reduction: correct reasoning paths converge
on the same answer, and errors are less likely to repeat. The cost is
proportional to the number of samples, so it belongs on hard, high-value
questions rather than as a default.

A cheaper cousin is **best-of-n with a verifier**: generate n candidates
and let a second pass — often the same model with a rubric — pick the best.
That turns quality into a judgement problem, which is often easier than
the original task.

## Verification and critique

The cheapest correctness check is asking the model to look again. Give it
the answer and the criteria, and let it act as a **critique** pass.

```
Here is a proposed root cause for the incident:
<answer>
Expire cache on payment gateway
</answer>

Check it against the timeline in the evidence. Answer in three lines:
VERDICT: supported | unsupported | insufficient evidence
REASON: one sentence
MISSING: the evidence you would need to be confident
```

Two things make this work. The critique must be able to say **insufficient
evidence** — a binary pass/fail critic gets gamed into approving bad
answers. And the criteria must be the same **acceptance criteria** the
answer was produced under, so the check is against the spec rather than
against taste.

The pattern generalises: generate, then critique against a rubric, then
revise. It costs an extra call per stage, and it pays off when errors are
expensive and correctness is checkable — not for every summarisation.
