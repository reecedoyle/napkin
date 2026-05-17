/**
 * Build-time slide ordering for the Part-I chapters.
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

const SLIDE_RE = /\/part-1-starting-out\/([^/]+)\/([^/]+)\/([^/]+)\.mdx$/;

// Match `id="..."` on exercise component tags only. Robust against stray
// `id` attributes elsewhere (SVG groups, anchors, etc.) — only IDs on MCQ /
// NumericInput / ProofReveal / Problem count as exercises.
const EX_RE = /<(?:MCQ|NumericInput|ProofReveal|Problem)[\s\S]*?\bid="([^"]+)"/g;

const slideRaw: Record<string, string> = import.meta.glob(
  '/src/pages/part-1-starting-out/*/*/*.mdx',
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
    const [, chapter, section] = m;
    return {
      url: path.replace('/src/pages', '').replace(/\.mdx$/, ''),
      title: titleFromPath(path),
      chapter,
      section,
      exerciseIds: extractExerciseIds(raw),
    };
  })
  .filter((x): x is SlideEntry => x !== null)
  .sort((a, b) => a.url.localeCompare(b.url));

// ────────────── Metadata ──────────────

export const chapterTitles: Record<string, string> = {
  '01-groups': 'Chapter 1 — Groups',
  '02-metric-topology': 'Chapter 2 — Metric Topology',
};

export const sectionTitles: Record<string, Record<string, string>> = {
  '01-groups': {
    '01-definition': '§1 — Definition and examples',
    '02-properties': '§2 — Properties of groups',
    '03-isomorphisms': '§3 — Isomorphisms',
    '04-orders-and-lagrange': '§4 — Orders & Lagrange',
    '05-subgroups': '§5 — Subgroups',
    '06-small-orders': '§6 — Groups of small orders',
    '07-axiom-rationale': '§7 — Why these axioms?',
    '08-problems': '§8 — Problems',
  },
  '02-metric-topology': {
    '01-definition': '§1 — Definition and examples',
    '02-convergence': '§2 — Convergence',
    '03-continuous-maps': '§3 — Continuous maps',
    '04-homeomorphisms': '§4 — Homeomorphisms',
    '05-product-metric': '§5 — Product metric',
    '06-open-sets': '§6 — Open sets',
    '07-closed-sets': '§7 — Closed sets',
    '08-problems': '§8 — Problems',
  },
};

// ────────────── Public helpers ──────────────

export function getAllSlides(): readonly SlideEntry[] {
  return slides;
}

export function getSlidesForChapter(chapter: string): SlideEntry[] {
  return slides.filter((s) => s.chapter === chapter);
}

export function getChapterFromUrl(url: string): string | undefined {
  const m = url.match(/\/part-1-starting-out\/([^/]+)\//);
  return m?.[1];
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
