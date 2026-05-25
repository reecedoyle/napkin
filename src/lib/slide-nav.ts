/**
 * Build-time slide ordering for the portal.
 *
 * Path-only globbing isn't enough now that the TOC tracks exercise
 * completion — we also need the *raw MDX text* to extract exercise IDs. We
 * use `eager: true` with `query: '?raw'` so Vite gives us the file contents
 * as strings at build time. This module is server-only — never shipped to
 * the browser — so the inlined raw text doesn't bloat the client bundle.
 *
 * Smoke slides (directly under a chapter dir, not nested in a section dir)
 * are deliberately excluded — they're test fixtures, not study material.
 */

export interface SlideEntry {
  url: string;
  title: string;
  /** Part directory, e.g. "part-1-starting-out". */
  part: string;
  /** Chapter directory name, e.g. "01-groups". */
  chapter: string;
  /** Section directory name, e.g. "01-definition". */
  section: string;
  /** Exercise component IDs declared on this slide. */
  exerciseIds: string[];
}

function titleFromPath(path: string): string {
  // Filename ends in `<NN>-<kebab-slug>.mdx`. Strip prefix, dashes → spaces,
  // capitalise the first character.
  const m = path.match(/\d+-([^/]+)\.mdx$/);
  if (!m) return '';
  const slug = m[1].replace(/-/g, ' ');
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

// /src/pages/<part-dir>/<chapter-dir>/<section-dir>/<NN-slug>.mdx
const SLIDE_RE = /\/(part-[^/]+)\/([^/]+)\/([^/]+)\/([^/]+)\.mdx$/;

// Match `id="..."` on exercise component tags only. Robust against stray
// `id` attributes elsewhere (SVG groups, anchors, etc.) — only IDs on MCQ /
// NumericInput / ProofReveal / Problem count as exercises.
const EX_RE = /<(?:MCQ|NumericInput|ProofReveal|Problem)[\s\S]*?\bid="([^"]+)"/g;

// BASE_URL is "/" by default, "/napkin/" when PUBLIC_BASE_PATH is set for
// the production build. Strip the leading "/" from the page path so the
// concatenation works in both cases without producing a double slash.
const BASE_URL = import.meta.env.BASE_URL;

const slideRaw: Record<string, string> = import.meta.glob(
  '/src/pages/part-*/*/*/*.mdx',
  { eager: true, query: '?raw', import: 'default' },
);

function extractExerciseIds(raw: string): string[] {
  const ids = new Set<string>();
  for (const m of raw.matchAll(EX_RE)) ids.add(m[1]);
  return [...ids];
}

const slides: SlideEntry[] = Object.entries(slideRaw)
  .map(([path, raw]) => {
    const m = path.match(SLIDE_RE);
    if (!m) return null;
    const [, part, chapter, section] = m;
    return {
      url: BASE_URL + path.replace('/src/pages/', '').replace(/\.mdx$/, ''),
      title: titleFromPath(path),
      part,
      chapter,
      section,
      exerciseIds: extractExerciseIds(raw),
    };
  })
  .filter((x): x is SlideEntry => x !== null)
  .sort((a, b) => a.url.localeCompare(b.url));

// ────────────── Metadata ──────────────
//
// Titles are keyed by directory path under src/pages/ so two different
// parts can have a "01-something" chapter without collision.

export const partTitles: Record<string, string> = {
  'part-1-starting-out': 'Part I — Starting Out',
  'part-2-basic-abstract-algebra': 'Part II — Basic Abstract Algebra',
};

export const chapterTitles: Record<string, string> = {
  'part-1-starting-out/01-groups': 'Chapter 1 — Groups',
  'part-1-starting-out/02-metric-topology': 'Chapter 2 — Metric Topology',
  'part-2-basic-abstract-algebra/01-quotient-groups': 'Chapter 3 — Homomorphisms and quotient groups',
  'part-2-basic-abstract-algebra/02-rings': 'Chapter 4 — Rings and ideals',
  'part-2-basic-abstract-algebra/03-ring-flavors': 'Chapter 5 — Flavors of rings',
};

export const sectionTitles: Record<string, string> = {
  // Part I — Groups
  'part-1-starting-out/01-groups/01-definition': '§1 — Definition and examples',
  'part-1-starting-out/01-groups/02-properties': '§2 — Properties of groups',
  'part-1-starting-out/01-groups/03-isomorphisms': '§3 — Isomorphisms',
  'part-1-starting-out/01-groups/04-orders-and-lagrange': '§4 — Orders & Lagrange',
  'part-1-starting-out/01-groups/05-subgroups': '§5 — Subgroups',
  'part-1-starting-out/01-groups/06-small-orders': '§6 — Groups of small orders',
  'part-1-starting-out/01-groups/07-axiom-rationale': '§7 — Why these axioms?',
  'part-1-starting-out/01-groups/08-problems': '§8 — Problems',
  // Part I — Metric Topology
  'part-1-starting-out/02-metric-topology/01-definition': '§1 — Definition and examples',
  'part-1-starting-out/02-metric-topology/02-convergence': '§2 — Convergence',
  'part-1-starting-out/02-metric-topology/03-continuous-maps': '§3 — Continuous maps',
  'part-1-starting-out/02-metric-topology/04-homeomorphisms': '§4 — Homeomorphisms',
  'part-1-starting-out/02-metric-topology/05-product-metric': '§5 — Product metric',
  'part-1-starting-out/02-metric-topology/06-open-sets': '§6 — Open sets',
  'part-1-starting-out/02-metric-topology/07-closed-sets': '§7 — Closed sets',
  'part-1-starting-out/02-metric-topology/08-problems': '§8 — Problems',
};

// ────────────── Public helpers ──────────────

export function getAllSlides(): readonly SlideEntry[] {
  return slides;
}

export function getSlidesForChapter(part: string, chapter: string): SlideEntry[] {
  return slides.filter((s) => s.part === part && s.chapter === chapter);
}

export function getPartAndChapterFromUrl(
  url: string,
): { part: string; chapter: string } | undefined {
  const m = url.match(/\/(part-[^/]+)\/([^/]+)\//);
  return m ? { part: m[1], chapter: m[2] } : undefined;
}

export function getSlideNeighbors(currentUrl: string): {
  prev?: SlideEntry;
  next?: SlideEntry;
  index?: number;
  total: number;
} {
  const url = currentUrl.replace(/\/$/, '');
  const idx = slides.findIndex((s) => s.url === url);
  if (idx === -1) return { total: slides.length };
  return {
    prev: idx > 0 ? slides[idx - 1] : undefined,
    next: idx < slides.length - 1 ? slides[idx + 1] : undefined,
    index: idx,
    total: slides.length,
  };
}
