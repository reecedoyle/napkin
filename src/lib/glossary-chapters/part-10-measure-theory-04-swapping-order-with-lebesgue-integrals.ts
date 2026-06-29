/**
 * Chapter glossary for Part 10 Chapter 4 — Swapping order with Lebesgue integrals.
 *
 * Keys must be unique across the entire portal.
 */
import type { GlossaryEntry } from '../glossary';

const entries: Record<string, GlossaryEntry> = {
  // ── §1 Motivating limit interchange ─────────────────────────────────
  indicatorQQ: {
    term: 'Indicator function of ℚ',
    symbol: '\\mathbf{1}_\\QQ',
    definition: 'The function that equals 1 at every rational number and 0 at every irrational. It is not Riemann integrable (upper/lower sums never agree) but its Lebesgue integral over [0,1] is 0, since ℚ has measure zero.',
  },
  measureZero: {
    term: 'Measure zero',
    definition: 'A set has measure zero if it can be covered by a countable collection of intervals whose total length is arbitrarily small. Every countable set (like ℚ) has measure zero.',
    example: 'ℚ has measure zero. Any single point has measure zero. The Cantor set has measure zero despite being uncountable.',
  },
  riemannIntegrable: {
    term: 'Riemann integrable',
    definition: 'A bounded function on a closed interval is Riemann integrable if its upper and lower Darboux sums converge to the same value. Equivalently, the set of discontinuities has measure zero (Lebesgue\'s criterion).',
    example: 'Every continuous function on [a,b] is Riemann integrable. The indicator of ℚ is not.',
  },
  pointwiseConvergence: {
    term: 'Pointwise convergence',
    definition: 'A sequence of functions fₙ : Ω → ℝ converges pointwise to f if, for each fixed ω ∈ Ω, the real sequence f₁(ω), f₂(ω), … converges to f(ω). Pointwise convergence imposes no uniformity across different points.',
    example: 'The functions fₙ(x) = xⁿ converge pointwise on [0,1] to the function that is 0 on [0,1) and 1 at x=1, but not uniformly.',
  },
  limitInterchange: {
    term: 'Limit-integral interchange',
    definition: 'The operation of moving a limit past an integral sign: replacing lim ∫ fₙ dμ by ∫ (lim fₙ) dμ. Valid under extra hypotheses (monotone or dominated convergence); fails in general for mere pointwise convergence.',
  },
  dominatingFunction: {
    term: 'Dominating function',
    definition: 'An integrable function g : Ω → ℝ such that |fₙ(ω)| ≤ g(ω) for all n and all ω. The existence of such a g is the key hypothesis in the dominated convergence theorem.',
    example: 'For fₙ(x) = sin(nx)/n on [0,1], the constant function g(x) = 1 dominates since |fₙ(x)| ≤ 1/n ≤ 1.',
  },
  // ── §2 Overview ──────────────────────────────────────────────────────
  fatousLemma: {
    term: "Fatou's lemma",
    definition: 'For any sequence of nonnegative measurable functions fₙ, the integral of their pointwise liminf is at most the liminf of their integrals: ∫(liminf fₙ) dμ ≤ liminf ∫ fₙ dμ. No extra hypotheses beyond nonnegativity.',
  },
  monotonoConvergence: {
    term: 'Monotone convergence theorem',
    definition: 'If nonneg. measurable fₙ converge pointwise to f and fₙ ≤ f for every n, then lim ∫ fₙ dμ = ∫ f dμ. A quick corollary of Fatou\'s lemma.',
  },
  dominatedConvergence: {
    term: 'Dominated convergence theorem',
    definition: 'If measurable fₙ → f pointwise and |fₙ| ≤ g for an absolutely integrable g, then lim ∫ fₙ dμ = ∫ f dμ. The most useful limit-interchange theorem in practice.',
  },
  // ── §3 Fatou's lemma ─────────────────────────────────────────────────
  liminf: {
    term: 'liminf (limit inferior)',
    symbol: '\\liminf_{n\\to\\infty}',
    definition: 'For a sequence of real numbers aₙ, the liminf is lim_{n→∞} inf_{k≥n} aₖ — the largest value that all but finitely many terms stay above. For functions, the pointwise liminf is defined the same way at each point.',
    example: 'For aₙ = (−1)ⁿ, the liminf is −1 and the limsup is 1.',
  },
  limsup: {
    term: 'limsup (limit superior)',
    symbol: '\\limsup_{n\\to\\infty}',
    definition: 'For a sequence aₙ, the limsup is lim_{n→∞} sup_{k≥n} aₖ — the smallest value that all but finitely many terms stay below. Always ≥ liminf; equality means the sequence converges.',
    example: 'For aₙ = (−1)ⁿ, the limsup is 1.',
  },
  nonnegMeasurable: {
    term: 'Nonnegative measurable function',
    definition: 'A measurable function f : Ω → [0, +∞] whose values are nonneg. real numbers (or +∞). The Lebesgue integral is always well-defined for such functions, though it may be +∞.',
  },
  // ── §4 Monotone & dominated convergence ─────────────────────────────
  absolutelyIntegrable: {
    term: 'Absolutely integrable function',
    definition: 'A measurable function f : Ω → ℝ such that ∫|f| dμ < ∞. For Lebesgue integrals this is the standard integrability condition, ensuring the integral is a finite real number.',
    example: 'f(x) = e^{−x} on [0,∞) is absolutely integrable. f(x) = 1/x on (0,1] is not.',
  },
  egorovsTheorem: {
    term: "Egorov's theorem",
    definition: "On a measure space with finite total measure, if fₙ → f pointwise a.e., then for any ε > 0 we can find a subset U with |Ω \\ U| < ε on which the convergence is *uniform*. The anomaly in the limit-integral interchange is therefore always concentrated in a set of small measure.",
  },
  uniformConvergence: {
    term: 'Uniform convergence',
    definition: 'A sequence fₙ : Ω → ℝ converges uniformly to f if, for every ε > 0, there exists N such that |fₙ(ω) − f(ω)| < ε for all ω ∈ Ω and all n ≥ N. Stronger than pointwise convergence — the same N works everywhere.',
    example: 'fₙ(x) = sin(nx)/n converges uniformly to 0 on ℝ. fₙ(x) = xⁿ does not converge uniformly on [0,1].',
  },
  fatouLebesgue: {
    term: 'Fatou–Lebesgue theorem',
    definition: 'A strengthening of Fatou\'s lemma to functions that are not necessarily nonneg, under the condition |fₙ| ≤ g for an absolutely integrable dominator g. It gives the four-way inequality: ∫(liminf fₙ) ≤ liminf ∫ fₙ ≤ limsup ∫ fₙ ≤ ∫(limsup fₙ).',
  },
  // ── §5 Fubini and Tonelli ────────────────────────────────────────────
  productMeasure: {
    term: 'Product measure',
    symbol: '\\mu \\otimes \\nu',
    definition: 'Given σ-finite measure spaces (X, μ) and (Y, ν), the product measure μ ⊗ ν on X × Y is the unique measure satisfying (μ ⊗ ν)(A × B) = μ(A) · ν(B) for measurable rectangles A × B.',
    example: 'Lebesgue measure on ℝ² is the product of Lebesgue measure on ℝ with itself.',
  },
  fubiniTheorem: {
    term: "Fubini's theorem",
    definition: 'For an absolutely integrable function f on a product measure space X × Y, the double integral equals the two iterated integrals in either order: ∫_{X×Y} f d(μ⊗ν) = ∫_X (∫_Y f(x,y) dν(y)) dμ(x) = ∫_Y (∫_X f(x,y) dμ(x)) dν(y).',
  },
  tonelliTheorem: {
    term: "Tonelli's theorem",
    definition: 'For a nonneg. measurable function f on a product of σ-finite measure spaces, the double integral always equals both iterated integrals (with all values possibly being +∞). No absolute integrability required — nonnegativity suffices.',
  },
  sigmaFinite: {
    term: 'σ-finite measure space',
    definition: 'A measure space (Ω, μ) where Ω can be written as a countable union of measurable sets each with finite measure. Lebesgue measure on ℝ is σ-finite (ℝ = ∪ₙ [−n, n]). Both Fubini and Tonelli require σ-finiteness.',
  },
};

export default entries;
