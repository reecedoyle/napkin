/**
 * Chapter glossary for Part 16 Chapter 3 — Covering projections.
 *
 * This file default-exports all glossary entries specific to this chapter.
 * Merged at build time via import.meta.glob in src/lib/glossary.ts.
 *
 * Every key is prefixed `cp65` to stay unique across the Part XVI chapters
 * being authored in parallel. Concepts already defined elsewhere in the
 * portal (fundamental group, covering projection, lifting theorem,
 * universal cover, path, homotopy, group action, ...) are reused by their
 * existing keys rather than redefined here.
 */
import type { GlossaryEntry } from '../glossary';

const entries: Record<string, GlossaryEntry> = {
  // ─── Recap: loops and null-homotopy (used throughout) ─────────────
  cp65Loop: {
    term: 'Loop',
    symbol: '\\gamma \\colon [0,1] \\to X,\\ \\gamma(0) = \\gamma(1) = b_0',
    definition: 'A path γ: [0,1] → X whose endpoints coincide, γ(0) = γ(1) = b₀. Loops based at b₀, up to homotopy, are exactly the elements of the fundamental group π₁(X, b₀).',
  },
  cp65NullHomotopic: {
    term: 'Null-homotopic',
    definition: 'A loop is null-homotopic if it is homotopic to the constant loop at its basepoint — it can be continuously shrunk to a point without leaving the space. Null-homotopic loops represent the identity element of the fundamental group.',
  },

  // ─── §1 Even coverings and covering projections ──────────────────
  cp65EvenlyCovered: {
    term: 'Evenly covered (open set)',
    symbol: 'p^{-1}(U)',
    definition: 'An open set U ⊆ B is evenly covered by p: E → B if its preimage p⁻¹(U) splits into a disjoint union of open "sheets" in E, each carried homeomorphically onto U by p. Think of U as a pancake and p⁻¹(U) as a stack of identical copies of that pancake.',
    example: 'For p: ℝ → S¹ by θ ↦ e^{2πiθ}, a small arc U around 1 ∈ S¹ is evenly covered: its preimage is a disjoint union of small open intervals around every integer.',
  },

  // ─── §2 Lifting theorem ───────────────────────────────────────────
  cp65Lifting: {
    term: 'Lifting (of a path or map)',
    symbol: '\\tilde\\gamma',
    definition: 'Given a covering projection p: E → B and a map γ into B, a lifting of γ is a map γ̃ into E with p ∘ γ̃ = γ — a copy of γ that lives upstairs in E and projects down to exactly γ.',
    example: 'For p: ℝ → S¹, the path γ(t) = e^{2πit} on S¹ has the lifting γ̃(t) = t on ℝ, since p(γ̃(t)) = e^{2πit} = γ(t).',
  },
  cp65LocallyPathConnected: {
    term: 'Locally path-connected',
    definition: 'A space Y is locally path-connected if every open neighborhood U of every point x contains a smaller path-connected open neighborhood V of x. This mild niceness condition is what the general lifting criterion needs — the Warsaw circle fails it and lifting can fail there.',
  },

  // ─── §3 Lifting correspondence ────────────────────────────────────
  cp65Fiber: {
    term: 'Fiber (of a covering projection)',
    symbol: 'p^{-1}(b)',
    definition: 'The fiber over a point b ∈ B is the preimage p⁻¹(b) ⊆ E — the set of all points of the covering space sitting directly above b. Evenly-covered neighborhoods show every fiber of a covering projection is a discrete set.',
    example: 'For p: ℝ → S¹, the fiber over 1 ∈ S¹ is the set of integers ℤ ⊆ ℝ.',
  },
  cp65LiftingCorrespondence: {
    term: 'Lifting correspondence',
    symbol: '\\Phi \\colon \\pi_1(B, b_0) \\to p^{-1}(b_0)',
    definition: 'The map sending a homotopy class [γ] of loops at b₀ to the endpoint γ̃(1) of the unique lifting of γ starting at e₀. It is surjective when E is path-connected, and injective when E is simply connected — so it becomes a bijection between π₁(B, b₀) and the fiber whenever E is a universal cover.',
  },

  // ─── §4 Regular coverings ──────────────────────────────────────────
  cp65QuotientByAction: {
    term: 'Quotient space of a group action',
    symbol: 'X/G',
    definition: 'Given a continuous group action of G on X with trivial stabilizers, the quotient space X/G is formed by fusing every orbit of the action into a single point. Its points are exactly the orbits of the action.',
    example: 'ℝ/ℤ (ℤ acting on ℝ by n·x = n + x) recovers the circle group 𝕋 — real numbers modulo 1.',
  },
  cp65RegularProjection: {
    term: 'Regular (covering) projection',
    symbol: 'X \\to X/G',
    definition: 'The natural projection sending each point of X to the orbit it belongs to, when a group G acts continuously on X with trivial stabilizers. Every such projection is a covering projection.',
    example: 'ℝ → ℝ/ℤ ≅ S¹ and ℝ² → ℝ²/ℤ² ≅ (torus) are both regular projections.',
  },
  cp65Torus: {
    term: 'Torus',
    symbol: 'S^1 \\times S^1',
    definition: 'The surface obtained as the quotient ℝ²/ℤ², where ℤ² acts on ℝ² by (m,n)·(x,y) = (m+x, n+y). Concretely: a unit square with opposite edges identified. Its universal cover is the plane ℝ².',
  },
  cp65RealProjectivePlane: {
    term: 'Real projective plane ℝP²',
    symbol: '\\mathbb{RP}^2',
    definition: 'The quotient of the sphere S² by the antipodal action of ℤ/2ℤ (x ↦ −x), which has trivial stabilizers since no point of S² equals its own antipode. Equivalently, the set of lines through the origin in ℝ³.',
    example: 'The covering projection S² → ℝP² has fiber of size 2 over every point, giving π₁(ℝP²) ≅ ℤ/2ℤ.',
  },

  // ─── §5 The algebra of fundamental groups ─────────────────────────
  cp65InducedHomomorphism: {
    term: 'Induced homomorphism on π₁',
    symbol: 'f_\\sharp \\colon \\pi_1(X, x_0) \\to \\pi_1(Y, y_0)',
    definition: 'For a continuous f: (X, x₀) → (Y, y₀), the induced map f♯ sends a homotopy class [γ] to [f ∘ γ]. It is a group homomorphism, and when p is a covering projection p♯ is always injective.',
  },
  cp65MapOfCoveringProjections: {
    term: 'Map of covering projections',
    symbol: 'f \\colon E_1 \\to E_2 \\text{ with } p_2 \\circ f = p_1',
    definition: 'Given two covering projections p₁: E₁ → B and p₂: E₂ → B, a map between them is a continuous f: E₁ → E₂ satisfying p₂ ∘ f = p₁. Two covering projections are isomorphic if such maps exist in both directions and compose to identities.',
  },
  cp65LocallyConnected: {
    term: 'Locally connected',
    definition: 'A space X is locally connected if every point x and every open neighborhood V of x contains a connected open set U with x ∈ U ⊆ V. A mild condition satisfied by essentially every space one meets in practice.',
  },
  cp65SemiLocallySimplyConnected: {
    term: 'Semi-locally simply connected',
    definition: 'A space X is semi-locally simply connected if every point has an open neighborhood U such that every loop in U is null-homotopic in X (the contraction is allowed to leave U). Together with locally connected, this is exactly the hypothesis needed for the classification theorem for covering projections.',
  },
};

export default entries;
