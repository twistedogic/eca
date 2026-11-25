# Few-shot prompting and in-context learning

When a description of the target answer leaves room for interpretation, the
cheapest way to close the gap is to show one. This is the single
highest-yield technique in prompt engineering, and the one most often used
badly.

## What few-shot examples buy you

**Few-shot prompting** means putting worked examples in the prompt before
the real input. The model does not train on them — it copies their shape.
This works because of **in-context learning**: the behaviour demonstrated in
the context of the request is the behaviour the model imitates.

You can demonstrate:

- a label set and how labels map to inputs (`bug`, `billing`, `howto`);
- a tone and register the reviewer expects;
- an output shape that prose would leave ambiguous;
- a decision boundary — what counts as "urgent", what does not;
- how to handle a case where you want refusal or escalation.

> Examples do not teach facts. They teach format, tone, and judgement.

The distinction matters. Few-shot prompting is the wrong tool when the
model lacks knowledge; no amount of example will supply a fact it has never
seen. It is the right tool when the model knows the material but does not
know *your* house style, *your* labels, or *your* threshold.

## How many examples and which ones

The number of examples has sharply diminishing returns: the first two or
three buy most of the improvement, and the rest cost tokens for little
gain. But which examples you pick matters more than how many.

Good example sets:

- **Diverse coverage** — different categories, not four phrasings of the
  same one.
- **Hard cases** — the inputs where the model gets it wrong. An example of a
  tricky ticket teaches more than an example of a clean one.
- **Boundaries** — one example on each side of the decision you care about,
  especially the side that is easy to get wrong.
- **Real formatting** — the example must show the exact output shape you
  want, including the boring parts.

Bad example sets:

- All examples from one category.
- Examples chosen because they were easy to write.
- An example whose output is correct but stylistically unlike the real
  ones — the model copies style as readily as content.

## The shape of a good example

An example is a miniature prompt. It works best when it contains the same
scaffolding the real request will have, with only the input swapped.

```
Input: "My card was charged twice for the same order."
Output: {"label": "billing", "reason": "Duplicate charge for one order."}

Input: "How do I turn on two-factor authentication?"
Output: {"label": "howto", "reason": "Question about enabling a security setting."}

Input: "Checkout fails with a 500 after I apply a coupon."
Output: {"label": "bug", "reason": "Server error triggered by coupon code."}
```

Three properties make these work. The **input block** is delimited so the
model sees the boundary between instruction and data. The **output block**
is exactly the shape required, including keys and quoting. The
**labelling is consistent** — one label per input, no hedging, no
commentary.

That last point is where many hand-written sets fail. If two examples
disagree in style, the model averages them and produces output in a third
style nobody wanted.

## Where examples come from

The best examples are usually the **hard cases from production** — the
inputs that made you write the rule in the first place. A practical loop:

1. Log real inputs and the answer you wish you had given.
2. Cluster the failures by type.
3. Write one example per cluster, starting with the cluster that causes the
   most damage.
4. Re-test on the whole failure set, not just the cluster you just fixed.

This is the **label mapping** step, and it is the one teams skip. If your
prompt says "sentiment: positive / negative / neutral" but your customers
say "frustrated but loyal", the examples are where you discover that the
taxonomy needs a fourth bucket.

> Write the examples from the failures, not from the imagination.

## When not to use examples

Examples are not free. They consume context, they can bias the model
toward the topics the examples cover, and they slow every request.

Skip them when:

- The task is genuinely simple and the output format is fully specified.
- The model lacks the underlying knowledge — fix the context or use
  retrieval instead.
- The input distribution is wide and a handful of examples would misrepresent
  it.
- You are token-constrained and a clear specification works nearly as well.

The last case deserves a sanity check, because it is counter-intuitive: on
simple, well-specified tasks, a long instruction and a couple of examples
perform similarly, and the instruction is cheaper and easier to maintain.
Measure it on your own task rather than assuming.
