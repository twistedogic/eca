# The anatomy of a prompt

A prompt is not an incantation. It is the *entire* input a model sees: the
role it is asked to play, the task, the material it must work from, the
shape of the answer you want, and nothing else. Every technique in this
topic is a way of making that input more complete, or of making the model's
job smaller.

## What the model actually receives

Chat models take a list of **messages**, and each message carries a **role**.
A **system prompt** sets persistent behaviour for the whole conversation. A
**user message** carries the actual request. An **assistant message** holds
a previous reply, so the transcript itself becomes context. A tool message
carries the result of a function the model asked to run.

```
system: You are a terse release-notes writer for a database product.
user:   Here are the merged PRs. Write release notes.
        <pull_requests>
        ...
        </pull_requests>
```

Two consequences follow immediately. First, the model has no memory beyond
the messages you send: anything you want it to know has to be in the
prompt. Second, the model does not distinguish "important instruction" from
"data I pasted in" unless you make the distinction visible — which is why
**delimiters** and explicit labels matter so much.

Everything you send is measured in **tokens**. A token is roughly three
quarters of a word, but not exactly: rare words split into several tokens,
code splits at punctuation, and a JSON object can cost three times what the
same information costs in prose. The **context window** is the total token
budget for the whole conversation, including the reply being generated.

## The parts of a complete prompt

A prompt that works reliably tends to have the same parts, even when it is
written casually. Naming them makes the difference between "the model was
vague" and "the prompt was vague" visible.

- **Role** — who the model is and what standards it answers to. "You are a
  senior SRE writing an incident review" beats "help me".
- **Task** — the single verb you want performed: classify, extract,
  rewrite, rank, explain, debug. One task per prompt.
- **Context** — the input material: the log, the email, the schema, the
  ticket. This is the part that grows, and the part that must be
  delimited.
- **Constraints** — the limits: length, tone, allowed vocabulary, what to
  do when the input is missing a field.
- **Output specification** — the exact shape of the answer: a JSON schema,
  a fixed set of headings, a single number.
- **Examples** — one or two samples of a good answer, when words alone
  leave the target ambiguous.

> A prompt is a **specification**: it says what to produce, from what, under
> which limits, and in what shape.

## Anatomy at a glance

The diagram below is the shape to keep in your head when reviewing a prompt.
The parts are ordered by how often they are missing, not by how interesting
they are.

<svg width="640" viewBox="0 0 640 300" role="img" aria-label="A stack of labelled blocks showing the parts of a prompt: role, task, context, constraints, output specification, and examples, with the context block drawn largest." xmlns="http://www.w3.org/2000/svg">
  <rect x="20" y="20" width="600" height="34" rx="6" fill="var(--accent)" opacity="0.18" stroke="var(--accent)"/>
  <text x="36" y="42" font-size="15" fill="var(--ink)">role — who the model is</text>
  <rect x="20" y="62" width="600" height="34" rx="6" fill="var(--accent)" opacity="0.18" stroke="var(--accent)"/>
  <text x="36" y="84" font-size="15" fill="var(--ink)">task — one verb, one job</text>
  <rect x="20" y="104" width="600" height="70" rx="6" fill="var(--ok)" opacity="0.22" stroke="var(--ok)"/>
  <text x="36" y="126" font-size="15" fill="var(--ink)">context — the material to work from</text>
  <text x="36" y="150" font-size="14" fill="var(--muted)">delimited, and usually the biggest block</text>
  <rect x="20" y="182" width="600" height="34" rx="6" fill="var(--accent)" opacity="0.18" stroke="var(--accent)"/>
  <text x="36" y="204" font-size="15" fill="var(--ink)">constraints — length, tone, edge cases</text>
  <rect x="20" y="224" width="600" height="34" rx="6" fill="var(--accent)" opacity="0.18" stroke="var(--accent)"/>
  <text x="36" y="246" font-size="15" fill="var(--ink)">output specification — exact shape of the answer</text>
  <rect x="20" y="266" width="600" height="28" rx="6" fill="var(--muted)" opacity="0.25" stroke="var(--muted)"/>
  <text x="36" y="285" font-size="15" fill="var(--ink)">examples — optional, when words are ambiguous</text>
</svg>

Not every prompt needs every part. A one-line rewrite needs none of them. A
prompt that runs unattended in production needs all six, because nobody is
there to notice when the output drifts.

## Tokens, cost, and latency

Three properties of a prompt matter operationally.

**Cost** is roughly proportional to tokens in plus tokens out. Long context
that is pasted in on every request is the usual culprit.

**Latency** grows with the number of tokens processed and with the number of
**reasoning steps** the model takes. Asking for a long deliberation costs
both.

**Reliability** is what a bigger context actually buys you: more evidence
in the prompt means fewer inferences the model has to make from scratch. The
trade-off is not "shorter is always better". It is "every token should
earn its place".

> The right context length is the shortest prompt that contains everything
> the answer depends on.

## Where prompts live in code

In an application the prompt is a **prompt template**: a string with
placeholders, filled in per request. Keeping it in code rather than in a
scattered notebook makes it reviewable, diffable, and versioned.

```python
TEMPLATE = """You are a triage assistant for a payments service.
Classify the support ticket below as exactly one of: bug, billing, howto, other.

Ticket:
<ticket>
{ticket}
</ticket>

Reply with JSON: {{"label": "<one of the labels>", "reason": "<one sentence>"}}
"""

def build_prompt(ticket: str) -> str:
    return TEMPLATE.replace("{ticket}", ticket)
```

Notice what the template does: it fixes the parts that never change (role,
labels, output shape) and leaves exactly one variable slot. A template with
one variable is easy to test; a prompt that is re-assembled from strings at
five call sites is not.
