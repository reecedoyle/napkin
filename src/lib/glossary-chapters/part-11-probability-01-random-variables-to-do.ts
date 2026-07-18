import type { GlossaryEntry } from '../glossary';

// ────────────── Chapter 40 — Random variables ──────────────
const entries: Record<string, GlossaryEntry> = {
  probabilitySpace: {
    term: 'Probability space',
    symbol: '(\\Omega, \\mathscr{A}, \\mu)',
    definition: 'A measure space (Ω, 𝒜, μ) where μ(Ω) = 1. Ω is the sample space (all possible outcomes), 𝒜 is a σ-algebra of measurable events, and μ is a probability measure assigning each event a value in [0,1].',
    example: 'A fair coin: Ω = {H, T}, 𝒜 = all subsets, μ({H}) = μ({T}) = 1/2.',
  },
  measurableFunction: {
    term: 'Measurable function',
    symbol: 'f: (\\Omega, \\mathscr{A}) \\to (\\mathbb{R}, \\mathcal{B})',
    definition: 'A function between measurable spaces such that the preimage of every measurable set is measurable. Formally, f: Ω → ℝ is measurable when f⁻¹(B) ∈ 𝒜 for every Borel set B ⊆ ℝ. This condition makes integration against a measure well-defined.',
    example: 'The indicator function 𝟏_A of any measurable set A is measurable: its preimage of {1} is A and its preimage of {0} is Aᶜ, both in 𝒜.',
  },
  borelSigmaAlgebra: {
    term: 'Borel σ-algebra',
    symbol: '\\mathcal{B}(\\mathbb{R})',
    definition: 'The smallest σ-algebra on ℝ containing all open intervals. It contains all open sets, closed sets, and many other naturally occurring subsets of ℝ. A random variable is defined by requiring its target space ℝ to carry this σ-algebra.',
    example: 'Every open set, closed set, and countable set in ℝ is a Borel set. The Cantor set is Borel. A Vitali set is an example of a non-Borel set.',
  },
  expectedValue: {
    term: 'Expected value',
    symbol: '\\mathbb{E}[X]',
    definition: 'For a random variable X on a probability space (Ω, 𝒜, μ), the expected value is the Lebesgue integral 𝔼[X] = ∫_Ω X(ω) dμ. It is the probability-weighted average of X. Also called the mean or first moment.',
    example: 'For a fair die, X = outcome, 𝔼[X] = (1+2+3+4+5+6)/6 = 3.5.',
  },
  kthMoment: {
    term: 'kth moment',
    symbol: '\\mathbb{E}[X^k]',
    definition: 'For a random variable X and positive integer k, the kth moment is 𝔼[Xᵏ] = ∫_Ω X(ω)ᵏ dμ. The first moment is the mean; the second moment (and variance) describe spread.',
    example: 'If X is a standard normal, all odd moments are 0 and the second moment 𝔼[X²] = 1.',
  },
  variance: {
    term: 'Variance',
    symbol: '\\operatorname{Var}(X)',
    definition: 'The variance of a random variable X is Var(X) = 𝔼[(X − 𝔼[X])²], the expected squared deviation from the mean. It equals 𝔼[X²] − (𝔼[X])². The square root of the variance is the standard deviation.',
    example: 'For a fair coin X ∈ {0,1} with 𝔼[X] = 1/2: Var(X) = 𝔼[(X − 1/2)²] = (1/4 + 1/4)/2 = 1/4.',
  },
  indicatorFunction: {
    term: 'Indicator function',
    symbol: '\\mathbf{1}_A',
    definition: 'For a measurable set A in a measure space, the indicator (or characteristic) function 𝟏_A assigns 1 to points in A and 0 to points outside A. It is always measurable. Its integral equals the measure of A: ∫ 𝟏_A dμ = μ(A).',
    example: 'For a coin flip with A = {Heads}: 𝟏_A(H) = 1, 𝟏_A(T) = 0, and 𝔼[𝟏_A] = probability of Heads.',
  },
  linearityOfExpectation: {
    term: 'Linearity of expectation',
    symbol: '\\mathbb{E}[X + Y] = \\mathbb{E}[X] + \\mathbb{E}[Y]',
    definition: 'For any two random variables X and Y on the same probability space, 𝔼[X + Y] = 𝔼[X] + 𝔼[Y]. This holds even when X and Y are dependent. It follows directly from linearity of the Lebesgue integral.',
    example: 'Expected number of heads in n coin flips = sum of 𝔼[𝟏_{flip i is heads}] = n/2, by linearity, without any independence argument.',
  },
};

export default entries;
