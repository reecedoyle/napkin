import type { GlossaryEntry } from '../glossary';

// ────────────── Chapter 32 — Meromorphic functions ──────────────

const entries: Record<string, GlossaryEntry> = {
  meromorphic: {
    term: 'Meromorphic function',
    symbol: 'f = A/B',
    definition:
      'A function that is holomorphic everywhere on an open set except at an isolated set of poles, where it admits a Laurent series expansion. Think of it as a holomorphic function with controlled, isolated blow-ups — like a rational function but over ℂ.',
    example: '1/z is meromorphic on ℂ: holomorphic everywhere except at z = 0, where it has a simple pole.',
  },
  pole: {
    term: 'Pole of a meromorphic function',
    definition:
      'An isolated point p where a meromorphic function blows up to infinity in a controlled way — the Laurent series at p has finitely many negative-power terms. The number of negative-power terms is the order of the pole.',
    example: 'The function 1/z² has a pole of order 2 at z = 0.',
  },
  laurentSeries: {
    term: 'Laurent series',
    symbol: '\\sum_{n=-m}^{\\infty} c_n (z-p)^n',
    definition:
      'A power series that allows finitely many negative-exponent terms. Near a pole p of order m, a meromorphic function f expands as c_{−m}/(z−p)^m + ··· + c_{−1}/(z−p) + c_0 + c_1(z−p) + ···. The negative-power part is called the principal part.',
    example: 'e^z/z² = 1/z² + 1/z + 1/2 + z/6 + ··· is the Laurent series of e^z/z² at z = 0.',
  },
  poleOrder: {
    term: 'Order of a pole',
    definition:
      'For a pole p of a meromorphic function f, the order m is the largest positive integer such that (z−p)^m · f(z) remains bounded (and nonzero) near p. Equivalently, it is the index of the leading negative-power term in the Laurent series. A pole of order 1 is called a simple pole.',
    example: '1/z³ has a pole of order 3 at z = 0; (z²+1)/z has a simple pole at z = 0.',
  },
  simplePole: {
    term: 'Simple pole',
    definition:
      'A pole of order 1. The Laurent series near a simple pole p has the form c_{−1}/(z−p) + c_0 + c_1(z−p) + ···, with exactly one negative-power term. Simple poles are the mildest kind of pole.',
    example: '1/z has a simple pole at z = 0. The function z/(z²−1) has simple poles at z = ±1.',
  },
  residue: {
    term: 'Residue',
    symbol: '\\operatorname{Res}(f; p)',
    definition:
      'The coefficient c_{−1} in the Laurent series of f at a pole p. It is the unique complex number extracted by the formula Res(f; p) = (1/2πi) ∮_γ f(z) dz for a small circle γ around p. The residue theorem makes residues the key to computing contour integrals.',
    example: 'For f(z) = e^z/z², the Laurent series at z = 0 gives residue 1 (the coefficient of 1/z).',
  },
  principalPart: {
    term: 'Principal part',
    definition:
      'The negative-power portion of the Laurent series of f at a pole p: the sum c_{−m}/(z−p)^m + ··· + c_{−1}/(z−p). It captures all the singular behaviour of f near p. The remaining part c_0 + c_1(z−p) + ··· is called the analytic part.',
    example: 'For f(z) = 1/z² + 3/z + 5 near z = 0, the principal part is 1/z² + 3/z.',
  },
  zeroMultiplicity: {
    term: 'Zero of multiplicity k',
    definition:
      'A point p where a holomorphic function f vanishes to order k: f(p) = f′(p) = ··· = f^(k−1)(p) = 0 but f^(k)(p) ≠ 0. Equivalently, the Taylor series starts with the k-th power term. A zero of multiplicity 1 is a simple zero.',
    example: 'g(z) = 3z³ + 2z⁴ + ··· has a zero of multiplicity 3 at z = 0.',
  },
  windingNumber: {
    term: 'Winding number',
    symbol: '\\operatorname{Wind}(\\gamma, p)',
    definition:
      'For a loop γ and a point p not on γ, the winding number Wind(γ, p) = (1/2πi) ∮_γ 1/(z−p) dz counts how many times γ winds around p. It is always an integer: positive for counterclockwise winding, negative for clockwise, zero if p is outside.',
    example: 'A counterclockwise unit circle has winding number 1 around the origin and 0 around any point outside the circle.',
  },
  regularCurve: {
    term: 'Regular curve (loop)',
    definition:
      'A loop γ is regular if Wind(γ, p) = 1 for every point p in the interior of γ. A counterclockwise simple closed curve (like a circle traversed once) is regular. For regular curves the residue theorem simplifies: the integral equals the sum of residues inside.',
    example: 'The counterclockwise unit circle γ(t) = e^{it} for t ∈ [0, 2π] is a regular curve.',
  },
  residueTheorem: {
    term: "Cauchy's residue theorem",
    definition:
      'For a meromorphic function f on a simply connected domain and a loop γ not through any pole: (1/2πi) ∮_γ f(z) dz = Σ Wind(γ, p) · Res(f; p), summed over all poles p. For a regular γ this becomes the sum of residues inside γ. Generalises the Cauchy–Goursat theorem to meromorphic functions.',
    example: 'Integrating 1/z around the unit circle: (1/2πi)·2πi = 1, which equals Res(1/z; 0) = 1.',
  },
  logarithmicDerivative: {
    term: 'Logarithmic derivative',
    symbol: "f'/f",
    definition:
      "The function f′/f, named because it equals d/dz(log f). For a meromorphic f, its logarithmic derivative is also meromorphic: it has a simple pole of residue +k at each zero of f of multiplicity k, and a simple pole of residue −m at each pole of f of order m.",
    example: 'For P(z) = (z−a)^k, we get P′/P = k/(z−a), a simple pole at a with residue k.',
  },
  argumentPrinciple: {
    term: 'Argument principle',
    definition:
      'For a regular curve γ and a meromorphic f with no zeros or poles on γ: (1/2πi) ∮_γ f′/f dz = Z − P, where Z is the total number of zeros inside γ (counted with multiplicity) and P is the total number of poles inside γ (counted with order). Allows counting zeros and poles purely from contour integrals.',
    example: 'A polynomial of degree n satisfies Z − P = n (it has n zeros, no poles), confirmed by integrating its logarithmic derivative.',
  },
  holomorphicFn: {
    term: 'Holomorphic function',
    definition:
      'A complex-valued function that is complex-differentiable at every point in its domain. Holomorphic functions are infinitely differentiable and equal their Taylor series locally. They are the "nicest" functions in complex analysis: meromorphic functions are holomorphic except at isolated poles.',
    example: 'e^z, sin(z), and every polynomial are holomorphic on all of ℂ.',
  },
};

export default entries;
