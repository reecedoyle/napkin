/**
 * Glossary entries for Chapter 54 — The ring of integers.
 * Keys are prefixed with `an54` for portal-wide uniqueness.
 *
 * This file is merged into src/lib/glossary.ts by the parent agent
 * at finalize time. Do not import it directly in portal code.
 */

import type { GlossaryEntry } from '../glossary';

export const an54Glossary: Record<string, GlossaryEntry> = {
  // ────────────── Chapter 54 — The ring of integers ──────────────

  an54algebraicNumber: {
    term: 'Algebraic number',
    definition:
      'A complex number that satisfies a nonzero polynomial equation with rational coefficients. Every rational number is algebraic; so are √2, i, and the golden ratio. Numbers like π and e are not algebraic — they are transcendental.',
    example: '√2 satisfies x² − 2 = 0. The golden ratio φ satisfies x² − x − 1 = 0.',
  },

  an54algebraicInteger: {
    term: 'Algebraic integer',
    definition:
      'An algebraic number that satisfies a MONIC polynomial equation with integer coefficients. Having a denominator does not prevent this: (1+√5)/2 is an algebraic integer because it satisfies x² − x − 1 = 0.',
    example:
      '√2 (satisfies x²−2=0) and (1+√5)/2 (satisfies x²−x−1=0) are algebraic integers. The rational number 1/2 is not — its minimal polynomial x−1/2 is not monic over ℤ.',
  },

  an54minimalPolynomial: {
    term: 'Minimal polynomial',
    symbol: '\\mathrm{min}_{\\QQ}(\\alpha)',
    definition:
      'The unique monic polynomial of smallest degree in ℚ[x] having α as a root. It is irreducible over ℚ. Its degree is called the degree of α.',
    example:
      'The minimal polynomial of √2 is x²−2. The minimal polynomial of ω = e^{2πi/3} is x²+x+1.',
  },

  an54galoisConjugate: {
    term: 'Galois conjugate',
    definition:
      'The Galois conjugates of an algebraic number α are all the roots of its minimal polynomial over ℚ. An element of degree m has exactly m distinct conjugates. For √2 the conjugates are √2 and −√2; for i they are i and −i.',
    example: 'The conjugates of ∛2 are ∛2, ∛2·ω, and ∛2·ω² where ω = e^{2πi/3}.',
  },

  an54numberField: {
    term: 'Number field',
    symbol: 'K',
    definition:
      'A finite-degree field extension of ℚ. Equivalently, a field K with ℚ ⊆ K ⊆ ℂ and [K:ℚ] < ∞. The degree [K:ℚ] is the dimension of K as a ℚ-vector space. Every number field has the form ℚ(α) for some algebraic number α.',
    example: 'ℚ(√2) has degree 2. ℚ(∛2) has degree 3. ℚ(ζₚ) for a prime p has degree p−1.',
  },

  an54normKQ: {
    term: 'Norm N_{K/ℚ}',
    symbol: '\\operatorname{N}_{K/\\QQ}(\\alpha)',
    definition:
      'For α in a number field K of degree d, the norm is the determinant of the multiplication-by-α map on K (viewed as a ℚ-vector space). It equals the product of all embeddings K ↪ ℂ applied to α. Always a rational number; an integer when α is an algebraic integer. Multiplicative: N(αβ) = N(α)N(β).',
    example:
      'In ℚ(√2): N(a + b√2) = a² − 2b². In particular N(1+√2) = 1−2 = −1 and N(3+√2) = 9−2 = 7.',
  },

  an54traceKQ: {
    term: 'Trace Tr_{K/ℚ}',
    symbol: '\\operatorname{Tr}_{K/\\QQ}(\\alpha)',
    definition:
      'For α in a number field K of degree d, the trace is the trace of the multiplication-by-α map on K (as a ℚ-vector space). It equals the sum of all embeddings K ↪ ℂ applied to α. Always a rational number; an integer when α is an algebraic integer. Additive: Tr(α+β) = Tr(α)+Tr(β).',
    example:
      'In ℚ(√2): Tr(a + b√2) = 2a. In ℚ(∛2): Tr(a + b∛2 + c∛4) = 3a.',
  },

  an54ringOfIntegers: {
    term: 'Ring of integers 𝒪_K',
    symbol: '\\mathcal{O}_K',
    definition:
      'For a number field K, the ring of integers 𝒪_K = K ∩ Z̄ is the subring of K consisting of all algebraic integers in K. It is a free ℤ-module of rank [K:ℚ], and plays the same role in K that ℤ plays in ℚ.',
    example:
      '𝒪_ℚ(√2) = ℤ[√2]. 𝒪_ℚ(√5) = ℤ[(1+√5)/2]. 𝒪_ℚ(i) = ℤ[i] (Gaussian integers). 𝒪_ℚ(ζₚ) = ℤ[ζₚ] for prime p.',
  },

  an54monogenic: {
    term: 'Monogenic extension',
    definition:
      'A number field K with 𝒪_K = ℤ[θ] for some single element θ ∈ 𝒪_K. In a monogenic extension, the set {1, θ, θ², …, θ^{n−1}} serves simultaneously as a ℚ-basis for K and as a ℤ-basis for 𝒪_K. Most "nice" examples (quadratic fields, cyclotomic fields) are monogenic, but monogenicity fails in general.',
    example:
      'ℚ(√2) is monogenic: 𝒪_K = ℤ[√2]. ℚ(α) where α is a root of x³−x²−2x−8 is NOT monogenic — no single θ generates 𝒪_K as a ℤ-algebra.',
  },

  an54powerBasis: {
    term: 'Power basis',
    definition:
      'A ℤ-basis for the ring of integers 𝒪_K of the form {1, θ, θ², …, θ^{n−1}} for a single element θ. A number field has a power basis exactly when it is monogenic. Power bases are computationally convenient but do not always exist.',
    example:
      'ℤ[√2] has power basis {1, √2}. ℤ[ζₚ] has power basis {1, ζₚ, …, ζₚ^{p−2}}.',
  },
};
