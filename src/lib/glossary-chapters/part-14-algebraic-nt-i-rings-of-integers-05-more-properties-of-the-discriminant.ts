/**
 * Chapter glossary for Part 14 Chapter 5 — More properties of the discriminant.
 *
 * Keys are prefixed with "an57" to guarantee portal-wide uniqueness.
 */
import type { GlossaryEntry } from '../glossary';

const entries: Record<string, GlossaryEntry> = {
  // ────────────── §1 The discriminant definition ──────────────
  an57discriminant: {
    term: 'Discriminant Δ_K',
    symbol: '\\Delta_K',
    definition: 'For a number field K of degree n with ℤ-basis α₁, …, αₙ and embeddings σ₁, …, σₙ into ℂ, the discriminant is the square of the determinant of the embedding matrix [σᵢ(αⱼ)]. It is an integer independent of the choice of basis.',
    example: 'For K = ℚ: Δ_ℚ = 1. For K = ℚ(√d) (squarefree d): Δ_K = d if d ≡ 1 mod 4, and 4d otherwise.',
  },
  an57embeddingMatrix: {
    term: 'Embedding matrix',
    symbol: '[\\sigma_i(\\alpha_j)]',
    definition: 'The n×n matrix whose (i,j) entry is σᵢ(αⱼ), where σ₁, …, σₙ are the embeddings of K into ℂ and α₁, …, αₙ is a ℤ-basis for 𝒪_K. Its determinant squared is the discriminant Δ_K.',
    example: 'For K = ℚ(√2) with basis {1, √2} and embeddings σ₁(a+b√2) = a+b√2, σ₂(a+b√2) = a−b√2, the embedding matrix is [[1,√2],[1,−√2]] with determinant −2√2, so Δ_K = (−2√2)² = 8.',
  },
  an57traceForm: {
    term: 'Trace form',
    symbol: '\\operatorname{Tr}_{K/\\mathbb{Q}}(\\alpha_i \\alpha_j)',
    definition: 'The bilinear form (x,y) ↦ Tr_{K/ℚ}(xy) on K, where Tr_{K/ℚ}(x) = σ₁(x) + ··· + σₙ(x) is the sum over all embeddings. The Gram matrix of the trace form on a ℤ-basis of 𝒪_K equals Mᵀ·M for the embedding matrix M, and its determinant is Δ_K.',
    example: 'For K = ℚ(√2) with basis {1, √2}: Tr(1·1) = 2, Tr(1·√2) = 0, Tr(√2·√2) = Tr(2) = 4. The Gram matrix is [[2,0],[0,4]], with det = 8 = Δ_K.',
  },
  an57fieldTrace: {
    term: 'Field trace Tr_{K/ℚ}',
    symbol: '\\operatorname{Tr}_{K/\\mathbb{Q}}',
    definition: 'For a degree-n number field K with embeddings σ₁, …, σₙ into ℂ, the trace of α ∈ K is Tr_{K/ℚ}(α) = σ₁(α) + ··· + σₙ(α). It is always a rational number, and an integer when α ∈ 𝒪_K.',
    example: 'In K = ℚ(√2): Tr_{K/ℚ}(a + b√2) = (a+b√2) + (a−b√2) = 2a. In K = ℚ(∛2): Tr_{K/ℚ}(∛2) = ∛2 + ω∛2 + ω²∛2 = 0, where ω = e^(2πi/3).',
  },
  an57polynomialDiscriminant: {
    term: 'Polynomial discriminant Δ(f)',
    symbol: '\\Delta(f)',
    definition: 'For a polynomial f of degree n with leading coefficient c and roots z₁, …, zₙ, the polynomial discriminant is Δ(f) = c^(2n−2) · ∏_{i<j} (zᵢ − zⱼ)². It is zero iff f has a repeated root. For a monic f this equals ∏_{i<j} (zᵢ − zⱼ)².',
    example: 'For f = x² − d: Δ(f) = (√d − (−√d))² = 4d. For f = x³ + px + q: Δ(f) = −4p³ − 27q².',
  },
  an57monogenicField: {
    term: 'Monogenic number field',
    symbol: '\\mathcal{O}_K = \\ZZ[\\theta]',
    definition: 'A number field K such that 𝒪_K = ℤ[θ] for a single algebraic integer θ. Equivalently, {1, θ, θ², …, θ^{n−1}} is a ℤ-basis of 𝒪_K. When this holds, the discriminant Δ_K equals the polynomial discriminant Δ(f) where f is the minimal polynomial of θ.',
    example: 'ℚ(∛2) is monogenic: 𝒪_K = ℤ[∛2]. ℚ(√5) is monogenic: 𝒪_K = ℤ[(1+√5)/2] (the golden ratio basis). Not every number field is monogenic.',
  },
  an57signature: {
    term: 'Signature of a number field',
    symbol: '(r_1, r_2)',
    definition: 'For a degree-n number field K, the signature (r₁, r₂) records how many embeddings K ↪ ℂ are real (r₁) and how many are complex (2r₂ embeddings come in conjugate pairs). We have r₁ + 2r₂ = n.',
    example: 'ℚ has signature (1,0). ℚ(√2) has signature (2,0) (two real embeddings). ℚ(√-1) has signature (0,1) (no real embeddings, one conjugate pair). ℚ(∛2) has signature (1,1) (one real embedding, one conjugate pair).',
  },
  an57cyclotomicField: {
    term: 'Cyclotomic field ℚ(ζ_p)',
    symbol: '\\QQ(\\zeta_p)',
    definition: 'The number field obtained by adjoining a primitive p-th root of unity ζ_p = e^(2πi/p) to ℚ, where p is prime. It has degree p−1 over ℚ and ring of integers ℤ[ζ_p]. The discriminant is (−1)^((p−1)/2) · p^(p−2).',
    example: 'ℚ(ζ₃) = ℚ(ω) where ω = e^(2πi/3) = (−1+√−3)/2. Its discriminant is (−1)^1 · 3^1 = −3, which matches the discriminant of ℚ(√−3).',
  },
  an57vandermonde: {
    term: 'Vandermonde matrix',
    symbol: 'V = [z_i^{j-1}]',
    definition: 'The n×n matrix V with (i,j) entry zᵢ^{j−1}: the first column is all 1s, then z₁,…,zₙ, then their squares, etc. Its determinant is ∏_{i>j}(zᵢ − zⱼ) — the product of all pairwise differences. Vandermonde determinants appear in the discriminant when 𝒪_K = ℤ[θ].',
    example: 'For z₁ = 1, z₂ = 2, z₃ = 4: det[[1,1,1],[1,2,4],[1,4,16]] = (2−1)(4−1)(4−2) = 1·3·2 = 6.',
  },
  an57brillTheorem: {
    term: "Brill's theorem",
    definition: 'For a number field K with signature (r₁, r₂), the discriminant satisfies Δ_K > 0 if and only if r₂ is even. The sign of Δ_K is (−1)^{r₂}. This follows from the structure of the embedding matrix and the sign of its determinant.',
    example: 'ℚ(√2) has signature (2,0), so r₂ = 0 (even) and Δ_K = 8 > 0. ℚ(√−2) has signature (0,1), so r₂ = 1 (odd) and Δ_K = −8 < 0.',
  },
  an57stickelberger: {
    term: "Stickelberger's theorem",
    definition: 'For any number field K, the discriminant Δ_K is congruent to 0 or 1 modulo 4. More precisely: if K has signature (r₁, r₂) and n = r₁ + 2r₂ embeddings, then Δ_K ≡ 0 or 1 (mod 4). This rules out discriminants like 2, 5, 6, etc.',
    example: 'Δ_{ℚ(√d)} is either d (when d ≡ 1 mod 4) or 4d (when d ≡ 2,3 mod 4). In both cases Δ ≡ 0 or 1 mod 4 is satisfied.',
  },
  an57minkBound: {
    term: 'Minkowski bound M_K',
    symbol: 'M_K',
    definition: 'An explicit upper bound on the norm of primes in the class group of a number field K: every ideal class contains an ideal of norm at most M_K. Used to show |Δ_K| > 1 for K ≠ ℚ, since M_K ≥ 1 forces a non-trivial discriminant.',
    example: 'For K = ℚ(√d), M_K = (2/π)√|Δ_K| for imaginary quadratic fields. For ℚ(√−5): M_K ≈ 2.85, so we only need to check ideals of norm 1 or 2.',
  },
};

export default entries;
