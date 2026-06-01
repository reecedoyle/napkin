# Authoring a chapter

Single reference for any sub-agent (or human) authoring a chapter for the
napkin learning portal. The brief that spawns you should be tiny — read
this for everything else.

## TL;DR

1. Read the source TeX at `vendor/napkin/tex/<area>/<chapter>.tex`.
2. Author MDX slides under `src/pages/<part-dir>/<chapter-dir>/<NN-section>/<MM-slide>.mdx`.
3. Add a glossary section block to `src/lib/glossary.ts`.
4. Write one chapter-level e2e spec at `tests/e2e/<chapter-slug>.spec.ts`.
5. Run `node scripts/verify-chapter.mjs <chapter-dir>` and `npm run check` — fix anything they report.
6. Commit incrementally (one commit per section) so partial progress survives a stall.

You're working in a dedicated git worktree on a dedicated branch. The
parent worktree handles merging back to `main` and adding the chapter
to `chapterTitles` in `slide-nav.ts` — **don't touch `slide-nav.ts`**.

## Where things live

| What | Where |
| --- | --- |
| Slides | `src/pages/<part-dir>/<chapter-dir>/<NN-section-slug>/<MM-slide-slug>.mdx` |
| Layout | `@/layouts/SlideLayout.astro` |
| Callouts | `@/components/Callout.astro` |
| Term wrapper | `@/components/Term.astro` |
| Figure wrapper | `@/components/Figure.astro` |
| Exercises | `@/components/{MCQ,NumericInput,ProofReveal,Problem}` |
| Glossary | `src/lib/glossary.ts` |
| KaTeX macros | `src/lib/katex-macros.ts` |
| Tests | `tests/e2e/<chapter-slug>.spec.ts` |
| Raster figures | `public/figures/<chapter-slug>/<file>` |

Use the `@/` alias — never `../../../../`.

## MDX file template

```mdx
---
title: <Slide title>
---
import SlideLayout from '@/layouts/SlideLayout.astro';
import Callout from '@/components/Callout.astro';
import Term from '@/components/Term.astro';
import MCQ from '@/components/MCQ';            // only if used
import NumericInput from '@/components/NumericInput';
import ProofReveal from '@/components/ProofReveal';
import Problem from '@/components/Problem';

<SlideLayout title="<Slide title>">

… slide content …

</SlideLayout>
```

`SlideLayout` takes only `title`. The header breadcrumb (Part · Chapter ·
Section) is auto-derived from the slide's URL via `src/lib/slide-nav.ts`.
**Do not pass `part` or `chapter` props.**

## Slide style

- One focused idea per slide. If it would scroll, split it.
- ~1–4 prose blocks, possibly one `<Callout>`, possibly one `<Figure>`,
  possibly one or more exercise components.
- ~30–40 slides per chapter total. Split across submodules — one per
  TeX `\section{}`.
- Naming: `01-section-slug/01-slide-slug.mdx`. The two-digit prefix
  controls ordering. Section titles auto-infer from the slug (e.g.
  `04-homeomorphisms` → "§4 — Homeomorphisms"), so pick descriptive
  kebab-case names.

## Components

### Callout

```mdx
<Callout kind="definition" title="Group">
…
</Callout>
```

Kinds: `definition`, `theorem`, `proposition`, `lemma`, `corollary`,
`example`, `remark`, `question`, `exercise`. Title is optional but
strongly preferred.

### Term

```mdx
… the additive group <Term k="ZZ">$(\ZZ, +)$</Term> …
```

Wrap **every** mathematical notation. The key references an entry in
`src/lib/glossary.ts`. **Never** explain notation via an inline
parenthetical "(here X means Y)" — the user has explicitly disallowed
this. The hover tooltip and glossary entry are the explanation channel.

### KaTeX

