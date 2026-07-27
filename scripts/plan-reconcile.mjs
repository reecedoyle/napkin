#!/usr/bin/env node
/**
 * Reconcile the portal against an upstream Napkin update.
 *
 * Given two commits of the vendored source (`vendor/napkin` submodule), find
 * which **already-covered** portal chapters have source changes worth a
 * re-review, and classify each change as SUBSTANTIVE (the math/notation
 * changed) or cosmetic (prose/grammar only). Most upstream churn is a
 * proofreading sweep, so the whole point is to filter the handful of
 * chapters a reviewer should actually look at.
 *
 *   git -C vendor/napkin fetch origin              # get the new commits
 *   node scripts/plan-reconcile.mjs --since <old-sha>          # vs current HEAD
 *   node scripts/plan-reconcile.mjs --since <old-sha> --to <new-sha>
 *   node scripts/plan-reconcile.mjs --since <old-sha> --json   # for piping
 *
 * "Covered" = the part exists under src/pages (we author whole parts). The
 * tex-file → portal-chapter map is the reverse of plan-part.mjs: Napkin.tex
 * lists parts → \include{tex/<rel>} in book order, and we mirror that order
 * as src/pages/part-<n>-.../NN-<slug>/. See RECONCILE.md for the full runbook.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const SUB = resolve(ROOT, 'vendor/napkin');
const args = process.argv.slice(2);
const json = args.includes('--json');
const argVal = (flag) => {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : undefined;
};
const since = argVal('--since');
const to = argVal('--to') || 'HEAD';
if (!since) {
  console.error(
    'usage: plan-reconcile.mjs --since <old-submodule-ref> [--to <ref>] [--json]\n' +
      '(fetch first: git -C vendor/napkin fetch origin; the old ref is the pin you are\n' +
      ' upgrading from — e.g. the submodule sha in the pre-bump commit.)',
  );
  process.exit(1);
}

const git = (a) => execFileSync('git', ['-C', SUB, ...a], { encoding: 'utf8' });
const show = (spec) => {
  try {
    return git(['show', spec]);
  } catch {
    return '';
  }
};

let sinceSha, toSha;
try {
  sinceSha = git(['rev-parse', '--short', since]).trim();
  toSha = git(['rev-parse', '--short', to]).trim();
} catch (e) {
  console.error(`Cannot resolve refs in the submodule (fetch first?): ${e.message}`);
  process.exit(1);
}

// ── helpers shared with plan-part.mjs ──────────────────────────────────
const kebab = (s) =>
  s
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// ── forward map from the *new* Napkin.tex: rel → {partNum, includeIndex} ─
const napkin = show(`${toSha}:Napkin.tex`);
const relMap = new Map(); // 'homology/singular' → { partNum, includeIndex, note }
{
  let partNum = 0;
  let idx = 0;
  for (const line of napkin.split('\n')) {
    if (/^\\part\{/.test(line)) {
      partNum += 1;
      idx = 0;
      continue;
    }
    const im = line.match(/^\\include\{tex\/([^}]+)\}\s*(?:%\s*(.*))?$/);
    if (im && partNum > 0) {
      if (im[1].startsWith('frontmatter/')) continue;
      relMap.set(im[1], { partNum, includeIndex: idx, note: (im[2] || '').trim() });
      idx += 1;
    }
  }
}

// ── which parts are covered, and their chapter dirs (in order) ─────────
const coveredPart = new Map(); // partNum → { dir, chapterDirs: string[] }
for (const d of readdirSync(resolve(ROOT, 'src/pages'), { withFileTypes: true })) {
  if (!d.isDirectory()) continue;
  const m = d.name.match(/^part-(\d+)-/);
  if (!m) continue;
  const chapterDirs = readdirSync(resolve(ROOT, 'src/pages', d.name), { withFileTypes: true })
    .filter((c) => c.isDirectory() && /^\d+-/.test(c.name))
    .map((c) => c.name)
    .sort();
  coveredPart.set(Number(m[1]), { dir: d.name, chapterDirs });
}

// ── classify a file's diff: did the MATH actually change, or only prose? ─
const MATH_ENVS =
  'equation|align|aligned|gather|multline|cases|array|matrix|pmatrix|bmatrix|vmatrix|smallmatrix|split|eqnarray';
const ENV_RE = new RegExp(`\\\\begin\\{(${MATH_ENVS})\\*?\\}[\\s\\S]*?\\\\end\\{\\1\\*?\\}`, 'g');
// Tokens that carry no mathematical meaning (spacing, sizing, delimiters) —
// changing only these is typography, not math.
const IGNORE = new Set([
  '\\left', '\\right', '\\,', '\\;', '\\!', '\\:', '\\quad', '\\qquad',
  '\\big', '\\Big', '\\bigg', '\\Bigg', '\\displaystyle', '\\,',
]);
// A meaningful math token: a \command, a number, or a single operator char.
const tokenize = (s) => {
  const bag = [];
  for (const m of s.matchAll(/\\[a-zA-Z]+|\d+|[=+<>^_/|~*-]/g)) {
    if (!IGNORE.has(m[0])) bag.push(m[0]);
  }
  return bag;
};
const mathText = (s) => {
  let out = '';
  for (const m of s.matchAll(/\$[^$]+\$/g)) out += ' ' + m[0];
  for (const m of s.matchAll(/\\\[[\s\S]*?\\\]/g)) out += ' ' + m[0];
  for (const m of s.matchAll(ENV_RE)) out += ' ' + m[0];
  return out;
};
// A changed line that is part of a display/multi-line equation whose
// delimiters sit on *other* lines — so mathText() can't pair it. Heuristic:
// the line looks like math (has =, &, \\, \[ \], or is command-dense) and is
// not an ordinary prose sentence.
const looksLikeMathLine = (l) => {
  const t = l.trim();
  if (/\\\[|\\\]|\\begin\{|\\end\{/.test(t)) return true;
  const prose = (t.match(/\b[a-z]{4,}\b/g) || []).length; // 4+ letter words
  const mathy = /[=&]|\\\\|\\[a-zA-Z]+|\^|_/.test(t);
  return mathy && prose <= 1;
};
// Returns { tokens: string[] changed, multiline: bool } for a file's diff.
function diffMathChange(file) {
  const diff = git(['diff', '-U0', sinceSha, toSha, '--', file]).split('\n');
  const minus = [];
  const plus = [];
  let multiline = false;
  for (const line of diff) {
    if (/^[-+]{3} /.test(line) || /^@@/.test(line)) continue;
    if (line.startsWith('-')) minus.push(line.slice(1));
    else if (line.startsWith('+')) plus.push(line.slice(1));
  }
  const count = (arr) => {
    const m = new Map();
    for (const t of tokenize(mathText(arr.join('\n')))) m.set(t, (m.get(t) || 0) + 1);
    return m;
  };
  const ca = count(minus);
  const cb = count(plus);
  const changed = [];
  for (const k of new Set([...ca.keys(), ...cb.keys()])) {
    if ((ca.get(k) || 0) !== (cb.get(k) || 0)) changed.push(k);
  }
  // Multi-line-equation edit that mathText() couldn't pair up.
  if (!changed.length && [...minus, ...plus].some(looksLikeMathLine)) multiline = true;
  return { tokens: changed, multiline };
}
function structureSpans(text) {
  const s = [];
  for (const m of text.matchAll(/\\(?:sub)*section\{([^}]*)\}/g)) s.push('sec:' + m[1].replace(/\s+/g, ' ').trim());
  for (const m of text.matchAll(/\\chapter(?:\[[^\]]*\])?\{([^}]*)\}/g)) s.push('chap:' + m[1].replace(/\s+/g, ' ').trim());
  return s.sort();
}
const isStub = (t) => /to be written/i.test(t) || t.replace(/%[^\n]*/g, '').trim().length < 400;

