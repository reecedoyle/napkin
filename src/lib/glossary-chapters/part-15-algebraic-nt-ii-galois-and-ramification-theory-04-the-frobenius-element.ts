import type { GlossaryEntry } from '../glossary';

const entries: Record<string, GlossaryEntry> = {
  frob61GaloisGroup: {
    term: 'Galois group Gal(K/ℚ)',
    symbol: '\\operatorname{Gal}(K/\\mathbb{Q})',
    definition:
      'For a Galois extension K/ℚ, the group of field automorphisms of K that fix ℚ pointwise, under composition. It acts on the ring of integers 𝒪_K and permutes the prime ideals lying above a given rational prime.',
    example: 'For K = ℚ(i), Gal(K/ℚ) = {id, complex conjugation}, a group of order 2.',
  },
  frob61PrimeAbove: {
    term: 'Prime above p',
    symbol: '\\mathfrak p \\mid p',
    definition:
      'A prime ideal 𝔭 of 𝒪_K is said to lie above (or be "above") a rational prime p if 𝔭 contains p, equivalently if 𝔭 is one of the prime factors appearing in the factorization of the ideal (p) in 𝒪_K.',
    example: 'In ℤ[i], the ideals (2+i) and (2−i) both lie above the rational prime 5, since (5) = (2+i)(2−i).',
  },
  frob61UnramifiedPrime: {
    term: 'Unramified prime',
    definition:
      'A rational prime p is unramified in K if, in the factorization (p) = 𝔭₁^e₁⋯𝔭_g^e_g of the ideal (p) in 𝒪_K, every ramification index eᵢ equals 1. Only finitely many primes ramify in any given number field, so "unramified" is the generic case.',
  },
  frob61ResidueField: {
    term: 'Residue field 𝒪_K/𝔭',
    symbol: '\\mathcal{O}_K/\\mathfrak p \\cong \\mathbb{F}_{p^f}',
    definition:
      'For a prime ideal 𝔭 of 𝒪_K lying above rational prime p, the quotient ring 𝒪_K/𝔭 is a finite field, isomorphic to 𝔽_{p^f} where f is the inertial degree of 𝔭. It records "what K looks like modulo 𝔭".',
  },
  frob61InertialDegree: {
    term: 'Inertial degree f',
    symbol: 'f_{\\mathfrak p}',
    definition:
      'For a prime 𝔭 of 𝒪_K above rational prime p, the inertial degree f is the degree of the residue field extension: 𝒪_K/𝔭 ≅ 𝔽_{p^f} is an extension of 𝔽_p of degree f. It measures how much bigger the residue field is than 𝔽_p.',
  },
  frob61FrobeniusMapFiniteField: {
    term: 'Frobenius map on a finite field',
    symbol: '\\sigma(x) = x^p',
    definition:
      'On the finite field 𝔽_{p^f}, the map σ(x) = xᵖ is a field automorphism (it respects addition thanks to the "freshman\'s dream" identity (x+y)ᵖ ≡ xᵖ+yᵖ in characteristic p). It generates the whole Galois group Gal(𝔽_{p^f}/𝔽_p), which is cyclic of order f.',
  },
  frob61FrobeniusElement: {
    term: 'Frobenius element',
    symbol: '\\operatorname{Frob}_{\\mathfrak p}',
    definition:
      'For K/ℚ Galois with unramified prime 𝔭 above p, the Frobenius element Frob_𝔭 ∈ Gal(K/ℚ) is the unique automorphism satisfying Frob_𝔭(α) ≡ αᵖ (mod 𝔭) for every algebraic integer α ∈ 𝒪_K. It has order equal to the inertial degree f of 𝔭.',
    example: 'In ℤ[i], Frob_𝔭 is the identity when p ≡ 1 (mod 4), and complex conjugation when p ≡ 3 (mod 4).',
  },
  frob61DecompositionGroup: {
    term: 'Decomposition group D_𝔭',
    symbol: 'D_{\\mathfrak p}',
    definition:
      'For 𝔭 above p in a Galois extension K/ℚ, the decomposition group D_𝔭 is the subgroup of Gal(K/ℚ) consisting of automorphisms that fix 𝔭 as a set (i.e. send 𝔭 to itself). It surjects naturally onto Gal((𝒪_K/𝔭)/𝔽_p), and when p is unramified this map is an isomorphism.',
  },
  frob61ChebotarevDensity: {
    term: 'Chebotarev density theorem',
    definition:
      'For K/ℚ Galois with group G, and a conjugacy class C of G, the density of unramified rational primes p whose Frobenius set {Frob_𝔭 : 𝔭 above p} equals C is exactly |C|/|G|. In particular every conjugacy class — hence every element of G — arises as Frob_𝔭 for infinitely many primes p.',
    example: 'For G abelian of order n, every element forms its own conjugacy class, so each is hit by exactly a 1/n fraction of primes — this recovers Dirichlet\'s theorem on primes in arithmetic progressions.',
  },
  frob61PrimeDensity: {
    term: 'Density of a set of primes',
    symbol: '\\lim_{x\\to\\infty} \\frac{\\#\\{p \\le x : p \\in S\\}}{\\#\\{p \\le x\\}}',
    definition:
      'The density of a set S of rational primes is the limiting proportion of primes up to x that lie in S, as x → ∞. It is a way to measure the "size" of an infinite set of primes as a fraction between 0 and 1.',
  },
  frob61CyclotomicField: {
    term: 'Cyclotomic field ℚ(ζ_q)',
    symbol: '\\QQ(\\zeta_q)',
    definition:
      'For q a prime, the field ℚ(ζ_q) obtained by adjoining a primitive q-th root of unity ζ_q to ℚ. Its ring of integers is ℤ[ζ_q], its discriminant is ±q^(q−2), and [ℚ(ζ_q):ℚ] = q−1.',
  },
  frob61CyclotomicGaloisGroup: {
    term: 'Galois group of a cyclotomic field',
    symbol: '\\Gal(\\QQ(\\zeta_q)/\\QQ) = \\{\\sigma_n\\}',
    definition:
      'The automorphisms of L = ℚ(ζ_q) are exactly the maps σ_n: ζ_q ↦ ζ_q^n for n not divisible by q, depending only on n mod q. As a group, Gal(L/ℚ) ≅ (ℤ/qℤ)^× ≅ ℤ/(q−1)ℤ — every automorphism just permutes the q-th roots of unity by raising them to a fixed power.',
  },
  frob61SplitsCompletely: {
    term: 'Splits completely',
    definition:
      'A rational prime p splits completely in 𝒪_K if it factors as (p) = 𝔭₁⋯𝔭_n with n = [K:ℚ] distinct prime factors, each with inertial degree 1 (and, if unramified, ramification index 1). Equivalently, for K/ℚ Galois and 𝔭 above p unramified, p splits completely exactly when Frob_𝔭 = id.',
  },
  frob61Restriction: {
    term: 'Restriction of an automorphism',
    symbol: '\\sigma \\restrict{K}',
    definition:
      'For a tower ℚ ⊆ K ⊆ L with K/ℚ normal, and σ an automorphism of L, the restriction σ|_K is the automorphism of K obtained by only remembering the action of σ on the subfield K ⊆ L. It is well-defined precisely because K/ℚ is normal, so σ sends K back into itself.',
  },
  frob61LegendreSymbol: {
    term: 'Legendre symbol',
    symbol: '\\left(\\frac{a}{p}\\right)',
    definition:
      'For an odd prime p and integer a not divisible by p, the Legendre symbol (a/p) is +1 if a is a quadratic residue mod p (a ≡ x² for some x), and −1 otherwise. It is multiplicative in a.',
    example: '(2/7) = +1 since 3² ≡ 2 (mod 7). (3/7) = −1 since no square is ≡ 3 (mod 7).',
  },
  frob61QuadraticReciprocity: {
    term: 'Quadratic reciprocity',
    definition:
      'For distinct odd primes p and q, the Legendre symbols satisfy (p/q)(q/p) = (−1)^{((p−1)/2)·((q−1)/2)}. In particular (p/q) = (q/p) unless both p and q are ≡ 3 (mod 4), in which case they differ by a sign.',
  },
  frob61QuadraticSubfield: {
    term: 'Quadratic subfield of a cyclotomic field',
    symbol: '\\QQ(\\sqrt{q^\\ast})',
    definition:
      'Inside L = ℚ(ζ_q), the unique subfield of degree 2 over ℚ, corresponding via Galois theory to the unique index-2 subgroup H ≤ Gal(L/ℚ). It equals ℚ(√q*) for a squarefree integer q* satisfying q* = ±q and q* ≡ 1 (mod 4).',
  },
  frob61FactorizationPattern: {
    term: 'Factorization pattern',
    definition:
      'For a number field E of degree n over ℚ and an unramified rational prime p, the factorization pattern of p in E is the partition n = f₁ + f₂ + ⋯ + f_g given by the inertial degrees of the prime factors of (p) in 𝒪_E (there are g of them, and if p is unramified all ramification indices are 1).',
    example: 'A quadratic field E has n = 2, so p either has pattern 1+1 (p splits) or 2 (p is inert).',
  },
  frob61CycleStructure: {
    term: 'Cycle structure of a permutation',
    definition:
      'For a permutation π of a finite set of size n, its cycle structure is the partition of n given by the lengths of the disjoint cycles in its cycle decomposition. Two permutations are conjugate in the symmetric group iff they have the same cycle structure.',
    example: 'The permutation (1 2 3)(4 5) of {1,...,5} has cycle structure 3+2.',
  },
  frob61CauchysGroupTheorem: {
    term: "Cauchy's theorem (group theory)",
    definition:
      'If a prime p divides the order of a finite group G, then G has an element of order p. This is a purely group-theoretic fact — no field theory or number theory required — and is a special case of the (harder) Sylow theorems.',
    example: 'Since 3 divides |S₄| = 24, S₄ must contain an element of order 3 (indeed, any 3-cycle works).',
  },
};

export default entries;
