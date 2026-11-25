# Tool use and agent prompts

A tool turns a model from something that answers into something that acts.
The prompt has to change with it: the model now needs to know what it can
do, when to do it, and what to do when the tool says no.

## What a tool call is

With **function calling**, the model does not execute anything. It emits a
request to call a named function with arguments, your code runs the
function, and the result is sent back as a tool message. The model then
writes the next request.

```
user: What is the weather in Oslo?

assistant (tool call): {"name": "get_weather", "arguments": {"city": "Oslo"}}
tool: {"temp_c": 4, "conditions": "rain"}
assistant: It is 4°C and raining in Oslo.
```

Three consequences. The model has a **vocabulary of actions** — the tools
you gave it and nothing else. Control flow is driven by the **tool
results**: the model decides again after each result. And your code is in
the loop at every step, which is where you can authorise, rate-limit, log,
or refuse.

The loop is the part people underestimate:

```
while not done:
    request = model.next(messages)
    if request is a tool call:
        if not allowed(request):
            messages.append(refusal(request))
            continue
        messages.append(run(request))
    else:
        done = True
```

## Describing tools

A **tool schema** is a contract. It is the only documentation the model
gets about what a tool does, so it has to carry the whole burden: what the
tool does, when to use it, what each argument means, what the result
looks like, and what to do when the result is empty or an error.

```
name: search_invoices
description: Find invoices for a customer. Use when the user asks about
  billing, charges, or payment history. Returns a list of invoices, most
  recent first. An empty list means no matching invoices exist.
parameters:
  customer_id: string, the customer's id, e.g. "cus_01H9"
  status: string, optional, one of "paid" | "unpaid" | "refunded"
  limit: integer, optional, default 10, maximum 50
```

Three habits make schemas work. **Say when to use it and when not to**,
in the description, because the model picks tools by description when
several are plausible. **Describe the empty and error results**, because
"no results" and "the call failed" need different next steps. And **state
the units, the format, and the limits** — `limit` without "maximum 50" is
an invitation to ask for ten thousand rows.

Descriptions should be written for the model, not for humans. If a
human-facing API reference and a tool description disagree, the tool
description wins in production.

## Deciding when to call

The model decides to call a tool when the description implies the task
needs it. Two failure modes sit on either side of the decision.

**Over-calling**: the model calls a tool it does not need, because the
description is broad enough to match. The fix is narrower descriptions
and explicit "do not use this for ..." clauses.

**Under-calling**: the model answers from memory when the answer requires
the tool — a current price, a private record. The fix is to name the
requirement in the task: "look it up with search_invoices before
answering; if the invoice list is empty, say so".

A third failure is **asking the user** when a tool would have answered.
That is sometimes right (the tool cannot know), but when the model has a
tool that covers the case, it should call it. Being explicit about which
tools cover which topics removes the ambiguity.

## Failure and recovery

Tools fail. Networks time out, permissions are denied, arguments are
missing. The prompt needs a policy for each, because the default behaviour
of a helpful model is to invent.

- **Tool error** — retry with the same arguments at most twice, then
  report the failure. Never fabricate a result.
- **Empty result** — say so, and treat it as an answer, not an error.
- **Denied by policy** — tell the user what was refused and why; do not
  retry it in a different shape hoping it passes.
- **Invalid arguments** — the schema should prevent most of this, but a
  validation error should be returned as a tool result so the model can
  correct and retry once.

```
When a tool fails twice, stop calling it and explain what failed.
Never state a result you did not receive from a tool.
```

The last sentence is the important one. **Idempotency** is the other half
of this: a retried call must not duplicate the effect. Read-only calls are
safe to retry; a call that sends an email or charges a card needs an
idempotency key, so the retry cannot send twice.

## Guardrails and permissions

A **guardrail** is a check that happens outside the model. The model
proposes; the code decides. This is the only reliable place to enforce
limits, because the model is not a security boundary — it is a
proposal generator.

```
if request.name not in ALLOWED_TOOLS:
    refuse
if request.name == "send_email" and not approved_by_human:
    refuse
if request.arguments["limit"] > 50:
    clamp and log
```

Guardrails worth having in any agent loop:

- an **allow-list** of tools, per role or per request.
- an **approval gate** for irreversible or outward-facing actions (sending,
  paying, deleting, publishing).
- **argument validation** at the boundary, treating model output as
  untrusted input.
- **budgets** — max steps, max tokens, max wall-clock time — so a loop
  that is going nowhere stops.
- **logging** of every call, its arguments, and its result.

The agent loop is also where you decide what "done" means. If the model
has no way to signal completion, it will keep working until it hits the
step budget. A clear finish condition in the prompt — a final answer that
must contain a specific marker — ends the loop deterministically.

> The model's job is to propose the next action. Your code's job is to
> decide whether it is allowed.