// ── walk the changed tex files ─────────────────────────────────────────
const changed = git(['diff', '--name-only', sinceSha, toSha, '--', 'tex'])
  .split('\n')
  .filter((f) => f.endsWith('.tex'));

const substantive = [];
const largeChange = [];
const cosmetic = [];
const newlyWritten = [];
const shared = []; // changed .tex not \include'd as a chapter (macros, preamble, inputs…)
let notCovered = 0;

for (const file of changed) {
  const rel = file.replace(/^tex\//, '').replace(/\.tex$/, '');
  const entry = relMap.get(rel);
  const numstat = git(['diff', '--numstat', sinceSha, toSha, '--', file]).trim().split('\t');
  const added = Number(numstat[0] || 0);
  const removed = Number(numstat[1] || 0);

  if (!entry) {
    shared.push({ file, added, removed });
    continue;
  }
  const cov = coveredPart.get(entry.partNum);
  if (!cov) {
    notCovered += 1;
    continue;
  }
  const chapterDir =
    cov.chapterDirs[entry.includeIndex] !== undefined
      ? `${cov.dir}/${cov.chapterDirs[entry.includeIndex]}`
      : `${cov.dir}/(chapter #${entry.includeIndex + 1} — dir not found)`;

  const oldText = show(`${sinceSha}:${file}`);
  const newText = show(`${toSha}:${file}`);

  if (isStub(oldText) && !isStub(newText)) {
    newlyWritten.push({ partNum: entry.partNum, chapterDir, file, added, removed });
    continue;
  }

  const { tokens, multiline } = diffMathChange(file);
  const structChanged =
    JSON.stringify(structureSpans(oldText)) !== JSON.stringify(structureSpans(newText));
  const large = added + removed >= 40;
  const base = { partNum: entry.partNum, chapterDir, file, added, removed };

  if (tokens.length || multiline || structChanged) {
    const reason = [];
    if (tokens.length) reason.push(`math tokens changed: ${tokens.slice(0, 12).join(' ')}`);
    if (multiline) reason.push('multi-line equation edited — inspect diff');
    if (structChanged) reason.push('section/chapter structure changed');
    substantive.push({ ...base, reason: reason.join('; '), score: tokens.length + (multiline ? 5 : 0) });
  } else if (large) {
    largeChange.push(base); // big diff with no math-token change → figure/prose block
  } else {
    cosmetic.push(base);
  }
}

const byPart = (a, b) => a.partNum - b.partNum;
substantive.sort((a, b) => b.score - a.score || byPart(a, b));
largeChange.sort(byPart);
cosmetic.sort(byPart);

const result = { since: sinceSha, to: toSha, substantive, newlyWritten, largeChange, cosmetic, shared, notCovered };

if (json) {
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}

// ── human report ───────────────────────────────────────────────────────
const P = (n) => `Part ${n}`;
console.log(`\nReconcile  ${sinceSha} → ${toSha}   (${changed.length} changed .tex file(s))\n`);

if (newlyWritten.length) {
  console.log(`🆕 PREVIOUSLY-STUB SOURCE NOW WRITTEN — author via the normal pipeline:`);
  for (const c of newlyWritten) console.log(`   ${P(c.partNum)}  ${c.chapterDir}\n      ${c.file}  (+${c.added}/-${c.removed})`);
  console.log('');
}

console.log(`🔎 SUBSTANTIVE — re-review these covered chapters (${substantive.length}):`);
if (!substantive.length) console.log('   (none — the update is cosmetic for covered content)');
for (const c of substantive) {
  console.log(`   ${P(c.partNum)}  ${c.chapterDir}   (+${c.added}/-${c.removed})`);
  console.log(`      ${c.file}  —  ${c.reason}`);
}
console.log('');

if (largeChange.length) {
  console.log(`📦 large change, no math-token delta (likely figure/new prose — skim): ${largeChange.length}`);
  for (const c of largeChange) console.log(`   ${P(c.partNum)}  ${c.chapterDir}  (+${c.added}/-${c.removed})  ${c.file}`);
  console.log('');
}

console.log(`✎ cosmetic (prose/grammar only — safe to skip): ${cosmetic.length}`);
for (const c of cosmetic) console.log(`   ${P(c.partNum)}  ${c.chapterDir}  (+${c.added}/-${c.removed})`);
if (shared.length) {
  console.log(`\n⚙ shared / non-chapter files changed (review by hand — may affect rendering):`);
  for (const s of shared) console.log(`   ${s.file}  (+${s.added}/-${s.removed})`);
}
if (notCovered) console.log(`\n(${notCovered} changed chapter file(s) in parts not yet covered — ignored.)`);
console.log(`\nNext: for each SUBSTANTIVE chapter, run the reconcile reviewer (see RECONCILE.md).\n`);
