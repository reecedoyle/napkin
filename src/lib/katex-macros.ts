/**
 * KaTeX macro definitions translating the most-used Napkin LaTeX macros
 * (defined in vendor/napkin/tex/macros.tex) into something KaTeX understands.
 *
 * Add new entries as we hit unfamiliar macros in chapters; keep alphabetised.
 */
export const napkinKatexMacros: Record<string, string> = {
  // Blackboard-bold number sets.
  '\\CC': '\\mathbb{C}',
  '\\FF': '\\mathbb{F}',
  '\\NN': '\\mathbb{N}',
  '\\QQ': '\\mathbb{Q}',
  '\\RR': '\\mathbb{R}',
  '\\ZZ': '\\mathbb{Z}',

  // Common shorthands.
  '\\eps': '\\varepsilon',
  '\\inv': '^{-1}',
  '\\half': '\\tfrac{1}{2}',
  '\\id': '\\mathrm{id}',
  '\\defeq': '\\coloneqq',
  '\\dg': '^{\\circ}',

  // Operators that LaTeX would \DeclareMathOperator.
  '\\sign': '\\operatorname{sign}',
  '\\Aut': '\\operatorname{Aut}',
  '\\Inn': '\\operatorname{Inn}',
  '\\Syl': '\\operatorname{Syl}',
  '\\Gal': '\\operatorname{Gal}',
  '\\GL': '\\operatorname{GL}',
  '\\SL': '\\operatorname{SL}',
  '\\cis': '\\operatorname{cis}',
  '\\lcm': '\\operatorname{lcm}',
  '\\diam': '\\operatorname{diam}',
  '\\ord': '\\operatorname{ord}',

  // Decorators.
  '\\abs': '\\left\\lvert #1 \\right\\rvert',
  '\\norm': '\\left\\lVert #1 \\right\\rVert',
  '\\floor': '\\left\\lfloor #1 \\right\\rfloor',
  '\\ceiling': '\\left\\lceil #1 \\right\\rceil',
  '\\cbrt': '\\sqrt[3]{#1}',
  '\\ol': '\\overline{#1}',
  '\\ul': '\\underline{#1}',
  '\\wt': '\\widetilde{#1}',
  '\\wh': '\\widehat{#1}',

  // Cyclic group Z/n — Napkin writes \Zc{n}.
  '\\Zc': '\\mathbb{Z}/#1\\mathbb{Z}',

  // Cyclic group with parenthesised argument — Napkin uses \Zcc{p-1}
  // when the argument is a compound expression. Same group as \Zc.
  '\\Zcc': '\\mathbb{Z}/(#1)\\mathbb{Z}',

  // Multiplicative group of units mod n — Napkin writes \Zm{n}.
  '\\Zm': '(\\mathbb{Z}/#1\\mathbb{Z})^\\times',

  // Matrix space — Napkin writes \Mat (e.g. \Mat_{2 \times 2}(\RR)).
  '\\Mat': '\\mathrm{Mat}',
};
