/**
 * Glossary entries for Chapter 46 — A bit of manifolds
 * (Part 12 — Differential Geometry)
 *
 * All keys here are also registered in src/lib/glossary.ts so that
 * the verify-chapter script and the Term component can find them.
 */
import type { GlossaryEntry } from '@/lib/glossary';

const entries: Record<string, GlossaryEntry> = {
  // ── §1 Topological manifolds ──
  topologicalManifold: {
    term: 'Topological n-manifold',
    symbol: 'M',
    definition: 'A Hausdorff topological space with an open cover {Uᵢ}, each homeomorphic to an open subset Eᵢ of ℝⁿ. Think: a space that looks locally flat, like the surface of the Earth looks like ℝ² to a person standing on it.',
    example: 'The sphere S² is a 2-manifold; the circle S¹ is a 1-manifold; ℝⁿ is trivially an n-manifold.',
  },
  chart: {
    term: 'Chart',
    symbol: '\\phi_i \\colon U_i \\to E_i',
    definition: 'A homeomorphism φᵢ from an open set Uᵢ in a manifold M to an open subset Eᵢ of ℝⁿ. Like a map of a region of the Earth: it distorts globally, but locally captures the shape faithfully.',
    example: 'Stereographic projection from the north pole maps S² \\ {N} → ℝ² and serves as one chart for S².',
  },
  atlas: {
    term: 'Atlas',
    symbol: '\\{U_i \\xrightarrow{\\phi_i} E_i\\}',
    definition: 'A collection of charts {φᵢ: Uᵢ → Eᵢ} whose domains Uᵢ cover the manifold M. Just as a geographic atlas covers the whole globe with overlapping maps, a manifold atlas covers M with overlapping charts.',
    example: 'Two stereographic projections (from north and south poles) form an atlas for S².',
  },
  // ── §2 Smooth manifolds ──
  transitionMap: {
    term: 'Transition map',
    symbol: '\\phi_{ij}',
    definition: 'For two overlapping charts φᵢ and φⱼ, the transition map φᵢⱼ = φⱼ ∘ φᵢ⁻¹ expresses how to pass from chart i to chart j over their overlap. It is a map between open subsets of ℝⁿ.',
    example: 'On S¹ covered by two open arcs, the transition maps are the two changes-of-coordinate on the overlapping ends.',
  },
  smoothManifold: {
    term: 'Smooth manifold',
    symbol: 'M',
    definition: 'A topological manifold M whose atlas has the property that all transition maps φᵢⱼ are smooth (infinitely differentiable) as functions between open subsets of ℝⁿ.',
    example: 'Every topological manifold listed in §1 (S², S¹, torus, ℝⁿ) carries a natural smooth structure.',
  },
  smoothMap: {
    term: 'Smooth map between manifolds',
    symbol: 'f \\colon M \\to N',
    definition: 'A continuous map f: M → N between smooth manifolds such that in every pair of charts, the coordinate representation φⱼ ∘ f ∘ φᵢ⁻¹ is smooth as a map between open subsets of Euclidean space.',
    example: 'The inclusion S¹ ↪ ℝ² is a smooth map. Every rotation of S² is smooth.',
  },
  // ── §3 Regular value theorem ──
  regularValueThm: {
    term: 'Regular value theorem',
    definition: 'If f₁, …, fₘ: U → ℝ are smooth functions on an open subset U of ℝⁿ, and the common zero set M = {f₁ = ··· = fₘ = 0} is nonempty with the Jacobian map having full rank m at every point of M, then M is a smooth manifold of dimension n − m.',
    example: 'The unit circle {x² + y² − 1 = 0} ⊆ ℝ² is a 1-manifold by the regular value theorem (the gradient (2x, 2y) is nonzero on the circle).',
  },
  levelHypersurface: {
    term: 'Level hypersurface',
    symbol: '\\{f = 0\\}',
    definition: 'The zero set of a single smooth function f: U → ℝ, where U ⊆ ℝⁿ is open. If f is smooth and its differential Df is nonzero at every point of the zero set, the zero set is a smooth manifold of dimension n − 1.',
    example: '{x² + y² + z² = 1} is a level hypersurface (the unit sphere S²) of f(x,y,z) = x² + y² + z² − 1.',
  },
  // ── §4 Differential forms on manifolds ──
  diffFormOnManifold: {
    term: 'Differential k-form on a manifold',
    symbol: '\\alpha',
    definition: 'A collection {αᵢ} of differential k-forms, one on each chart domain Eᵢ, that are compatible under pullbacks of transition maps: αⱼ = φᵢⱼ*(αᵢ). Extends the notion of a differential form from open subsets of ℝⁿ to manifolds.',
    example: 'A smooth function f: M → ℝ is a 0-form on M. The volume form on S² is a nowhere-vanishing 2-form.',
  },
  pullback: {
    term: 'Pullback of a differential form',
    symbol: '\\phi^*(\\alpha)',
    definition: 'Given a smooth map φ: M → N and a k-form α on N, the pullback φ*(α) is a k-form on M defined by (φ*α)_p(v₁,…,vₖ) = α_{φ(p)}(dφ_p(v₁),…,dφ_p(vₖ)). It transports forms backwards along φ.',
    example: 'If φ: ℝ² → ℝ³ parametrises a surface and α is a 2-form on ℝ³, then φ*(α) is a 2-form on ℝ² — the form "pulled back" to parameter space.',
  },
  // ── §5 Orientations ──
  orientableManifold: {
    term: 'Orientable manifold',
    symbol: 'M',
    definition: 'A smooth n-manifold M that admits a nowhere-vanishing differential n-form ω (a volume form). Orientability means we can consistently choose a "positive" side at every point; non-orientable spaces like the Möbius strip do not admit such a global choice.',
    example: 'Spheres Sⁿ, planes, and the torus are orientable. The Möbius strip and Klein bottle are not.',
  },
  volumeForm: {
    term: 'Volume form',
    symbol: '\\omega',
    definition: 'A nowhere-vanishing differential n-form on a smooth n-manifold M — i.e., ω_p ≠ 0 for every p ∈ M. Its existence is equivalent to orientability. It determines a consistent notion of "signed volume" at every point.',
    example: 'On ℝⁿ, dx₁ ∧ ··· ∧ dxₙ is the standard volume form. On S², the area element is a volume form.',
  },
  tangentPlane: {
    term: 'Tangent plane (tangent space)',
    symbol: 'T_p(M)',
    definition: 'The n-dimensional vector space at a point p ∈ M that captures the "directions you can move" in M near p. For a surface in ℝ³ this is the usual geometric tangent plane; in general it is defined abstractly via derivations.',
    example: 'At any point of S² ⊆ ℝ³, the tangent plane is the plane in ℝ³ perpendicular to the radius vector.',
  },
  // ── §6 Stokes theorem ──
  manifoldWithBoundary: {
    term: 'Manifold with boundary',
    symbol: '(M, \\partial M)',
    definition: 'A topological space M that locally looks like ℝⁿ (in the interior) or like a half-space (on the boundary). The boundary ∂M is an (n−1)-dimensional manifold. If M is oriented, its boundary inherits a canonical orientation.',
    example: 'The closed disk D² has boundary S¹. The closed interval [0,1] has boundary {0,1}.',
  },
  supportForm: {
    term: 'Support of a differential form',
    symbol: '\\operatorname{supp}(\\alpha)',
    definition: 'The closure of the set of points where the form is nonzero: supp(α) = closure({p ∈ M : α_p ≠ 0}). If this set is compact, α is said to be compactly supported.',
    example: 'A bump function on ℝ compactly supported in (0,1) is a 0-form with compact support. Every form on a compact manifold is automatically compactly supported.',
  },
  compactlySupported: {
    term: 'Compactly supported form',
    definition: 'A differential form on a manifold whose support is a compact set. Integration of compactly supported forms on oriented manifolds is well-defined, avoiding convergence issues at infinity.',
    example: 'On ℝⁿ, f(x)dx₁ ∧ ··· ∧ dxₙ is compactly supported if f is a smooth function that vanishes outside some bounded set.',
  },
  stokesManifold: {
    term: "Stokes' theorem (for manifolds)",
    symbol: '\\int_M d\\alpha = \\int_{\\partial M} \\alpha',
    definition: "For a smooth oriented n-manifold M with boundary and a compactly supported (n−1)-form α, the integral of dα over M equals the integral of α over the oriented boundary ∂M. Unifies the fundamental theorem of calculus, Green's theorem, and the classical Stokes' theorem.",
    example: "If M = [a,b] ⊆ ℝ and α = f is a 0-form (function), Stokes' theorem reduces to ∫ₐᵇ f′ dx = f(b) − f(a).",
  },
  // ── §7 Tangent and cotangent space ──
  derivation: {
    term: 'Derivation (at a point)',
    symbol: 'D \\colon C^\\infty(M) \\to \\RR',
    definition: 'A linear map D from smooth functions on M to ℝ that satisfies the Leibniz (product) rule: D(fg) = f(p)·D(g) + g(p)·D(f). Derivations at p are identified with tangent vectors at p, giving a coordinate-free definition of the tangent space.',
    example: 'For M = ℝⁿ and p = 0, the map D = ∂/∂xᵢ|₀ (partial derivative in direction i) is a derivation.',
  },
  tangentSpace: {
    term: 'Tangent space',
    symbol: 'T_p(M)',
    definition: 'The vector space of all derivations at a point p of a smooth manifold M. For an n-dimensional manifold, T_p(M) has dimension n. This coordinate-free definition makes the tangent space intrinsic — independent of any ambient space.',
    example: 'At a point of S² ⊆ ℝ³, the tangent space T_p(S²) is 2-dimensional.',
  },
  cotangentSpace: {
    term: 'Cotangent space',
    symbol: '\\mathfrak{m}_p / \\mathfrak{m}_p^2',
    definition: 'The dual of the tangent space T_p(M). Concretely, it can be defined as 𝔪_p/𝔪_p² where 𝔪_p is the ideal of smooth functions vanishing at p. The cotangent space is the natural home for differential forms at p.',
    example: 'At p ∈ ℝⁿ, the cotangent space has basis dx₁|_p, …, dxₙ|_p — the differentials of coordinate functions.',
  },
  maximalIdealGerm: {
    term: 'Maximal ideal at a point',
    symbol: '\\mathfrak{m}_p',
    definition: 'The ideal 𝔪_p = {f ∈ C∞(M) : f(p) = 0} of smooth functions vanishing at a point p. Its square 𝔪_p² = {Σ fᵢgᵢ : fᵢ(p) = gᵢ(p) = 0} consists of functions vanishing to second order. The cotangent space is 𝔪_p/𝔪_p².',
    example: 'On ℝ with p = 0, 𝔪_0 consists of functions with f(0) = 0. A basis for 𝔪_0/𝔪_0² is the class [x], since x vanishes at 0 but x²/2 only vanishes to second order.',
  },
};

export default entries;
