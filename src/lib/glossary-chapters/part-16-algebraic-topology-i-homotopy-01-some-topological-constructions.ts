import type { GlossaryEntry } from '../glossary';

const entries: Record<string, GlossaryEntry> = {
  tc63Sphere: {
    term: 'n-sphere',
    symbol: 'S^n',
    definition:
      'The set of points (x₀, …, xₙ) with x₀² + ⋯ + xₙ² = 1, sitting inside ℝⁿ⁺¹. S⁰ is two points, S¹ is the familiar circle, S² is the surface of a ball in 3-space.',
    example: 'S⁰ = {−1, 1} ⊂ ℝ. S¹ is the unit circle in ℝ². S² is the surface of the Earth, sitting in ℝ³.',
  },
  tc63ClosedBall: {
    term: 'Closed ball',
    symbol: 'D^n',
    definition:
      'The set of points (x₁, …, xₙ) with x₁² + ⋯ + xₙ² ≤ 1, sitting inside ℝⁿ — a solid disk together with its boundary. Its boundary is the sphere Sⁿ⁻¹.',
    example: 'D¹ is the closed interval [−1, 1]. D² is a solid disk in the plane, with boundary S¹.',
  },
  tc63QuotientTopology: {
    term: 'Quotient topology',
    symbol: 'X / {\\sim}',
    definition:
      'Given a space X and an equivalence relation ∼ on its points, X/∼ is the space whose points are the equivalence classes [x], with a set U ⊆ X/∼ declared open exactly when the set of x ∈ X with [x] ∈ U is open in X. Geometrically: weld together points that are equivalent.',
    example: 'Identifying the two endpoints of the interval [−1, 1] recovers the circle S¹.',
  },
  tc63QuotientByA: {
    term: 'Quotient by a subset',
    symbol: 'X / A',
    definition:
      'Shorthand for the quotient topology X/∼ where ∼ identifies every point of A ⊆ X with every other point of A (and leaves points outside A alone). Collapses the whole subset A down to a single point.',
    example: 'Dⁿ / Sⁿ⁻¹ = Sⁿ: collapsing the boundary sphere of a closed ball to a point yields a sphere one dimension "rounder".',
  },
  tc63DisjointUnion: {
    term: 'Disjoint union',
    symbol: 'X \\amalg Y',
    definition:
      'The space formed by placing two topological spaces X and Y side by side with no shared points: its points are the disjoint union of the point sets, and a set U is open iff U ∩ X and U ∩ Y are each open. Geometrically, just "both spaces drawn next to each other".',
    example: 'Two separate circles drawn on the same page, not touching, form the disjoint union S¹ ⊔ S¹.',
  },
  tc63WedgeSum: {
    term: 'Wedge sum',
    symbol: 'X \\vee Y',
    definition:
      'Given basepoints x₀ ∈ X and y₀ ∈ Y, the wedge sum X ∨ Y is the disjoint union X ⊔ Y with x₀ and y₀ identified to a single point — two spaces fused together at exactly one point.',
    example: 'S¹ ∨ S¹ is a "figure eight": two circles glued together at one point.',
  },
  tc63CWComplex: {
    term: 'CW complex',
    symbol: 'X',
    definition:
      'A space built up in stages: start with a set of points X⁰, attach 1-cells (copies of D¹) along their boundary S⁰ to get X¹, attach 2-cells (copies of D²) along their boundary S¹ to get X², and so on. A CW complex is "finite" if only finitely many cells were used in total, and "n-dimensional" if the process stops at stage n.',
    example: 'A single point is a 0-dimensional CW complex. A circle can be built with one 0-cell and one 1-cell.',
  },
  tc63Skeleton: {
    term: 'k-skeleton',
    symbol: 'X^k',
    definition:
      'In the construction of a CW complex X, the stage-k space Xᵏ built after attaching all cells of dimension ≤ k. The skeleta form an increasing chain X⁰ ⊆ X¹ ⊆ X² ⊆ ⋯ ⊆ X.',
  },
  tc63Cell: {
    term: 'k-cell',
    symbol: 'e^k_\\alpha',
    definition:
      'A copy of the closed ball Dᵏ used as a building block when constructing a CW complex, indexed by α when there are several in the same dimension. Its boundary Sᵏ⁻¹ gets welded onto the (k−1)-skeleton via an attaching map.',
  },
  tc63AttachingMap: {
    term: 'Attaching map',
    symbol: '\\varphi \\colon S^{k-1}_\\alpha \\to X^{k-1}',
    definition:
      'The continuous map used to glue the boundary of a new k-cell onto the existing (k−1)-skeleton when building a CW complex. Formally, Xᵏ = (Xᵏ⁻¹ ⊔ ⨆ₐ eᵏₐ) / ∼, where ∼ identifies each boundary point of eᵏₐ with its image under the attaching map.',
  },
  tc63AttachingWord: {
    term: 'Attaching word',
    symbol: 'aba^{-1}b^{-1}',
    definition:
      'A shorthand for describing how the boundary circle of a 2-cell wraps around the 1-cells of a CW complex: each letter names a 1-cell to wrap around (in the forward direction), and an inverse letter (like a⁻¹) means wrapping around it backwards. E.g. aba⁻¹b⁻¹ means: around a, then b, then a backwards, then b backwards.',
    example: 'The torus has attaching word aba⁻¹b⁻¹; the Klein bottle has attaching word abab⁻¹.',
  },
  tc63Torus: {
    term: 'Torus',
    symbol: 'T^2',
    definition:
      'The surface formed by taking a square and identifying each pair of opposite edges in the same direction (walk off the right edge, reappear on the left). Equivalent to (ℝ/ℤ)² ≅ S¹ × S¹, and realizable in 3-space as the surface of a donut.',
  },
  tc63KleinBottle: {
    term: 'Klein bottle',
    definition:
      'The surface formed like the torus — identifying opposite edges of a square — except one pair of edges is identified in the opposite (flipped) orientation. Unlike the torus, it cannot be embedded in ℝ³ without self-intersection.',
  },
  tc63RPn: {
    term: 'Real projective space',
    symbol: '\\RP^n',
    definition:
      'The set of lines through the origin in ℝⁿ⁺¹, topologized as (n+1)-tuples (x₀ : ⋯ : xₙ), not all zero, up to a common nonzero scalar. Equivalently, ℝⁿ together with a "point at infinity" for each direction, and those points at infinity themselves form a copy of ℝℙⁿ⁻¹.',
    example: 'ℝℙ¹ ≅ S¹. ℝℙ² is the projective plane, obtained from a square with both pairs of edges reversed.',
  },
  tc63CPn: {
    term: 'Complex projective space',
    symbol: '\\CP^n',
    definition:
      'Defined like ℝℙⁿ but with complex coordinates: the set of tuples (z₀ : ⋯ : zₙ) of complex numbers, not all zero, up to a common nonzero complex scalar. Equivalently, ℂⁿ augmented with points at infinity forming a copy of ℂℙⁿ⁻¹.',
    example: 'ℂℙ⁰ is a point. ℂℙ¹ ≅ S² is the Riemann sphere: ℂ plus a single point at infinity.',
  },

};

export default entries;
