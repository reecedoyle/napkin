import type { GlossaryEntry } from '../glossary';

// Chapter 59 — Finite fields.
// Keys are prefixed `ff59` to avoid clashing with any other chapter's keys.
const entries: Record<string, GlossaryEntry> = {
  ff59Characteristic: {
    term: 'Characteristic of a ring',
    symbol: '\\operatorname{char}(F)',
    definition:
      'The smallest positive integer p such that 1 + 1 + ⋯ + 1 (p times) equals 0 in the ring. If no such p exists, the characteristic is defined to be 0.',
    example: 'char(ℚ) = 0. char(𝔽_p) = p, since adding 1 to itself p times wraps around to 0 mod p.',
  },
  ff59FreshmansDream: {
    term: "Freshman's dream",
    symbol: '(a+b)^p = a^p + b^p',
    definition:
      'In a field of characteristic p, the p-th power map distributes over addition: (a+b)^p = a^p + b^p. This looks like a beginner\'s mistake in general algebra, but it is a genuine theorem in characteristic p, following from the binomial theorem plus the fact that the binomial coefficient C(p,i) is divisible by p for 0 < i < p.',
  },
  ff59SplittingField: {
    term: 'Splitting field',
    definition:
      'The smallest field extension of a base field K over which a given polynomial factors completely into linear factors (i.e. all of its roots live in the extension).',
    example: 'The splitting field of x² + 1 over ℝ is ℂ, since x² + 1 = (x−i)(x+i) needs i adjoined.',
  },
  ff59Separable: {
    term: 'Separable polynomial',
    definition:
      'A polynomial with no repeated roots (in its splitting field). One way to check separability: a polynomial and its formal derivative share no common root exactly when the polynomial is separable.',
  },
  ff59Fpn: {
    term: 'The finite field 𝔽_{p^n}',
    symbol: '\\mathbb{F}_{p^n}',
    definition:
      'The (unique up to isomorphism) finite field with p^n elements, for p prime and n a positive integer. It is the splitting field of x^{p^n} − x over 𝔽_p.',
    example: '𝔽_9 = 𝔽_{3²} is the field of 9 elements built as 𝔽_3[X]/(X²+1).',
  },
  ff59Automorphism: {
    term: 'Field automorphism',
    definition:
      'A bijective ring homomorphism from a field to itself. The set of all automorphisms of F fixing a subfield K pointwise forms a group under composition.',
  },
  ff59GaloisExtension: {
    term: 'Galois extension',
    definition:
      'A field extension F/K that is the splitting field of a separable polynomial over K. Equivalently, one where the group of automorphisms of F fixing K has size equal to the degree [F:K].',
  },
  ff59GaloisGroup: {
    term: 'Galois group Gal(F/K)',
    symbol: '\\Gal(F/K)',
    definition:
      'The group of field automorphisms of F that fix every element of the subfield K, under composition. Measures the symmetries of a Galois extension F/K.',
  },
  ff59Frobenius: {
    term: 'Frobenius automorphism',
    symbol: '\\sigma_p',
    definition:
      'The p-th power map σ_p(x) = x^p on a field of characteristic p. It is always a ring homomorphism (thanks to the Freshman\'s dream), and on a finite field it is a bijective automorphism fixing the base field 𝔽_p pointwise.',
  },
  ff59MultGroupCyclic: {
    term: 'Multiplicative group of a field',
    symbol: 'F^\\times',
    definition:
      'The nonzero elements of a field F under multiplication, written F^×. For any finite field F, this group is cyclic — a generator g is called a primitive root, and every nonzero element is a power of g.',
    example: '𝔽_17^× is cyclic of order 16; g = 3 is a generator (a primitive root mod 17).',
  },
  ff59QuadraticResidue: {
    term: 'Quadratic residue',
    definition:
      'A nonzero element a of a finite field F that can be written as a square: a = b² for some b ∈ F. In a finite field of odd order, exactly half of the nonzero elements are quadratic residues.',
    example: 'In 𝔽_17, the quadratic residues are {1, 2, 4, 8, 9, 13, 15, 16} — exactly 8 of the 16 nonzero elements.',
  },
};

export default entries;
