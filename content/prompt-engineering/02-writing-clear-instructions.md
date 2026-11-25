# Writing clear instructions

Most prompt failures are not model failures. They are underspecified
instructions that the model resolves using the most common prior it has —
which is rarely the one you wanted. Fixing the specification is cheaper
than fixing the output afterwards.

## Vague instructions and what they cost

Compare two prompts for the same job.

    Summarise this ticket.

    Summarise this support ticket for a support manager who has not read
    it. Use three bullet points: what broke, who is affected, what happens
    next. Use the customer's wording for the product name. Do not speculate
    about causes.

The second prompt is longer, and it is the shorter one that costs you. A
**vague prompt** makes the model guess, and the guesses are drawn from the
broadest distribution available: the average support ticket summary, the
average essay, the average SQL query.

The concrete symptom is **ambiguity**: two equally valid readings of the
same instruction, producing answers that differ in ways you did not
choose. Ambiguity is worth hunting down precisely because it does not show
up as an error. It shows up as two good-looking answers.

> Vague prompts do not fail loudly. They fail as a set of plausible
> answers that never quite match what you wanted.

## Say what you want, not what you do not want

Negative constraints are weak. "Do not be verbose" is weaker than "answer
in at most 120 words" because it asks the model to search for a concept
(verbosity) and then invert it, with no target to aim at. This applies to
style, format, and content alike.

- "No markdown" → "Reply as plain text with no formatting characters."
- "Don't make things up" → "Use only facts present in the input. If a
  required fact is missing, output the word `UNKNOWN`."
- "Be concise" → "Answer in at most three sentences."

The rewritten versions give the model something checkable. "At most three
sentences" can be verified by a script; "be concise" cannot be verified by
anything, including the model.

## Constraints that survive

A **constraint** survives when it is attached to a measurable property of
the output. Good constraint targets: maximum length, allowed vocabulary,
required section headings, permitted labels, prohibited content, audience
and reading level.

The best constraints are **acceptance criteria**: a checklist the output
can be judged against, by you or by a model acting as a judge.

    Acceptance criteria:
    1. Every claim traces to a sentence in the input.
    2. No number appears that is not in the input.
    3. The summary is under 150 words.
    4. The first line states the recommended action.

Criteria like these turn "write a good summary" into a reviewable
specification. They also translate directly into test assertions, which is
what chapter 7 turns into an evaluation set.

## Specifying the output

**Output format** is the part of a prompt people leave out and then pay
for downstream, in a parser that breaks at 2am on an unexpected answer.

Ask for structure explicitly, and prefer the strictest structure the
consumer of the answer can actually parse.

    Return a JSON object with exactly these keys:
      "verdict": one of "pass" | "fail"
      "issues": array of strings, each starting with the line number of the
                offending code
      "confidence": number between 0 and 1

    No prose before or after the JSON object.

Two details do most of the work. First, **enumeration**: list the allowed
values instead of describing them ("one of `pass` or `fail`" rather than
"say whether it passes"). Second, a **stop condition**: "no prose before or
after" removes the most common failure of structured output, where the
model wraps the JSON in a friendly preamble.

> An output specification is what lets you stop reading the answer and
> start parsing it.

## Show the shape, not the recipe

There is a limit to how much specification a model can absorb. Long rule
lists get followed unevenly: early rules are honoured, late rules are
skipped, and the number of rules affects reliability more than their
severity.

Past a handful of rules, it is usually better to **show** the target
rather than describe it. One well-chosen example carries more information
than a paragraph of rules, because an example resolves every ambiguity at
once — length, tone, ordering, level of detail, what to omit.

```
Summarise the incident for an executive audience.

Good example:
  "Payments started failing for 4% of EU customers between 09:02 and 09:41
   UTC. No data was lost. Root cause was an expired certificate on the
   card-vault connection pool. Fix shipped at 09:38."
```

Notice the example also does something no rule would: it shows what was
*left out*. The exception stack, the customer list, the timeline of the
deploy. Omission is part of the shape, and an example is the only compact
way to demonstrate it.
