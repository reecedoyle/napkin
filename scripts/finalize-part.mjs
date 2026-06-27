#!/usr/bin/env node
/**
 * After chapter-authoring sub-agents finish a Part, run this to:
 *
 *   1. Commit any staged-but-uncommitted work in each agent worktree
 *      (some agents can't run `git commit` themselves).
 *   2. Merge each `worktree-agent-…` branch into main with --no-ff.
 *   3. Auto-resolve the predictable `src/lib/glossary.ts` conflict
 *      (each branch appends a new chapter section block at the end).
 *   4. Clean up the worktrees and their branches.
 *   5. Run `npm run check` and `npm run test:unit` so anything that
 *      regressed shows up before you push.
 *
 *   node scripts/finalize-part.mjs
 *
 * Does NOT push and does NOT run the full e2e suite — those are your
 * call.
 *
 * Refuses to run if you're not on `main` or your working tree is dirty.
 */
import { execSync, spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');

// Files where an automatic merge-conflict resolution + key dedupe is safe.
// They share two properties: (a) each chapter appends a new comment-headed
// section block at the end of a top-level object literal; (b) duplicate keys
// are an actual TS error, so the second occurrence has to go. Declared up
// here (not beside the resolver fns below) because the merge loop references
// it — a `const` is not hoisted, so a later declaration would be a TDZ error.
//
// glueLine: a literal line to insert between the HEAD block and the INCOMING
//   block during conflict resolution. Needed for multi-line entries
//   (glossary), where the conflict markers eat the trailing "  },"; not
//   needed for one-line entries (macros).
//
// shape: how to identify entry boundaries during dedupe.
//   - 'multiline': entry starts with `  <camelKey>: {` and ends with `  },`
//   - 'oneline'  : entry is a single `  'key': value,` line
// glossary.ts is no longer here: chapters now add their entries as separate
// files under src/lib/glossary-chapters/, so parallel branches never touch a
// shared glossary file and there's nothing to merge or dedup. Only
// katex-macros.ts is still a single appended file, and it uses the safe
// one-line path (no glue line — that's what produced the old stray-brace bug
// on the multiline glossary).
const ADDITIVE_FILES = {
  'src/lib/katex-macros.ts': { glueLine: null, shape: 'oneline' },
};

// Append any one-line KaTeX macro entries a branch added (between `base` and
// `branch`) that main's katex-macros.ts doesn't already have, inserting them
// before the closing `};`. Returns how many were added. Used instead of
// merging the shared macros file, so a stale worktree base can't conflict.
function applyNewMacros(base, branch) {
  const rel = 'src/lib/katex-macros.ts';
  const diff = sh(`git diff ${base} ${branch} -- ${rel}`).trim();
  if (!diff) return 0;
  const macroLineRe = /^\+(\s*'[^']+'\s*:\s*'[^']*'\s*,?)\s*$/;
  const addedKeys = diff.split('\n')
    .map((l) => l.match(macroLineRe))
    .filter(Boolean)
    .map((m) => '  ' + m[1].trim());
  if (addedKeys.length === 0) return 0;

  const full = resolve(ROOT, rel);
  const content = readFileSync(full, 'utf8');
  const present = new Set([...content.matchAll(/^\s*'([^']+)'\s*:/gm)].map((m) => m[1]));
  const fresh = addedKeys.filter((line) => {
    const key = line.match(/'([^']+)'/)[1];
    if (present.has(key)) return false;
    present.add(key);
    return true;
  });
  if (fresh.length === 0) return 0;

  const lines = content.split('\n');
  let close = lines.length - 1;
  while (close >= 0 && lines[close].trim() !== '};') close--;
  if (close < 0) return 0;
  lines.splice(close, 0, ...fresh);
  writeFileSync(full, lines.join('\n'));
  return fresh.length;
}

function sh(cmd, opts = {}) {
  return execSync(cmd, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...opts });
}

