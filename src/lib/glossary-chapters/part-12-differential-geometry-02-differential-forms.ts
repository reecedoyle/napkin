/**
 * Chapter glossary for Part 12 Chapter 2 — Differential forms.
 *
 * This file exports the glossary entries specific to this chapter.
 * The entries are also present in src/lib/glossary.ts (required by the
 * verify-chapter.mjs verifier and the Term component at runtime).
 */
import type { GlossaryEntry } from '../glossary';

const entries: Record<string, GlossaryEntry> = {
  finDimRealVS: {
    term: 'Finite-dimensional real vector space',
    symbol: 'V',
    definition: 'A vector space over ℝ with a finite basis. In this chapter all vector spaces V are assumed finite-dimensional and equipped with an inner product unless otherwise stated.',
    example: 'ℝⁿ with the standard inner product is the prototypical example.',
  },
  smoothFunction: {
    term: 'Smooth function',
    definition: 'A function that is infinitely differentiable — every order of partial derivative exists and is continuous. Abbreviated C∞.',
    example: 'Polynomials, eˣ, sin x, cos x are smooth. The function |x| is not smooth at x = 0.',
  },
  zeroForm: {
    term: '0-form',
    symbol: 'f \\colon U \\to \\mathbb{R}',
    definition: 'A smooth real-valued function on an open set U ⊆ V. The "0" refers to integration over 0-dimensional objects (points): integrating a 0-form over a finite set of points means summing its values.',
    example: 'f(x, y) = x² + y² is a 0-form on ℝ².',
  },
  oneForm: {
    term: '1-form',
    symbol: '\\alpha \\colon U \\to V^\\vee',
    definition: 'A smooth assignment of a linear functional on tangent vectors to each point of U. At each point p, the value α_p ∈ V∨ eats a tangent vector v and returns a real number α_p(v). Linearity in v is required.',
    example: 'The total derivative Df of a function f: V → ℝ is a 1-form. In ℝ², the forms dx and dy are the two basis 1-forms.',
  },
  twoForm: {
    term: '2-form',
    symbol: '\\beta_p \\in V^\\vee \\wedge V^\\vee',
    definition: 'A smooth assignment of an antisymmetric bilinear functional to each point of U. At each point p, the value β_p takes two tangent vectors v, w and returns a signed area β_p(v, w) = −β_p(w, v).',
    example: 'In ℝ³, dx ∧ dy is a 2-form measuring the signed area of the projection of a parallelogram onto the xy-plane.',
  },
  diffKForm: {
    term: 'Differential k-form',
    symbol: '\\alpha \\colon U \\to \\bigwedge^k(V^\\vee)',
    definition: 'A smooth map from an open set U ⊆ V to the k-th exterior power of V∨. At each point p, the value α_p takes k tangent vectors and returns a real number, antisymmetrically in all inputs. A 0-form is a function, a 1-form is a field of linear functionals, and so on.',
    example: 'In ℝ³, a 2-form looks like f(p) dx∧dy + g(p) dx∧dz + h(p) dy∧dz for smooth functions f, g, h.',
  },
  exteriorPower: {
    term: 'Exterior power',
    symbol: '\\bigwedge^k(V)',
    definition: 'The k-th exterior power of a vector space V is the vector space of antisymmetric k-tensors on V. It has dimension C(n, k) when dim V = n. Elements are linear combinations of wedge products v₁ ∧ ⋯ ∧ vₖ with the relation v ∧ v = 0 (and its consequences).',
    example: 'For V = ℝ³, ⋀¹(V) ≅ ℝ³, ⋀²(V) ≅ ℝ³, and ⋀³(V) ≅ ℝ — a single "volume" element.',
  },
  wedgeProduct: {
    term: 'Wedge product',
    symbol: '\\alpha \\wedge \\beta',
    definition: 'An associative, graded-antisymmetric product on differential forms: if α is a k-form and β is an ℓ-form, then α ∧ β is a (k+ℓ)-form. It satisfies α ∧ β = (−1)^{kℓ} β ∧ α. The wedge product encodes the antisymmetric, oriented nature of multidimensional measurement.',
    example: 'dx ∧ dy = −dy ∧ dx. In ℝ², dx ∧ dy is the area element, and (dx ∧ dy)(e₁, e₂) = 1.',
  },
  linearFunctional: {
    term: 'Linear functional',
    symbol: '\\xi \\in V^\\vee',
    definition: 'A linear map from a vector space V to its base field ℝ. The set of all linear functionals on V forms the dual space V∨. For finite-dimensional V, dim V∨ = dim V.',
    example: 'For V = ℝ², the map (x, y) ↦ 3x − 2y is a linear functional.',
  },
  exteriorDerivative: {
    term: 'Exterior derivative',
    symbol: 'd\\alpha',
    definition: 'An operator d sending k-forms to (k+1)-forms. For a 0-form f it equals the total derivative Df. For a general k-form written in coordinates it is defined by d(Σ f_I de_I) = Σ df_I ∧ de_I. It satisfies d² = 0 and a graded Leibniz rule for wedge products.',
    example: 'For f(x,y) = xy on ℝ², df = y dx + x dy. Applying d again: d(df) = dy∧dx + dx∧dy = 0.',
  },
  stokesTheorem: {
    term: "Stokes' theorem",
    symbol: '\\int_c d\\alpha = \\int_{\\partial c} \\alpha',
    definition: "The theorem that the integral of dα over an oriented manifold-with-boundary c equals the integral of α over the boundary ∂c. Unifies the fundamental theorem of calculus (k=0), Green's theorem (k=1 in ℝ²), and the classical Stokes' theorem (k=2 in ℝ³).",
    example: 'For a 0-form f and curve c from a to b: ∫_c df = f(b) − f(a).',
  },
  alternationMap: {
    term: 'Alternation map',
    symbol: '\\operatorname{Alt}',
    definition: 'The map Alt: T^k(V) → T^k(V) that symmetrizes a tensor into its antisymmetric part: Alt(f₁⊗⋯⊗fₖ) = (1/k!) Σ_{σ∈Sₖ} sgn(σ) f_{σ(1)}⊗⋯⊗f_{σ(k)}. It provides a canonical representative in each equivalence class of the wedge quotient.',
    example: 'Alt(e₁ ⊗ e₂) = (e₁⊗e₂ − e₂⊗e₁)/2 in ℝ².',
  },
  oneDensity: {
    term: '1-density',
    symbol: '\\omega_p(v)',
    definition: 'A function assigning to each (point, vector) pair (p, v) a non-negative number ω_p(v), satisfying ω_p(λv) = λω_p(v) for all λ ≥ 0 (but not necessarily for negative λ). The arc-length element ds is a 1-density but not a 1-form.',
    example: 'ds_p(v) = ‖v‖ is the arc-length density. Unlike 1-forms, ds_p(−v) = ‖v‖ = ds_p(v) ≠ −ds_p(v).',
  },
  closedForm: {
    term: 'Closed form',
    symbol: 'd\\alpha = 0',
    definition: 'A differential k-form α is closed if its exterior derivative vanishes: dα = 0. Every exact form is closed (since d² = 0), but a closed form need not be exact on domains with nontrivial topology.',
    example: 'The angle form (−y dx + x dy)/(x²+y²) on ℝ²∖{0} is closed but not exact.',
  },
  exactForm: {
    term: 'Exact form',
    symbol: '\\alpha = d\\beta',
    definition: 'A differential k-form α is exact if there exists a (k−1)-form β with dβ = α. Exact forms are automatically closed. Whether every closed form is exact depends on the topology of the domain.',
    example: 'The form f dx + g dy on ℝ² is exact if and only if ∂g/∂x = ∂f/∂y (and the domain is simply connected).',
  },
  angleForm: {
    term: 'Angle form',
    symbol: '\\frac{-y\\,dx + x\\,dy}{x^2 + y^2}',
    definition: 'The 1-form on ℝ²∖{0} defined by α = (−y dx + x dy)/(x²+y²). It measures infinitesimal change in polar angle θ — intuitively "dθ" — and is the prototype of a closed but not exact form. Integrating α around a loop encircling the origin gives 2π times the winding number.',
    example: 'On the unit circle, α integrates to 2π going counterclockwise, reflecting one full turn of angle.',
  },
  deRhamCohomology: {
    term: 'de Rham cohomology',
    symbol: 'H^k_{\\mathrm{dR}}(U)',
    definition: 'For an open set U, the k-th de Rham cohomology group is the quotient of closed k-forms by exact k-forms. It is a topological invariant measuring the "holes" of U in dimension k. A nonzero element represents a closed form that cannot be written as an exact form.',
    example: 'H¹_dR(ℝ²∖{0}) ≅ ℝ, generated by the angle form. H^k_dR(ℝⁿ) = 0 for k > 0 (Poincaré lemma).',
  },
};

export default entries;