Inline `$...$` and display `$$...$$`. Macros in `src/lib/katex-macros.ts`
are available: `\ZZ \RR \QQ \CC \NN \FF \Zc{n} \Zcc{p-1} \Zm{p} \ord
\abs{x} \norm{v} \GL \SL \Aut \Inn \Syl \Gal \id \defeq \half \eps \inv
\Mat` and more. If you need a new shorthand, add it there.

### Exercises

Each exercise has a stable kebab-case `id`, scoped to the chapter:
`"<chapter-prefix>-<section>-<kind>-<slug>"`, e.g. `"quot-hom-mcq-kernel"`.
Two exercises on one slide must have different ids. Storage key is
`napkin:exercise:<slidePath>#<id>`.

| TeX | Component | Notes |
| --- | --- | --- |
| Concept check / "Which of the following…" | `<MCQ>` | 3–4 options, one correct, explanation |
| Numeric or simple-symbolic answer | `<NumericInput>` | Pass `expected`. Normalised (`1/2` ≡ `0.5`). |
| "Show / prove X" | `<ProofReveal>` | Prompt + reveal |
| `\begin{problem}` | `<Problem difficulty="standard">` | Optional hint + required solution |
| `\begin{sproblem}` | `<Problem difficulty="starred">` | ★ |
| `\begin{dproblem}` | `<Problem difficulty="daggered">` | ✦ |

**Every** problem block in the TeX source must map to a `<Problem>` on a
slide in the chapter's problems section. The verifier checks this.

## Glossary

Add new entries at the bottom of `src/lib/glossary.ts` under a new
section block:

```ts
// ────────────── Chapter N — <Chapter name> ──────────────
mySymbol: {
  term: '<plain-text name>',                    // appears in tooltip
  symbol: '\\mySymbolLatex',                    // optional, /glossary page only
  definition: '<1–3 plain-text sentences>.',    // tooltip + page. Use Unicode (ℤ, ℝ) — no LaTeX.
  example: '<optional plain-text example>.',
},
```

Keys are short camelCase. Read existing entries first — match the depth
and Unicode conventions. The verifier checks every `<Term k="X">` against
this file.

## Voice

The reader is a CS-trained adult rebuilding undergraduate math. They
know abstraction; they've forgotten the math. Frame ideas concretely
before going formal. Prose is terse — the slide structure (Callouts,
exercises) does the heavy lifting. Evan Chen is conversational and uses
"we" — match that tone.

## Tests

One spec at `tests/e2e/<chapter-slug>.spec.ts`. Copy the structure of
`tests/e2e/ring-flavors.spec.ts` — replace the URL list, retitle the
describes, but keep the four exercise-flow blocks (MCQ, NumericInput,
ProofReveal, Problem). Pick one slide per exercise type to cover.

When asserting on slide text, **match a unique phrase from the actual
solution / explanation prose**, not a phrase you hope is there. The
parent has had to fix several "expected wording" mismatches.

## Self-verify before reporting done

```sh
node scripts/verify-chapter.mjs <part-dir>/<chapter-dir>
npm run check
```

`verify-chapter` validates:
- every `<Term k="…">` key exists in `glossary.ts`
- every section dir matches `NN-kebab-slug`
- every slide file matches `NN-kebab-slug.mdx`
- every exercise `id` is unique per slide
- every `\begin{(s|d)?problem}` in the source TeX has a `<Problem>` somewhere in the chapter
- no MDX uses relative `../` imports or the legacy `part="…" chapter="…"` props

Fix any issues it reports before committing.

## Out of scope

- **Don't** edit `src/lib/slide-nav.ts` (chapter title is added by the parent at finalize time).
- **Don't** run `npm install` — your worktree shares dependencies with the parent.
- **Don't** add per-submodule e2e specs — one chapter spec is enough.
- **Don't** add new components — use what's already in `src/components/`.
- **Don't** invoke the `simplify`, `fewer-permission-prompts`, or `review` skills — these are for the human user, not chapter authoring.
- **Don't** touch other chapters.

## Finishing

Commit your branch with a clear message ending in
`Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>`.
Don't open a PR — the parent will merge your branch via
`scripts/finalize-part.mjs`.
