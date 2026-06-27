#!/usr/bin/env node
/**
 * Emit ready-to-launch chapter-authoring agent briefs for a part, built
 * from plan-part.mjs plus each source chapter's \section structure and
 * problem-block count. Removes the per-chapter brief hand-writing.
 *
 *   node scripts/author-part-brief.mjs            # next unwired part
 *   node scripts/author-part-brief.mjs --part 9
 *   node scripts/author-part-brief.mjs --json     # machine-readable
 *
 * Each brief is intentionally small — it points the agent at AUTHORING.md
 * for everything else (the spec is hardened there).
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = resolve(import.meta.dirname, '..');
const args = process.argv.slice(2);
const asJson = args.includes('--json');
const planArgs = args.includes('--part') ? ['--part', args[args.indexOf('--part') + 1]] : [];
const plan = JSON.parse(
  execFileSync('node', [resolve(ROOT, 'scripts/plan-part.mjs'), ...planArgs], { encoding: 'utf8' }),
);

const EXEMPLAR = 'src/pages/part-2-basic-abstract-algebra/03-ring-flavors/01-fields/01-what-is-a-field.mdx';

function clean(s) {
  return s.replace(/\$([^$]*)\$/g, '$1').replace(/\\[A-Za-z]+\s?/g, '').replace(/[{}]/g, '').replace(/\s+/g, ' ').trim();
}

function analyzeSource(texPath) {
  let src = '';
  try { src = readFileSync(resolve(ROOT, texPath), 'utf8'); } catch { return { sections: [], problems: 0 }; }
  const sections = [...src.matchAll(/^\\section\{([\s\S]*?)\}/gm)]
    .map((m) => clean(m[1]))
    .filter((s) => s && !/problemhead|problems/i.test(s));
  const problems = src
    .split('\n').filter((l) => !/^\s*%/.test(l)).join('\n')
    .match(/\\begin\{(s?problem|dproblem)\}/g)?.length ?? 0;
  return { sections, problems };
}

function briefFor(ch) {
  const { sections, problems } = analyzeSource(ch.sourceTex);
  const slug = ch.dirSlug.replace(/^\d+-/, '');
  const sectionList = sections.length
    ? sections.map((s, i) => `§${i + 1} ${s}`).join(', ')
    : '(read the source for section structure)';
  const problemClause = problems > 0
    ? `The source has ${problems} problem block(s) — every one must appear as a <Problem> in your problems section (the verifier checks this).`
    : `The source has no problem blocks — no problems section is required, and your spec can omit the Problem-flow block.`;
  const incompleteClause = ch.incomplete
    ? `\n\nNOTE: the source for this chapter is flagged incomplete in the book ("${ch.sourceNote || 'incomplete'}"). Author what the source covers; do not invent missing material — note any gaps in your final report.`
    : '';
  return `You are authoring one chapter of the "napkin" interactive math learning portal. You are in a dedicated git worktree on your own branch — author files, commit at section boundaries, do NOT push, do NOT merge.

**FIRST, read \`AUTHORING.md\` at the repo root in full.** It is the complete spec (slide style, components, glossary, KaTeX macros, tests, self-verify, and the build-time gotchas that astro check misses). Follow it exactly.

Your chapter:
- Source TeX: \`${ch.sourceTex}\`
- Part dir: \`${plan.partDir}\`
- Chapter dir: \`${ch.chapterDir}\`
- Chapter title (context only; the parent wires slide-nav.ts, NOT you): "${ch.chapterTitle}"
- Sections in the source: ${sectionList}, plus a problems section if applicable. ${problemClause}

Glossary: create ONE new file \`src/lib/glossary-chapters/${ch.chapterDir.replace('/', '-')}.ts\` (default-exporting a Record<string, GlossaryEntry>) — do NOT edit the shared src/lib/glossary.ts. Keys must be unique across the portal.

Style exemplar: \`${EXEMPLAR}\`.
Test spec: copy the shape of \`tests/e2e/ring-flavors.spec.ts\` → write \`tests/e2e/${slug}.spec.ts\`. Write ONLY the interactive flow blocks (KaTeX, MCQ, NumericInput, ProofReveal, Problem); do NOT write per-slide "loads URL" tests or a SLIDES list (a global smoke spec covers rendering). Every exercise island needs \`client:load\`. article.getByText assertions must be verbatim substrings of your slide prose.

Audience: a CS-trained adult rebuilding undergraduate math (knows abstraction, forgot the math). Frame concretely before formal. Match Evan Chen's conversational "we" voice.

Work incrementally: author one section, add its glossary entries to your chapter glossary file, then \`git add -A && git commit -m "Author §N …"\`, before the next section.

Before reporting done, run (fix anything they report):
  node scripts/verify-chapter.mjs ${ch.chapterDir}
  npm run check
  npm run build

HARD CONSTRAINTS:
- Do NOT edit src/lib/slide-nav.ts (parent wires it).
- Do NOT touch any other chapter/part or any file outside your chapter's slides, your glossary-chapters file, src/lib/katex-macros.ts, and your one test spec.
- Do NOT run npm install. Do NOT push or merge.
- Do NOT invoke the simplify / fewer-permission-prompts / review / code-review or any other skill. When authored and verified, stop and report.

Report back: sections authored, slide count, glossary keys added, anything deliberately skipped/simplified, and verify/check/build status.${incompleteClause}`;
}

const briefs = plan.chapters.map((ch) => ({
  chapterDir: ch.chapterDir,
  chapterTitle: ch.chapterTitle,
  model: 'sonnet',
  isolation: 'worktree',
  brief: briefFor(ch),
}));

if (asJson) {
  console.log(JSON.stringify({ part: plan.partTitleEntry, partDir: plan.partDir, briefs }, null, 2));
} else {
  console.log(`\n# ${plan.partTitleEntry} — ${briefs.length} chapter agents (worktree-isolated, sonnet)\n`);
  for (const b of briefs) {
    console.log(`\n${'='.repeat(78)}\n## ${b.chapterTitle}  (${b.chapterDir})\n${'='.repeat(78)}\n`);
    console.log(b.brief);
  }
}
