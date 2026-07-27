import type { ReactNode } from 'react';
import { renderMathString } from '../lib/render-math';

/**
 * Renders an exercise-island text prop that may contain `$…$` / `$$…$$`
 * KaTeX. When the prop is a plain string (the normal case from MDX) it is
 * run through {@link renderMathString} and injected as HTML so its math
 * renders like slide prose; plain/Unicode strings pass through unchanged.
 * A non-string ReactNode (rare — inline JSX) is rendered as-is.
 *
 * `block` picks the wrapper element: a `<div>` for standalone prompt/solution
 * blocks, a `<span>` for inline bits (hints, option labels, explanations).
 */
export default function MathText({
  content,
  block = false,
  className,
}: {
  content: ReactNode;
  block?: boolean;
  className?: string;
}) {
  if (typeof content !== 'string') {
    return block ? <div className={className}>{content}</div> : <span className={className}>{content}</span>;
  }
  const html = renderMathString(content);
  return block ? (
    <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
  ) : (
    <span className={className} dangerouslySetInnerHTML={{ __html: html }} />
  );
}