function run(cmd, opts = {}) {
  // Like sh but pipes child output to the user's terminal in real time.
  const [bin, ...args] = cmd.split(' ');
  const r = spawnSync(bin, args, { cwd: ROOT, stdio: 'inherit', ...opts });
  if (r.status !== 0) throw new Error(`${cmd} exited ${r.status}`);
}


// ─── pre-flight ────────────────────────────────────────────────────────

const currentBranch = sh('git rev-parse --abbrev-ref HEAD').trim();
if (currentBranch !== 'main') {
  console.error(`finalize-part: must be run on main (you're on "${currentBranch}")`);
  process.exit(2);
}
const dirty = sh('git status --porcelain').trim();
if (dirty) {
  console.error('finalize-part: working tree must be clean before running');
  console.error(dirty);
  process.exit(2);
}

// ─── 1. enumerate agent worktrees ──────────────────────────────────────

const blocks = sh('git worktree list --porcelain').split(/\n\n+/);
const agentTrees = blocks
  .map((block) => ({
    path: block.match(/^worktree (.+)$/m)?.[1],
    branch: block.match(/^branch refs\/heads\/(.+)$/m)?.[1],
  }))
  .filter((wt) => wt.path && wt.branch?.startsWith('worktree-agent-'));

if (agentTrees.length === 0) {
  console.log('No agent worktrees to finalize.');
  process.exit(0);
}

console.log(`Found ${agentTrees.length} agent worktree(s):`);
for (const wt of agentTrees) console.log(`  ${wt.branch}  ${wt.path}`);

// ─── 2. commit any staged work inside each worktree ────────────────────

for (const wt of agentTrees) {
  const status = sh('git status --porcelain', { cwd: wt.path }).trim();
  if (!status) continue;
  console.log(`Committing pending work in ${wt.branch}…`);
  sh('git add -A', { cwd: wt.path });
  sh(`git commit -m "Finalize: ${wt.branch}"`, { cwd: wt.path });
}

// ─── 3. extract each branch's additive files onto main ────────────────
//
// Chapters produce only NEW files — slides, one glossary-chapters/*.ts, and
// one e2e spec — plus the occasional katex-macros.ts addition. We extract
// those instead of 3-way merging the branch, so it doesn't matter what
// commit the worktree was based on. (Agent worktrees have branched from a
// stale base, which turned a should-be-trivial merge into conflicts on
// shared files like glossary.ts.) No shared file except katex-macros is
// ever touched.

const ADDITIVE_GLOBS = ['src/pages/part-*/**', 'src/lib/glossary-chapters/*.ts', 'tests/e2e/*.spec.ts'];

let extractedAny = false;
for (const wt of agentTrees) {
  const base = sh(`git merge-base main ${wt.branch}`).trim();
  const files = sh(
    `git diff --name-only --diff-filter=ACMR ${base} ${wt.branch} -- ${ADDITIVE_GLOBS.join(' ')}`,
  ).trim().split('\n').filter(Boolean);

  if (files.length === 0) {
    console.log(`${wt.branch}: no additive chapter files — skipping.`);
  } else {
    console.log(`Extracting ${files.length} file(s) from ${wt.branch}…`);
    for (let i = 0; i < files.length; i += 50) {
      const chunk = files.slice(i, i + 50).map((f) => `'${f}'`).join(' ');
      sh(`git checkout ${wt.branch} -- ${chunk}`);
    }
    extractedAny = true;
  }

  // Append any KaTeX macros the branch added that main doesn't have.
  const added = applyNewMacros(base, wt.branch);
  if (added > 0) {
    console.log(`  + ${added} new KaTeX macro(s) from ${wt.branch}`);
    extractedAny = true;
  }
}

if (extractedAny) {
  sh('git add -A');
  sh('git commit -m "Land authored chapters from agent worktrees"');
}

// ─── 4. clean up worktrees ────────────────────────────────────────────

