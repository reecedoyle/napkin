import type { GlossaryEntry } from '../glossary';

// ────────────── Chapter 39 — Bonus: A hint of Pontryagin duality ──────────────
const entries: Record<string, GlossaryEntry> = {
  circleGroup: {
    term: 'Circle group 𝕋',
    symbol: '\\mathbb{T}',
    definition: 'The multiplicative group of complex numbers of absolute value 1, i.e. {z ∈ ℂ : |z| = 1}. It can be identified with ℝ/ℤ or with the unit circle in the complex plane. As a topological group it is compact and abelian.',
    example: 'Every element of 𝕋 can be written as exp(2πiθ) for some θ ∈ [0, 1).',
  },
  topologicalGroup: {
    term: 'Topological group',
    symbol: '(G, \\cdot)',
    definition: 'A group G that is also a Hausdorff topological space, with the property that both the multiplication map (x, y) ↦ xy and the inversion map x ↦ x⁻¹ are continuous. The topology and the group structure are compatible.',
    example: 'ℝ under addition, the circle group 𝕋 under multiplication, and any finite group with the discrete topology are all topological groups.',
  },
  lcaGroup: {
    term: 'Locally compact abelian (LCA) group',
    symbol: 'G',
    definition: 'A topological group G whose group operation is commutative (abelian) and whose topology is locally compact: every point has a compact neighborhood. The class includes finite groups, ℝⁿ, 𝕋, and ℤ.',
    example: 'ℝ is LCA but not compact. 𝕋 is LCA and compact. ℤ with the discrete topology is LCA and discrete.',
  },
  haarMeasure: {
    term: 'Haar measure',
    symbol: '\\mu',
    definition: 'A translation-invariant regular Borel measure on a locally compact abelian group G, unique up to a positive scalar. "Translation-invariant" means μ(gS) = μ(S) for all g ∈ G and measurable S. When G is compact, Haar measure is usually normalized so μ(G) = 1.',
    example: 'On ℝ the Haar measure is the usual Lebesgue measure. On 𝕋 ≅ [0, 1) it is arc-length measure normalized to total mass 1.',
  },
  borelSigmaAlgebra: {
    term: 'Borel σ-algebra',
    symbol: '\\mathcal{B}(G)',
    definition: 'The smallest σ-algebra on a topological space G that contains all open sets. Its elements are called Borel sets. Standard measurable structure for topological spaces.',
    example: 'The Borel σ-algebra on ℝ contains all open intervals, all closed sets, all countable unions of these, and more.',
  },
  pontryaginDual: {
    term: 'Pontryagin dual',
    symbol: '\\widehat{G}',
    definition: 'For a locally compact abelian group G, the Pontryagin dual G-hat is the group of all continuous group homomorphisms ξ: G → 𝕋 (called characters), with pointwise multiplication. It is itself an LCA group.',
    example: 'The Pontryagin dual of ℤ is 𝕋, of 𝕋 is ℤ, of ℝ is ℝ, and of ℤ/nℤ is ℤ/nℤ.',
  },
  character: {
    term: 'Character (of an LCA group)',
    symbol: '\\xi \\colon G \\to \\mathbb{T}',
    definition: 'A continuous group homomorphism ξ from a locally compact abelian group G to the circle group 𝕋. Characters are the "frequency components" used to decompose functions on G. The set of all characters is the Pontryagin dual G-hat.',
    example: 'For G = ℤ, the characters are θ ↦ exp(2πinθ) for n ∈ ℤ. For G = ℝ, the characters are x ↦ exp(2πiξx) for ξ ∈ ℝ.',
  },
  pontryaginDualityThm: {
    term: 'Pontryagin duality theorem',
    symbol: 'G \\cong \\widehat{\\widehat{G}}',
    definition: 'For any locally compact abelian group G, the natural map G → G-hat-hat sending x to the evaluation map (ξ ↦ ξ(x)) is an isomorphism of LCA groups. This says G is its own double dual — analogous to V ≅ V** for finite-dimensional vector spaces.',
    example: 'Since the dual of ℤ is 𝕋 and the dual of 𝕋 is ℤ, Pontryagin duality gives ℤ ≅ (𝕋)-hat ≅ ℤ, as expected.',
  },
  lTwoGroup: {
    term: 'L²(G) — square-integrable functions on a group',
    symbol: 'L^2(G)',
    definition: 'The Hilbert space of measurable functions f: G → ℂ with ∫_G |f|² dμ < ∞, where μ is the Haar measure on the compact LCA group G. Two functions are identified if they agree μ-almost everywhere. The inner product is ⟨f, g⟩ = ∫_G f · ḡ dμ.',
    example: 'For G = 𝕋, L²(𝕋) is the space of square-integrable 1-periodic functions, the arena for classical Fourier series.',
  },
  fourierCoeffLCA: {
    term: 'Fourier coefficient on an LCA group',
    symbol: '\\widehat{f}(\\xi)',
    definition: 'For a function f ∈ L²(G) on a compact LCA group G and a character ξ ∈ G-hat, the Fourier coefficient is f-hat(ξ) = ⟨f, e_ξ⟩ = ∫_G f(x) exp(−2πi ξ(x)) dμ(x). The collection of all these coefficients encodes f completely.',
    example: 'For G = 𝕋 and ξ = n ∈ ℤ, f-hat(n) is the classical nth Fourier coefficient of a periodic function.',
  },
  dualMeasure: {
    term: 'Dual measure',
    symbol: '\\nu',
    definition: 'Given a Haar measure μ on a locally compact abelian group G, the dual measure ν is the unique Haar measure on the Pontryagin dual G-hat such that the Fourier inversion formula holds. For a compact group G with normalized Haar measure, the dual measure is the counting measure on the discrete group G-hat.',
    example: 'For G = 𝕋 with arc-length measure, the dual measure on G-hat = ℤ is the counting measure.',
  },
  fourierInversionLCA: {
    term: 'Fourier inversion formula (non-compact case)',
    symbol: 'f(x) = \\int_{\\widehat{G}} \\widehat{f}(\\xi)\\,\\xi(x)\\,d\\nu',
    definition: 'For a locally compact abelian group G with Haar measure μ and dual measure ν on G-hat, if f ∈ L¹(G) and f-hat ∈ L¹(G-hat), then f(x) = ∫_{G-hat} f-hat(ξ) ξ(x) dν(ξ) for almost all x. This generalizes the classical Fourier inversion theorem.',
    example: 'For G = ℝ this gives the classical Fourier inversion: f(x) = ∫_ℝ f-hat(ξ) exp(2πiξx) dξ.',
  },
  peterWeyl: {
    term: 'Peter–Weyl theorem',
    symbol: 'L^2(G)',
    definition: 'For a compact Lie group G (not necessarily abelian), the rescaled matrix coefficients √(dim V) ρ_{ij} of all irreducible finite-dimensional unitary representations ρ of G together form an orthonormal basis of L²(G). Generalizes the character orthogonality of the compact abelian case.',
    example: 'For G = 𝕋 (abelian, so all irreps are 1-dimensional), Peter–Weyl recovers the classical Fourier series basis {exp(2πinθ)}.',
  },
  matrixCoefficient: {
    term: 'Matrix coefficient',
    symbol: '\\rho_{ij}',
    definition: 'For a representation (V, ρ) of a group G with a fixed orthonormal basis e₁, …, e_d of V, the (i, j)th matrix coefficient ρ_{ij}: G → ℂ sends g to the (i, j) entry of the matrix ρ(g). These functions on G play the role that characters of LCA groups do in the abelian Fourier theory.',
    example: 'For a 1-dimensional representation ρ: G → ℂˣ, there is a single matrix coefficient ρ₁₁ = ρ, which is a character of G.',
  },
};

export default entries;
