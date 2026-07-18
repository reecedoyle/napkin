/**
 * Chapter glossary for Part 13 Chapter 52 — Line bundles.
 * All keys prefixed with rs52 to guarantee portal-wide uniqueness.
 */
import type { GlossaryEntry } from '../glossary';

const entries: Record<string, GlossaryEntry> = {
  // ────────────── §1 Overview ──────────────
  rs52lineBundle: {
    term: 'Line bundle',
    symbol: 'L \\xrightarrow{\\pi} X',
    definition: 'A line bundle over a Riemann surface X is a set L together with a projection map π: L → X, such that each fiber π⁻¹(p) carries the structure of a 1-dimensional complex vector space, and these structures vary analytically over X.',
    example: 'The trivial line bundle ℂ × X sends (v, p) ↦ p; every fiber is just a copy of ℂ.',
  },
  rs52section: {
    term: 'Section of a line bundle',
    definition: 'A section on an open set U ⊆ X is a map f: U → L such that π ∘ f is the identity on U. Intuitively, a section picks one point from each fiber — the generalization of a function whose graph lives on the line bundle.',
    example: 'On the trivial bundle ℂ × X a section is the same as an ordinary function f: U → ℂ.',
  },
  rs52globalSection: {
    term: 'Global section',
    definition: 'A section f: X → L defined on the entire Riemann surface X, not just on an open subset.',
    example: 'The zero section of any line bundle — mapping every p ∈ X to the zero element of the fiber — is always a global section.',
  },
  rs52analyticSection: {
    term: 'Analytic section',
    definition: 'A section f: U → L is analytic if, for every open subset U₁ ⊆ U that admits a line bundle chart φ, the composition φ ∘ f|_{U₁}: U₁ → ℂ × U₁ is analytic.',
    example: 'On the trivial bundle ℂ × ℂ, the section f(z) = z² − 1 is an analytic section.',
  },
  // ────────────── §2 Definition ──────────────
  rs52projectionMap: {
    term: 'Projection map (line bundle)',
    symbol: '\\pi \\colon L \\to X',
    definition: 'The projection map π of a line bundle sends each point of L to its base point in X. The preimage π⁻¹(p) of any point p ∈ X is the fiber at p, which is a 1-dimensional complex vector space.',
    example: 'For the trivial bundle L = ℂ × X, the projection is π(v, p) = p.',
  },
  rs52lineBundleChart: {
    term: 'Line bundle chart',
    symbol: '\\phi \\colon \\pi^{-1}(U) \\to \\mathbb{C} \\times U',
    definition: 'A line bundle chart over an open set U ⊆ X is a bijection φ: π⁻¹(U) → ℂ × U that restricts to a ℂ-vector space isomorphism on each fiber π⁻¹(p) → ℂ × {p}.',
    example: 'On the trivial bundle ℂ × X, the identity map is a global chart.',
  },
  rs52transitionFunction: {
    term: 'Transition function (line bundle)',
    definition: 'For two overlapping line bundle charts φ₁: π⁻¹(U₁) → ℂ × U₁ and φ₂: π⁻¹(U₂) → ℂ × U₂, the transition function is φ₂ ∘ φ₁⁻¹: ℂ × (U₁ ∩ U₂) → ℂ × (U₁ ∩ U₂). It must be a ℂ-linear isomorphism on each fiber and have an analytic scaling factor.',
    example: 'The tautological line bundle on ℂ_∞ has transition function (y, z) ↦ (y/z, z) on the overlap ℂ \\ {0}.',
  },
  rs52trivialBundle: {
    term: 'Trivial line bundle',
    symbol: '\\mathbb{C} \\times X',
    definition: 'The trivial line bundle is the Cartesian product ℂ × X with projection (v, p) ↦ p. A section is the same as a function f: U → ℂ. All line bundles are locally trivial (isomorphic to ℂ × U over small open sets U).',
    example: 'Every section of the trivial bundle over X = ℂ is just a complex-valued function.',
  },
  // ────────────── §3 Visualizing ──────────────
  rs52mobiusBundle: {
    term: 'Möbius-strip line bundle',
    definition: 'A nontrivial real line bundle over the circle whose total space is a Möbius strip. The complex analogue over ℂ_∞ is obtained by welding the z-chart to the t-chart via the transition function (y, z) ↦ (y/z, z), introducing a twist that prevents a nowhere-zero global section.',
    example: 'The tautological bundle 𝒪(−1) over ℙ¹ is the complex analogue of the Möbius strip.',
  },
  rs52nontrivialBundle: {
    term: 'Nontrivial line bundle',
    definition: 'A line bundle that is not isomorphic to the trivial bundle ℂ × X. Nontriviality is detected by the transition functions: if they cannot all be chosen to be the constant function 1, the bundle is nontrivial.',
    example: 'The tautological bundle over the Riemann sphere is nontrivial — it has no nowhere-zero global analytic section.',
  },
  // ────────────── §4 Morphisms ──────────────
  rs52lineBundleMorphism: {
    term: 'Line bundle morphism',
    definition: 'A map α: L₁ → L₂ between line bundles over the same base X such that π₂ ∘ α = π₁ (each fiber maps to the corresponding fiber), and in every pair of charts the map looks like (s, p) ↦ (f(p)·s, p) for some analytic function f.',
    example: 'On X = ℂ, the map α(y, x) = (x²·y, x) is a morphism from ℂ × ℂ to itself.',
  },
  rs52lineBundleIso: {
    term: 'Line bundle isomorphism',
    definition: 'Two line bundles L₁ and L₂ over X are isomorphic if there exist line bundle morphisms α: L₁ → L₂ and β: L₂ → L₁ that are mutual inverses. Equivalently, the analytic scaling factor f in each chart is everywhere nonzero.',
    example: 'Every line bundle is locally isomorphic to the trivial bundle; global isomorphism is a stronger condition.',
  },
};

export default entries;
