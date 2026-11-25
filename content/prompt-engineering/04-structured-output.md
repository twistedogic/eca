# Structured output

Half of the engineering effort in an LLM feature is spent on the output
side: parsing what came back, deciding whether it is usable, and coping
when it is not. Structured output is how you push that work upstream into
the prompt, where it is cheap to fix.

## Why structure beats prose

A prose answer has to be read by a human or parsed by a fragile regular
expression. A **structured output** — JSON, a fixed set of headings, a
table with known columns — can be consumed by code directly.

```
Return a JSON object with exactly these keys:
  "summary":  string, one sentence
  "severity": one of "low" | "medium" | "high"
  "tags":     array of strings, at most 3, each lowercase

No prose before or after the JSON object.
```

Three things are specified: the keys, the types, and the allowed values. The stop condition matters as much as the schema — "no prose
before or after" removes the preamble that otherwise breaks a strict
parser.

Notice also what is not specified: how to think about severity, or when
"low" beats "medium". The schema constrains the answer's shape; the
rubric constrains its content. Both are needed.

## JSON and schemas

If the consumer is code, ask for **JSON schema** style output, and prefer
the strictest form the consumer can accept. Strict means:

- exactly the keys you named, no extras;
- the exact types you named;
- no trailing commas, no comments, no single quotes;
- no prose wrapper.

```
Return a JSON array of objects. Each object has exactly two keys:
  "id":      string
  "summary": string
Return at most 5 objects, ordered by descending severity. Output only the
JSON array.
```

When the model supports structured output directly, prefer that: the
schema is enforced during decoding, so a malformed answer is impossible
rather than merely unlikely. When it does not, the prompt above is the
fallback, and the parser must still be defensive.

## Delimiters and tags

The other half of structured output is the **input** side. Text pasted into
a prompt needs explicit boundaries so the model can tell instruction from
data. **XML-style tags** are the common choice:

```
<document>
Support policy: refunds are available for 30 days after purchase.
</document>

Question: can I get a refund after 40 days?

Answer using only the content inside <document>. If the answer is not
there, reply exactly: NOT_FOUND
```

Tags beat bare triple quotes because they nest, they cannot collide with
prose, and they survive copy-paste. They also make the extraction trivial:
the payload between `<document>` and `</document>` is your data.

> Untrusted content inside the prompt is data, never instructions. Tags
> make that boundary explicit.

## Constrained decoding

**Constrained decoding** is the strongest form of the idea: the model's
sampler is restricted so that only tokens which keep the output valid are
allowed. If the schema says the field is an integer, the token stream
cannot produce a word there.

This turns a probabilistic instruction into a hard guarantee, and it is the
difference between "the model usually returns valid JSON" and "the output
is always parseable". The trade-off is flexibility: the model can no longer
produce an answer outside the grammar, so unusual-but-valid answers must
be expressible in the schema. If your schema is too narrow, the model
starts producing empty or default values rather than saying what it means.

Constrained decoding also helps with **enum-constrained choices**: the
label set becomes a whitelist, so the model can never invent a sixth
category.

## Parsing and repairing

Even with a perfect prompt, plan for the parse to fail. The recovery
ladder, cheapest first:

1. **Parse leniently** — strip code fences, take the outermost braces, fix
   trailing commas.
2. **Repair with the model** — send the broken output back with a
   **repair prompt** that says what is wrong and asks for the same content
   in the required shape. This is a second call, so it costs latency and
   money; keep it rare.
3. **Fail loudly** — if the output is unusable, hand it to a human or a
   fallback path instead of inventing a plausible answer.

```
Your previous output was not valid JSON.

Output received:
<output>
{summary: "payments failing", severity: "high"}
</output>

Return the same information as a JSON object with keys "summary" (string)
and "severity" (one of "low", "medium", "high"). Output only the JSON.
```

The third rung is the one people skip and regret. A pipeline that
substitutes a default answer for a failed parse turns a visible outage
into silent wrong data, which is far more expensive to detect.
