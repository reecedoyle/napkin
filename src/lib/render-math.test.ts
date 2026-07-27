import { describe, it, expect } from 'vitest';
import { renderMathString } from './render-math';

describe('renderMathString', () => {
  it('returns plain text unchanged (no math)', () => {
    expect(renderMathString('Compute the answer.')).toBe('Compute the answer.');
  });

  it('leaves Unicode-math props untouched (newer convention)', () => {
    const s = 'Show H̃₁(ℝ, ℚ) ≅ ℤ ⊕ ℤ/2ℤ.';
    expect(renderMathString(s)).toBe(s);
  });

  it('HTML-escapes special characters in non-math text', () => {
    const out = renderMathString('a < b & c > d');
    expect(out).toBe('a &lt; b &amp; c &gt; d');
  });

  it('renders an inline $…$ segment as KaTeX', () => {
    const out = renderMathString('Let $x^2$ be a square.');
    expect(out).toContain('Let ');
    expect(out).toContain('class="katex"');
    expect(out).toContain(' be a square.');
    // raw dollar/tex must not survive
    expect(out).not.toContain('$x^2$');
  });

  it('renders backslash commands inside $…$', () => {
    const out = renderMathString('The dual $\\widehat{G}$ is discrete.');
    expect(out).toContain('class="katex"');
    expect(out).not.toContain('\\widehat');
    expect(out).not.toContain('$');
  });

  it('applies napkin macros ($\\ZZ$ → blackboard Z)', () => {
    const out = renderMathString('The integers $\\ZZ$.');
    expect(out).toContain('class="katex"');
    expect(out).not.toContain('\\ZZ');
  });

  it('renders display $$…$$ segments in display mode', () => {
    const out = renderMathString('$$\\lim_{n\\to\\infty} a_n = 0$$');
    expect(out).toContain('class="katex"');
    // display mode wrapper present
    expect(out).toContain('katex-display');
  });

  it('handles multiple math segments mixed with escaped text', () => {
    const out = renderMathString('If $G$ is compact then $\\widehat{G}$ is discrete & nice.');
    expect((out.match(/class="katex"/g) || []).length).toBe(2);
    expect(out).toContain('&amp; nice.');
  });

  it('treats an unbalanced $ as literal text', () => {
    const out = renderMathString('It costs $5 today.');
    expect(out).toBe('It costs $5 today.');
  });

  it('handles null/undefined safely', () => {
    expect(renderMathString(null)).toBe('');
    expect(renderMathString(undefined)).toBe('');
  });
});
