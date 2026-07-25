# Authoring a whole Part, unsupervised

The deterministic runbook for taking the next Napkin part from nothing to
merged-and-green without user supervision. Every step is scripted or a
fixed agent fan-out; `AUTHORING.md` is the per-chapter spec the agents read.

## Operating mode (default — minimise user involvement)

When the user says "next part" / "carry on" / "do the rest", run the whole
flow below **without pausing to ask**. Use sensible defaults; don't open
AskUserQuestion for scope, slugs, or style. Run parts **back-to-back** when
asked for more than one — finish a part fully (green e2e + committed),
then start the next — and only return to the user for a genuine **blocker**:

- a source chapter that's a stub (`(TO DO)` / "to be written") — nothing
  faithful to author;
- a reviewer finding that's a real math judgment call, not a clear fix;
- a failure you can't resolve after a reasonable attempt.

Keep progress terse: a one-line status per phase, and a short final summary
per part (chapters, slide count, e2e result, any review fixes). Don't
narrate every tool call. Never push or deploy unless asked.

## 0. Plan

```sh
node scripts/plan-part.mjs --human
```

Shows the next unwired part: its chapters, source `.tex` paths, portal
chapter numbers, dir slugs, and **incompleteness flags**. Decide the
policy for any flagged chapter before proceeding:

- **Part marked `(TO DO)`** (e.g. Probability) or a chapter `% To be written`
  → the source is a stub. **Stop and ask the user** — there's nothing
  faithful to author. Don't invent material.
- **`% missing sols` / `% missing probs`** → author normally; the chapter
  just has fewer problems. The brief tells the agent not to invent them.

## 1. Generate briefs

```sh
node scripts/author-part-brief.mjs > /tmp/briefs.txt
```

One complete brief per chapter (sections, problem count, per-chapter
glossary file, all guardrails baked in).

## 2. Fan out chapter agents

Launch **one agent per chapter in a single message** (so they run
concurrently), each with the generated brief:

- `subagent_type: general-purpose`, `model: sonnet`, `isolation: "worktree"`.

Sonnet is sufficient (see memory). The worktree isolation gives each its
own checkout; glossary edits no longer collide because each chapter writes
its own `glossary-chapters/*.ts` file.

## 3. Review pass (quality gate the build can't give)

When all authoring agents report done, fan out **one reviewer per chapter**
(parallel, can be sonnet or a stronger model for proof-heavy chapters).
Reviewer brief:

> Read every slide under `src/pages/<chapterDir>/` and the source
> `vendor/napkin/tex/<area>/<file>.tex`. Report, as a list: (a) any
> mathematically wrong or misleading statement, (b) any key theorem/idea in
> the source that the slides omit, (c) any exercise whose stated answer is
> wrong. Quote the slide file + line. Do NOT edit anything; just report.
> If the chapter is faithful and correct, say so.

Triage the findings: fix material errors (wrong math, wrong answers) and
genuine omissions; ignore stylistic nits. Dispatch fixes to a quick agent
or do them inline, then re-run that chapter's `verify-chapter` + `check`.

## 4. Land it (one command)

```sh
node scripts/land-part.mjs        # extract → verify → wire → commit → build → e2e
```

This collapses the whole deterministic tail. After extraction it runs
`verify-chapter` on every landed chapter as a **fail-closed gate** (this used
to be advisory, and Part XIV shipped 4 broken e2e anchors because nothing
enforced it). Mechanical defects — dead islands, bad `Callout` kinds, unknown
`<Term>` keys, MCQ button matchers that hit ≥2 options — fail here in ~1 s per
chapter, before the ~1-min build. Assertion-text mismatches print as warnings;
the full e2e run at the end is their authoritative gate. Under the hood it
**extracts each branch's additive files** (slides, `glossary-chapters/*.ts`,
the e2e spec) onto main rather than 3-way merging — agent worktrees have
branched from a *stale* base commit, which would make a real merge conflict
on shared files like `glossary.ts`; extraction only touches new files +
macro additions, so the base doesn't matter. It then wires slide-nav,
commits that, builds, and runs the full e2e. It stops at the first failure
with a clear message. Re-run it after fixing a failure (it's idempotent —
finalize finds no worktrees the second time and skips).

(If the worktrees were already cleaned up, `git checkout <branch> -- <chapter
paths>` per branch does the same extraction by hand.)

## 5. Residual e2e failures

The verifier now catches the historical offenders at authoring time
(missing `client:load`, paraphrased `article.getByText` assertions). What's
left is rare and usually one of:

- A reveal-flow phrase that's also in visible prose (so `toBeHidden` fails)
  → change the assertion to text unique to the solution.
- An MCQ/button label mismatch → align the spec's `name:` to the rendered
  option text.

Read the failing spec + slide, fix, re-run the one spec
(`npx playwright test <slug>`), then the full suite.

## 6. Commit

`finalize-part` and `wire-part` leave their changes committed/staged;
commit the metadata wiring and any review fixes. **Do not push** unless the
user asks.

## What still needs a human

- A `(TO DO)` / "to be written" source chapter (nothing to author faithfully).
- A reviewer finding that's a genuine math judgment call, not a clear error.
- The decision to `git push` / deploy.

Everything else — planning, briefs, authoring, glossary, metadata, merge,
and the common failure modes — is scripted or gated.
