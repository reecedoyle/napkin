import type { GlossaryEntry } from '../glossary';

// Chapter glossary for Part 18, Chapter 5 — Singular cohomology.
// Every key is prefixed `sc74` (this is "Chapter 74" in the portal's
// absolute numbering) so it can't collide with sibling chapters authored
// in parallel elsewhere in Part 18.
const entries: Record<string, GlossaryEntry> = {
  // ────────────── Chapter intro ──────────────
  sc74ProjectiveSpace: {
    term: 'Complex projective space ℂℙⁿ',
    symbol: '\\CP^n',
    definition: 'The space of complex lines through the origin in ℂⁿ⁺¹: the set of nonzero vectors in ℂⁿ⁺¹, modulo scaling by a nonzero complex number. It is a compact 2n-real-dimensional space built from cells in dimensions 0, 2, 4, …, 2n.',
    example: 'ℂℙ¹ is homeomorphic to the 2-sphere S². ℂℙ² is built from a point, a 2-cell, and a 4-cell.',
  },
  sc74Sphere: {
    term: 'n-sphere Sⁿ',
    symbol: 'S^n',
    definition: 'The set of unit-length vectors in ℝⁿ⁺¹: {x ∈ ℝⁿ⁺¹ : |x| = 1}. S¹ is the circle, S² the usual sphere surface, and so on.',
  },
  sc74WedgeSum: {
    term: 'Wedge sum X ∨ Y',
    symbol: 'X \\vee Y',
    definition: 'Two spaces X and Y glued together at a single chosen point (one from each). Homology and cohomology of a wedge sum split as a direct sum of the pieces (in positive degree), which is what makes wedge sums easy to compute with.',
    example: 'S² ∨ S⁴ is a 2-sphere and a 4-sphere touching at one point.',
  },
  sc74HomotopyEquivSpaces: {
    term: 'Homotopy equivalent spaces',
    symbol: 'X \\simeq Y',
    definition: 'Two spaces X and Y are homotopy equivalent if there are maps f: X → Y and g: Y → X with g∘f homotopic to the identity on X and f∘g homotopic to the identity on Y. Homotopy equivalent spaces have isomorphic homology and cohomology groups (though the converse can fail — the whole point of this chapter).',
  },
  // ────────────── §1 — Cochain complexes ──────────────
  sc74CochainComplex: {
    term: 'Cochain complex',
    symbol: 'A^\\bullet',
    definition: 'Algebraically the same data as a chain complex, except the indices increase: a sequence of abelian groups …→ Aⁿ⁻¹→ Aⁿ→ Aⁿ⁺¹→ … connected by maps δ (called the coboundary maps) with δ² = 0. Superscripts and δ (instead of subscripts and ∂) signal "cochain" rather than "chain."',
    example: 'The de Rham complex 0 → Ω⁰(M) → Ω¹(M) → Ω²(M) → ⋯ of differential forms on a manifold, with δ = d the exterior derivative.',
  },
  sc74Delta: {
    term: 'Coboundary operator δ',
    symbol: '\\delta',
    definition: 'The connecting map Aⁿ → Aⁿ⁺¹ in a cochain complex, satisfying δ² = 0. It plays the role that ∂ plays in a chain complex, but raises the index instead of lowering it.',
  },
  sc74CohomologyOfComplex: {
    term: 'Cohomology group of a cochain complex',
    symbol: 'H^n(A^\\bullet)',
    definition: 'For a cochain complex A^bullet with maps δ, the n-th cohomology group is ker(δ: Aⁿ → Aⁿ⁺¹) / im(δ: Aⁿ⁻¹ → Aⁿ) — cocycles modulo coboundaries. Exactly dual to how Hₙ of a chain complex is cycles modulo boundaries.',
  },
  sc74DeRham: {
    term: 'De Rham cohomology',
    definition: 'The cohomology of the cochain complex of differential k-forms on a smooth manifold M, with δ the exterior derivative d. It is one motivating example of a cochain complex that does not arise from dualizing a chain complex.',
  },
  sc74HomDualFunctor: {
    term: 'Dualizing functor Hom(−,G)',
    symbol: '\\Hom(-,G)',
    definition: 'For a fixed abelian group G, the contravariant functor Hom(−,G) turns a chain complex A_bullet (maps ∂, indices decreasing) into a cochain complex A^bullet (maps δ, indices increasing) by setting Aⁿ = Hom(Aₙ, G). A chain map reverses into a "dual map" going the other way. This is the standard source of cochain complexes in algebraic topology.',
  },
  sc74HnAG: {
    term: 'Cohomology with coefficients Hⁿ(A_•; G)',
    symbol: 'H^n(A_\\bullet; G)',
    definition: 'Given a chain complex A_bullet and an abelian group G, Hⁿ(A_•; G) denotes the cohomology groups of the dual cochain complex obtained by applying Hom(−,G) to A_bullet. So Hⁿ(A_•; G) := Hⁿ(A^bullet).',
  },
  // ────────────── §2 — Cohomology of spaces ──────────────
  sc74SingularCochain: {
    term: 'Singular cochain complex Cᐧ(X;G)',
    symbol: 'C^\\bullet(X;G)',
    definition: 'The dual of the singular chain complex C_bullet(X), obtained by applying Hom(−,G): so Cⁿ(X;G) = Hom(Cₙ(X), G). Its elements are called cochains — functions that assign an element of G to each singular n-simplex (extended linearly to formal sums of simplices).',
  },
  sc74HnXG: {
    term: 'Cohomology groups of a space Hⁿ(X;G)',
    symbol: 'H^n(X;G)',
    definition: 'For a space X and abelian group G, Hⁿ(X;G) := Hⁿ(C_bullet(X); G) = Hⁿ(C^bullet(X;G)) — the cohomology of the singular cochain complex of X. Determined up to isomorphism by the homology of X and G via the universal coefficient theorem.',
  },
  sc74GModule: {
    term: 'G-module structure on Hⁿ(X;G)',
    definition: 'If G is not just an abelian group but a ring (e.g. ℤ or ℝ), then Hⁿ(X;G) is naturally a G-module, not just an abelian group — you can multiply a cohomology class by a scalar from G.',
  },
  sc74H0Constant: {
    term: 'Hⁿ(X;G) for n = 0',
    definition: 'H⁰(X;G) is isomorphic to the group of 0-cochains that are constant on each path-connected component of X. If X has r path-connected components (r finite), then H⁰(X;G) ≅ G^⊕r. For infinitely many components, H⁰ is instead a product ∏G rather than a direct sum ⊕G — the same finite/infinite subtlety that separates H₀.',
    example: 'If X = X₁ ⊔ X₂ ⊔ X₃ has 3 path components, H⁰(X;G) ≅ G ⊕ G ⊕ G — one copy of G per component, recording the (locally constant) value assigned there.',
  },

  // ────────────── §3 — Cohomology of spaces is functorial ──────────────
  sc74CoCmplxCat: {
    term: 'Category of cochain complexes CoCmplx',
    symbol: '\\catname{CoCmplx}',
    definition: 'The category whose objects are cochain complexes of abelian groups and whose morphisms are cochain maps (degree-0 maps commuting with δ). Dual to Cmplx, the category of chain complexes.',
  },
  sc74HnAsFunctor: {
    term: 'Hⁿ as a functor CoCmplx → Grp',
    symbol: 'H^n \\colon \\catname{CoCmplx} \\to \\catname{Grp}',
    definition: 'Taking n-th cohomology is itself a functor: a cochain map A^bullet → B^bullet induces a group homomorphism Hⁿ(A^bullet) → Hⁿ(B^bullet), and this respects composition and identities — exactly as Hₙ is a functor Cmplx → Grp.',
  },
  sc74CohomFunctorial: {
    term: 'Contravariant functor Hⁿ(−;G): hTopᵒᵖ → Grp',
    symbol: 'H^n(-;G) \\colon \\catname{hTop}\\op \\to \\catname{Grp}',
    definition: 'For every n, sending a space X to Hⁿ(X;G) and a homotopy class of maps f: X → Y to the induced map f*: Hⁿ(Y;G) → Hⁿ(X;G) is a contravariant functor out of the homotopy category hTop. Built by composing three functors: C_bullet: Top → Cmplx, Hom(−,G): Cmplx^op → CoCmplx, and Hⁿ: CoCmplx → Grp.',
  },
  sc74CochainHomotopic: {
    term: 'Chain homotopic cochain maps',
    definition: 'Two cochain maps f^♯, g^♯: C^bullet(X;G) → C^bullet(Y;G) are chain homotopic if f^♯ − g^♯ = δP∨ + P∨δ for some map P∨ of degree −1. Chain homotopic maps induce the same map on cohomology, dual to the chain-complex fact that chain homotopic chain maps induce the same map on homology.',
  },

  // ────────────── §4 — Universal coefficient theorem ──────────────
  sc74UCT: {
    term: 'Universal coefficient theorem',
    definition: 'For a chain complex A_bullet of free abelian groups and an abelian group G, there is a natural short exact sequence 0 → Ext(Hₙ₋₁(A_•), G) → Hⁿ(A_•;G) → Hom(Hₙ(A_•), G) → 0, and it splits. So Hⁿ(A_•;G) ≅ Ext(Hₙ₋₁(A_•), G) ⊕ Hom(Hₙ(A_•), G). It shows cohomology is completely determined (as a group) by homology and G — no new information at the level of a single Hⁿ.',
  },
  sc74MapH: {
    term: 'Map h: Hⁿ(A_•;G) → Hom(Hₙ(A_•),G)',
    symbol: 'h',
    definition: 'The natural surjection in the universal coefficient theorem. A class in Hⁿ(A_•;G) is represented by a cochain, i.e. a function sending each cycle in Aₙ to an element of G; h sends that class to the induced homomorphism Hₙ(A_•) → G. The theorem\'s content is that h is surjective with kernel Ext(Hₙ₋₁(A_•), G).',
  },
  sc74FreeResolution: {
    term: 'Free resolution',
    definition: 'For an abelian group H, an exact sequence ⋯ → F₁ → F₀ → H → 0 with each Fᵢ free. Every abelian group has one (e.g. from the structure theorem: 0 → K ↪ R^⊕d ↠ M → 0 with both R^⊕d and K free).',
    example: '0 → ℤ →[×n] ℤ → ℤ/nℤ → 0 is a free resolution of ℤ/nℤ.',
  },
  sc74ExtFunctor: {
    term: 'Ext functor',
    symbol: '\\Ext(H,G)',
    definition: 'Given a free resolution ⋯ → F₁ →[f₁] F₀ → H → 0 of H, apply Hom(−,G) to get a cochain complex ⋯ ←[f₂∨] Hom(F₁,G) ←[f₁∨] Hom(F₀,G) ← 0, which need not stay exact. Define Ext(H,G) := ker(f₂∨)/im(f₁∨). This is independent of the choice of free resolution, and measures the failure of Hom(−,G) to preserve exactness — informally, "maps that should be there but aren\'t."',
  },
  sc74ExtLemma: {
    term: 'Computing Ext',
    definition: 'For abelian groups G, H, H′: (a) Ext(H⊕H′,G) = Ext(H,G)⊕Ext(H′,G); (b) Ext(H,G) = 0 whenever H is free; (c) Ext(ℤ/nℤ, G) = G/nG.',
    example: 'Ext(ℤ^⊕5, G) = 0 since ℤ^⊕5 is free. Ext(ℤ/6ℤ, ℤ) = ℤ/6ℤ, since G/nG = ℤ/6ℤ when G = ℤ and n = 6.',
  },

  // ────────────── §5 — Explanation for universal coefficient theorem ──────────────
  sc74KleinBottle: {
    term: 'Klein bottle',
    symbol: 'K',
    definition: 'The closed nonorientable surface obtained from a square by gluing one pair of opposite sides directly and the other pair with a flip. Its homology groups are H₀(K) = ℤ, H₁(K) = ℤ ⊕ ℤ/2ℤ, and Hₙ(K) = 0 for n ≥ 2.',
  },
  sc74CellularReformulation: {
    term: 'Cellular cohomology formula',
    definition: 'Since the cellular and singular chain complexes are both free with the same homology, the universal coefficient theorem guarantees they have the same cohomology too. So Hⁿ(X;G) can equally be computed as ker(Hom(Cellsₙ(X),G) → Hom(Cellsₙ₊₁(X),G)) / im(Hom(Cellsₙ₋₁(X),G) → Hom(Cellsₙ(X),G)), using the (usually much smaller) cellular chain complex instead of the singular one.',
  },
  sc74TautologicalExt: {
    term: 'Hⁿ ≅ Ext(Hₙ₋₁;G) when only Hₙ₋₁ ≠ 0',
    definition: 'If a chain complex A_bullet has Hₖ(A_bullet) = 0 for every k except Hₙ₋₁(A_bullet) ≠ 0, then Hⁿ(A_bullet;G) ≅ Ext(Hₙ₋₁(A_bullet), G) tautologically — because a free resolution of Hₙ₋₁ literally *is* a chain complex with this homology profile, so we may as well use it as A_bullet.',
  },

  // ────────────── §6 — Example computation of cohomology groups ──────────────
  sc74HnSm: {
    term: 'Cohomology of the sphere Hⁿ(Sᵐ)',
    definition: 'Since Hₙ(Sᵐ) is always free (it is ℤ in degrees 0 and m, and 0 otherwise, for m ≥ 1), every Ext term vanishes and Hⁿ(Sᵐ) ≅ Hom(Hₙ(Sᵐ), G): equal to G when n = m or n = 0, and 0 otherwise.',
  },
  sc74HnTorus: {
    term: 'Cohomology of the torus Hⁿ(S¹×S¹)',
    definition: 'Since Hₙ(S¹×S¹) is always free (ℤ, ℤ², ℤ in degrees 0, 1, 2), every Ext term vanishes, giving Hⁿ(S¹×S¹) ≅ Hom(Hₙ(S¹×S¹), G): equal to G for n = 0, 2 and G^⊕2 for n = 1.',
  },
  sc74H0H1Duals: {
    term: 'H⁰ and H¹ are always Hom-duals',
    definition: 'For every space X and n = 0 or n = 1: Hⁿ(X;G) ≅ Hom(Hₙ(X), G) — no Ext correction term ever appears in these two lowest degrees. This holds because H₋₁(X) = 0 trivially (handling n=0) and H₀(X) is always free (handling n=1), and Ext of anything against a free group, or Ext out of the zero group, vanishes.',
  },
  sc74HnKlein: {
    term: 'Cohomology of the Klein bottle Hⁿ(K;G)',
    definition: 'With H₀(K)=ℤ, H₁(K)=ℤ⊕ℤ/2ℤ, H₂(K)=0: H⁰(K;G) ≅ G; H¹(K;G) ≅ G ⊕ Hom(ℤ/2ℤ,G) (no Ext term, since H₀ is free); H²(K;G) ≅ Ext(ℤ⊕ℤ/2ℤ,G) ≅ G/2G (this time genuinely an Ext term, since H₁ is not free); Hⁿ(K;G) = 0 for n ≥ 3. This is the first example in the chapter where Ext actually contributes something nonzero.',
    example: 'Hom(ℤ/2ℤ,G) is the subgroup of elements of order dividing 2 in G (including 0). For G = ℤ/2ℤ itself, H²(K;ℤ/2ℤ) ≅ (ℤ/2ℤ)/2(ℤ/2ℤ) = ℤ/2ℤ, since 2(ℤ/2ℤ) = 0.',
  },

  // ────────────── §7 — Visualization of cohomology groups ──────────────
  sc74Cocycle: {
    term: 'Cocycle',
    symbol: 'Z^n(X;G)',
    definition: 'An n-cochain f ∈ Cⁿ(X;G) with δf = 0, i.e. an element of ker(Cⁿ(X;G) → Cⁿ⁺¹(X;G)). When G is a field, f is a cocycle exactly when f assigns 0 to every n-boundary.',
  },
  sc74Coboundary: {
    term: 'Coboundary',
    symbol: 'B^n(X;G)',
    definition: 'An n-cochain f ∈ Cⁿ(X;G) lying in the image of δ: Cⁿ⁻¹(X;G) → Cⁿ(X;G), i.e. f = δg for some (n−1)-cochain g. A coboundary always assigns 0 to every n-cycle, but (when G is not a field) not every cochain vanishing on cycles is itself a coboundary — that gap is exactly the Ext error term.',
  },
  sc74HomotopicSimplices: {
    term: 'Homotopic simplices (fixed boundary)',
    definition: 'Two k-simplices with the same boundary that can be continuously deformed into one another while keeping that boundary fixed. Any cocycle assigns the same value to homotopic simplices, because their difference is always a boundary.',
  },
  sc74HomologousCycles: {
    term: 'Homologous cycles',
    definition: 'Two k-cycles that map to the same class under the quotient map Zₖ(X) ↠ Hₖ(X) — equivalently, their difference is a boundary. Any cocycle assigns the same value to homologous cycles.',
  },
  sc74ErrorTermGeometric: {
    term: 'The Ext "error term," geometrically',
    definition: 'If a region eᵏ ∈ Cₖ(X) has boundary ∂eᵏ divisible by n (i.e. ∂eᵏ = n·(something)), then a cocycle\'s value on eᵏ can only be shifted by a coboundary in increments of n — so only the value modulo n is forced to be consistent across different choices of cocycle. This "leftover ambiguity modulo n" is exactly what the Ext(Hₙ₋₁(X),G) term in the universal coefficient theorem is capturing.',
  },

  // ────────────── §8 — Relative cohomology groups ──────────────
  sc74RelativeCohomology: {
    term: 'Relative cohomology groups Hⁿ(X,A;G)',
    symbol: 'H^n(X,A;G)',
    definition: 'Dualize the relative chain complex ⋯ → C₁(X,A) → C₀(X,A) → 0 with Hom(−,G) to get a cochain complex, and take its cohomology groups. These are the relative cohomology groups Hⁿ(X,A;G), the direct dual of relative homology.',
  },
  sc74ReducedCohomology: {
    term: 'Reduced cohomology groups H̃ⁿ(X;G)',
    symbol: '\\wt H^n(X;G)',
    definition: 'For a nonempty space X and a chosen point ∗ ∈ X, the reduced cohomology groups are defined as H̃ⁿ(X;G) := Hⁿ(X,{∗};G). Equivalently, they come from dualizing the augmented singular chain complex ⋯ → C₁(X) → C₀(X) → ℤ → 0 (using ε: C₀(X)→ℤ) and applying the universal coefficient theorem, which still applies since the added ℤ term is free.',
  },

  // ────────────── §9 — Problems ──────────────
  sc74RPn: {
    term: 'Real projective space ℝℙⁿ',
    symbol: '\\RP^n',
    definition: 'The space of lines through the origin in ℝⁿ⁺¹: the set of nonzero vectors in ℝⁿ⁺¹, modulo scaling by a nonzero real number. It is built from cells in every dimension 0 through n, one cell per dimension.',
    example: 'ℝℙ¹ is homeomorphic to the circle S¹. ℝℙ² is the projective plane, built from a point, a 1-cell, and a 2-cell.',
  },
  sc74DualityFieldChar0: {
    term: 'Cohomology as the dual of homology (field coefficients)',
    definition: 'For a field F of characteristic zero and a space X with finitely generated homology groups, Hᵏ(X;F) ≅ (Hₖ(X))∨ — the vector-space dual. Over a field, the Ext terms from the universal coefficient theorem all vanish (since F/nF = 0 for any nonzero integer n when char F = 0), leaving cohomology as literally the linear dual of homology.',
  },

};

export default entries;
