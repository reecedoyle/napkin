/**
 * Chapter glossary for Part 18, Chapter 75 — Application of cohomology.
 *
 * All keys are prefixed `aoc75` to stay unique across sibling chapters of
 * this part authored in parallel (they cannot see each other's files).
 * Concepts already covered by earlier parts (smooth/orientable manifolds,
 * wedge product, differential forms, de Rham cohomology, tensor product,
 * Hom space, compactness) are referenced via their existing portal keys
 * instead of being redefined here.
 */
import type { GlossaryEntry } from '../glossary';

const entries: Record<string, GlossaryEntry> = {
  // ────────────── §1 Poincaré duality ──────────────
  aoc75PoincareDuality: {
    term: 'Poincaré duality',
    symbol: 'H^k(M;\\ZZ) \\cong H_{n-k}(M)',
    definition: 'For a smooth, oriented, compact n-manifold M, the theorem that cohomology in degree k is naturally isomorphic to homology in the complementary degree n − k, for every k. In particular H^k(M) = 0 once k exceeds n.',
    example: 'For the torus T (n = 2): H⁰(T) ≅ H₂(T) ≅ ℤ and H¹(T) ≅ H₁(T) ≅ ℤ², matching Poincaré duality.',
  },
  aoc75BettiNumber: {
    term: 'Betti number',
    symbol: 'b_k',
    definition: 'The rank of the abelian group H_k(X) — the number of independent k-dimensional "holes", ignoring any torsion subgroup. For a smooth oriented compact n-manifold, Poincaré duality forces b_k = b_{n-k}.',
    example: "The torus has Betti numbers b₀ = 1, b₁ = 2, b₂ = 1.",
  },

  // ────────────── §3 Graded rings ──────────────
  aoc75GradedPseudoRing: {
    term: 'Graded pseudo-ring',
    symbol: 'R = \\bigoplus_{d \\ge 0} R^d',
    definition: 'An abelian group R = ⊕_{d≥0} R^d, together with an associative product under which r ∈ R^d and s ∈ R^e multiply to give rs ∈ R^{d+e}. No identity or commutativity is assumed — "pseudo" flags the missing 1.',
    example: 'The differential forms Ω^•(M) = ⊕_d Ω^d(M) under the wedge product form a graded pseudo-ring (in fact a full graded ring, since 1 ∈ Ω⁰(M) exists).',
  },
  aoc75HomogeneousDegree: {
    term: 'Homogeneous element / degree',
    symbol: '|r| = d',
    definition: 'An element r of a graded (pseudo-)ring R = ⊕ R^d is homogeneous if it lies in a single graded piece R^d; its degree is then written |r| = d.',
    example: 'In ℤ[x,y,z], the monomial x²y is homogeneous of degree 3, but x + y² is not homogeneous (its pieces have degrees 1 and 2).',
  },
  aoc75GradedRing: {
    term: 'Graded ring',
    definition: 'A graded pseudo-ring that has a multiplicative identity 1. If the multiplication is also commutative, it is called a commutative graded ring.',
    example: 'ℤ[x] is a commutative graded ring, graded by degree.',
  },
  aoc75Anticommutative: {
    term: 'Anticommutative (graded ring)',
    symbol: 'rs = (-1)^{|r||s|}sr',
    definition: 'A graded (pseudo-)ring R is anticommutative if for all homogeneous r, s ∈ R, rs = (−1)^{|r||s|}sr. This is not the opposite of commutative — a ring can satisfy both, one, or neither, depending on which degrees carry nonzero elements.',
    example: 'The exterior algebra ⋀^•(V) is anticommutative but not commutative (for a, b of degree 1, ab = −ba ≠ ab unless ab = 0).',
  },

  // ────────────── §4 Cup products ──────────────
  aoc75CupProduct: {
    term: 'Cup product ⌣',
    symbol: '\\phi \\smile \\psi',
    definition: 'For cochains φ ∈ Cᵏ(X;R) and ψ ∈ Cˡ(X;R), the cup product φ⌣ψ ∈ C^{k+ℓ}(X;R) evaluates on a (k+ℓ)-simplex by multiplying φ on the front k+1 vertices by ψ on the back ℓ+1 vertices, inside R. It descends to a product on cohomology classes, making H^•(X;R) into a graded ring.',
    example: 'On the torus, the cup product of the 1-cocycles "dx" and "dy" gives (up to sign) the generator of H²(torus).',
  },
  aoc75CohomologyRing: {
    term: 'Singular cohomology ring',
    symbol: 'H^\\bullet(X;R) = \\bigoplus_{k\\ge0} H^k(X;R)',
    definition: 'The graded ring formed by piecing together all the cohomology groups H^k(X;R) of a space X, with multiplication given by the cup product ⌣. It is always anticommutative, and carries strictly more information than the cohomology groups taken separately.',
    example: 'H^•(S²∨S⁴;ℤ) and H^•(ℂP²;ℤ) have isomorphic graded pieces in every degree, but different ring structures — distinguishing the two spaces.',
  },

  // ────────────── §5 Relative cohomology pseudo-rings ──────────────
  aoc75RelativeCohomologyPseudoRing: {
    term: 'Relative cohomology pseudo-ring',
    symbol: 'H^\\bullet(X,A;R)',
    definition: 'For a pair A ⊆ X, the graded abelian group ⊕_k H^k(X,A;R) equipped with the relative cup product. It is an anticommutative pseudo-ring: it need not have a multiplicative identity.',
  },
  aoc75ReducedCohomologyPseudoRing: {
    term: 'Reduced cohomology pseudo-ring',
    symbol: '\\wt H^\\bullet(X;R)',
    definition: 'The relative cohomology pseudo-ring of the pair (X, {∗}) for a basepoint ∗ ∈ X, i.e. ⊕_k H̃^k(X;R) with the cup product. Since H̃⁰(X;R) is often 0, this pseudo-ring frequently has no multiplicative identity at all.',
    example: 'H̃^•(Sⁿ;ℤ) ≅ αℤ concentrated in degree n — no degree-0 piece, hence no identity element.',
  },

  // ────────────── §6 Wedge sums ──────────────
  aoc75WedgeSum: {
    term: 'Wedge sum X ∨ Y',
    symbol: 'X \\vee Y',
    definition: 'The space formed by gluing two based spaces X and Y together at a single shared basepoint. Reduced (co)homology of a wedge sum splits as a direct sum/product of the reduced (co)homology of the pieces.',
    example: 'S¹ ∨ S¹ (a figure eight) is the wedge sum of two circles.',
  },
  aoc75ProductPseudoRing: {
    term: 'Product pseudo-ring R × S',
    symbol: 'R \\times S',
    definition: 'For graded pseudo-rings R and S, the graded pseudo-ring on the direct sum R ⊕ S = ⊕_d(R^d ⊕ S^d), with multiplication inherited separately from R and S, and every cross term r·s (r ∈ R, s ∈ S) declared 0.',
    example: 'H̃^•(X∨Y;R) ≅ H̃^•(X;R) × H̃^•(Y;R): the reduced cohomology ring of a wedge sum is the product pseudo-ring of the two pieces.',
  },

  // ────────────── §7 Cross product ──────────────
  aoc75CrossProductChain: {
    term: 'Cross product ×',
    symbol: 'a \\times b',
    definition: 'For an m-simplex (or m-cell) f in X and n-simplex (or n-cell) g in Y, the cross product f×g is the natural (m+n)-chain it determines in X×Y. As a map out of the plain product C_m(X)×C_n(Y) it fails to be linear, but it is bilinear, so it descends to a genuine ℤ-module homomorphism C_m(X)⊗_ℤC_n(Y) → C_{m+n}(X×Y), and likewise induces maps on homology and cohomology.',
    example: 'For X = Y = S¹ with generators α, β of H₁, the cross product α×β generates H₂(torus) ≅ ℤ.',
  },

  // ────────────── §8 Künneth formula ──────────────
  aoc75TensorProductGradedRing: {
    term: 'Tensor product of graded rings',
    symbol: 'A \\otimes_R B',
    definition: 'For graded rings A, B that are also R-modules, the graded ring A⊗_R B whose degree-d piece is ⊕_{k=0}^d A^k⊗_R B^{d-k}, with multiplication (a₁⊗b₁)(a₂⊗b₂) = (a₁a₂)⊗(b₁b₂) and identity 1_A⊗1_B.',
    example: 'H^•(S²×S⁴;ℤ) ≅ ℤ[β]/(β²) ⊗ ℤ[γ]/(γ²), generated by 1⊗1, β⊗1, 1⊗γ, β⊗γ in degrees 0, 2, 4, 6.',
  },
  aoc75KunnethFormula: {
    term: 'Künneth formula',
    definition: 'A formula expressing the cohomology ring of a product space X×Y in terms of the cohomology rings of X and Y. In the case treated here (X, Y CW complexes with H^k(Y;R) finitely generated free for every k), the cross product gives an isomorphism of anticommutative rings H^•(X;R)⊗_R H^•(Y;R) ≅ H^•(X×Y;R).',
    example: 'Applying Künneth distinguishes ℂP³ from S²×S⁴: their cohomology groups agree in every degree, but the ring structures do not.',
  },
};

export default entries;
