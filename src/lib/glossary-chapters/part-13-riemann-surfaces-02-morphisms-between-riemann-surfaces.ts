import type { GlossaryEntry } from '@/lib/glossary';

// ────────────── Chapter 48 — Morphisms between Riemann surfaces ──────────────

const entries: Record<string, GlossaryEntry> = {
  rs48riemannSurface: {
    term: 'Riemann surface',
    definition: 'A one-dimensional complex manifold: a Hausdorff space that looks locally like an open subset of ℂ, with holomorphic transition maps. The complex plane ℂ and the Riemann sphere ℂ∞ are the two simplest examples.',
    example: 'ℂ itself, ℂ∞ = ℂ ∪ {∞}, and the complex torus ℂ/Λ are all Riemann surfaces.',
  },
  rs48morphism: {
    term: 'Morphism of Riemann surfaces',
    definition: 'A holomorphic map f: X → Y between Riemann surfaces — one that is holomorphic in every pair of compatible local charts. Equivalently, f looks like a holomorphic function ℂ → ℂ in local coordinates at every point.',
    example: 'The map z ↦ z³ on ℂ is a morphism. So is the embedding ℂ ↪ ℂ∞.',
  },
  rs48holomorphicAtP: {
    term: 'Holomorphic at a point p',
    definition: 'A map f: X → Y between Riemann surfaces is holomorphic at p ∈ X if the chart-conjugated map φ₂ ∘ f ∘ φ₁⁻¹ is holomorphic (as a ℂ→ℂ function) at the local coordinate φ₁(p), for some (equivalently any) compatible charts φ₁ on X near p and φ₂ on Y near f(p).',
  },
  rs48riemannSphere: {
    term: 'Riemann sphere ℂ∞',
    symbol: '\\CC_\\infty',
    definition: 'The one-point compactification ℂ ∪ {∞} of the complex plane, given the structure of a Riemann surface. It is compact; every meromorphic function on a compact Riemann surface extends to a holomorphic map into ℂ∞.',
    example: 'The function 1/z, viewed as a map ℂ∞ → ℂ∞, sends 0 to ∞ and ∞ to 0 — holomorphic everywhere on ℂ∞.',
  },
  rs48meromorphicFunction: {
    term: 'Meromorphic function',
    definition: 'A function that is holomorphic everywhere except at isolated poles. On a compact Riemann surface X, meromorphic functions f: X → ℂ correspond exactly to nonconstant holomorphic maps g: X → ℂ∞ (by sending poles to ∞).',
    example: '1/z is meromorphic on ℂ with a single pole at 0. (x+1)/(x+2) is meromorphic with a pole at −2.',
  },
  rs48degreeMap: {
    term: 'Degree of a holomorphic map',
    symbol: '\\deg(f)',
    definition: 'For a nonconstant holomorphic map f: X → Y between compact Riemann surfaces, the degree deg(f) is the total multiplicity of the preimage of any point y ∈ Y. It is well-defined: the total multiplicity is the same for every y.',
    example: 'The map z ↦ zᵏ from ℂ∞ to ℂ∞ has degree k.',
  },
  rs48multiplicityMap: {
    term: 'Multiplicity of a map at a point',
    symbol: '\\mult_p(f)',
    definition: 'For a nonconstant holomorphic map f: X → Y, the multiplicity mult_p(f) is the unique integer m ≥ 1 such that in suitable local charts centered at p and f(p), the map looks like z ↦ zᵐ. When m > 1, the point p is a ramification point.',
    example: 'mult_0(z ↦ z⁵+1) = 5, since z⁵+1 − 1 = z⁵ vanishes to order 5 at z = 0.',
  },
  rs48ramificationPoint: {
    term: 'Ramification point',
    definition: 'A point p in the domain of a nonconstant holomorphic map f where mult_p(f) > 1 — the map is locally m-to-1 rather than 1-to-1 near p. The image f(p) is called a branch point.',
    example: 'For z ↦ z², the point 0 is a ramification point (multiplicity 2) and 0 = 0² is its branch point.',
  },
  rs48branchPoint: {
    term: 'Branch point',
    definition: 'The image f(p) of a ramification point p under a holomorphic map f. Near a branch point, multiple preimage sheets of f come together. Branch points are where the fiber structure is not locally trivial.',
    example: 'For z ↦ z², the value 0 is the branch point — every nonzero value has exactly 2 preimages, but 0 has just 1 (with multiplicity 2).',
  },
  rs48orderMeromorphic: {
    term: 'Order of a meromorphic function at a point',
    symbol: '\\operatorname{ord}_p(f)',
    definition: 'For a meromorphic function f on a Riemann surface, ord_p(f) is a positive integer if p is a zero (the order of vanishing), a negative integer if p is a pole (minus the order of the pole), and 0 if f is nonzero and holomorphic at p.',
    example: 'For f(x) = (x+1)²/(x+2), we have ord_{-1}(f) = 2 (zero of order 2) and ord_{-2}(f) = −1 (simple pole).',
  },
  rs48identityTheorem: {
    term: 'Identity theorem for Riemann surfaces',
    definition: 'If two holomorphic maps f, g: X → Y between Riemann surfaces agree on a nonempty open subset of the connected Riemann surface X, then f = g everywhere on X. Holomorphic maps are completely determined by their values on any open patch.',
  },
  rs48rigidity: {
    term: 'Rigidity of holomorphic maps',
    definition: 'The principle that holomorphic maps between Riemann surfaces are uniquely determined by their values on any open set. This is much stronger than the analogous statement for smooth maps, which can be locally modified without affecting the rest of the map.',
  },
};

export default entries;
