/**
 * Glossary entries for Chapter 45 — Integrating differential forms.
 * Keys are also registered in src/lib/glossary.ts (required for the
 * verify-chapter.mjs Term-key checker).
 */
import type { GlossaryEntry } from '../glossary';

const entries: Record<string, GlossaryEntry> = {
  parametrizedCurve: {
    term: 'Parametrized curve',
    symbol: 'c \\colon [a,b] \\to U',
    definition:
      'A smooth function c from an interval [a, b] into an open subset U of a vector space V. The tangent vector at time t is c′(t) = (Dc)_t(1) ∈ V.',
    example: 'The unit circle can be parametrized by c(t) = (cos t, sin t) for t ∈ [0, 2π].',
  },
  pullback: {
    term: 'Pullback of a differential form',
    symbol: '\\phi^\\ast \\alpha',
    definition:
      'Given a smooth map φ: U → U′ and a k-form α on U′, the pullback φ*α is the k-form on U defined by (φ*α)_p(v₁, …, vₖ) = α_{φ(p)}((Dφ)_p(v₁), …, (Dφ)_p(vₖ)).',
    example:
      'If c: [a,b] → U is a curve and α is a 1-form, then ∫_c α = ∫_{[a,b]} c*α.',
  },
  kCell: {
    term: 'k-cell',
    symbol: 'c \\colon [0,1]^k \\to V',
    definition:
      'A smooth function from a product of intervals into a real vector space V. A 1-cell is a curve, a 2-cell is a surface patch.',
    example:
      'The map (r, θ) ↦ (r cos θ, r sin θ) on [0,R] × [0,2π] is a 2-cell parametrizing a disk.',
  },
  volumeForm: {
    term: 'Volume form',
    symbol: 'dx_1 \\wedge \\dots \\wedge dx_k',
    definition:
      'The k-form on ℝᵏ defined by p ↦ e₁∨ ∧ ⋯ ∧ eₖ∨. Integrating it over a k-cell gives the signed k-dimensional volume.',
  },
  reparametrization: {
    term: 'Reparametrization',
    symbol: '\\phi',
    definition:
      'A bijective smooth map between parameter boxes whose derivative is everywhere invertible. Preserves orientation if det(Dφ) > 0, reverses it if det(Dφ) < 0.',
  },
  kChain: {
    term: 'k-chain',
    symbol: 'c = a_1 c_1 + \\dots + a_m c_m',
    definition:
      'A formal real linear combination of k-cells. Integration extends by linearity: ∫_c α = Σᵢ aᵢ ∫_{cᵢ} α.',
  },
  cellBoundary: {
    term: 'Boundary of a cell',
    symbol: '\\partial c',
    definition:
      'The (k−1)-chain formed by the oriented faces of a k-cell. For a 1-cell c: [a,b] → V the boundary is {c(b)} − {c(a)}.',
    example: 'The boundary of a square traverses its four edges counterclockwise.',
  },
  boundarySquaredZero: {
    term: 'Boundary of a boundary is zero',
    symbol: '\\partial^2 = 0',
    definition:
      'For any k-chain c, ∂(∂c) = 0. Geometric analogue of d² = 0 for the exterior derivative.',
  },
  stokesThm: {
    term: "Stokes' theorem for cells",
    symbol: '\\int_c d\\alpha = \\int_{\\partial c} \\alpha',
    definition:
      "For a k-cell c and a (k−1)-form α: ∫_c dα = ∫_{∂c} α. Unifies the fundamental theorem of calculus, Green's theorem, the classical Stokes' theorem, and the divergence theorem.",
  },
  hodgeStar: {
    term: 'Hodge star operator',
    symbol: '\\star',
    definition:
      'An isomorphism ★: ∧ᵏ(V∨) → ∧^{n−k}(V∨) on an n-dimensional oriented inner-product space. In ℝ³ it sends e₁∨∧e₂∨ ↦ e₃∨, e₂∨∧e₃∨ ↦ e₁∨, e₃∨∧e₁∨ ↦ e₂∨.',
  },
  exactForm: {
    term: 'Exact differential form',
    symbol: '\\alpha = d\\beta',
    definition:
      'A k-form α is exact if α = dβ for some (k−1)-form β. By Stokes\' theorem, the integral of an exact 1-form around any closed loop is zero.',
  },
  crossProduct: {
    term: 'Cross product',
    symbol: '\\mathbf{v} \\times \\mathbf{w}',
    definition:
      'An operation on two vectors in ℝ³ yielding a perpendicular vector. Defined via the Hodge star: v × w = ★(v ∧ w).',
    example: 'e₁ × e₂ = e₃, e₂ × e₃ = e₁, e₃ × e₁ = e₂.',
  },
  gradientOp: {
    term: 'Gradient',
    symbol: '\\nabla f',
    definition:
      'For f: ℝⁿ → ℝ, the gradient ∇f is the vector of partial derivatives. Corresponds to the 1-form df.',
  },
  curlOp: {
    term: 'Curl',
    symbol: '\\nabla \\times \\mathbf{F}',
    definition:
      'For F: ℝ³ → ℝ³, the curl ∇×F corresponds to applying the Hodge star to the exterior derivative dα of the associated 1-form α.',
  },
  divOp: {
    term: 'Divergence',
    symbol: '\\nabla \\cdot \\mathbf{F}',
    definition:
      'For F: ℝ³ → ℝ³, the divergence ∇·F = ∂F₁/∂x + ∂F₂/∂y + ∂F₃/∂z. Corresponds to the exterior derivative dα of the associated 2-form.',
  },
  workIntegral: {
    term: 'Work integral',
    symbol: '\\int \\mathbf{F} \\cdot d\\mathbf{r}',
    definition:
      'The line integral of a vector field F along a curve: ∫ F(r(t)) · r′(t) dt. Equals the integral of the dual 1-form α over the 1-cell c.',
  },
  fluxIntegral: {
    term: 'Flux integral',
    symbol: '\\iint \\mathbf{F} \\cdot d\\mathbf{S}',
    definition:
      'The surface integral of a vector field F through a parametrized surface. Equals the integral of the associated 2-form over a 2-cell.',
  },
};

export default entries;
