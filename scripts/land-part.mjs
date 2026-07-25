#!/usr/bin/env node
/**
 * Land an authored part in one shot: extract the chapter files from the
 * agent worktrees, wire slide-nav metadata, commit that, build, and run the
 * full e2e suite. Stops at the first failure with a clear message so the
 * only manual steps left in a part are (1) launching the authoring agents,
 * (2) the reviewer pass, and (3) acting on any failure this surfaces.
 *
 *   node scripts/land-part.mjs            # next unwired part
 *   node scripts/land-part.mjs --part 10
 *
 * Idempotent-ish: safe to re-run after fixing a failure (finalize will find
 * no worktrees the second time and skip; wire is idempotent).
 */
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const partArgs = process.argv.includes('--part')
  ? ['--part', process.argv[process.argv.indexOf('--part') + 1]]
  : [];

function run(cmd, args, opts = {}) {
  console.log(`\n▶ ${cmd} ${args.join(' ')}`);
  execFileSync(cmd, args, { cwd: ROOT, stdio: 'inherit', ...opts });
}
function capture(cmd, args) {
  return execFileSync(cmd, args, { cwd: ROOT, encoding: 'utf8' });
}

const plan = JSON.parse(capture('node', [resolve(ROOT, 'scripts/plan-part.mjs'), ...partArgs]));

// 1. extract chapter files from worktrees (no-op if already done)
run('node', [resolve(ROOT, 'scripts/finalize-part.mjs')]);

// 1b. verify each landed chapter before the expensive build+e2e. This is the
// gate that was only advisory when Part XIV shipped 4 broken e2e anchors:
// mechanical errors (dead islands, bad Callout kinds, unknown Term keys,
// ambiguous MCQ button matchers) fail here in ~1s/chapter instead of after a
// ~1-min build. Assertion mismatches print as warnings — the e2e run below is
// their authoritative gate.
for (const ch of plan.chapters) {
  const texArgs = ch.sourceTex ? ['--tex', ch.sourceTex] : [];
  run('node', [resolve(ROOT, 'scripts/verify-chapter.mjs'), ch.chapterDir, ...texArgs]);
}

// 2. wire metadata, commit if it changed anything
run('node', [resolve(ROOT, 'scripts/wire-part.mjs'), ...partArgs]);
const dirty = capture('git', ['status', '--porcelain', 'src/lib/slide-nav.ts']).trim();
if (dirty) {
  run('git', ['add', 'src/lib/slide-nav.ts']);
  run('git', ['commit', '-m', `Wire ${plan.partTitleEntry} metadata`]);
} else {
  console.log('\nslide-nav already wired — nothing to commit.');
}

// 3. build + full regression
run('npm', ['run', 'build']);
run('npm', ['run', 'test:e2e']);

console.log(`\n✅ ${plan.partTitleEntry} landed: extracted, wired, built, e2e green.`);
