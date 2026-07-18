/**
 * Chapter glossary for Part 11 Chapter 2 — Large number laws (TO DO).
 */
import type { GlossaryEntry } from '../glossary';

const entries: Record<string, GlossaryEntry> = {
  // ────────────── §1 Notions of convergence ──────────────
  llProbabilitySpace: {
    term: 'Probability space',
    symbol: '(\\Omega, \\mu)',
    definition: 'A set Ω of "worlds" equipped with a probability measure μ. A random variable is then just a function X: Ω → ℝ — its randomness comes from not knowing which world ω actually occurs.',
    example: 'Ω = {H, T}² (two coin flips), μ assigns equal probability 1/4 to each outcome.',
  },
  llAlmostSureConv: {
    term: 'Converges almost surely',
    symbol: 'X_n \\xrightarrow{\\mathrm{a.s.}} X',
    definition: 'A sequence of random variables Xₙ converges almost surely to X if the set of worlds where the numerical sequence Xₙ(ω) fails to converge to X(ω) has probability zero.',
    example: 'The strong law of large numbers says the sample mean Mₙ converges almost surely to the true mean.',
  },
  llBorelCantelli: {
    term: 'Borel–Cantelli lemma',
    definition: 'If the sum of probabilities Σ P(Aₙ) diverges, then in almost every world infinitely many events Aₙ occur. Used to show that "small but frequent" bad events accumulate and prevent almost sure convergence.',
    example: 'If the archer misses on shot n with probability 1/n, then Σ 1/n = ∞, so infinitely many misses occur in almost every world.',
  },
  llInProbability: {
    term: 'Converges in probability',
    symbol: 'X_n \\xrightarrow{P} X',
    definition: 'Xₙ converges in probability to X if for every ε > 0, the probability that |Xₙ - X| ≥ ε tends to 0 as n → ∞. Weaker than almost sure convergence: different bad worlds are allowed at each step.',
    example: 'The weak law of large numbers states that the sample mean converges in probability to the true mean.',
  },
  llInLaw: {
    term: 'Converges in law',
    symbol: 'X_n \\xrightarrow{d} X',
    definition: 'Xₙ converges in law (or in distribution) to X if the cumulative distribution functions Fₙ(t) → F(t) at every continuity point of F. Only the distributions match up — individual worlds need not be close.',
    example: 'The Central Limit Theorem: normalised sample sums converge in law to a standard Gaussian, regardless of the original distribution.',
  },
  // ────────────── §2 Weak law of large numbers ──────────────
  llIID: {
    term: 'i.i.d.',
    definition: 'Independent and identically distributed. A sequence of random variables X₁, X₂, … is i.i.d. if: each Xᵢ has the same distribution, and the variables are mutually independent (knowing some gives no information about others).',
    example: 'Repeated fair coin flips are i.i.d. Bernoulli(1/2) random variables.',
  },
  llSampleMean: {
    term: 'Sample mean / partial mean',
    symbol: 'M_n = \\tfrac{X_1 + \\cdots + X_n}{n}',
    definition: 'The average of the first n values of an i.i.d. sequence. Both the weak and strong laws of large numbers say that Mₙ converges to the true mean 𝔼[X₁].',
    example: 'Flip a fair coin n times; the fraction of heads is Mₙ → 1/2 as n → ∞.',
  },
  llWLLN: {
    term: 'Weak law of large numbers',
    definition: 'For i.i.d. random variables with finite mean μ, the sample mean Mₙ converges in probability to μ. A direct corollary of the strong law, but the proof is simpler and some applications only need this weaker statement.',
    example: 'Used to prove Weierstrass approximation: any continuous function on [0,1] is a uniform limit of polynomials.',
  },
  llBernsteinPoly: {
    term: 'Bernstein polynomial',
    symbol: 'B_n f(p)',
    definition: 'The nth Bernstein polynomial of f is Bₙf(p) = Σₖ f(k/n) C(n,k) pᵏ(1-p)^{n-k}. It is a polynomial in p for each n. The Weierstrass theorem follows from showing Bₙf → f uniformly using the WLLN.',
    example: 'For f(x) = x², the Bernstein polynomial B₂f(p) = p².',
  },
  // ────────────── §3 Strong law of large numbers ──────────────
  llSLLN: {
    term: 'Strong law of large numbers',
    symbol: 'M_n \\xrightarrow{\\text{a.s.}} 0',
    definition: 'For i.i.d. random variables X₁, X₂, … with mean 0, the sample mean Mₙ = (X₁ + ⋯ + Xₙ)/n converges to 0 in almost every world. The "strong" refers to almost sure (vs. in-probability) convergence.',
    example: 'Flipping a fair coin repeatedly: in almost every infinite sequence of flips, the fraction of heads tends to 1/2.',
  },
  llChebyshev: {
    term: "Chebyshev's inequality",
    definition: 'For a random variable X with mean 0 and variance σ², Pr[|X| ≥ a] ≤ Var[X] / a². Gives a tail bound in terms of variance alone, without needing the full distribution.',
    example: 'If Var[X] = 4 then Pr[|X| ≥ 10] ≤ 4/100 = 0.04.',
  },
  llKolmogorov: {
    term: "Kolmogorov's maximal inequality",
    definition: 'For independent mean-zero random variables X₁, …, Xₙ with partial sums Sᵢ = X₁ + ⋯ + Xᵢ, the probability that ANY of |S₁|, …, |Sₙ| exceeds a is at most Var[Sₙ] / a². Stronger than Chebyshev because it controls the running maximum, not just the final value.',
    example: 'Chebyshev bounds Pr[|Sₙ| ≥ a]; Kolmogorov bounds Pr[max_{i≤n} |Sᵢ| ≥ a] with the same right-hand side.',
  },
  llCesaro: {
    term: 'Cesàro mean',
    definition: 'The Cesàro mean of a sequence (aₙ) is (a₁ + a₂ + ⋯ + aₙ)/n. If aₙ → L then the Cesàro mean also → L. Used in the SLLN proof: once Tₙ converges, its Cesàro mean converges to the same limit, giving Mₙ → 0.',
    example: 'If aₙ = (-1)ⁿ (diverges), the Cesàro mean → 0.',
  },
  llWeightedSeries: {
    term: 'Weighted partial-sum series',
    symbol: 'T_n = X_1 + \\tfrac{X_2}{2} + \\cdots + \\tfrac{X_n}{n}',
    definition: 'The key auxiliary series in the finite-variance SLLN proof. Its total variance Σ Var[Xᵢ]/i² is finite when Var[X₁] < ∞, and Kolmogorov\'s inequality then forces almost sure convergence of Tₙ.',
    example: 'Even if individual Xᵢ have variance σ², the weights 1/i² ensure Σ σ²/i² = σ² · π²/6 < ∞.',
  },
  llCauchy: {
    term: 'Cauchy convergence criterion',
    definition: 'A sequence in a complete metric space (such as ℝ) converges if and only if it is Cauchy: for every ε > 0, all sufficiently late terms are within ε of each other. Allows proving convergence without knowing the limit.',
    example: 'To show Tₙ converges almost surely, we verify that |Tₘ − Tₙ| < ε for large m, n — using Kolmogorov\'s inequality on the tail.',
  },
};

export default entries;
