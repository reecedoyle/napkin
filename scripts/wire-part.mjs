#!/usr/bin/env node
/**
 * Insert a part's metadata (partTitles + chapterTitles) into
 * src/lib/slide-nav.ts from the plan emitted by plan-part.mjs. Idempotent:
 * entries already present (by key) are left alone. Run after the chapters
 * are merged onto main.
 *
 *   node scripts/wire-part.mjs --part 9
 *   node scripts/wire-part.mjs              # next unwired part
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = resolve(import.meta.dirname, '..');
const NAV = resolve(ROOT, 'src/lib/slide-nav.ts');

const args = process.argv.slice(2);
const planArgs = args.includes('--part')
  ? ['--part', args[args.indexOf('--part') + 1]]
  : [];
const plan = JSON.parse(
  execFileSync('node', [resolve(ROOT, 'scripts/plan-part.mjs'), ...planArgs], { encoding: 'utf8' }),
);

let nav = readFileSync(NAV, 'utf8');

// Insert `lines` (array of "  'key': 'value',") into the object literal
// that begins with `declRe`, just before its closing `};`. Skips any line
// whose key already appears in the file.
function insertInto(declRe, newLines) {
  const lines = nav.split('\n');
  const start = lines.findIndex((l) => declRe.test(l));
  if (start === -1) throw new Error(`couldn't find object for ${declRe}`);
  let end = start;
  while (end < lines.length && lines[end].trim() !== '};') end++;
  const fresh = newLines.filter((nl) => {
    const key = nl.match(/^\s*'([^']+)'/)[1];
    return !nav.includes(`'${key}':`);
  });
  if (fresh.length === 0) return 0;
  lines.splice(end, 0, ...fresh);
  nav = lines.join('\n');
  return fresh.length;
}

// Some chapter titles contain an apostrophe (e.g. "Shor's algorithm"); quote
// those entries with double quotes to avoid escaping inside single quotes.
function entry(key, value) {
  const v = value.includes("'") ? `"${value}"` : `'${value}'`;
  return `  '${key}': ${v},`;
}

const partLines = [entry(plan.partDir, plan.partTitleEntry)];
const chapterLines = plan.chapters.map((c) => entry(c.chapterDir, c.chapterTitle));

const nP = insertInto(/export const partTitles\b/, partLines);
const nC = insertInto(/export const chapterTitles\b/, chapterLines);

writeFileSync(NAV, nav);
console.log(
  `wire-part: ${plan.partDir} — added ${nP} part title, ${nC} chapter title(s).` +
  (nP === 0 && nC === 0 ? ' (already wired)' : ''),
);
