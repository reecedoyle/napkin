/**
 * Chapter glossary for Part 14, Chapter 1 — Algebraic integers (Ch. 53).
 *
 * All keys are prefixed with `an53` to guarantee portal-wide uniqueness.
 */
import type { GlossaryEntry } from '../glossary';

const entries: Record<string, GlossaryEntry> = {
  // ────────────── §1 Motivation from high school algebra ──────────────
  an53minimalPoly: {
    term: 'Minimal polynomial',
    symbol: '\\operatorname{minpoly}_\\mathbb{Q}(\\alpha)',
    definition: 'The unique monic polynomial P(x) ∈ ℚ[x] of smallest degree satisfying P(α) = 0. It divides every other rational polynomial that vanishes at α, and its other roots are the conjugates of α.',
    example: 'The minimal polynomial of √2 over ℚ is x² − 2. The minimal polynomial of ∛2 is x³ − 2, so ∛2 has two complex conjugates.',
  },
  an53degree: {
    term: 'Degree of an algebraic number',
    definition: 'The degree of the minimal polynomial of α over ℚ. This equals the dimension of ℚ(α) as a ℚ-vector space.',
    example: '√2 has degree 2. The primitive 5th root of unity ζ₅ has degree 4. Every rational number has degree 1.',
  },
  an53conjugates: {
    term: 'Galois conjugates',
    definition: 'The other roots of the minimal polynomial of α over ℚ. Any rational polynomial that vanishes at α must also vanish at all its conjugates.',
    example: 'The conjugates of 2 + √2 are just {2 − √2}. The conjugates of ∛2 are ∛2·e^(2πi/3) and ∛2·e^(4πi/3).',
  },

  // ────────────── §2 Algebraic numbers and algebraic integers ──────────────
  an53algebraicNumber: {
    term: 'Algebraic number',
    symbol: '\\alpha \\in \\overline{\\mathbb{Q}}',
    definition: 'A complex number that is a root of some nonzero polynomial with rational (equivalently, integer) coefficients. The set of all algebraic numbers is denoted ℚ̄ (the algebraic closure of ℚ) and forms a field.',
    example: '√2, i, ∛5, and e^(2πi/7) are all algebraic numbers. π and e are not algebraic (they are transcendental).',
  },
  an53olQQ: {
    term: 'Algebraic closure of ℚ',
    symbol: '\\overline{\\mathbb{Q}}',
    definition: 'The field of all algebraic numbers — complex numbers that satisfy a nonzero polynomial equation over ℚ. It is the smallest algebraically closed field containing ℚ.',
    example: 'ℚ̄ contains all roots of unity, all nth roots of integers, and all algebraic combinations thereof.',
  },
  an53olZZ: {
    term: 'Ring of all algebraic integers',
    symbol: '\\overline{\\mathbb{Z}}',
    definition: 'The set of all complex numbers that are roots of monic polynomials with integer coefficients. It forms a ring (closed under + and ×). Its intersection with ℚ equals ℤ exactly.',
    example: 'ℤ̄ contains √2 (root of x² − 2), i (root of x² + 1), and all roots of unity.',
  },
  an53rationalInteger: {
    term: 'Rational integer',
    symbol: 'n \\in \\mathbb{Z}',
    definition: 'An ordinary integer — used as a name to distinguish elements of ℤ from the broader class of algebraic integers. Every rational integer is an algebraic integer (root of x − n), but not vice versa.',
    example: '3 is a rational integer. √2 is an algebraic integer but not a rational integer.',
  },

  // ────────────── §3 Number fields ──────────────
  an53numberField: {
    term: 'Number field',
    symbol: 'K',
    definition: 'A field containing ℚ as a subfield and finite-dimensional as a ℚ-vector space. The dimension is called the degree of K. Equivalently, every number field has the form ℚ(α) for some algebraic number α.',
    example: 'ℚ(√2) = {a + b√2 : a,b ∈ ℚ} is a number field of degree 2. ℚ(∛2) has degree 3.',
  },
  an53degreeField: {
    term: 'Degree of a number field',
    symbol: '[K : \\mathbb{Q}]',
    definition: 'The dimension of K as a ℚ-vector space, written [K : ℚ]. Equals the degree of the minimal polynomial of any primitive element α with K = ℚ(α).',
    example: '[ℚ(√2) : ℚ] = 2. [ℚ(∛2) : ℚ] = 3. [ℚ(ζ₅) : ℚ] = 4.',
  },
  an53QQadj: {
    term: 'Field ℚ(α)',
    symbol: '\\mathbb{Q}(\\alpha)',
    definition: 'The smallest field containing ℚ and the algebraic number α. Equals ℚ[α] = {a₀ + a₁α + ⋯ + aₙ₋₁αⁿ⁻¹ : aᵢ ∈ ℚ} where n = deg α. Every element of ℚ(α) can be uniquely written in this polynomial form.',
    example: 'ℚ(√2) = {a + b√2 : a,b ∈ ℚ}. Since 1/(3 − √2) = (3 + √2)/7, denominators cause no trouble.',
  },

  // ────────────── §4 Primitive element theorem ──────────────
  an53primitiveElement: {
    term: 'Primitive element',
    definition: 'An algebraic number α such that K = ℚ(α). Every number field has a primitive element — this is the content of Artin\'s primitive element theorem.',
    example: 'For K = ℚ(√3, √5), the element √3 + √5 is a primitive element: ℚ(√3 + √5) = ℚ(√3, √5).',
  },
  an53monogenic: {
    term: 'Monogenic extension',
    definition: 'A field extension K/ℚ is monogenic if K = ℚ(α) for some single element α. Every number field is monogenic — a consequence of the primitive element theorem.',
    example: 'ℚ(√3, √5) looks like it needs two generators, but √3 + √5 alone generates it, making it monogenic.',
  },
};

export default entries;
