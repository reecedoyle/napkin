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

function sh(cmd, opts = {}) {
  return execSync(cmd, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...opts });
}

function run(cmd, opts = {}) {
  // Like sh but pipes child output to the user's terminal in real time.
  const [bin, ...args] = cmd.split(' ');
  const r = spawnSync(bin, args, { cwd: ROOT, stdio: 'inherit', ...opts });
  if (r.status !== 0) throw new Error(`${cmd} exited ${r.status}`);
}

function tryMerge(branch) {
  // Returns 'clean' | 'conflict' | 'error'.
  const r = spawnSync('git', ['merge', '--no-ff', branch, '-m', `Merge ${branch}`], {
    cwd: ROOT,
    stdio: 'pipe',
    encoding: 'utf8',
  });
  if (r.status === 0) return 'clean';
  const stderr = (r.stderr ?? '') + (r.stdout ?? '');
  if (/CONFLICT/.test(stderr)) return 'conflict';
  console.error(stderr);
  return 'error';
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

// ─── 3. merge each branch into main, auto-resolving glossary ──────────

for (const wt of agentTrees) {
  // Skip branches with no commits ahead of main.
  const ahead = sh(`git rev-list --count main..${wt.branch}`).trim();
  if (ahead === '0') {
    console.log(`Skipping ${wt.branch} — no commits ahead of main.`);
    continue;
  }

  console.log(`Merging ${wt.branch} (${ahead} commit(s))…`);
  const result = tryMerge(wt.branch);

  if (result === 'clean') continue;
  if (result === 'error') {
    console.error(`Merge of ${wt.branch} failed for an unexpected reason — resolve manually and re-run.`);
    process.exit(1);
  }

  // result === 'conflict'
  const conflicted = sh('git diff --name-only --diff-filter=U').trim().split('\n').filter(Boolean);
  if (conflicted.length !== 1 || conflicted[0] !== 'src/lib/glossary.ts') {
    console.error(`Merge of ${wt.branch} produced unexpected conflicts:`);
    for (const f of conflicted) console.error(`  ${f}`);
    console.error('Resolve manually, commit, then re-run.');
    process.exit(1);
  }

  console.log('  Auto-resolving src/lib/glossary.ts (additive section blocks)…');
  const glossPath = resolve(ROOT, 'src/lib/glossary.ts');
  const resolved = resolveAdditiveGlossaryConflict(readFileSync(glossPath, 'utf8'));
  if (!resolved) {
    console.error(`  Conflict didn't match the expected additive pattern (chapter section block at end).`);
    console.error('  Resolve manually, commit, then re-run.');
    process.exit(1);
  }
  writeFileSync(glossPath, resolved);
  sh('git add src/lib/glossary.ts');
  sh(`git commit -m "Merge ${wt.branch}"`);
}

// ─── 4. clean up worktrees ────────────────────────────────────────────

for (const wt of agentTrees) {
  try { sh(`git worktree unlock ${wt.path}`); } catch { /* ignore */ }
  sh(`git worktree remove -f ${wt.path}`);
  sh(`git branch -D ${wt.branch}`);
}

// ─── 4b. dedupe glossary keys ─────────────────────────────────────────
//
// When two chapters in a single Part both introduce the same concept
// (e.g. hausdorff appearing in both compactness and topological-spaces),
// merging just concatenates both blocks and TS will error on the
// duplicate object-literal key. Strip the second occurrence of every
// repeated key, keeping the first.

const glossPath = resolve(ROOT, 'src/lib/glossary.ts');
const originalGloss = readFileSync(glossPath, 'utf8');
const { content: dedupedGloss, dropped } = dedupeGlossaryKeys(originalGloss);
if (dropped.length > 0) {
  console.log(`\nAuto-deduping ${dropped.length} cross-chapter glossary key collision(s):`);
  for (const k of dropped) console.log(`  - dropped second occurrence of "${k}"`);
  writeFileSync(glossPath, dedupedGloss);
  sh('git add src/lib/glossary.ts');
  sh('git commit -m "Dedupe glossary: keys defined by multiple chapters"');
}

// ─── 5. run quick checks ──────────────────────────────────────────────

console.log('\nRunning npm run check…');
run('npm run check');
console.log('\nRunning npm run test:unit…');
run('npm run test:unit');

console.log('\nfinalize-part: done.');
console.log('Next: run `npm run test:e2e` for the full regression, then `git push`.');

// ─── glossary auto-resolver ────────────────────────────────────────────

/**
 * Drop second-and-later occurrences of any key in the glossary's top-level
 * object literal. Operates line-by-line so we can preserve indentation
 * exactly. An "entry" starts with `  <camelKey>: {` at line start and ends
 * at the matching `  },` (depth-tracked over the entry body, which may
 * itself contain nested braces in string literals — but the regex on the
 * entry header is anchored at column 3 with `\s{2}`, so we can rely on
 * that exact indentation to find true entry boundaries).
 */
function dedupeGlossaryKeys(content) {
  const lines = content.split('\n');
  const seen = new Set();
  const dropped = [];
  const out = [];
  const HEADER_RE = /^\s{2}([a-zA-Z_][a-zA-Z0-9_]*):\s*\{\s*$/;
  // A line of exactly "  }," (two spaces, close brace, comma) closes one
  // top-level entry. Sentinel-shape because every entry in this file
  // closes that way.
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
    // Collect this entry block until we hit the matching closer.
    let end = i;
    while (end < lines.length && lines[end] !== CLOSER) end++;
    if (end >= lines.length) {
      // Malformed — bail out by keeping rest verbatim.
      out.push(...lines.slice(i));
      break;
    }
    const block = lines.slice(i, end + 1);
    if (seen.has(key)) {
      dropped.push(key);
      // Also swallow a single trailing blank line if there is one, so
      // we don't leave a double-blank where the entry used to be.
      if (lines[end + 1] === '') {
        i = end + 2;
      } else {
        i = end + 1;
      }
    } else {
      seen.add(key);
      out.push(...block);
      i = end + 1;
    }
  }
  return { content: out.join('\n'), dropped };
}

function resolveAdditiveGlossaryConflict(content) {
  // Expected shape (single conflict in the entire file):
  //
  //     <<<<<<< HEAD
  //       // ────── Chapter X header ──────
  //       entryX1: { … },
  //       …
  //       entryXn: {
  //         … definition: '…',
  //     =======
  //       // ────── Chapter Y header ──────
  //       entryY1: { … },
  //       …
  //       entryYm: {
  //         … definition: '…',
  //     >>>>>>> branch
  //       },
  //     } as const satisfies …
  //
  // Both blocks are additive (chapter-N section header + entries). The
  // closing `},` for the last entry on each side has been swallowed by
  // the conflict markers — the one closing brace that survives outside
  // the markers belongs to whichever side ended up last. We rebuild
  // with both blocks separated by a `},` so both last entries close.

  const re = /^<<<<<<<[^\n]*\n([\s\S]*?)^=======[^\n]*\n([\s\S]*?)^>>>>>>>[^\n]*\n/m;
  const all = [...content.matchAll(/^<<<<<<</gm)];
  if (all.length !== 1) return null;
  const m = content.match(re);
  if (!m) return null;
  const [whole, headPart, incomingPart] = m;

  // Sanity: both sides should look like additive section blocks — leading
  // comment row of em-dashes and at least one entry. The original case
  // we saw used "// ──────────────". Just look for a leading "//" header
  // in each side.
  const headFirstLine = headPart.split('\n').find((l) => l.trim());
  const incomingFirstLine = incomingPart.split('\n').find((l) => l.trim());
  if (!/^\s*\/\//.test(headFirstLine ?? '') || !/^\s*\/\//.test(incomingFirstLine ?? '')) {
    return null;
  }

  // Trim trailing whitespace from each side, then concatenate with a
  // `},` separator so HEAD's last entry closes properly. The standalone
  // `  },` that already sits immediately after the conflict block in
  // the file closes the incoming side's last entry — leave it alone.
  const joined = headPart.replace(/\s+$/, '') + '\n  },\n\n' + incomingPart.replace(/\s+$/, '') + '\n';
  return content.replace(whole, joined);
}
