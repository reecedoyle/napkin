#!/usr/bin/env node
/**
 * Self-check for an authored chapter. Run by the chapter-authoring
 * sub-agent before it reports done, and by the parent during finalize.
 *
 *   node scripts/verify-chapter.mjs <part-dir>/<chapter-dir> [--tex vendor/napkin/tex/<area>/<file>.tex]
 *
 * Example:
 *   node scripts/verify-chapter.mjs part-2-basic-abstract-algebra/01-quotient-groups \
 *     --tex vendor/napkin/tex/H113/quotient.tex
 *
 * Exits 0 on clean, 1 on any error. Warnings are printed but don't fail.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, relative, join } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');

// ─── arg parsing ────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const positional = [];
const flags = {};
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a.startsWith('--')) {
    const name = a.slice(2);
    const next = args[i + 1];
    if (next !== undefined && !next.startsWith('--')) {
      flags[name] = next;
      i++;
    } else {
      flags[name] = true;
    }
  } else {
    positional.push(a);
  }
}

const chapterRel = positional[0];
if (!chapterRel) {
  console.error('usage: verify-chapter.mjs <part-dir>/<chapter-dir> [--tex <path>]');
  process.exit(2);
}
const chapterDir = resolve(ROOT, 'src', 'pages', chapterRel);
const texPath = flags.tex ? resolve(ROOT, flags.tex) : undefined;

// ─── helpers ────────────────────────────────────────────────────────────

const errors = [];
const warnings = [];

function err(msg) { errors.push(msg); }
function warn(msg) { warnings.push(msg); }

function walk(dir, predicate) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const s = statSync(full);
    if (s.isDirectory()) out.push(...walk(full, predicate));
    else if (predicate(full)) out.push(full);
  }
  return out;
}

function readSafe(path) {
  try { return readFileSync(path, 'utf8'); } catch { return ''; }
}

// ─── load glossary keys ────────────────────────────────────────────────

// Keys live in the base map (src/lib/glossary.ts) plus one file per chapter
// under src/lib/glossary-chapters/*.ts (merged at build via import.meta.glob).
function keysFrom(src) {
  return [...src.matchAll(/^\s+([a-zA-Z_][a-zA-Z0-9_]*):\s*\{\s*$/gm)]
    .map((m) => m[1])
    .filter((k) => !['term', 'symbol', 'definition', 'example'].includes(k));
}
const glossaryKeys = new Set(keysFrom(readSafe(resolve(ROOT, 'src/lib/glossary.ts'))));
const chaptersDir = resolve(ROOT, 'src/lib/glossary-chapters');
try {
  for (const name of readdirSync(chaptersDir)) {
    if (name.endsWith('.ts')) for (const k of keysFrom(readSafe(join(chaptersDir, name)))) glossaryKeys.add(k);
  }
} catch { /* dir may not exist yet */ }

// ─── scan chapter MDX ──────────────────────────────────────────────────

let mdxFiles;
try {
  mdxFiles = walk(chapterDir, (p) => p.endsWith('.mdx'));
} catch (e) {
  err(`chapter dir not found: ${chapterDir}`);
  print();
  process.exit(1);
}

if (mdxFiles.length === 0) {
  err(`no MDX files found under ${chapterRel}`);
}

// Slug is kebab-case, lowercase-preferred but we allow uppercase
// for slugs that mirror LaTeX macros like ZZ, ZN, GL — agents have
// authored these and the file system serves them fine.
const NAME_RE = /^\d{2}-[A-Za-z0-9-]+(\.mdx)?$/;

// Mirror of the Kind union in src/components/Callout.astro.
const CALLOUT_KINDS = new Set([
  'definition', 'theorem', 'proposition', 'lemma', 'corollary',
  'example', 'remark', 'question', 'exercise',
]);

