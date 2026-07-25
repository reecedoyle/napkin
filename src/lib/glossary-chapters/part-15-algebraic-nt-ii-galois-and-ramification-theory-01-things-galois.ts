/**
 * Chapter glossary for Part 15, Chapter 1 — Things Galois (Ch. 58).
 *
 * All keys are prefixed with `gal58` to guarantee portal-wide uniqueness.
 * Where a concept already has a portal-wide key from an earlier chapter
 * (e.g. minimal polynomial, number field, algebraically closed field) we
 * reuse that key directly via <Term k="..."> rather than redefining it.
 */
import type { GlossaryEntry } from '../glossary';

const entries: Record<string, GlossaryEntry> = {
  // ────────────── §1 Motivation ──────────────
  gal58Embedding: {
    term: 'Embedding',
    symbol: '\\sigma \\colon K \\hookrightarrow \\CC',
    definition: 'An injective field homomorphism from a number field K into ℂ: a map preserving + and ×, sending 1 to 1. Injectivity is automatic — the kernel of a field homomorphism is an ideal, and a field has only the zero ideal and the whole field as ideals.',
    example: 'ℚ(i) has two embeddings into ℂ: the identity z ↦ z, and complex conjugation z ↦ z̄.',
  },

  // ────────────── §2 Field extensions, algebraic closure ──────────────
  gal58FieldExtension: {
    term: 'Field extension',
    symbol: 'K/F',
    definition: 'For fields F ⊆ K, we say K is a field extension of F, written K/F. Since F ⊆ K and both share addition and multiplication, K is automatically an F-vector space.',
    example: 'ℚ(√2)/ℚ is a field extension: ℚ(√2) contains ℚ and is a 2-dimensional ℚ-vector space with basis {1, √2}.',
  },
  gal58ExtensionDegree: {
    term: 'Degree of a field extension',
    symbol: '[K:F]',
    definition: 'The dimension of K as an F-vector space, for a field extension K/F. If this is finite, K/F is called a finite extension. Degrees are multiplicative in towers: [L:K][K:F] = [L:F].',
    example: '[ℚ(√2):ℚ] = 2 since {1, √2} is a ℚ-basis. [ℚ(∛2,ω):ℚ(∛2)] = 2, and [ℚ(∛2):ℚ] = 3, so [ℚ(∛2,ω):ℚ] = 6.',
  },
  gal58AlgClosure: {
    term: 'Algebraic closure',
    symbol: '\\overline{F}',
    definition: 'For any field F, an algebraically closed field extension F̄ that is minimal by inclusion: every other algebraically closed extension of F contains a copy of F̄. Every element of F̄ is a root of some polynomial with coefficients in F.',
    example: 'ℂ is the algebraic closure of ℝ (and of itself). The algebraic closure of ℚ is ℚ̄, the field of algebraic numbers — a proper subfield of ℂ, since π and e are not algebraic.',
  },

  // ────────────── §4 Characteristic and separability ──────────────
  gal58Characteristic: {
    term: 'Characteristic of a field',
    symbol: '\\operatorname{char}(F)',
    definition: 'The smallest positive integer p such that 1+1+⋯+1 (p times) equals 0 in F, or 0 if no such p exists. When nonzero, the characteristic is always prime.',
    example: 'ℚ, ℝ, ℂ all have characteristic 0. 𝔽_p (the integers mod a prime p) has characteristic p.',
  },
  gal58Separable: {
    term: 'Separable polynomial',
    definition: 'A polynomial with no repeated (double) roots. Over a characteristic-0 field, every irreducible polynomial is automatically separable; this can fail in positive characteristic.',
    example: 'x² − 2 is separable over ℚ (roots ±√2 are distinct). Over 𝔽_3, the polynomial 2x³+24x+9 has derivative 6x²+24 ≡ 0, a warning sign that separability needs care in positive characteristic.',
  },
  gal58SeparableExtension: {
    term: 'Separable extension',
    definition: 'A field extension K/F where every α ∈ K has a separable minimal polynomial over F. Automatic whenever F has characteristic 0.',
    example: 'Every extension of ℚ is separable, since ℚ has characteristic 0.',
  },
  gal58PerfectField: {
    term: 'Perfect field',
    definition: 'A field F such that every finite extension K/F is separable. Every characteristic-0 field is perfect, and every finite field is perfect too.',
    example: 'ℚ, ℝ, ℂ, and every 𝔽_p are perfect fields.',
  },

  // ────────────── §5 Automorphism groups and Galois extensions ──────────────
  gal58AutKF: {
    term: 'Automorphism group Aut(K/F)',
    symbol: '\\Aut(K/F)',
    definition: 'The group (under composition) of field isomorphisms σ: K → K that fix F pointwise — that is, σ(x) = x for every x ∈ F. Unlike an embedding into ℂ, elements of Aut(K/F) must map K back into K itself.',
    example: 'Aut(ℚ(√2)/ℚ) ≅ ℤ/2ℤ, containing the identity and a+b√2 ↦ a−b√2. Aut(ℚ(∛2)/ℚ) is trivial — only the identity.',
  },
  gal58SplittingField: {
    term: 'Splitting field',
    definition: 'For a polynomial p(x) ∈ F[x] of degree n with roots α₁,…,αₙ in the algebraic closure of F, the splitting field of p over F is F(α₁,…,αₙ) — the smallest field over F in which p factors completely into linear factors.',
    example: 'The splitting field of x²−5 over ℚ is ℚ(√5). The splitting field of x³−2 over ℚ is ℚ(∛2, ω), degree 6 — not just ℚ(∛2), which is only degree 3.',
  },
  gal58GaloisExtension: {
    term: 'Galois extension',
    definition: 'A finite extension K/F where |Aut(K/F)| = [K:F] — equivalently, K is the splitting field of some separable polynomial over F. When this holds, Aut(K/F) is renamed Gal(K/F), the Galois group.',
    example: 'ℚ(√2)/ℚ is Galois (splitting field of x²−2). ℚ(∛2)/ℚ is not Galois: |Aut| = 1 but [K:F] = 3.',
  },
  gal58GaloisClosure: {
    term: 'Galois closure',
    definition: 'For a non-Galois extension K/F, a smallest Galois extension of F containing K, obtained by adjoining the missing Galois conjugates.',
    example: 'ℚ(∛2)/ℚ is not Galois, but adjoining ω gives ℚ(∛2, ω)/ℚ, which is Galois of degree 6 with Galois group S₃ — the Galois closure of ℚ(∛2).',
  },

  // ────────────── §6 Fundamental theorem of Galois theory ──────────────
  gal58FixedField: {
    term: 'Fixed field',
    symbol: 'K^H',
    definition: 'For a subgroup H of Aut(K/F), the fixed field K^H is the set of elements of K left unchanged by every σ ∈ H. It is itself a field, sitting between F and K.',
    example: 'For K = ℚ(√2,√3) and H = {id, σ} where σ fixes √2 and negates √3, the fixed field K^H is ℚ(√3).',
  },
};

export default entries;
