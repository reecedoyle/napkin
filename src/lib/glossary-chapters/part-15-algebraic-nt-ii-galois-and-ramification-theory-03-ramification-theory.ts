import type { GlossaryEntry } from '../glossary';

// Chapter 60 — Ramification theory. Keys are prefixed rt60 to stay
// collision-free from sibling Part XV chapters authored in parallel worktrees.
const entries: Record<string, GlossaryEntry> = {
  // ────────────── §1 Ramified / inert / split primes ──────────────
  rt60above: {
    term: 'Above a prime',
    symbol: '\\kp \\mid (p)',
    definition: 'A prime ideal 𝔭 of 𝒪_K is above the rational prime p (or above (p)) if 𝔭 appears in the factorization of p·𝒪_K into prime ideals. Equivalently, 𝔭 ∩ ℤ = (p).',
    example: 'In ℤ[i], both (2+i) and (2-i) are above the rational prime 5, since (5) = (2+i)(2-i).',
  },
  rt60ramified: {
    term: 'Ramified prime',
    symbol: 'e_i > 1',
    definition: 'A rational prime p is ramified in 𝒪_K if, in the factorization p·𝒪_K = 𝔭₁^e₁ ··· 𝔭_g^e_g, some exponent e_i is greater than 1. Ramification is the "exceptional" behavior — only finitely many primes ramify in any given number field.',
    example: '2 is ramified in ℤ[i]: (2) = (1+i)², so e₁ = 2.',
  },
  rt60inert: {
    term: 'Inert prime',
    symbol: 'g=1,\\ e_1=1',
    definition: 'A rational prime p is inert in 𝒪_K if p·𝒪_K stays prime — that is, g = 1 and e₁ = 1 in the factorization. Equivalently, (p) itself is already a prime ideal of 𝒪_K.',
    example: '3 is inert in ℤ[i]: (3) remains prime, since 3 ≡ 3 (mod 4).',
  },
  rt60split: {
    term: 'Split prime',
    symbol: 'g > 1',
    definition: 'A rational prime p is split in 𝒪_K if p·𝒪_K factors into more than one distinct prime ideal, i.e. g > 1 in p·𝒪_K = 𝔭₁^e₁ ··· 𝔭_g^e_g.',
    example: '5 is split in ℤ[i]: (5) = (2+i)(2-i), so g = 2.',
  },
  rt60quadraticResidue: {
    term: 'Quadratic residue',
    symbol: 'a \\equiv x^2 \\pmod p',
    definition: 'An integer a is a quadratic residue mod p if a ≡ x² (mod p) for some x — that is, a has a square root mod p. For an odd prime p, -1 is a quadratic residue mod p exactly when p ≡ 1 (mod 4).',
    example: '-1 is a quadratic residue mod 13 (since 5² = 25 ≡ -1 (mod 13)) but not mod 7.',
  },

  // ────────────── §3 Inertial degrees ──────────────
  rt60inertialDegree: {
    term: 'Inertial degree',
    symbol: 'f_i',
    definition: 'For a prime 𝔭ᵢ above p in the factorization p·𝒪_K = 𝔭₁^e₁ ··· 𝔭_g^e_g of a degree-n number field K, the inertial degree f_i is defined by 𝒩(𝔭ᵢ) = p^{f_i}. The identity n = Σ eᵢfᵢ always holds.',
    example: 'In ℤ[i], the prime 7·ℤ[i] has inertial degree 2, since 𝒩((7)) = 49 = 7².',
  },
  rt60ramificationIndex: {
    term: 'Ramification index',
    symbol: 'e_i',
    definition: 'For a prime 𝔭ᵢ above p in the factorization p·𝒪_K = 𝔭₁^e₁ ··· 𝔭_g^e_g, the ramification index e_i is just the exponent of 𝔭ᵢ in that factorization. p is ramified exactly when some e_i > 1.',
    example: 'In ℤ[i], (2) = (1+i)², so the ramification index of (1+i) is e = 2.',
  },

  // ────────────── §4 The magic of Galois extensions ──────────────
  rt60galoisExtension: {
    term: 'Galois extension',
    symbol: 'K/\\QQ',
    definition: 'A field extension K/ℚ is Galois if it is normal (contains all roots of the minimal polynomial of each of its elements) and separable (those roots are distinct). Equivalently, |Aut(K/ℚ)| = [K:ℚ]. Ramification behaves especially cleanly over Galois extensions.',
    example: 'ℚ(i)/ℚ and ℚ(√2,√3)/ℚ are Galois. ℚ(∛2)/ℚ is not Galois — it does not contain the complex cube roots of 2.',
  },
  rt60galoisGroup: {
    term: 'Galois group',
    symbol: 'G = \\Gal(K/\\QQ)',
    definition: 'For a Galois extension K/ℚ, the Galois group Gal(K/ℚ) is the group of all field automorphisms of K that fix ℚ pointwise, under composition. Its order equals [K:ℚ].',
    example: 'Gal(ℚ(i)/ℚ) = {id, complex conjugation} ≅ ℤ/2ℤ.',
  },
  rt60chineseRemainderTheorem: {
    term: 'Chinese remainder theorem',
    definition: 'For pairwise distinct maximal ideals 𝔪₁, …, 𝔪_k of a ring R and any target residues r₁, …, r_k, there is an element x ∈ R with x ≡ rᵢ (mod 𝔪ᵢ) for every i. It lets you prescribe behavior of an element modulo several primes independently.',
    example: 'In ℤ[i], given distinct primes 𝔭₁,𝔭₂ above a split rational prime, CRT finds x ≡ 0 (mod 𝔭₁) and x ≡ 1 (mod 𝔭₂) simultaneously.',
  },

  // ────────────── §5 Decomposition and inertia groups ──────────────
  rt60decompositionGroup: {
    term: 'Decomposition group',
    symbol: 'D_\\kp',
    definition: 'For a prime 𝔭 above p in a Galois extension K/ℚ, the decomposition group D_𝔭 is the stabilizer of 𝔭 under the action of Gal(K/ℚ): D_𝔭 = {σ ∈ Gal(K/ℚ) : σ𝔭 = 𝔭}. It has order ef, and there is a natural surjection D_𝔭 ↠ Gal((𝒪_K/𝔭)/𝔽_p) with kernel the inertia group.',
    example: 'In ℚ(ζ₅)/ℚ with p=19 (e=1, f=2), the decomposition group D_𝔭 has order 2.',
  },
  rt60inertiaGroup: {
    term: 'Inertia group',
    symbol: 'I_\\kp',
    definition: 'The inertia group I_𝔭 is the kernel of the natural map θ: D_𝔭 → Gal((𝒪_K/𝔭)/𝔽_p). It is a subgroup of the decomposition group D_𝔭 of order e, the ramification index. I_𝔭 = {1} exactly when p is unramified.',
    example: 'If p is unramified in K (e=1), then I_𝔭 is trivial and D_𝔭 ≅ Gal((𝒪_K/𝔭)/𝔽_p).',
  },
  rt60fixedField: {
    term: 'Fixed field',
    symbol: 'K^H',
    definition: 'For a subgroup H of Gal(K/F), the fixed field K^H = {x ∈ K : σ(x) = x for all σ ∈ H} is the intermediate field fixed pointwise by H. The fundamental theorem of Galois theory gives an order-reversing correspondence between subgroups of Gal(K/F) and intermediate fields F ⊆ L ⊆ K, via H ↦ K^H.',
    example: 'For K = ℚ(i) and H = Gal(K/ℚ) = {id, conjugation}, the fixed field K^H = ℚ.',
  },
};

export default entries;