// per-chapter counters
const problemComponents = [];
const termKeysUsed = new Set();
const slideProse = [];
// For the e2e-assertion checks below: MCQ option labels grouped by slide
// (button-name matchers must resolve to exactly one), every `solution="…"`
// value (reveal anchors must live here), and each slide's source with its
// `solution="…"` blocks stripped (reveal anchors must NOT also live here).
const perSlideLabels = [];   // [{ rel, labels: string[] }]
const solutionValues = [];   // string[]  — contents of solution="…" props
const nonSolSources = [];    // string[]  — slide sources minus solution="…"

// Normalise prose for substring comparison: drop markdown emphasis/code
// marks and collapse whitespace, lowercase (e2e text matchers are usually
// case-insensitive).
function norm(s) {
  return s.replace(/[*_`]/g, '').replace(/\s+/g, ' ').toLowerCase().trim();
}

// Files directly under the chapter dir (e.g. 01-hello.mdx) are smoke
// slides for the existing chapters; slide-nav.ts deliberately ignores
// them, so verify-chapter ignores them too.
const realSlides = mdxFiles.filter((p) => relative(chapterDir, p).split('/').length === 2);

for (const file of realSlides) {
  const rel = relative(ROOT, file);
  const src = readSafe(file);
  const [section, slide] = relative(chapterDir, file).split('/');

  // ── path-shape checks ──────────────────────────────────────────────
  if (!NAME_RE.test(section)) err(`${rel}: section dir "${section}" must match NN-kebab-slug`);
  if (!NAME_RE.test(slide)) err(`${rel}: slide name "${slide}" must match NN-kebab-slug.mdx`);

  // ── legacy patterns ────────────────────────────────────────────────
  if (/from '\.\.\//.test(src)) {
    err(`${rel}: uses relative import (../). Use @/layouts/... or @/components/... instead.`);
  }
  if (/<SlideLayout[\s\S]*?\b(part|chapter)=/.test(src)) {
    err(`${rel}: passes <SlideLayout part="…" / chapter="…">. Drop those props — they auto-derive from the URL.`);
  }
  // NumericInput.expected is typed `string`; agents have repeatedly
  // passed `expected={5}` (number) instead of `expected="5"`. The
  // component then crashes inside answersEqual() on submit and the
  // test sees no "Not quite" / "Correct" feedback.
  for (const m of src.matchAll(/expected=\{([^}]*)\}/g)) {
    const inner = m[1].trim();
    if (/^[-+]?\d+(\.\d+)?([eE][-+]?\d+)?$/.test(inner)) {
      err(`${rel}: <NumericInput expected={${inner}}> — pass a string instead: expected="${inner}". NumericInput.expected is typed as string.`);
    }
  }
  // Callout.kind is a closed union — anything else crashes at render time.
  for (const m of src.matchAll(/<Callout\s+kind="([^"]+)"/g)) {
    const kind = m[1];
    if (!CALLOUT_KINDS.has(kind)) {
      err(`${rel}: <Callout kind="${kind}"> — kind must be one of ${[...CALLOUT_KINDS].join(', ')}.`);
    }
  }

  // ── interactive islands must hydrate ──────────────────────────────
  // MCQ / NumericInput / ProofReveal / Problem are React islands; without
  // a `client:load` directive Astro renders them statically and the
  // reveal/answer buttons never wire up. astro check and npm run build
  // both pass on this — only an e2e click catches it, and agents don't
  // run e2e. So gate it here.
  for (const m of src.matchAll(/<(MCQ|NumericInput|ProofReveal|Problem)\b[\s\S]*?\/>/g)) {
    if (!/\bclient:load\b/.test(m[0])) {
      err(`${rel}: <${m[1]}> is missing the client:load directive — it will render but never hydrate (buttons dead).`);
    }
  }

  // ── Term keys ──────────────────────────────────────────────────────
  for (const m of src.matchAll(/<Term\s+k="([^"]+)"/g)) {
    const key = m[1];
    termKeysUsed.add(key);
    if (!glossaryKeys.has(key)) {
      err(`${rel}: <Term k="${key}"> has no matching entry in src/lib/glossary.ts`);
    }
  }

  // ── exercise id uniqueness within a slide ─────────────────────────
  const idsHere = [];
  for (const m of src.matchAll(/<(?:MCQ|NumericInput|ProofReveal|Problem)\b[\s\S]*?\bid="([^"]+)"/g)) {
    idsHere.push(m[1]);
  }
  const dupes = idsHere.filter((id, i) => idsHere.indexOf(id) !== i);
  for (const id of new Set(dupes)) {
    err(`${rel}: exercise id "${id}" used more than once on the same slide`);
  }

  // ── Problem-component count ───────────────────────────────────────
  for (const _ of src.matchAll(/<Problem\b/g)) problemComponents.push(rel);

  // ── MCQ option labels + reveal regions (for the e2e checks) ───────
  // `label:` is MCQ-specific here (Callouts use `title=`), so a bare scan
  // is safe. Solution props may span several lines; the napkin authoring
  // convention never embeds a literal " inside them, so a non-greedy
  // match to the next " captures the whole value.
  const labels = [
    ...[...src.matchAll(/label:\s*"([^"]*)"/g)].map((m) => m[1]),
    ...[...src.matchAll(/label:\s*'([^']*)'/g)].map((m) => m[1]),
  ];
  if (labels.length) perSlideLabels.push({ rel, labels });
  for (const m of src.matchAll(/\bsolution="([\s\S]*?)"/g)) solutionValues.push(m[1]);
  nonSolSources.push(src.replace(/\bsolution="[\s\S]*?"/g, ' '));

  slideProse.push(src);
}

// ─── e2e spec assertions must match slide prose ───────────────────────
// The chapter spec asserts on revealed solution text via
// `article.getByText(...)`. Those strings must be verbatim substrings of
// the slides — a paraphrase that isn't is the single most common e2e
// failure, and agents don't run e2e. We only check `article.getByText`
// (slide content); bare `page.getByText` targets component feedback
// ("Correct.", "Not quite") and button labels, which aren't slide prose.

const slug = chapterRel.split('/').pop().replace(/^\d+-/, '');
const specPath = resolve(ROOT, 'tests/e2e', `${slug}.spec.ts`);
const specSrc = readSafe(specPath);

// ── shared matcher helpers ────────────────────────────────────────────
// A matcher is {raw, rx, flags, exact, disambig}. `rx` matchers are regex
// bodies (no slashes); string matchers match as case-insensitive substrings
// unless `exact`, mirroring Playwright's default non-exact `name:`/getByText
// semantics. `disambig` marks a locator narrowed by .first()/.last()/.nth(),
// which resolves multiplicity so the ambiguity checks don't apply.
function fragsOf(a) {
  return a.rx
    ? a.raw.split(/[.*+?()[\]{}|^$\\]/).map((s) => s.trim()).filter((s) => s.length >= 6)
    : [a.raw];
}
function matches(m, text) {
  if (m.rx) {
    let re;
    try { re = new RegExp(m.raw, (m.flags || '').includes('i') ? 'i' : ''); }
    catch { return false; }
    return re.test(text);
  }
  if (m.exact) return text.trim().toLowerCase() === m.raw.trim().toLowerCase();
  return text.toLowerCase().includes(m.raw.toLowerCase());
}
function show(m) { return m.rx ? `/${m.raw}/` : `"${m.raw}"`; }

// Buttons the interactive components render with fixed text (MCQ renders
// its option labels; everything else is a static control). A button-name
// matcher hitting one of these targets a control, not an MCQ option, so
// the MCQ checks skip it.
const STATIC_CONTROLS = [
  'show solution', 'hide solution', 'show hint', 'hide hint', 'reveal solution',
  'check', 'submit', 'try again', 'next', 'previous', 'prev', 'back',
  'show answer', 'continue', 'got it',
];
const isStatic = (m) => STATIC_CONTROLS.some((lbl) => matches(m, lbl));

// Pull {name: …} matchers out of one source line, tagging whether the call
// carries `exact: true` and whether the locator is narrowed by
// .first()/.last()/.nth() (so multiplicity is intentional).
function matchersOnLine(line, kind) {
  const gate = kind === 'button'
    ? /getByRole\(\s*['"]button['"]/
    : /article\.getByText\(/;
  if (!gate.test(line)) return [];
  const exact = /\bexact:\s*true\b/.test(line);
  const disambig = /\)\s*\.\s*(?:first|last|nth)\s*\(/.test(line);
  const out = [];
  const prefix = kind === 'button'
    ? String.raw`getByRole\(\s*['"]button['"]\s*,\s*\{\s*name:\s*`
    : String.raw`article\.getByText\(\s*`;
  for (const m of line.matchAll(new RegExp(prefix + String.raw`\/([^/]+)\/([a-z]*)`, 'g')))
    out.push({ raw: m[1], rx: true, flags: m[2], exact, disambig });
  for (const m of line.matchAll(new RegExp(prefix + String.raw`'([^']+)'`, 'g')))
    out.push({ raw: m[1], rx: false, exact, disambig });
  for (const m of line.matchAll(new RegExp(prefix + String.raw`"([^"]+)"`, 'g')))
    out.push({ raw: m[1], rx: false, exact, disambig });
  return out;
}

if (!specSrc) {
  warn(`no e2e spec at tests/e2e/${slug}.spec.ts (expected one per chapter)`);
} else {
  const specLines = specSrc.split('\n');

  // ── (existing) article.getByText phrases must appear in some slide ──
  const hay = norm(slideProse.join('\n'));
  const assertions = specLines.flatMap((l) => matchersOnLine(l, 'text'));
  for (const a of assertions) {
    const frags = fragsOf(a);
    if (frags.length === 0) continue; // regex too pattern-y to check
    if (!frags.some((f) => hay.includes(norm(f)))) {
      // Warning, not error: KaTeX-rendered math, whitespace, and title-slug
      // collisions across parts can hide a genuine runtime match, so the e2e
      // run is authoritative. Still worth surfacing — a true paraphrase shows
      // up here before the ~1-min build+e2e cycle does.
      warn(`tests/e2e/${slug}.spec.ts: article.getByText(${show(a)}) not found verbatim in any slide — ` +
          `if it's a paraphrase, copy the text straight from the slide's solution.`);
    }
  }

  // ── button-name matchers vs rendered MCQ options ───────────────────
  // getByRole('button', { name: … }). Two failure modes bite here, pass
  // `astro check`/build, and only surface in e2e:
  //   B1 the name matches ≥2 options on one slide → Playwright strict-mode
  //      violation on click (e.g. /−12/ hitting two distractors).
  //   B2 the name matches no option label at all → a paraphrased label
  //      (e.g. "…, because …" when the option reads "… (since …)").
  // We honour exact:true and .first()/.nth() (both resolve multiplicity),
  // and skip B2 entirely when any option label contains `$` — those render
  // via KaTeX, so the spec's matcher targets rendered text we can't compare
  // against the LaTeX source.
  const buttonMatchers = specLines.flatMap((l) => matchersOnLine(l, 'button'));
  const allLabels = perSlideLabels.flatMap((s) => s.labels);
  const chapterHasMathLabels = allLabels.some((l) => l.includes('$'));
  for (const m of buttonMatchers) {
    if (isStatic(m)) continue;
    // B1 — ambiguous within a single slide (unless narrowed by .first()).
    if (!m.disambig) {
      for (const { rel: sfile, labels } of perSlideLabels) {
        const hits = labels.filter((l) => matches(m, l));
        if (hits.length >= 2) {
          err(`tests/e2e/${slug}.spec.ts: getByRole('button', { name: ${show(m)} }) matches ` +
              `${hits.length} options on ${sfile} — ambiguous (Playwright strict-mode). ` +
              `Tighten the name to exactly one option or narrow with .first().`);
        }
      }
    }
    // B2 — matches no option anywhere. Warning, not error: even with the
    // math-label gate, rendered spacing and cross-part slug collisions
    // produce false misses; the e2e run is authoritative.
    if (allLabels.length && !chapterHasMathLabels && !allLabels.some((l) => matches(m, l))) {
      warn(`tests/e2e/${slug}.spec.ts: getByRole('button', { name: ${show(m)} }) matches no MCQ ` +
          `option label in the chapter — check for a paraphrased label; copy the option text verbatim.`);
    }
  }

  // ── B3 — reveal-flow anchors must be unique to the solution ─────────
  // `expect(article.getByText(X)).toBeHidden()` gates a Show-solution
  // reveal: unless narrowed by .first(), X must live in a solution="…" prop
  // and NOWHERE else, or getByText resolves to multiple nodes (strict-mode)
  // or is already visible before the click (a phrase also in the hint).
  const solHay = norm(solutionValues.join('\n'));
  const nonSolHay = norm(nonSolSources.join('\n'));
  for (const line of specLines) {
    if (!/\.toBeHidden\(\)/.test(line)) continue;
    for (const a of matchersOnLine(line, 'text')) {
      if (a.disambig) continue; // .first() picks one node → no ambiguity
      const frags = fragsOf(a);
      if (frags.length === 0) continue;
      // Warnings, not errors: the solution/non-solution haystacks are
      // chapter-wide, so a phrase living in another slide's prose reads as a
      // collision the runtime (article scoped to one slide) never sees. Still
      // a useful nudge toward solution-unique anchors — the class that broke
      // Part XIV's pigeonhole reveal.
      if (!frags.some((f) => solHay.includes(norm(f)))) {
        warn(`tests/e2e/${slug}.spec.ts: reveal anchor article.getByText(${show(a)}).toBeHidden() ` +
            `not found in any solution="…" prop — prefer text from the hidden solution.`);
      } else if (frags.some((f) => nonSolHay.includes(norm(f)))) {
        warn(`tests/e2e/${slug}.spec.ts: reveal anchor article.getByText(${show(a)}) may also appear outside ` +
            `the solution (hint/prompt/another slide) — if it's the same slide, use a solution-unique phrase ` +
            `or narrow with .first().`);
      }
    }
  }
}

// ─── tex source: problem coverage ─────────────────────────────────────

if (texPath) {
  const texSrc = readSafe(texPath);
  if (!texSrc) {
    warn(`--tex ${flags.tex}: file not found or unreadable; skipping problem-coverage check`);
  } else {
    // Skip lines that are tex-commented (leading %, possibly preceded by
    // whitespace). Inline `%` mid-line could appear inside a verbatim
    // environment but the napkin source doesn't put problem blocks there,
    // so the line-level filter is enough.
    const texProblems = texSrc
      .split('\n')
      .filter((line) => !/^\s*%/.test(line))
      .join('\n')
      .match(/\\begin\{(s?problem|dproblem)\}/g)?.length ?? 0;
    if (texProblems > problemComponents.length) {
      err(
        `tex source has ${texProblems} problem block(s) but only ${problemComponents.length} <Problem> component(s) ` +
        `found in the chapter — at least ${texProblems - problemComponents.length} appear to be missing`,
      );
    } else if (texProblems < problemComponents.length) {
      warn(
        `tex source has ${texProblems} problem block(s) but ${problemComponents.length} <Problem> component(s) found — ` +
        `verify no problems were duplicated`,
      );
    }
  }
}

// ─── output ───────────────────────────────────────────────────────────

function print() {
  if (warnings.length) {
    console.error('warnings:');
    for (const w of warnings) console.error('  - ' + w);
  }
  if (errors.length) {
    console.error('errors:');
    for (const e of errors) console.error('  - ' + e);
    console.error(`\nverify-chapter: FAIL (${errors.length} error${errors.length === 1 ? '' : 's'})`);
  } else {
    console.log(
      `verify-chapter: OK  (${realSlides.length} slide${realSlides.length === 1 ? '' : 's'}, ` +
      `${termKeysUsed.size} glossary key${termKeysUsed.size === 1 ? '' : 's'}, ` +
      `${problemComponents.length} <Problem> component${problemComponents.length === 1 ? '' : 's'})`,
    );
  }
}

print();
process.exit(errors.length ? 1 : 0);
