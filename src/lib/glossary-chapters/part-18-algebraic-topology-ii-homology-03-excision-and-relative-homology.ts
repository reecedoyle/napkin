/**
 * Glossary entries for Part XVIII, Chapter 72 — Excision and relative
 * homology (part-18-algebraic-topology-ii-homology/03-excision-and-relative-homology).
 *
 * Every key is prefixed `ear72` so it stays unique against sibling
 * chapters authored in parallel in their own worktrees (01-singular-homology,
 * 02-... etc.), which this file cannot see.
 */
import type { GlossaryEntry } from '../glossary';

const entries: Record<string, GlossaryEntry> = {
  // ────────────── §1 Motivation ──────────────
  ear72RelativeHomology: {
    term: 'Relative homology',
    symbol: 'H_n(X,A)',
    definition: 'For a subspace A ⊆ X, the relative homology group Hₙ(X,A) is the homology of the quotient chain complex Cₙ(X)/Cₙ(A) — chains in X, where anything supported entirely inside A is set to zero. It measures the n-dimensional holes of X that are not already accounted for by A.',
  },
  ear72ReducedHomology: {
    term: 'Reduced homology',
    symbol: '\\wt H_n(X)',
    definition: 'A variant of homology, written H̃ₙ(X), that agrees with the ordinary Hₙ(X) for n ≥ 1 but makes H̃₀(X) one dimension smaller — it is 0 for a single point, rather than ℤ. Bookkeeping convenience: it makes formulas for contractible spaces and wedge sums uniform in every degree.',
  },
  ear72QuotientSpace: {
    term: 'Quotient space',
    symbol: 'X/A',
    definition: 'Given A ⊆ X, the space X/A is X with every point of A identified to a single point. The quotient map q : X → X/A collapses A to one point and is the identity elsewhere.',
    example: '[0,1]/{0,1} (collapsing both endpoints of an interval to one point) is homeomorphic to the circle S¹.',
  },
  ear72ClosedDisk: {
    term: 'Closed disk',
    symbol: 'D^n',
    definition: 'The set of points in ℝⁿ at distance ≤ 1 from the origin — a closed ball. Its boundary is the sphere Sⁿ⁻¹.',
  },

  // ────────────── §2 The long exact sequences ──────────────
  ear72LongExactSequence: {
    term: 'Long exact sequence',
    definition: 'A (possibly infinite) chain of groups and homomorphisms in which the image of each map equals the kernel of the next. Exactness is a strong constraint: it lets you deduce a group is trivial, or an isomorphism, purely from its neighbors being trivial.',
  },
  ear72LongExactSequenceOfPair: {
    term: 'Long exact sequence of a pair',
    definition: 'For A ⊆ X, the long exact sequence …→ Hₙ(A) → Hₙ(X) → Hₙ(X,A) → Hₙ₋₁(A) →… relates the homology of A, of X, and of the pair (X,A). It comes from the short exact sequence of chain complexes 0 → Cₙ(A) → Cₙ(X) → Cₙ(X,A) → 0.',
  },
  ear72LongExactSequenceOfTriple: {
    term: 'Long exact sequence of a triple',
    definition: 'For A ⊆ B ⊆ X, the long exact sequence …→ Hₙ(B,A) → Hₙ(X,A) → Hₙ(X,B) → Hₙ₋₁(B,A) →… generalizes the long exact sequence of a pair (which is the case B = X, or A = ∅).',
  },

  // ────────────── §3 The category of pairs ──────────────
  ear72PairOfSpaces: {
    term: 'Pair of spaces',
    symbol: '(X,A)',
    definition: 'A topological space X together with a chosen subspace A ⊆ X. The basic object relative homology is defined on, generalizing a single space X (which is the pair (X, ∅)).',
  },
  ear72MapOfPairs: {
    term: 'Map of pairs',
    symbol: 'f \\colon (X,A) \\to (Y,B)',
    definition: 'A continuous map f : X → Y such that f(A) ⊆ B, i.e. f sends the distinguished subspace of the first pair into the distinguished subspace of the second. Notated f : (X,A) → (Y,B).',
  },
  ear72PairHomotopy: {
    term: 'Pair-homotopy',
    definition: 'A homotopy F between maps of pairs f, g : (X,A) → (Y,B) such that every intermediate map Fₜ is itself a map of pairs (sends A into B at every instant t). This is strictly stronger than an ordinary homotopy between the underlying maps X → Y.',
  },
  ear72PairHomotopyEquivalence: {
    term: 'Pair-homotopy equivalence',
    definition: 'An isomorphism in the category of pairs up to pair-homotopy: a map of pairs f : (X,A) → (Y,B) with a homotopy-inverse map of pairs g, so that g∘f and f∘g are each pair-homotopic to the respective identity. Generalizes ordinary homotopy equivalence of spaces (the case A = B = ∅).',
  },
  ear72Category: {
    term: 'Category',
    definition: 'A collection of objects together with morphisms (arrows) between them that compose associatively and have identities. Topological spaces with continuous maps, or pairs of spaces with maps of pairs, are the two examples in view here.',
  },
  ear72Functor: {
    term: 'Functor',
    definition: 'A structure-preserving map between categories: it sends objects to objects and morphisms to morphisms, preserving identities and composition. Hₙ is a functor from (pairs of) spaces to groups: it turns a map of pairs into a group homomorphism between relative homology groups.',
  },
  ear72DeformationRetract: {
    term: 'Deformation retract',
    definition: 'A subspace A ⊆ X is a deformation retract of X if there is a map of pairs r : (X,A) → (A,A) that is a pair-homotopy equivalence — informally, X can be continuously squashed onto A without ever moving points already in A. Consequently Hₙ(X,A) ≅ Hₙ(A,A) = 0 for every n.',
    example: 'The punctured plane ℝ² \\ {0} deformation retracts onto the unit circle S¹ by pushing each point radially outward or inward to the circle.',
  },
  ear72Contractible: {
    term: 'Contractible space',
    definition: 'A space X that is homotopy equivalent to a single point — equivalently, a single point of X is a deformation retract of X. Contractible spaces have trivial reduced homology in every degree: H̃ₙ(X) = 0 for all n.',
    example: 'Every convex subset of ℝⁿ is contractible, including the closed disk Dⁿ.',
  },

  // ────────────── §4 Excision ──────────────
  ear72Excision: {
    term: 'Excision',
    definition: 'The theorem that if Z ⊆ A ⊆ X with the closure of Z contained in the interior of A, then deleting Z from both X and A does not change relative homology: Hₙ(X∖Z, A∖Z) ≅ Hₙ(X,A). Intuitively, since relative homology already "mods out" A, tinkering with the interior of A is invisible to it.',
  },
  ear72Interior: {
    term: 'Interior',
    symbol: '\\operatorname{int}(A)',
    definition: 'The interior of a subset A of a topological space X is the largest open subset of X contained in A — equivalently, the set of points of A that have an open neighborhood entirely inside A.',
  },

  // ────────────── §5 Some applications ──────────────
  ear72WedgeSum: {
    term: 'Wedge sum',
    symbol: 'X \\vee Y',
    definition: 'Given spaces X and Y with chosen basepoints x₀, y₀, the wedge sum X ∨ Y is the disjoint union X ⊔ Y with x₀ and y₀ glued together to a single point. It is the "figure-eight"-style join of two pointed spaces.',
    example: 'The wedge of two circles S¹ ∨ S¹ is a figure eight.',
  },

  // ────────────── §6 Invariance of dimension ──────────────
  ear72LocalHomologyGroup: {
    term: 'Local homology group',
    symbol: 'H_k(X, X \\setminus \\{p\\})',
    definition: 'For a point p in a space X, the k-th local homology group of p is Hₖ(X, X∖{p}). By excision it only depends on an arbitrarily small neighborhood of p, so it detects the local shape of X near p — for instance, distinguishing a manifold point from a boundary point.',
  },
  ear72InvarianceOfDimension: {
    term: 'Invariance of dimension',
    definition: 'The theorem (Brouwer, 1910) that a nonempty open subset of ℝⁿ can be homeomorphic to a nonempty open subset of ℝᵐ only if n = m. So "dimension" is a genuine topological invariant, not an artifact of linear algebra.',
  },
};

export default entries;
