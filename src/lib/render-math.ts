import katex from 'katex';
import { napkinKatexMacros } from './katex-macros';

/**
 * Render a plain-string prop that may contain inline `$…$` or display
 * `$$…$$` KaTeX segments into an HTML string.
 *
 * The React exercise islands (Problem / MCQ / NumericInput / ProofReveal)
 * receive their prompt / hint / solution / explanation / option-label text
 * as plain strings. Astro's MDX pipeline (remark-math + rehype-katex) only
 * touches slide *prose*, never these props, so any math written in a prop
 * used to render as raw text (`$\widehat{G}$` shown literally). This helper
 * gives the islands the same math rendering the prose already has.
 *
 * Text outside `$…$` is HTML-escaped, so props that use plain Unicode math
 * (ℤ, ⊗, H̃) — the newer convention — are returned unchanged and render
 * exactly as before. Only `$…$` segments become KaTeX.
 *
 * KaTeX options mirror `astro.config.mjs` (same macros, `strict: 'ignore'`,
 * `output: 'html'`) so a prop renders identically to the same TeX in prose.
 * `throwOnError: false` means malformed TeX renders as a red error string
 * instead of throwing during SSR/build.
 */

const katexOptions = {
  macros: napkinKatexMacros,
  strict: 'ignore' as const,
  output: 'html' as const,
  throwOnError: false,
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function renderMathString(input: string | null | undefined): string {
  if (input == null) return '';
  // Fast path: no `$` means no math — just escape and return unchanged.
  if (!input.includes('$')) return escapeHtml(input);

  let out = '';
  let i = 0;
  const n = input.length;

  while (i < n) {
    const dollar = input.indexOf('$', i);
    if (dollar === -1) {
      out += escapeHtml(input.slice(i));
      break;
    }
    // Emit the escaped text before the delimiter.
    out += escapeHtml(input.slice(i, dollar));

    const display = input[dollar + 1] === '$';
    const delim = display ? '$$' : '$';
    const start = dollar + delim.length;
    const end = input.indexOf(delim, start);

    if (end === -1) {
      // Unbalanced delimiter: treat the trailing `$` (and rest) as literal text.
      out += escapeHtml(input.slice(dollar));
      break;
    }

    const tex = input.slice(start, end);
    try {
      out += katex.renderToString(tex, { ...katexOptions, displayMode: display });
    } catch {
      // Should not happen with throwOnError:false, but stay safe.
      out += escapeHtml(input.slice(dollar, end + delim.length));
    }
    i = end + delim.length;
  }

  return out;
}
