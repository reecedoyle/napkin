/**
 * Chapter glossary for Part 9 Chapter 1 — Holomorphic functions.
 *
 * This file exports the glossary entries specific to this chapter.
 * The entries are also present in src/lib/glossary.ts (required by the
 * verify-chapter.mjs verifier and the Term component at runtime).
 */
import type { GlossaryEntry } from '../glossary';

const entries: Record<string, GlossaryEntry> = {
  complexFunction: {
    term: 'Complex-valued function',
    symbol: 'f \\colon U \\to \\CC',
    definition: 'A function from a subset U of ℂ to ℂ. Can be thought of as a function ℝ² → ℝ², but the complex structure imposes extra constraints when we ask for differentiability.',
    example: 'f(z) = z², f(z) = eᶻ, and f(z) = z̄ (complex conjugate) are all complex-valued functions on ℂ.',
  },
  openSubset: {
    term: 'Open subset of ℂ',
    symbol: 'U \\subseteq \\CC',
    definition: 'A subset U of ℂ in which every point has a small disk around it still inside U. Openness is required for the complex derivative to be well-defined.',
    example: 'The open disk {z : |z| < 1} is open. A closed disk {z : |z| ≤ 1} is not open.',
  },
  complexDifferentiable: {
    term: 'Complex differentiable',
    definition: 'A function f: U → ℂ is complex differentiable at z₀ if the limit lim_{h→0} (f(z₀+h)−f(z₀))/h exists in ℂ, with h approaching 0 from every direction simultaneously.',
    example: 'f(z) = z² is complex differentiable everywhere. f(z) = z̄ is not differentiable anywhere.',
  },
  holomorphic: {
    term: 'Holomorphic function',
    symbol: 'f \\colon U \\to \\CC',
    definition: 'A function f: U → ℂ that is complex differentiable at every point of its open domain U.',
    example: 'Polynomials, eᶻ, sin z, cos z are holomorphic. The conjugate z ↦ z̄ is not.',
  },
  entireFunction: {
    term: 'Entire function',
    definition: 'A holomorphic function whose domain is all of ℂ.',
    example: 'Polynomials, eᶻ, sin z, cos z are entire. The function 1/z is not entire.',
  },
  contour: {
    term: 'Contour',
    symbol: '\\alpha \\colon [a,b] \\to \\CC',
    definition: 'A piecewise smooth path in ℂ: a continuous function from a real interval into ℂ that is differentiable except at finitely many bend points.',
    example: 'The unit circle traversed once is a contour.',
  },
  contourIntegral: {
    term: 'Contour integral',
    symbol: '\\oint_\\alpha f(z)\\,dz',
    definition: 'The integral of f along a contour α, defined as ∫_a^b f(α(t))·α\'(t) dt. Independent of how α is parametrised.',
    example: '∮_{unit circle} z^{−1} dz = 2πi.',
  },
  simplyConnectedOpen: {
    term: 'Simply connected open set',
    symbol: '\\Omega \\subseteq \\CC',
    definition: 'An open connected subset of ℂ with no holes: every loop inside can be continuously shrunk to a point.',
    example: 'ℂ and any open disk are simply connected. ℂ \\ {0} is not.',
  },
  cauchyGoursat: {
    term: 'Cauchy-Goursat theorem',
    definition: 'If f is holomorphic on a simply connected open Ω and γ is any loop in Ω, then ∮_γ f(z) dz = 0.',
    example: 'The integral of eᶻ around any closed curve in ℂ is 0.',
  },
  cauchyIntegralFormula: {
    term: "Cauchy's integral formula",
    symbol: 'f(a) = \\tfrac{1}{2\\pi i} \\oint_\\gamma \\frac{f(z)}{z-a}\\,dz',
    definition: 'If f is holomorphic on a region containing disk D bounded by γ, and a is inside D, then f(a) = (1/2πi) ∮_γ f(z)/(z−a) dz.',
  },
  taylorSeries: {
    term: 'Taylor series (complex)',
    symbol: 'f(z) = \\sum_{k \\ge 0} c_k (z-p)^k',
    definition: 'Every holomorphic function equals its Taylor series throughout any disk in its domain. The coefficient cₖ = f^(k)(p)/k!.',
    example: 'eᶻ = 1 + z + z²/2! + z³/3! + ···, convergent for all z ∈ ℂ.',
  },
  analyticFunction: {
    term: 'Analytic function',
    definition: 'A function that equals its Taylor series near every point. For complex functions, analytic and holomorphic are equivalent.',
  },
  mlLemma: {
    term: 'ML estimation lemma',
    definition: 'If |f(z)| ≤ M on a contour α of length L, then |∮_α f(z) dz| ≤ ML.',
  },
  keyholeContour: {
    term: 'Keyhole contour',
    definition: 'A contour used in the proof of Cauchy\'s integral formula, shaped like a keyhole: an outer circle connected to a tiny inner circle by two corridors.',
  },
  isolatedSet: {
    term: 'Isolated set',
    definition: 'A set S such that each point of S has an open neighbourhood containing no other point of S.',
    example: 'The integers ℤ form an isolated set in ℂ.',
  },
  liouvilleThm: {
    term: "Liouville's theorem",
    definition: 'A bounded entire function must be constant.',
  },
  identityThm: {
    term: 'Identity theorem',
    definition: 'Two holomorphic functions on a connected open set that agree on any open neighbourhood must be equal everywhere.',
  },
  removableSingularity: {
    term: 'Removable singularity',
    definition: 'A point p where a holomorphic function f: U \\ {p} → ℂ is bounded; f extends to a holomorphic function on all of U.',
  },
  backwardsContour: {
    term: 'Backwards contour',
    symbol: '\\overline{\\alpha}',
    definition: 'For a contour α: [0,1] → ℂ, the backwards contour ᾱ(t) = α(1−t) traces the same path in the opposite direction. Its integral is minus the original.',
  },
};

export default entries;
