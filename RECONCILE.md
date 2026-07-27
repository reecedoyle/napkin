# Reconciling the portal with an upstream Napkin update

The portal mirrors Evan Chen's *Napkin*, pinned as the `vendor/napkin`
submodule (source of truth — the `.tex`, never the PDF). When upstream
publishes changes, most of it is a proofreading sweep that never touches our
paraphrased slides; a few chapters get real math/notation fixes. This runbook
finds and folds in just those, reusing the authoring pipeline's reviewer pass.

`scripts/plan-reconcile.mjs` does the filtering; you (or a subagent) do the
judgement on the short list it produces.

## 0. Fetch upstream and note the old pin

```sh
git -C vendor/napkin fetch origin
OLD=$(git rev-parse HEAD:vendor/napkin)     # the pin we're upgrading *from*
```

`OLD` is the submodule sha currently recorded in the outer repo. (After you
later bump the pin, the pre-bump value is `git rev-parse <that-commit>~1:vendor/napkin`.)

## 1. See what actually changed for covered content

```sh
node scripts/plan-reconcile.mjs --since $OLD --to origin/main        # readable
node scripts/plan-reconcile.mjs --since $OLD --to origin/main --json # for piping
```

It maps every changed `tex/**/*.tex` back to the portal chapter that covers it
(reverse of `plan-part.mjs`: Napkin.tex parts → `\include` order → our
`part-<n>-…/NN-<slug>/`) and sorts the results:

- **🆕 newly-written** — a source that was a `(TO DO)` stub now has content.
  → author it via `AUTONOMY.md` (not a reconcile — it's new coverage).
- **🔎 SUBSTANTIVE** — the diff changed real math tokens (shown inline, e.g.
  `\times ^ \vee + \RP`) or equation/section structure. This is the list to
  triage.
- **📦 large change, no math delta** — usually a figure swap or new prose
  block; skim.
- **✎ cosmetic** — prose/grammar only; safe to skip.
- **⚙ shared** — `macros.tex`, `preamble.tex`, etc. Check by hand only if a
  macro we render in KaTeX (`src/lib/katex-macros.ts`) changed meaning.

The tool errs toward *showing* (recall over precision): a macro rename or a
`\left`/paren tweak may appear under SUBSTANTIVE. The inline token delta lets
you dismiss those in seconds without opening a file.

## 2. Triage the SUBSTANTIVE list

For each entry, read the one-line token delta:

- Delta is a macro rename we don't use, spacing, or parenthesisation only
  (`\odif`, `\lvert \rvert`, `\left`) → **skip**; our slides transcribe, they
  don't `\input` upstream macros.
- Delta changes a **number, relation, operator, or structure**
  (`6 24`, `\times → +`, `\neq`, an added `\vee`) → **check our slides.**
  Look at the actual hunk:

  ```sh
  git -C vendor/napkin diff $OLD origin/main -- tex/<area>/<file>.tex
  ```

## 3. Fold in the real fixes (reviewer pass, diff-scoped)

For each chapter that survives triage, dispatch one subagent — the P3 reviewer
pass from `AUTONOMY.md`, narrowed to the diff:

> Upstream Napkin changed `vendor/napkin/tex/<area>/<file>.tex`. Here is the
> diff:
> ```
> <paste `git -C vendor/napkin diff $OLD origin/main -- <file>`>
> ```
> Read our slides under `src/pages/<chapterDir>/`. For each change, decide
> whether our slides reproduce the **old, now-corrected** statement. If they
> do, edit the slide to match the correction; if they already had it right (we
> often fix source typos during authoring), report "already correct" and change
> nothing. Do NOT restyle or touch anything the diff doesn't concern. Props are
> strings that render `$…$` (see [[island_props_render_math]]); keep math as
> `$…$` or Unicode, never raw `\cmd` in a prop.

Then, per changed chapter:

```sh
node scripts/verify-chapter.mjs <chapterDir> --tex vendor/napkin/tex/<area>/<file>.tex
```

## 4. Build, test, commit

```sh
npm run build && npm run test:e2e     # or reuse a running preview on :4323
```

Commit the submodule bump and any slide fixes together. **Don't push/deploy
unless asked.** If no slide needed changing (common — the sweep was cosmetic
for us), the bump commit stands alone.

## What still needs a human / judgement

- Whether a borderline SUBSTANTIVE delta actually reaches our (paraphrased)
  slides — the reviewer proposes, you confirm.
- `macros.tex`/`preamble.tex` changes that alter a macro we render.
- Newly-written `(TO DO)` chapters → the full authoring pipeline, your call.
