# Context window management

A long context window removes one class of problem and creates another. It
means you no longer have to choose what to compress away before the model
sees it; it also means you can now bury the instruction in 200 pages of
text and wonder why it was ignored. Managing the context is a skill of its
own.

## The context budget

Every request spends from the same **context budget**: system prompt, few
shot examples, retrieved documents, conversation history, the current
input, and the reply still to come. They share one window.

The first discipline is to write down what each part costs, in tokens, and
to notice which part grows without limit. In most applications the answer
is conversation history and retrieved documents, not the instruction.

The second discipline is that the *output* is part of the budget. Asking
for a 2,000 word answer inside a 4,000 token window leaves half the
window for everything else, and long outputs drift further from the
instruction.

## What to include

The rule is not "include everything relevant" — it is "include what the
answer depends on". A short checklist for each candidate chunk:

- Does the answer change if this chunk is removed?
- Is it the most specific version of the fact? (a resolved answer beats a
  thread that asks the question)
- Is it still true, or has it been superseded?
- Can the model tell what kind of thing it is?

That last point is why a bare list of retrieved documents is weak. Adding a
line of framing per chunk — its title, its date, its type — is often worth
more than another chunk.

```
<source id="runbook-3" type="runbook" date="2026-04">
...
</source>
```

> Retrieval quality and context quality are the same problem seen from
> two ends.

## Long context and lost in the middle

Models attend most reliably to the beginning and the end of a long input.
Material in the middle — the **lost in the middle** effect — is retrieved
less often even when it is relevant.

Three practical responses:

1. **Put the instruction last**, after the material, when the instruction
   is the thing being missed.
2. **Put the most relevant material at the ends** — a summary at the top,
   the full text below it.
3. **Restate the question after the material**, so the task is adjacent to
   the evidence it applies to.

None of these is a substitute for good selection. They are cheap insurance
for when selection cannot be perfect.

## Retrieval instead of pasting

**Retrieval** beats pasting whenever you have more material than fits, or
more material than the answer depends on. Retrieval-augmented generation
splits the problem into two: find the right text, then answer from it.

Two failure modes dominate, and they are different problems:

- **Recall failure** — the right document was never retrieved. Fix the
  search, the **chunking**, and the query.
- **Precision failure** — ten mostly-irrelevant chunks were retrieved and
  the model answered from the noise. Fix the ranking and the number of
  chunks.

Useful knobs: how a document is split into **chunking** units (by heading,
not by fixed token count, when the structure allows), how many chunks are
returned, and whether the chunk text carries its title and date. Chunking
is where most retrieval quality is won or lost, and it is a much cheaper
place to experiment than the prompt.

## Compaction and summarisation

Long conversations and long agent runs overflow their budget. **Compaction**
is the standard fix: when the history crosses a threshold, summarise the
old part into a note and keep the recent turns verbatim.

```
[Summary of earlier conversation]
The user asked for a migration plan from schema v2 to v3. Decisions so far:
keep the old table for one release cycle; backfill nightly; no dual writes.
Open question: what to do with rows missing a tenant_id.
[End of summary]
```

Two rules make compaction safe. Keep the **decisions and open questions**,
not the transcript — a summary of what was said is nearly useless, while a
summary of what was decided is the whole point. And never compact away
**constraints** the model still has to obey; restate them after the
compaction point.

Compaction is lossy, so treat it as a context decision, not a cleanup
step: log the compacted summaries, and when a later answer looks wrong,
check what the summary dropped.
