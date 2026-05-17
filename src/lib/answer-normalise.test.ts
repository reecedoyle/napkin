import { describe, it, expect } from 'vitest';
import { toNumber, answersEqual } from './answer-normalise';

describe('toNumber', () => {
  it('parses integers', () => {
    expect(toNumber('42')).toBe(42);
    expect(toNumber('-7')).toBe(-7);
    expect(toNumber('  3  ')).toBe(3);
  });

  it('parses decimals', () => {
    expect(toNumber('0.5')).toBe(0.5);
    expect(toNumber('-1.25')).toBe(-1.25);
  });

  it('parses simple fractions', () => {
    expect(toNumber('1/2')).toBe(0.5);
    expect(toNumber('-3/4')).toBe(-0.75);
    expect(toNumber('  1 / 2  ')).toBe(0.5);
  });

  it('returns null for non-numeric input', () => {
    expect(toNumber('')).toBeNull();
    expect(toNumber('hello')).toBeNull();
    expect(toNumber('1+1')).toBeNull();
    expect(toNumber('sqrt(2)')).toBeNull();
  });

  it('returns null for divide-by-zero', () => {
    expect(toNumber('1/0')).toBeNull();
  });
});

describe('answersEqual', () => {
  it('treats 1/2 and 0.5 as equal', () => {
    expect(answersEqual('1/2', '0.5')).toBe(true);
    expect(answersEqual('0.5', '1/2')).toBe(true);
  });

  it('handles tiny floating-point error', () => {
    expect(answersEqual('0.1', '0.10000000001')).toBe(true);
  });

  it('rejects clearly different numbers', () => {
    expect(answersEqual('5', '6')).toBe(false);
    expect(answersEqual('1/2', '1/3')).toBe(false);
  });

  it('falls back to string equality for non-numeric', () => {
    expect(answersEqual('foo', 'foo')).toBe(true);
    expect(answersEqual('foo', 'bar')).toBe(false);
  });
});
