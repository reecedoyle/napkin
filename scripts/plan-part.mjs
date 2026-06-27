#!/usr/bin/env node
/**
 * Emit the authoring plan for the next (or a named) Napkin part: its
 * chapters, source TeX paths, portal chapter numbers, directory slugs, and
 * any source-incompleteness flags. The autonomy pipeline reads this so the
 * "what comes next" step is deterministic instead of hand-parsed.
 *
 *   node scripts/plan-part.mjs                 # next unwired part, JSON
 *   node scripts/plan-part.mjs --human         # next unwired part, readable
 *   node scripts/plan-part.mjs --part 9        # a specific part number
 *
 * Chapter numbers continue from the highest "Chapter N" already wired in
 * slide-nav.ts (the portal numbers chapters sequentially, in book order),
 * which sidesteps re-deriving the book's frontmatter chapter counter.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const args = process.argv.slice(2);
const human = args.includes('--human');
const partFlagIdx = args.indexOf('--part');
const wantPartNum = partFlagIdx !== -1 ? Number(args[partFlagIdx + 1]) : undefined;

const napkin = readFileSync(resolve(ROOT, 'vendor/napkin/Napkin.tex'), 'utf8');
const slideNav = readFileSync(resolve(ROOT, 'src/lib/slide-nav.ts'), 'utf8');

const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
  'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX'];

function kebab(s) {
  return s
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Strip TeX math/markup from a title for display.
function cleanTitle(s) {
  return s
    .replace(/\$([^$]*)\$/g, '$1')   // drop $…$ delimiters, keep inner
    .replace(/\\[A-Za-z]+\s?/g, '')  // drop \macros
    .replace(/[{}]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// ── parse Napkin.tex into parts → include files ────────────────────────
const lines = napkin.split('\n');
const parts = [];
let cur = null;
for (const line of lines) {
  const pm = line.match(/^\\part\{(.+?)\}/);
  if (pm) {
    cur = { title: pm[1], includes: [] };
    parts.push(cur);
    continue;
  }
  const im = line.match(/^\\include\{tex\/([^}]+)\}\s*(?:%\s*(.*))?$/);
  if (im && cur) {
    // Skip frontmatter includes — they aren't portal chapters.
    if (im[1].startsWith('frontmatter/')) continue;
    cur.includes.push({ rel: im[1], note: (im[2] || '').trim() });
  }
}

// ── which part is next? (parts are 1-indexed by position) ──────────────
const wiredPartNums = [...slideNav.matchAll(/'part-(\d+)-[^']*':\s*'Part/g)].map((m) => Number(m[1]));
const maxWired = wiredPartNums.length ? Math.max(...wiredPartNums) : 0;
const partNum = wantPartNum ?? maxWired + 1;
const part = parts[partNum - 1];
if (!part) {
  console.error(`No part numbered ${partNum} found in Napkin.tex (have ${parts.length}).`);
  process.exit(1);
}

// ── chapter numbers continue from the portal's current max ─────────────
const wiredChapterNums = [...slideNav.matchAll(/'Chapter (\d+) /g)].map((m) => Number(m[1]));
const maxChapter = wiredChapterNums.length ? Math.max(...wiredChapterNums) : 0;

const partTitle = cleanTitle(part.title.replace(/\s*\(TO DO\)\s*/i, ''));
const partIncomplete = /\(TO DO\)/i.test(part.title);
const partDir = `part-${partNum}-${kebab(partTitle)}`;

const chapters = part.includes.map((inc, i) => {
  const texPath = `vendor/napkin/tex/${inc.rel}.tex`;
  let title = inc.rel.split('/').pop();
  try {
    const src = readFileSync(resolve(ROOT, texPath), 'utf8');
    const m = src.match(/\\chapter(?:\[([^\]]*)\])?\{([\s\S]*?)\}/);
    if (m) title = cleanTitle(m[1] || m[2]);
  } catch { /* keep filename fallback */ }
  const num = maxChapter + 1 + i;
  return {
    chapterNumber: num,
    title,
    sourceTex: texPath,
    dirSlug: `${String(i + 1).padStart(2, '0')}-${kebab(title)}`,
    chapterDir: `${partDir}/${String(i + 1).padStart(2, '0')}-${kebab(title)}`,
    chapterTitle: `Chapter ${num} — ${title}`,
    sourceNote: inc.note || null,
    incomplete: partIncomplete || /to be written|missing/i.test(inc.note),
  };
});

const plan = {
  partNumber: partNum,
  roman: ROMAN[partNum] ?? String(partNum),
  partTitle,
  partDir,
  partTitleEntry: `Part ${ROMAN[partNum] ?? partNum} — ${partTitle}`,
  partIncomplete,
  chapters,
};

if (human) {
  console.log(`\nPart ${plan.roman} — ${plan.partTitle}   (${plan.partDir})`);
  if (partIncomplete) console.log(`  ⚠ part marked incomplete in source`);
  for (const c of chapters) {
    const flag = c.incomplete ? `  ⚠ ${c.sourceNote || 'incomplete in source'}` : '';
    console.log(`  ${c.chapterTitle}`);
    console.log(`     ${c.sourceTex}  →  ${c.chapterDir}${flag}`);
  }
  console.log('');
} else {
  console.log(JSON.stringify(plan, null, 2));
}
