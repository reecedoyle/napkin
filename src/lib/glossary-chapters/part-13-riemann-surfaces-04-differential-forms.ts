/**
 * Chapter glossary for Part 13, Chapter 4 — Differential forms on Riemann surfaces.
 *
 * Keys are prefixed with `rs50` to avoid collisions with the Part XII
 * differential-geometry chapter (which defines `oneForm`, `exteriorDerivative`, etc.).
 */
import type { GlossaryEntry } from '../glossary';

const entries: Record<string, GlossaryEntry> = {
  // ────────────── §1 — Differential form on ℂ ──────────────
  rs50oneFormR2: {
    term: '1-form on ℝ²',
    symbol: 'f(x,y)\\,dx + g(x,y)\\,dy',
    definition: 'A smooth assignment of a linear functional on tangent vectors to each point of an open set U ⊆ ℝ². In coordinates, it looks like f dx + g dy, where f and g are smooth functions. At each point p the functional eats a tangent vector and returns a real number.',
    example: 'The arc-length integrand ds = (cos θ) dx + (sin θ) dy is a real 1-form in ℝ².',
  },
  rs50oneFormCC: {
    term: '1-form on ℂ',
    symbol: 'f(z)\\,d\\operatorname{Re} + g(z)\\,d\\operatorname{Im}',
    definition: 'A smooth assignment of an ℝ-linear map from tangent vectors to ℂ at each point of an open set U ⊆ ℂ. Written as ω = f(z) dRe + g(z) dIm, where f and g may take complex values. By the projection principle, this is equivalent to a pair of real-valued 1-forms.',
    example: 'The form dz = dRe + i dIm measures the infinitesimal change in the complex coordinate z.',
  },
  rs50dz: {
    term: 'The 1-form dz',
    symbol: 'dz = d\\operatorname{Re} + i\\,d\\operatorname{Im}',
    definition: 'The complex 1-form on ℂ that measures the infinitesimal change in z. On a tangent vector v ∈ ℂ it returns dz · v = v. In coordinates, dz = dRe + i dIm. Its conjugate is d̄z = dRe − i dIm.',
    example: 'For a curve c with velocity c′(t), dz · c′(t) = c′(t), so ∫_c dz = c(1) − c(0): the total displacement.',
  },
  rs50dzbbar: {
    term: 'The 1-form d̄z',
    symbol: 'd\\bar{z} = d\\operatorname{Re} - i\\,d\\operatorname{Im}',
    definition: 'The complex 1-form on ℂ that measures the infinitesimal change in the complex conjugate z̄. On a tangent vector v it returns the conjugate v̄. It satisfies dz + d̄z = 2 dRe and dz − d̄z = 2i dIm.',
    example: 'Moving in the direction i (one unit upward), d̄z evaluates to −i, since the imaginary part increases but with a sign flip from conjugation.',
  },
  rs50contourIntegral: {
    term: 'Contour integral',
    symbol: '\\int_c f(z)\\,dz',
    definition: 'The integral of a complex-valued function f along a smooth curve c in ℂ. Defined as ∫₀¹ f(c(t)) c′(t) dt. More generally one can integrate any complex 1-form ω = f dRe + g dIm along c by summing f · Re(c′) + g · Im(c′) over the curve.',
    example: '∫_{|z|=1} dz/z = 2πi by the residue theorem, a foundational result in complex analysis.',
  },
  rs50smoothCC: {
    term: 'Smooth map on ℂ',
    definition: 'A function U → ℂ on an open set U ⊆ ℂ that is infinitely differentiable when regarded as a map ℝ² → ℝ². Smoothness is weaker than holomorphicity: every holomorphic function is smooth, but not conversely.',
    example: 'The function z̄ (complex conjugate) is smooth but not holomorphic. The function |z|² = zz̄ is smooth.',
  },

  // ────────────── §2 — Visualization of differential forms ──────────────
  rs50quiverDiagram: {
    term: 'Quiver diagram for a 1-form',
    definition: 'A visualization of a 1-form ω on ℂ: at each sample point p, draw short arrows labeled with the values ω_p(v) for representative directions v. Reading the diagram, the label on an arrow tells you the approximate contribution to the integral of ω if you move a short distance in that direction through p.',
    example: 'For dz, every rightward arrow is labeled 1 and every upward arrow is labeled i, reflecting that dz · 1 = 1 and dz · i = i.',
  },
  rs50holomorphicForm: {
    term: 'Holomorphic 1-form',
    symbol: 'f(z)\\,dz,\\; f \\text{ holomorphic}',
    definition: 'A complex 1-form ω on an open set U ⊆ ℂ that can be written as f(z) dz for some holomorphic function f. Equivalently, ω is holomorphic if, at each point z, rotating the input tangent vector by 90° counterclockwise (multiplying by i) multiplies the output value by i.',
    example: 'dz is holomorphic (f = 1). The form d(z²) = 2z dz is holomorphic (f = 2z). The form d̄z is not holomorphic.',
  },
  rs50type10: {
    term: 'Type (1,0) form',
    symbol: '\\Omega^{1,0}',
    definition: 'A complex 1-form on an open set U ⊆ ℂ that can be written locally as f(z) dz for some smooth (not necessarily holomorphic) function f. At each point, the value of ω on the upward direction i is i times its value on the rightward direction 1. Every holomorphic 1-form is type (1,0), but not conversely.',
    example: 'z̄ dz is type (1,0) but not holomorphic, since the coefficient z̄ is smooth but not holomorphic.',
  },
  rs50type01: {
    term: 'Type (0,1) form',
    symbol: '\\Omega^{0,1}',
    definition: 'A complex 1-form on an open set U ⊆ ℂ that can be written locally as f(z) d̄z for some smooth function f. At each point, rotating the input by 90° counterclockwise multiplies the output by −i (instead of +i as for type (1,0) forms). The form d̄z is the prototypical example.',
    example: 'The form d̄z is type (0,1) with coefficient f = 1. The antiholomorphic forms are exactly those of type (0,1).',
  },
};

export default entries;
