/**
 * Chapter glossary for Part 13 Chapter 1 — Basic definitions of Riemann surfaces.
 *
 * Keys are prefixed with rs47 to guarantee portal-wide uniqueness.
 */
import type { GlossaryEntry } from '../glossary';

const entries: Record<string, GlossaryEntry> = {
  // ── §1 Complex structures ──────────────────────────────────────────
  rs47genus: {
    term: 'Genus of a Riemann surface',
    symbol: 'g',
    definition: 'The number of "handles" on a compact orientable surface, viewed as a real 2-manifold. A sphere has genus 0, a torus has genus 1, a surface with two holes has genus 2.',
    example: 'An elliptic curve viewed as a Riemann surface has genus 1.',
  },
  rs47hyperellipticCurve: {
    term: 'Hyperelliptic curve',
    definition: 'A Riemann surface of genus g ≥ 2 that arises as a double cover of the Riemann sphere, branched at finitely many points. Generalises elliptic curves to higher genus.',
    example: 'The curve defined by y² = x⁵ − x is a hyperelliptic curve of genus 2.',
  },
  // ── §2 Riemann surface ────────────────────────────────────────────
  rs47riemannSurface: {
    term: 'Riemann surface',
    definition: 'A connected second-countable Hausdorff space equipped with a complex atlas: countably many homeomorphisms from open sets to open subsets of ℂ whose transition maps are analytic.',
    example: 'Any connected open subset of ℂ, the Riemann sphere ℂ∞, and the complex torus ℂ/ℤ[i] are all Riemann surfaces.',
  },
  rs47complexChart: {
    term: 'Complex chart',
    symbol: '\\phi_i \\colon U_i \\to E_i \\subseteq \\CC',
    definition: 'A homeomorphism from an open set Uᵢ on a Riemann surface to an open subset Eᵢ of ℂ. Gives a local identification of the surface with the complex plane.',
    example: 'Stereographic projection from the Riemann sphere to the complex plane is a complex chart.',
  },
  rs47complexAtlas: {
    term: 'Complex atlas',
    definition: 'A collection of complex charts {φᵢ : Uᵢ → Eᵢ} that cover the whole space, such that all transition maps are analytic.',
    example: 'The two stereographic projection charts on the Riemann sphere form a complex atlas.',
  },
  rs47transitionMap: {
    term: 'Transition map',
    symbol: '\\phi_{ij}',
    definition: 'For two overlapping charts φᵢ and φⱼ on a Riemann surface, the transition map φᵢⱼ = φⱼ ∘ φᵢ⁻¹ converts between their local coordinates on the overlap Uᵢ ∩ Uⱼ. For a Riemann surface, transition maps must be analytic.',
    example: 'On the Riemann sphere, the transition map between the two stereographic charts is z ↦ 1/z, which is analytic on ℂ \\ {0}.',
  },
  rs47complexStructure: {
    term: 'Complex structure',
    definition: 'The extra data on a topological space given by a compatible complex atlas. A Riemann surface is a topological space together with a complex structure.',
  },
  rs47localCoordinate: {
    term: 'Local coordinate',
    symbol: 'z = \\phi(x)',
    definition: 'For a point x in a chart domain U with chart φ : U → ℂ, the value z = φ(x) is the local coordinate of x. It identifies x with a complex number, making the local geometry of the surface look like ℂ.',
    example: 'On the Riemann sphere, the local coordinate given by stereographic projection from the south pole sends the "north hemisphere" to complex numbers with |z| > 1.',
  },
  rs47centeredCoordinate: {
    term: 'Centered local coordinate',
    definition: 'A local coordinate z = φ(x) centered at a point p means φ(p) = 0, so the point p corresponds to the origin in the local copy of ℂ.',
    example: 'On the Riemann sphere, the chart φ₁ (stereographic from north) gives a coordinate centered at the south pole S, because φ₁(S) = 0.',
  },
  // ── §3 Complex manifold ───────────────────────────────────────────
  rs47complexManifold: {
    term: 'Complex n-manifold',
    definition: 'A Hausdorff space covered by countably many open sets homeomorphic to open subsets of ℂⁿ, with all transition maps analytic. A complex n-manifold is naturally a smooth real 2n-manifold.',
    example: 'A Riemann surface is a complex 1-manifold. Projective space ℂPⁿ is a complex n-manifold.',
  },
  // ── §4 Examples ───────────────────────────────────────────────────
  rs47riemannSphere: {
    term: 'Riemann sphere',
    symbol: '\\CC_\\infty',
    definition: 'The one-point compactification of ℂ, written ℂ∞ = ℂ ∪ {∞}. As a smooth manifold it is the 2-sphere S². Its complex structure is given by two stereographic projection charts whose transition map is z ↦ 1/z.',
    example: 'Rational functions ℂ → ℂ∞ that send finitely many points to ∞ (i.e. have poles) are best viewed as holomorphic maps into the Riemann sphere.',
  },
  rs47stereographicProjection: {
    term: 'Stereographic projection',
    definition: 'A map from a sphere (minus one pole) to a plane, obtained by drawing lines from the pole through each point of the sphere to the plane. It is a conformal (angle-preserving) bijection.',
    example: 'Projecting the unit sphere minus the north pole onto the equatorial plane sends the south pole to the origin and the equator to the unit circle.',
  },
  rs47complexTorus: {
    term: 'Complex torus',
    symbol: '\\CC/L',
    definition: 'The quotient of ℂ by a lattice L (a discrete additive subgroup). The quotient map ℂ → ℂ/L induces a natural complex structure. As a real surface, ℂ/L is homeomorphic to a torus.',
    example: 'The quotient ℂ/ℤ[i] identifies points that differ by a Gaussian integer a + bi. The fundamental domain is the unit square.',
  },
  rs47lattice: {
    term: 'Lattice in ℂ',
    symbol: 'L \\subset \\CC',
    definition: 'A discrete additive subgroup of ℂ of the form L = ℤω₁ + ℤω₂ where ω₁, ω₂ are ℝ-linearly independent complex numbers.',
    example: 'ℤ[i] = {a + bi : a, b ∈ ℤ} is the Gaussian integer lattice, generated by ω₁ = 1 and ω₂ = i.',
  },
};

export default entries;