for (const wt of agentTrees) {
  try { sh(`git worktree unlock ${wt.path}`); } catch { /* ignore */ }
  sh(`git worktree remove -f ${wt.path}`);
  sh(`git branch -D ${wt.branch}`);
}

// ─── 4b. dedupe keys in additive files ────────────────────────────────
//
// When two chapters in a single Part both introduce the same concept
// (e.g. hausdorff appearing in both compactness and topological-spaces;
// \Reg appearing in both semisimple and applications), merging just
// concatenates both blocks and TS will error on the duplicate
// object-literal key. Strip the second occurrence of every repeated key,
// keeping the first.

const dedupePaths = [];
for (const [path, cfg] of Object.entries(ADDITIVE_FILES)) {
  const full = resolve(ROOT, path);
  const before = readFileSync(full, 'utf8');
  const { content: after, dropped } = dedupeKeys(before, cfg);
  if (dropped.length === 0) continue;
  console.log(`\nAuto-deduping ${dropped.length} cross-chapter collision(s) in ${path}:`);
  for (const k of dropped) console.log(`  - dropped second occurrence of "${k}"`);
  writeFileSync(full, after);
  sh(`git add ${path}`);
  dedupePaths.push(path);
}
if (dedupePaths.length > 0) {
  sh('git commit -m "Dedupe keys defined by multiple chapters"');
}

// ─── 5. run quick checks ──────────────────────────────────────────────

console.log('\nRunning npm run check…');
run('npm run check');
console.log('\nRunning npm run test:unit…');
run('npm run test:unit');

console.log('\nfinalize-part: done.');
console.log('Next: run `npm run test:e2e` for the full regression, then `git push`.');

// ─── additive-file conflict resolver and key deduper ─────────────────
// (ADDITIVE_FILES is declared near the top — the merge loop needs it.)

function dedupeKeys(content, cfg) {
  return cfg.shape === 'multiline'
    ? dedupeMultilineEntries(content)
    : dedupeOnelineEntries(content);
}

/**
 * Drop second-and-later occurrences of any top-level key in a TS object
 * literal where each entry spans multiple lines, starting with
 * `  <camelKey>: {` and ending with `  },`. Used for src/lib/glossary.ts.
 */
function dedupeMultilineEntries(content) {
  const lines = content.split('\n');
  const seen = new Set();
  const dropped = [];
  const out = [];
  const HEADER_RE = /^\s{2}([a-zA-Z_][a-zA-Z0-9_]*):\s*\{\s*$/;
  const CLOSER = '  },';
  let i = 0;
  while (i < lines.length) {
    const m = lines[i].match(HEADER_RE);
    if (!m) {
      out.push(lines[i]);
      i++;
      continue;
    }
    const key = m[1];
    let end = i;
    while (end < lines.length && lines[end] !== CLOSER) end++;
    if (end >= lines.length) {
      out.push(...lines.slice(i));
      break;
    }
    const block = lines.slice(i, end + 1);
    if (seen.has(key)) {
      dropped.push(key);
      i = lines[end + 1] === '' ? end + 2 : end + 1;
    } else {
      seen.add(key);
      out.push(...block);
      i = end + 1;
    }
  }
  return { content: out.join('\n'), dropped };
}

/**
 * Drop second-and-later occurrences of any top-level key where each
 * entry is a single quoted-key line: `  'key': 'value',`. Used for
 * src/lib/katex-macros.ts.
 */
function dedupeOnelineEntries(content) {
  const lines = content.split('\n');
  const seen = new Set();
  const dropped = [];
  const out = [];
  const KEY_RE = /^\s+'([^']+)':/;
  for (const line of lines) {
    const m = line.match(KEY_RE);
    if (m) {
      const key = m[1];
      if (seen.has(key)) {
        dropped.push(key);
        continue;
      }
      seen.add(key);
    }
    out.push(line);
  }
  return { content: out.join('\n'), dropped };
}
