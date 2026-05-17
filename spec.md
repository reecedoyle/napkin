# Spec for "An Infinitely Large Napkin" interactive learning portal

## Objective
Build an interactive web app for learning the content of Evan Chen's *An Infinitely Large Napkin*
(https://web.evanchen.cc/napkin.html, source: https://github.com/vEnhance/napkin, text licensed CC-BY-SA-4.0).

The user has a Master's in Computer Science and wants to rebuild university-level mathematics
(sets, calculus, algebra, topology, etc.) using slide-style, diagram-rich, interactive content
in place of the long PDF.

## Format
- **Slide-style** content, not long scrollable pages. One focused idea per slide.
- **Hierarchy**: Part → Chapter → Submodule → Slide.
- **Diagram-first** wherever feasible; explain pictorially before/alongside prose.
- **Inline exercises** so the user can confirm understanding as they go.

## Tech stack
- **Astro + MDX** — static site, free hosting (Vercel / GitHub Pages).
- **KaTeX** for math (via `remark-math` + `rehype-katex`).
- **React islands** for interactive exercise components only; slides stay as static HTML.
- **Tailwind CSS** for styling.
- **`localStorage`** for progress; no backend, no auth.

## Content model
```
Part (e.g., "I — Starting Out")
└── Chapter (e.g., "Groups")
    └── Submodule (e.g., "What is a group?")
        └── Slide (one focused idea)
            ├── 1–3 short prose blocks
            ├── 0–N math expressions (inline / display)
            ├── 0–1 figure (SVG)
            └── 0–N inline exercises
```

Each slide is one MDX file. Frontmatter holds title, ordering, prerequisites, and exercise metadata.
Navigation: prev / next within a submodule, plus a sidebar TOC for jump-to-anywhere.

## Slide building blocks
- **Prose** — markdown, ~1–4 sentences. If it would scroll, split.
- **Definition / Theorem / Proposition / Example / Remark** — styled callout components.
- **Math** — inline `$...$` and display `$$...$$` via KaTeX.
- **Figure** — SVG, either rendered at build time from the book's existing Asymptote/TikZ source
  or hand-authored. Diagrams are first-class.
- **Exercise** — see below.

## Exercise components
Three React islands, each persisting its outcome to `localStorage` keyed by slide path + exercise id:

- `<MCQ>` — multiple choice (concept checks).
- `<NumericInput>` — typed answer with normalised comparison (numeric, simple symbolic;
  e.g. `1/2` ≡ `0.5`).
- `<ProofReveal>` — "Try on paper or in your head, then click to reveal." For proof-style
  exercises where automated checking is impractical.

## Diagrams
- **For the pilot**: figures are authored as **inline SVG inside the MDX** by the same
  sub-agent that writes the slide. The sub-agent reads the `\begin{asy}...\end{asy}`
  blocks in the source `.tex` file and emits an SVG that visually approximates the
  diagram (Asymptote primitives → SVG primitives is straightforward translation).
  The book's `\includegraphics{...}` raster images are copied verbatim into `public/figures/`.
- **Why not auto-generate from Asymptote?** The book's asy blocks embed LaTeX labels
  (e.g. `MP("$\mathbb{Z}$", ...)`), so a working asy build needs `asymptote + texlive +
  ghostscript` (~500MB system install). For the pilot's ~6 figures the cost isn't worth it.
- **Future option** (deferred): a build-time pipeline that extracts asy blocks, runs `asy`,
  emits SVGs, and writes a manifest the slides reference by stable id. Pick this up if/when
  we hit a figure-dense chapter where hand-porting becomes tedious.
- **Augmentation**: where the book is light on visuals, the sub-agent (or a follow-up pass)
  adds new diagrams — also as inline SVG, with D3 only for things that genuinely need to
  animate/interact.

## Authoring pipeline (LLM-assisted)
For each chapter, a sub-agent:
1. Reads `vendor/napkin/tex/.../<chapter>.tex` (and any included files / figures).
2. Decomposes it into submodules → slides per the content model.
3. Outputs MDX files with KaTeX math, callouts, exercise components, and figure references.
4. Converts each `\begin{problem}` / `\begin{exercise}` block into the most appropriate
   exercise component (MCQ / NumericInput / ProofReveal).
5. Output is human-reviewed before merging.

## Repo layout
```
napkin/
├── spec.md
├── package.json
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── public/
├── src/
│   ├── components/      # MCQ, NumericInput, ProofReveal, Figure, Callout, …
│   ├── layouts/         # SlideLayout, ChapterLayout
│   ├── pages/           # Astro routes
│   ├── lib/             # progress tracking, KaTeX helpers, answer normalisation
│   └── styles/
├── src/pages/
│   └── part-1-starting-out/
│       └── 01-groups/
│           └── 01-definition/
│               ├── 01-introduction.mdx
│               ├── 02-additive-integers.mdx
│               └── …
├── figures/             # generated SVGs
├── vendor/
│   └── napkin/          # git submodule of vEnhance/napkin
└── scripts/
    └── build-figures.mjs
```

## Pilot scope — Part I only
Two source chapters:
1. `tex/H113/grp-intro.tex` → "Groups" (definition, examples, homomorphisms, …).
2. `tex/topology/metric-top.tex` → "Metric Topology" (metric spaces, open / closed sets,
   continuity, …).

### Definition of done for the pilot
- Both chapters fully authored as slides.
- All three exercise types (`MCQ`, `NumericInput`, `ProofReveal`) used at least once.
- Progress tracking working end-to-end.
- Site deployed and shareable.

## Order of work
1. Scaffold Astro + MDX + KaTeX + Tailwind + base layouts.
2. Build the three exercise components in isolation, with `localStorage` persistence.
3. Vendor the napkin repo (git submodule).
4. Build the `<Figure>` component (caption, alt text, dark-mode-friendly SVG defaults).
5. Run the LLM pipeline on chapter 1 (groups). Review, refine pipeline.
6. Run the pipeline on chapter 2 (metric topology).
7. Polish navigation / sidebar / theming.
8. Deploy.

## Out of scope (for now)
- Parts II – XXII.
- Cross-device sync, accounts, social features.
- Formal-proof checking (Lean4). The community has Lean4 proofs for some Napkin problems
  and that's a possible future extension, not a pilot goal.
