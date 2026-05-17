/**
 * Lightweight numeric-answer comparison for the pilot.
 * Supports integers, decimals, and simple fractions like "a/b".
 *
 * Deliberately *not* a CAS — we expand if/when a slide actually needs
 * symbolic equivalence (sqrt(2), pi, etc.). For now KISS.
 */

const FRACTION = /^\s*(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)\s*$/;
const NUMBER = /^\s*-?\d+(?:\.\d+)?\s*$/;

export function toNumber(input: string): number | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (NUMBER.test(trimmed)) {
    const n = Number(trimmed);
    return Number.isFinite(n) ? n : null;
  }

  const m = trimmed.match(FRACTION);
  if (m) {
    const num = Number(m[1]);
    const den = Number(m[2]);
    if (!Number.isFinite(num) || !Number.isFinite(den) || den === 0) return null;
    return num / den;
  }

  return null;
}

export function answersEqual(actual: string, expected: string, epsilon = 1e-6): boolean {
  const a = toNumber(actual);
  const e = toNumber(expected);
  if (a === null || e === null) {
    return actual.trim() === expected.trim();
  }
  return Math.abs(a - e) <= epsilon * Math.max(1, Math.abs(e));
}
