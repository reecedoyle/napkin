import type { GlossaryEntry } from '../glossary';

/**
 * Glossary entries for Chapter 37 — Lebesgue integration.
 * Keys must be unique across the portal (they mirror the entries added to
 * the shared src/lib/glossary.ts for this chapter).
 */
const entries: Record<string, GlossaryEntry> = {
  measureSpace: {
    term: 'Measure space',
    symbol: '(\\Omega, \\mathcal{A}, \\mu)',
    definition: 'A triple (Ω, 𝒜, μ) where Ω is a set, 𝒜 is a σ-algebra of subsets of Ω (the "measurable sets"), and μ: 𝒜 → [0,∞] is a measure (countably additive non-negative function with μ(∅) = 0).',
    example: '(ℝ, Borel σ-algebra, Lebesgue measure) is the standard measure space on the real line.',
  },
  lebesgueIntegral: {
    term: 'Lebesgue integral',
    symbol: '\\int_\\Omega f \\, d\\mu',
    definition: 'The integral of a measurable function f on a measure space (Ω, 𝒜, μ), built in four steps: indicator functions, simple functions, nonneg functions (via sup of simple approximations), and absolutely integrable functions (via positive/negative parts). It generalises the Riemann integral.',
    example: 'For f = 𝟏_A on (ℝ, Borel, μ): ∫_ℝ 𝟏_A dμ = μ(A).',
  },
  simpleFunction: {
    term: 'Simple function',
    symbol: '\\sum_i c_i \\mathbf{1}_{A_i}',
    definition: 'A finite nonneg linear combination of indicator functions: s = Σ cᵢ 𝟏_{Aᵢ} where each Aᵢ is measurable and cᵢ ≥ 0. Simple functions are the building blocks used to define the Lebesgue integral for general functions.',
    example: '3·𝟏_{[0,1]} + 7·𝟏_{[2,5]} is a simple function with integral 3·1 + 7·3 = 24 under Borel measure.',
  },
  absolutelyIntegrable: {
    term: 'Absolutely integrable',
    definition: 'A measurable function f is absolutely integrable (also called integrable or L¹) if ∫|f| dμ < ∞. Every measurable nonneg function has a Lebesgue integral (possibly ∞), but only those with finite integral are called integrable. Also called "finitely integrable" informally.',
    example: 'f(x) = 1/x² on (1,∞) is absolutely integrable. The constant f ≡ 1 on ℝ is NOT absolutely integrable.',
  },
  measurableFunction: {
    term: 'Measurable function',
    symbol: 'f \\colon \\Omega \\to \\mathbb{R}',
    definition: 'A function f: Ω → ℝ (or ℝ̄ = [−∞,∞]) such that the pre-image f⁻¹(B) is measurable for every Borel set B ⊆ ℝ. Equivalently, {ω : f(ω) > c} is measurable for every c ∈ ℝ. Measurability is necessary and sufficient for f to be Lebesgue integrable.',
    example: 'All continuous functions and all monotone functions on ℝ are measurable. The indicator function 𝟏_A is measurable iff A is measurable.',
  },
  almostEverywhere: {
    term: 'Almost everywhere',
    symbol: '\\text{a.e.}',
    definition: 'A property holds almost everywhere (a.e.) with respect to a measure μ if the set of points where it fails has μ-measure zero. Two functions that agree a.e. have the same Lebesgue integral.',
    example: 'The function f(x) = 0 for x ≠ 0 and f(0) = 100 equals 0 almost everywhere on ℝ, so ∫_ℝ f dμ = 0.',
  },
  regionUnderGraph: {
    term: 'Region under a function',
    symbol: 'R(f)',
    definition: 'For a nonneg function f: Ω → ℝ, the region R(f) = {(x,y) ∈ Ω×ℝ : 0 ≤ y ≤ f(x)}. The Lebesgue integral ∫_Ω f dμ equals the product-measure of R(f). This is the "volume under the graph" interpretation of the integral.',
    example: 'For f(x) = x on [0,1], R(f) is the triangle with vertices (0,0),(1,0),(1,1), which has area 1/2.',
  },
  productMeasure: {
    term: 'Product measure',
    symbol: '\\mu \\times \\lambda',
    definition: 'Given measure spaces (Ω, 𝒜, μ) and (X, ℬ, λ), the product measure μ×λ on Ω×X assigns measure μ(A)·λ(B) to each rectangle A×B. It extends uniquely to all measurable subsets of Ω×X by Carathéodory\'s theorem.',
    example: 'On ℝ×ℝ, the product of Lebesgue measure with itself is the standard 2-dimensional area measure.',
  },
  borelMeasure: {
    term: 'Borel measure on ℝ',
    definition: 'The unique measure on the Borel σ-algebra of ℝ that assigns length b−a to each interval [a,b]. Also called Lebesgue measure on ℝ. It is the standard way to measure subsets of ℝ used in analysis.',
    example: 'The Borel measure of [2,5] is 3. The Borel measure of ℚ (the rationals) is 0.',
  },
  riemannIntegrable: {
    term: 'Riemann integrable',
    symbol: '\\int_a^b f(x)\\,dx',
    definition: 'A bounded function f: [a,b] → ℝ is Riemann integrable if the upper and lower Riemann sums converge to the same limit (the Riemann integral). By Lebesgue\'s criterion, this happens iff f is continuous almost everywhere. Every Riemann integrable function is also Lebesgue integrable with the same value.',
    example: 'All continuous functions on [a,b] are Riemann integrable. The indicator 𝟏_ℚ of the rationals is NOT Riemann integrable.',
  },
  improperIntegral: {
    term: 'Improper Riemann integral',
    symbol: '\\int_a^\\infty f(x)\\,dx',
    definition: 'An improper Riemann integral is defined as a limit of ordinary Riemann integrals: ∫_a^∞ f dx = lim_{b→∞} ∫_a^b f dx, or ∫_0^1 f dx = lim_{ε→0+} ∫_ε^1 f dx when f blows up at 0. For nonneg f, this equals the Lebesgue integral over the open interval. For signed f, the improper integral may exist even if the Lebesgue integral does not.',
    example: '∫_0^1 x^{-1/2} dx = lim_{ε→0+} [2√x]_ε^1 = 2. The Lebesgue integral ∫_{(0,1)} x^{-1/2} dμ also equals 2.',
  },
};

export default entries;
