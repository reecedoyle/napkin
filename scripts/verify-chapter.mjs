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

const glossarySrc = readSafe(resolve(ROOT, 'src/lib/glossary.ts'));
const glossaryKeys = new Set(
  // matches `<identifier>: { … term: …` at the start of an entry
  [...glossarySrc.matchAll(/^\s+([a-zA-Z_][a-zA-Z0-9_]*):\s*\{\s*$/gm)]
    .map((m) => m[1])
    // drop the GlossaryEntry interface field names that look like entries
    .filter((k) => !['term', 'symbol', 'definition', 'example'].includes(k)),
);

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
