/**
 * Chapter glossary for Part 9 Chapter 3 — Holomorphic square roots and logarithms.
 *
 * This file default-exports all glossary entries specific to this chapter.
 * Merged at build time via import.meta.glob in src/lib/glossary.ts.
 */
import type { GlossaryEntry } from '../glossary';

const entries: Record<string, GlossaryEntry> = {
  // ─── §1 Motivation ────────────────────────────────────────────────
  holomorphic: {
    term: 'Holomorphic function',
    symbol: 'f \\colon U \\to \\CC',
    definition: 'A function f: U → ℂ that is complex differentiable at every point of its open domain U.',
    example: 'Polynomials, eᶻ, sin z, cos z are holomorphic. The conjugate z ↦ z̄ is not.',
  },
  branchCut: {
    term: 'Branch cut',
    definition: 'A curve (usually a ray from the branch point) removed from the domain to make a multivalued function single-valued and continuous. Crossing the branch cut causes a jump discontinuity.',
    example: 'The standard branch cut for √z is the negative real axis (−∞, 0]. With this cut, √z is holomorphic on ℂ \\ (−∞, 0].',
  },
  branchPoint: {
    term: 'Branch point',
    definition: 'A point around which a multivalued function cannot be made single-valued and continuous by any branch cut. Branch cuts must originate here. The origin is the branch point of √z.',
    example: 'The origin z = 0 is the branch point of √z and log z.',
  },

  contour: {
    term: 'Contour',
    symbol: '\\alpha \\colon [a,b] \\to \\CC',
    definition: 'A piecewise smooth path in ℂ: a continuous function from a real interval into ℂ that is differentiable except at finitely many bend points.',
    example: 'The unit circle traversed once counterclockwise is a contour.',
  },

  // ─── §2 Square roots of holomorphic functions ─────────────────────
  holomorphicNthRoot: {
    term: 'Holomorphic nth root',
    symbol: 'g \\colon U \\to \\CC',
    definition: 'A holomorphic function g: U → ℂ such that g(z)ⁿ = f(z) for all z ∈ U, where f: U → ℂ is a given holomorphic function. Exists if and only if f has no zeros and the winding of f around 0 is divisible by n for every loop in U.',
    example: 'f(z) = z² has a holomorphic square root g(z) = z on ℂ. The identity f(z) = z does not have a square root on all of ℂ \\ {0}.',
  },
  windingNumber: {
    term: 'Winding number',
    symbol: '\\tfrac{1}{2\\pi i} \\oint_\\gamma \\tfrac{f\'}{f}\\,dz',
    definition: 'For a closed curve γ in ℂ and a function f with no zeros on γ, the winding number of f∘γ around 0 counts how many times the image curve wraps around the origin. Given by the contour integral (1/2πi)∮_γ f\'/f dz.',
    example: 'If γ is a circle around the origin and f = id, then (1/2πi)∮_γ 1/z dz = 1: the image wraps once.',
  },

  // ─── §3 Covering projections ──────────────────────────────────────
  coveringProjection: {
    term: 'Covering projection',
    symbol: 'p \\colon E \\to B',
    definition: 'A continuous surjection p: E → B such that every point in B has an open neighbourhood U whose pre-image p⁻¹(U) is a disjoint union of open sets, each mapped homeomorphically onto U by p. The map z ↦ zⁿ on ℂ \\ {0} is a covering projection.',
    example: 'The squaring map (−)²: ℂ \\ {0} → ℂ \\ {0} is a degree-2 covering projection.',
  },
  liftingThm: {
    term: 'Lifting theorem',
    symbol: 'g \\colon V \\to E',
    definition: 'Given a covering projection p: E → B and a continuous map f: V → B, a lifting is a continuous map g: V → E with p∘g = f. By the lifting theorem, a lifting exists (up to choice of basepoint) if and only if f pushes the fundamental group of V into the image of π₁(E) under p.',
    example: 'The lifting of f: V → ℂ \\ {0} through the squaring map exists iff every loop in V maps to a curve that winds an even number of times around 0.',
  },
  fundamentalGroup: {
    term: 'Fundamental group',
    symbol: '\\pi_1(X)',
    definition: 'The group of homotopy classes of loops based at a fixed point in X. Describes which loops can be shrunk to a point. For the punctured plane ℂ \\ {0}, π₁ ≅ ℤ — the integer counts the winding number.',
    example: 'π₁(ℂ \\ {0}) ≅ ℤ; a generator is the loop that goes around the origin once counterclockwise.',
  },
  nthRootThm: {
    term: 'Existence of holomorphic nth roots (theorem)',
    definition: 'A holomorphic function f: U → ℂ has a holomorphic nth root if and only if (1/2πi)∮_γ f\'/f dz is a multiple of n for every closed contour γ in U. This is equivalent to the image of f avoiding 0 and winding n-divisibly around 0.',
  },

  // ─── §4 Complex logarithms ────────────────────────────────────────
  holomorphicLog: {
    term: 'Holomorphic logarithm',
    symbol: 'g \\colon U \\to \\CC',
    definition: 'A holomorphic function g: U → ℂ such that eᵍ⁽ᶻ⁾ = f(z) for all z ∈ U. Exists if and only if f has no zeros and has winding number 0 around 0 for every loop in U.',
    example: 'On ℂ \\ (−∞, 0], the principal logarithm Log z = ln|z| + i·Arg z is a holomorphic logarithm of the identity function.',
  },
  complexExp: {
    term: 'Complex exponential',
    symbol: 'e^z',
    definition: 'The function exp(z) = eᶻ, defined for all z ∈ ℂ by the power series ∑ zⁿ/n!. It satisfies exp(z + 2πi) = exp(z) — the source of the multi-valuedness of the logarithm.',
    example: 'e^{iπ} = −1 and e^{iπ/2} = i.',
  },
  universalCover: {
    term: 'Universal cover',
    symbol: '\\widetilde{X}',
    definition: 'The unique (up to isomorphism) simply connected covering space of a path-connected space X. Any other covering of X is a quotient of the universal cover. The exponential map exp: ℂ → ℂ \\ {0} is the universal cover of the punctured plane.',
    example: 'ℂ is the universal cover of ℂ \\ {0} via exp. The universal cover of S¹ is ℝ via t ↦ e^{2πit}.',
  },
  logExistenceThm: {
    term: 'Existence of holomorphic logarithms (theorem)',
    definition: 'A holomorphic function f: U → ℂ has a holomorphic logarithm if and only if (1/2πi)∮_γ f\'/f dz = 0 for every closed contour γ in U. Equivalently: f is zero-free and has winding number 0 around the origin for every loop in U.',
  },

  // ─── §5 Some special cases ────────────────────────────────────────
  nonvanishingCorollary: {
    term: 'Nonvanishing corollary',
    definition: 'If f: Ω → ℂ is continuous and nonvanishing on a simply connected domain Ω, then f has both a holomorphic logarithm and a holomorphic nth root for every n. This is the most commonly used special case of the existence theorems.',
    example: 'On any simply connected open U, if f(z) ≠ 0 for all z, then √f and log f both exist as holomorphic functions.',
  },
  principalBranch: {
    term: 'Principal branch',
    definition: 'The standard choice of branch for a multivalued function — analogous to picking the positive real square root. For the complex logarithm, the principal branch Log z satisfies Im(Log z) ∈ (−π, π] and is holomorphic on ℂ \\ (−∞, 0].',
    example: 'Log(−1 + 0i) = iπ. Log(1) = 0. Log(i) = iπ/2.',
  },
  branch: {
    term: 'Branch (of a multivalued function)',
    definition: 'A single-valued holomorphic function that is locally a selection from a multivalued expression. Different branches arise from different choices of branch cut. For log z there are infinitely many branches, differing by multiples of 2πi.',
    example: 'log z = Log z + 2πik for any integer k; each k gives a different branch of the logarithm.',
  },
};

export default entries;
