/**
 * Chapter glossary for Part 13 Chapter 3 — Affine and projective plane curves.
 *
 * Keys are prefixed with rs49 to guarantee portal-wide uniqueness.
 * This file is merged at build time via import.meta.glob in src/lib/glossary.ts.
 */
import type { GlossaryEntry } from '../glossary';

const entries: Record<string, GlossaryEntry> = {
  // ────────────── §1 — Affine plane curves ──────────────
  rs49smoothPoint: {
    term: 'Smooth (nonsingular) point',
    definition: 'A point (z₀, w₀) on a curve X = {f = 0} where at least one of ∂f/∂z or ∂f/∂w is nonzero. The implicit function theorem then gives a local analytic parametrisation, so X looks like a smooth 1-dimensional complex manifold near (z₀, w₀).',
    example: 'On the circle z² + w² = 1, every point is smooth because ∂f/∂z = 2z and ∂f/∂w = 2w cannot both vanish on the circle.',
  },
  rs49complexChart: {
    term: 'Complex chart',
    symbol: '\\phi: U \\to \\mathbb{C}',
    definition: 'A homeomorphism from an open subset U of a Riemann surface to an open subset of ℂ. On a smooth affine curve {f = 0}, the chart is given by projection: φ(z,w) = w where ∂f/∂z ≠ 0, or φ(z,w) = z where ∂f/∂w ≠ 0.',
    example: 'On the parabola w = z², ∂f/∂w = 1 ≠ 0 everywhere, so φ(z,w) = z is a single chart covering the whole curve.',
  },
  rs49affineCurve: {
    term: 'Smooth affine plane curve',
    symbol: 'X = \\{f = 0\\} \\subseteq \\mathbb{C}^2',
    definition: 'The zero set X = {(z,w) ∈ ℂ² : f(z,w) = 0} of a polynomial f ∈ ℂ[z,w], when X is connected and every point of X is smooth (at least one partial derivative of f is nonzero there). X inherits a Riemann surface structure from the implicit function theorem.',
    example: 'The parabola w = z², the complex circle z² + w² = 1, and the elliptic curve w² = z³ − z are all smooth affine plane curves.',
  },
  rs49ellipticCurve: {
    term: 'Elliptic curve',
    definition: 'A smooth affine (or projective) plane curve of the form w² = p(z) where p is a cubic with distinct roots. As a Riemann surface it has genus 1 — topologically a torus — and is not isomorphic to ℂ or ℂ∖{0}.',
    example: 'The curve w² = z³ − z is an elliptic curve. Its three roots z = −1, 0, 1 are distinct, so the curve is smooth.',
  },

  // ────────────── §2 — The projective line ──────────────
  rs49CP1: {
    term: 'Projective line ℂℙ¹',
    symbol: '\\mathbb{CP}^1',
    definition: 'The set of complex lines through the origin in ℂ². Formally, ℂℙ¹ = (ℂ² ∖ {0}) / ∼ where (x,y) ∼ (λx, λy) for any λ ≠ 0. A point in ℂℙ¹ is an equivalence class [x:y]. As a Riemann surface, ℂℙ¹ is isomorphic to the Riemann sphere ℂ∞.',
    example: '[1:0] and [2:0] represent the same point in ℂℙ¹. The class [1:y] for y ∈ ℂ covers all points with nonzero first coordinate, giving a copy of ℂ.',
  },
  rs49homogeneousCoords: {
    term: 'Homogeneous coordinates',
    symbol: '[x : y]',
    definition: 'Notation for points in projective space. The pair [x:y] denotes the equivalence class of (x,y) under scaling: [x:y] = [λx:λy] for any λ ≠ 0. Only the ratio x:y is meaningful.',
    example: '[1:2] = [2:4] = [−1:−2] are the same point in ℂℙ¹.',
  },

  // ────────────── §3 — Projective plane curves ──────────────
  rs49CP2: {
    term: 'Projective plane ℂℙ²',
    symbol: '\\mathbb{CP}^2',
    definition: 'The set of complex lines through the origin in ℂ³, equivalently (ℂ³ ∖ {0}) / ∼ where (x,y,z) ∼ (λx,λy,λz) for λ ≠ 0. Points are written [x:y:z]. It is a compact 2-dimensional complex manifold covered by three affine charts.',
    example: 'The three standard charts φ₀([x:y:z]) = (y/x, z/x), φ₁([x:y:z]) = (x/y, z/y), φ₂([x:y:z]) = (x/z, y/z) cover ℂℙ².',
  },
  rs49homogeneousPoly: {
    term: 'Homogeneous polynomial',
    symbol: 'f(\\lambda x, \\lambda y, \\lambda z) = \\lambda^d f(x,y,z)',
    definition: 'A polynomial f(x,y,z) in which every monomial has the same total degree d. Scaling (x,y,z) by λ multiplies f by λᵈ. This makes the zero set {f = 0} well-defined in ℂℙ², since f(λx,λy,λz) = 0 iff f(x,y,z) = 0.',
    example: 'f(x,y,z) = x³ − xz² − y²z is homogeneous of degree 3: every term has degree 3.',
  },
  rs49projectiveCurve: {
    term: 'Smooth projective plane curve',
    symbol: 'X = \\{[x:y:z] \\in \\mathbb{CP}^2 : g(x,y,z) = 0\\}',
    definition: 'The zero set in ℂℙ² of a homogeneous polynomial g, when X is connected and smooth at every point. Each intersection of X with an affine chart Uᵢ is a smooth affine plane curve. Projective curves are compact, unlike their affine counterparts.',
    example: 'The homogenisation of w² = z³ − z gives g(x,y,z) = x³ − xz² − y²z, whose zero set in ℂℙ² is a compact elliptic curve.',
  },
  rs49homogenisation: {
    term: 'Homogenisation of a polynomial',
    definition: 'Given f(z,w) of degree d, its homogenisation is g(x,y,z) = zᵈ · f(x/z, y/z). This replaces z ↦ x/z, w ↦ y/z and clears denominators, producing a homogeneous polynomial with g(x,y,1) = f(x,y).',
    example: 'For f(z,w) = w² − z³ + z: g(x,y,z) = y² − x³ + xz² (after dividing out a factor of z).',
  },
  rs49hyperellipticCurve: {
    term: 'Hyperelliptic curve',
    definition: 'A smooth projective curve of the form w² = p(z) where p is a polynomial of degree 2k+1 or 2k+2 with distinct roots. Its genus equals k. Hyperelliptic curves realise compact Riemann surfaces of all genera k ≥ 1.',
    example: 'w² = (z−x₁)(z−x₂)(z−x₃)(z−x₄)(z−x₅) with distinct xᵢ gives a hyperelliptic curve of genus 2.',
  },

  // ────────────── §5 — Nodes ──────────────
  rs49node: {
    term: 'Node (ordinary double point)',
    definition: 'A singular point of a plane curve where two smooth branches cross transversally. Locally the curve looks like two lines crossing, as in the equation x² − y² = 0. Also called an ordinary double point or a simple node.',
    example: 'The curve x² − y² = 0 has a node at the origin: it factors as (x−y)(x+y) = 0, giving two distinct branches y = x and y = −x crossing at 0.',
  },
  rs49singularPoint: {
    term: 'Singular point of a curve',
    definition: 'A point (z₀, w₀) on a curve X = {f = 0} where both ∂f/∂z and ∂f/∂w vanish. At such a point the implicit function theorem fails and X is not locally a smooth manifold.',
    example: 'The origin (0,0) is the unique singular point of the curve x² − y² = 0, since ∂f/∂x = 2x = 0 and ∂f/∂y = −2y = 0 both vanish there.',
  },
};

export default entries;
