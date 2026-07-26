import type { GlossaryEntry } from '../glossary';

// Chapter 73 — Bonus: Cellular homology.
// Every key here is prefixed `bch73` to stay unique across sibling chapters
// authored in parallel worktrees (see AUTHORING.md).
const entries: Record<string, GlossaryEntry> = {
  bch73Degree: {
    term: 'Degree of a map',
    symbol: '\\deg f',
    definition:
      'For a map f from the n-sphere to itself (n > 0), the induced map on H_n(Sⁿ) ≅ ℤ is multiplication by some integer d, called the degree of f, written deg(f). Intuitively it counts how many times f wraps the sphere around itself.',
    example: 'The map z ↦ z^k on the circle S¹ ⊆ ℂ has degree k.',
  },
  bch73AntipodalMap: {
    term: 'Antipodal map',
    symbol: '-\\id',
    definition:
      'The map x ↦ −x sending each point of Sⁿ to its antipode. It has degree (−1)^(n+1), since it is a composite of n+1 reflections, each of degree −1.',
  },
  bch73HairyBall: {
    term: 'Hairy ball theorem',
    definition:
      'If n is even and positive, Sⁿ has no continuous field of everywhere-nonzero tangent vectors — you cannot "comb" an even-dimensional sphere flat without a cowlick.',
  },

  // ────────────── §2 Cellular chain complex ──────────────
  bch73Skeleton: {
    term: 'n-skeleton',
    symbol: 'X^n',
    definition:
      'For a CW complex X, the n-skeleton Xⁿ is the union of all cells of X of dimension at most n. Building X means attaching cells one dimension at a time: X⁰ ⊆ X¹ ⊆ X² ⊆ ⋯, with X = ⋃ₙ Xⁿ.',
  },
  bch73GoodPair: {
    term: 'Good pair',
    symbol: '(X, A)',
    definition:
      'A pair (X, A) is "good" if A is a nonempty closed subspace that is a deformation retract of some neighborhood in X. For a good pair, the quotient map induces an isomorphism H_k(X, A) ≅ H̃_k(X/A) between relative homology and reduced homology of the quotient.',
  },
  bch73CellularChains: {
    term: 'Cellular chain group',
    symbol: '\\Cells_k(X)',
    definition:
      'For a CW complex X, the k-th cellular chain group is Cells_k(X) = H_k(Xᵏ, Xᵏ⁻¹). It is a free abelian group with one basis element per k-cell of X — much smaller than the singular chain group C_k(X).',
  },
  bch73CellularChainComplex: {
    term: 'Cellular chain complex',
    definition:
      'The chain complex ⋯ → Cells_n(X) → Cells_{n-1}(X) → ⋯ → Cells_0(X) → 0, where each map dₖ is built by chasing the exact sequences of adjacent skeletons. Its homology groups are isomorphic to the singular homology groups H_k(X).',
  },

  // ────────────── §3 Digression: why are the homology groups equal? ──────────────
  bch73SingularChainGroup: {
    term: 'Singular chain group',
    symbol: 'C_k(X)',
    definition:
      'The group of formal ℤ-linear combinations of continuous maps Δᵏ → X (singular k-simplices in X). It is the raw material homology is built from, and is typically enormous — uncountably generated even for simple spaces.',
  },
  bch73RelativeCycle: {
    term: 'Relative cycle',
    symbol: 'Z_k(X, A)',
    definition:
      'The subgroup of the relative chain group C_k(X, A) = C_k(X)/C_k(A) consisting of chains whose boundary vanishes in the quotient — i.e. whose actual boundary lies entirely inside A.',
  },
  bch73RelativeBoundary: {
    term: 'Relative boundary',
    symbol: 'B_k(X, A)',
    definition:
      'The image of the boundary map ∂: C_{k+1}(X, A) → C_k(X, A). Relative homology is H_k(X, A) = Z_k(X, A) / B_k(X, A), relative cycles modulo relative boundaries.',
  },

  // ────────────── §4 Euler characteristic via Betti numbers ──────────────
  bch73EulerCharacteristic: {
    term: 'Euler characteristic',
    symbol: '\\chi(X)',
    definition:
      'For a finite CW complex X, χ(X) = Σₙ (−1)ⁿ · #(n-cells of X). It generalizes the familiar V − E + F formula for polyhedra, and turns out to depend only on the space X, not on the choice of CW structure.',
    example: 'A triangulated sphere has χ = V − E + F = 2, matching the formula χ(Sⁿ) = 1 + (−1)ⁿ at n = 2.',
  },
  bch73BettiNumber: {
    term: 'Betti number',
    symbol: 'b_n',
    definition:
      'The n-th Betti number of X is bₙ = rank Hₙ(X), the rank of the n-th homology group. The Euler characteristic can be recovered from them: χ(X) = Σₙ (−1)ⁿ bₙ.',
    example: 'The torus has Betti numbers b₀ = 1, b₁ = 2, b₂ = 1, giving χ = 1 − 2 + 1 = 0.',
  },
  bch73Torus: {
    term: 'Torus',
    symbol: 'S^1 \\times S^1',
    definition:
      'The surface of a donut, formed as the product of two circles. As a CW complex it has one 0-cell, two 1-cells (the two loops a, b that generate it), and one 2-cell attached along the word aba⁻¹b⁻¹.',
  },
  bch73KleinBottle: {
    term: 'Klein bottle',
    definition:
      'A closed surface built like the torus but with one pair of identified edges reversed: as a CW complex, one 0-cell, two 1-cells a, b, and one 2-cell attached along the word abab⁻¹. Unlike the torus, it cannot be embedded in ℝ³ without self-intersection.',
  },
  bch73CPn: {
    term: 'Complex projective space',
    symbol: '\\CP^n',
    definition:
      'The space of complex lines through the origin in ℂ^(n+1). It has a CW structure with exactly one cell in each even dimension 0, 2, 4, …, 2n, and no odd-dimensional cells at all.',
  },

  // ────────────── §5 The cellular boundary formula ──────────────
  bch73AttachingMap: {
    term: 'Attaching map',
    definition:
      'For a k-cell e^k of a CW complex, the attaching map is the continuous function from the boundary sphere Sᵏ⁻¹ = ∂e^k into the (k−1)-skeleton X^(k-1), specifying how the cell is glued onto the rest of the complex.',
  },
  bch73CollapseMap: {
    term: 'Collapse map',
    definition:
      'For a (k−1)-cell e_β^(k-1) of X, the collapse map is the quotient X^(k-1) ↠ X^(k-1)/(X^(k-1) ∖ e_β^(k-1)), which crushes everything outside e_β^(k-1) to a single point, leaving a copy of S^(k-1) built from e_β^(k-1) alone.',
  },
  bch73CellularBoundaryFormula: {
    term: 'Cellular boundary formula',
    symbol: 'd_k(e^k) = \\sum_\\beta d_\\beta e_\\beta^{k-1}',
    definition:
      'The explicit description of the differential d_k on a basis k-cell e^k: its coefficient on a (k−1)-cell e_β is the degree d_β of the map Sᵏ⁻¹ = ∂e^k → X^(k-1) → S_β^(k-1), i.e. attach then collapse everything except e_β to a point.',
  },

  // ────────────── Problems ──────────────
  bch73RPn: {
    term: 'Real projective space',
    symbol: '\\RP^n',
    definition:
      'The space of lines through the origin in ℝ^(n+1). It has a CW structure with exactly one cell in every dimension 0, 1, 2, …, n.',
  },
  bch73MooreSpace: {
    term: 'Moore space',
    symbol: 'M(G, n)',
    definition:
      'A space whose reduced homology is concentrated in a single prescribed degree n, equal to a prescribed finitely generated abelian group G there and zero elsewhere. Built by attaching cells to realize exactly the desired cellular chain complex.',
  },
};

export default entries;
