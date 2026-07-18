/**
 * Chapter glossary for Part 12 Chapter 1 — Multivariable calculus done correctly.
 */
import type { GlossaryEntry } from '../glossary';

const entries: Record<string, GlossaryEntry> = {
  // ────────────── §1 The total derivative ──────────────
  linearMap: {
    term: 'Linear map',
    symbol: 'T \\colon V \\to W',
    definition: 'A function T between vector spaces satisfying T(u + v) = T(u) + T(v) and T(cv) = cT(v). Also called a linear transformation. The derivative at a point is always a linear map.',
    example: 'Any matrix-vector product Ax is a linear map from ℝⁿ to ℝᵐ.',
  },
  normedVectorSpace: {
    term: 'Normed vector space',
    definition: 'A vector space V equipped with a norm ‖·‖ that measures the "length" of vectors, satisfying positive-definiteness, homogeneity, and the triangle inequality. The norm turns V into a metric space.',
    example: 'ℝⁿ with the Euclidean norm ‖(x₁,…,xₙ)‖ = √(x₁²+…+xₙ²) is a normed vector space.',
  },
  totalDerivative: {
    term: 'Total derivative',
    symbol: '(Df)_p',
    definition: 'For f: U → W with U open in a normed space V, the total derivative at p is the unique linear map T: V → W (if it exists) such that ‖f(p+v) - f(p) - T(v)‖/‖v‖ → 0 as v → 0. Written (Df)_p.',
    example: 'For f(x,y) = x²+y², (Df)_(a,b) is the linear map v ↦ 2a·e₁∨(v) + 2b·e₂∨(v).',
  },
  dualBasis: {
    term: 'Dual basis',
    symbol: '\\mathbf{e}_i^\\vee',
    definition: 'Given a basis e₁,…,eₙ of V, the dual basis e₁∨,…,eₙ∨ of V∨ is defined by eᵢ∨(eⱼ) = δᵢⱼ (1 if i=j, 0 otherwise). Each eᵢ∨ extracts the i-th coordinate of a vector.',
    example: 'In ℝ², e₁∨(3,5) = 3 and e₂∨(3,5) = 5.',
  },
  dualVector: {
    term: 'Dual vector (covector)',
    symbol: 'V^\\vee',
    definition: 'An element of the dual space V∨ = Hom(V, ℝ): a linear map from V to the reals. The total derivative (Df)_p of a scalar-valued function f: U → ℝ is a dual vector.',
    example: 'The map v ↦ 2a·e₁∨(v) + 2b·e₂∨(v) is a dual vector on ℝ².',
  },
  dualSpace: {
    term: 'Dual space',
    symbol: 'V^\\vee',
    definition: 'The vector space of all linear maps from V to ℝ, written V∨ or V*. If V has dimension n then V∨ also has dimension n. For a differentiable f: U → ℝ, the total derivative Df maps into V∨.',
    example: 'The dual of ℝⁿ is again ℝⁿ (via dot products), but it is more natural to think of row vectors vs. column vectors.',
  },

  // ────────────── §2 The projection principle ──────────────
  projectionPrinciple: {
    term: 'Projection principle',
    definition: 'A function f: U → W into an m-dimensional space W is equivalent to m scalar-valued functions f₁,…,fₘ: U → ℝ (the coordinate projections). Differentiability, continuity, and smoothness are determined coordinate-by-coordinate.',
    example: 'A path γ: ℝ → ℝ³ is differentiable iff each component γ₁, γ₂, γ₃: ℝ → ℝ is differentiable.',
  },

  // ────────────── §3 Total and partial derivatives ──────────────
  partialDerivative: {
    term: 'Partial derivative',
    symbol: '\\partial f / \\partial \\mathbf{e}_i',
    definition: 'The partial derivative of f: U → ℝ with respect to the i-th basis direction eᵢ is the limit (∂f/∂eᵢ)(p) = lim_{t→0} [f(p + teᵢ) − f(p)] / t. It measures the rate of change of f along eᵢ alone.',
    example: 'For f(x,y) = x²+y², ∂f/∂x = 2x and ∂f/∂y = 2y.',
  },
  continuousPartials: {
    term: 'Continuous partials theorem',
    definition: 'If all partial derivatives of f: U → ℝ exist and are continuous on U, then f is differentiable on U, and Df = Σᵢ (∂f/∂eᵢ)·eᵢ∨. This is the standard way to verify differentiability in practice.',
    example: 'For f(x,y) = x sin y + x²y⁴, both partials are continuous everywhere, so f is differentiable.',
  },

  // ────────────── §4 Higher derivatives ──────────────
  hessian: {
    term: 'Hessian',
    symbol: 'D^2 f',
    definition: 'The second total derivative D²f(p) is an element of (V∨)⊗², which for a scalar-valued function f: U → ℝ can be represented as an n×n matrix of second-order partial derivatives. The Hessian encodes the local curvature of f.',
    example: 'For f(x,y) = x²+y², the Hessian is the 2×2 identity matrix times 2, reflecting uniform curvature.',
  },
  operatorNorm: {
    term: 'Operator norm',
    symbol: '\\|T\\|',
    definition: 'For a linear map T: V → W between normed spaces, the operator norm is ‖T‖ = sup{ ‖T(v)‖_W / ‖v‖_V : v ≠ 0 }. It makes Hom(V,W) itself a normed vector space, so it makes sense to differentiate maps into Hom(V,W).',
    example: '‖A‖_op = largest singular value of the matrix A.',
  },
  clairauts: {
    term: "Clairaut's theorem",
    definition: 'If f: U → ℝ is twice differentiable, then mixed partial derivatives are equal: ∂²f/∂eᵢ∂eⱼ = ∂²f/∂eⱼ∂eᵢ. This follows from the symmetry of D²f.',
    example: 'For f(x,y) = x²y³, ∂²f/∂x∂y = 6xy² = ∂²f/∂y∂x.',
  },

  // ────────────── §5 Towards differential forms ──────────────
  differentialForm: {
    term: 'Differential form',
    definition: 'The correct generalization of integrals in higher dimensions. A differential 1-form on U is a smooth map from U into V∨, assigning a dual vector to each point. The dx, dy you wrote in calculus are examples of differential 1-forms.',
    example: 'The 1-form df (where f: U → ℝ is smooth) assigns to each point p the total derivative (Df)_p ∈ V∨.',
  },
};

export default entries;
