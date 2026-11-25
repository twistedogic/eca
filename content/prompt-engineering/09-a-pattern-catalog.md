# A pattern catalogue

Most prompts are one of a handful of shapes wearing different clothes. This
chapter is the reference shelf: each **pattern** below has a skeleton to
copy, a worked example, and the failure it is prone to.

## How to read this catalogue

A pattern is not a prompt. It is the fixed **skeleton** — role, task,
format, and the constraints that always hold — with the parts that vary
left as slots. Filling the slots is the work; the skeleton is what stops
you from reinventing the structure each time.

Each entry gives you:

- Use it when — the situation where it earns its keep.
- **Skeleton** — the prompt frame, with `{slot}` placeholders.
- Example — a filled-in instance.
- Breaks when — the failure mode to watch for.

## Extraction

Use it when you need fields pulled out of free text: a log line, an
email, a contract clause.

**Skeleton**

```
Extract {fields} from the text below.

Text:
<text>
{text}
</text>

Rules:
- Copy values verbatim from the text; do not paraphrase.
- If a field is absent, use null.
- Return a JSON object with exactly these keys: {field list}.

JSON:
```

Example

```
Extract order_id, total, and currency from the text below.
...
Return a JSON object with exactly these keys: order_id, total, currency.
```

Breaks when the model starts inferring values that were never in the
text. "Copy values verbatim" plus "use null" is what prevents it, and
"verbatim" beats "the order id" every time.

## Classification

Use it when one input maps to one of a fixed set of labels.

**Skeleton**

```
Classify the input as exactly one of: {labels}.

<input>
{input}
</input>

Guidance:
{one line per label, saying what belongs in it}

Output: {"label": "<one of the labels>", "confidence": <0-1>}
```

Example

```
Guidance:
- bug: the product malfunctioned or produced a wrong result
- billing: the question is about charges, refunds, or invoices
- howto: the question asks how to do something
- other: none of the above
```

Breaks when the labels overlap. Overlapping guidance is fixed by
examples, not by more prose — two examples of the same input with different
labels teach nothing, but one example of the *boundary* case fixes the
overlap.

## Summarisation

Use it when the output is shorter than the input and aimed at a
specific reader.

**Skeleton**

```
Summarise the {document type} for {audience}.

Audience needs: {what they must be able to do after reading}.
Leave out: {the categories of detail that do not matter to them}.

<document>
{document}
</document>

Summary ({length} words max):
```

Example

```
Audience needs: decide whether to escalate to engineering.
Leave out: customer names, ticket history, and anything already resolved.
```

Breaks when you name an audience without saying what it needs. "For an
executive" leaves length, tone, and level of detail to the model's prior;
"to decide whether to escalate to engineering" pins all three.

## Transformation

Use it when the content should stay recognisable while changing
form: rewrite, translate, reformat, modernise.

**Skeleton**

```
Rewrite the {source} as {target}.

Keep: {what must survive the rewrite}.
Change: {what must change}.

<source>
{source}
</source>

{target}:
```

Example

```
Rewrite the release notes as a customer-facing changelog.
Keep: the version number, the date, and every user-visible change.
Change: remove internal ticket ids and infrastructure details.
```

Breaks when "keep" and "change" overlap. State the precedence
explicitly — "keep every user-visible change even if it is minor" — or the
model will resolve the conflict in whichever direction is easier.

## Generation with a rubric

Use it when the answer is open-ended but gradeable: an incident review,
a design proposal, a migration plan.

**Skeleton**

```
Write {artefact} for {audience}.

Constraints:
{hard constraints}

Quality bar:
{rubric, 3-6 criteria, each one line}

Example of the bar:
{one short sample}
```

Example

```
Quality bar:
- every recommendation names the file or service it touches
- every risk has a mitigation
- no recommendation needs a change to another team's service

Example of the bar:
"Move the retry policy to the gateway: it is per-route, so one change
covers every caller, and it removes the retry loop from three services."
```

Breaks when the rubric has no failing example. "Mention risks" is not
a bar; "every risk has a mitigation" is, because you can check it.

## Critique and revise

Use it when a first draft exists and needs to be sharpened.

**Skeleton**

```
Below is a draft and the criteria it must meet.

<draft>
{draft}
</draft>

Criteria:
{criteria}

Reply with:
1. The single biggest weakness, in one sentence.
2. A revised draft that fixes it.
Do not list further weaknesses after the revision.
```

Example

```
Criteria:
- every claim traces to the evidence in the request
- the recommendation fits in two sentences
```

Breaks when the critique is unbounded. "List every weakness" produces a
laundry list that the revision cannot address; asking for the single
biggest one forces a decision.

## Interview and refine

Use it when the request is underspecified and guessing is expensive.

**Skeleton**

```
Before you answer, ask me up to {n} questions about anything that would
change the answer. Skip questions whose answers would not change anything.

Then answer.
```

Example

```
Before you answer, ask me up to 3 questions about anything that would
change the answer: deployment target, traffic volume, existing
infrastructure.
```

Breaks when the model asks questions it could have answered from the
context. The clause "skip questions whose answers would not change
anything" plus "use only what is in the request" is what keeps it
focused.

## Adversarial review

Use it when the answer will be acted on and the cost of a missed
problem is high: a security change, a migration plan, a financial
decision.

**Skeleton**

```
You are a hostile reviewer. Assume the proposal below has a flaw, and
find it.

<proposal>
{proposal}
</proposal>

Report:
1. The strongest objection, with the specific line it applies to.
2. What evidence would settle it.
3. If you cannot find a real objection, say so plainly.
```

Example

```
Report:
1. The strongest objection, with the specific line it applies to.
2. What evidence would settle it.
3. If you cannot find a real objection, say so plainly.
```

Breaks when the reviewer is allowed to invent problems. The third
clause is not decoration: without permission to say "no objection", the
reviewer produces objections to fill the role, and a real team learns to
ignore it.

## The catalogue at a glance

| Pattern | Output | Main lever |
| --- | --- | --- |
| Extraction | Fixed fields | "verbatim", null for absent |
| Classification | One label | Per-label guidance and examples |
| Summarisation | Short prose | Audience and its needs |
| Transformation | Same content, new form | Explicit keep/change split |
| Generation with a rubric | Open-ended text | Rubric and a sample of the bar |
| Critique and revise | Sharper draft | One weakness at a time |
| Interview and refine | Answer plus questions | Skip questions that cannot change the answer |
| Adversarial review | Objections or "none" | Permission to find nothing |

> Patterns are starting points, not laws. The evaluation set decides which
> one works for your task.
