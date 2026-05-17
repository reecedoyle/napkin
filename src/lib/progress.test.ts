import { describe, it, expect } from 'vitest';
import { loadExercise, saveExercise } from './progress';

describe('progress', () => {
  it('returns null for unknown exercise', () => {
    expect(loadExercise('/some-slide', 'q1')).toBeNull();
  });

  it('round-trips a saved outcome', () => {
    saveExercise('/slide', 'q1', { outcome: 'correct', answer: 'a' });
    const loaded = loadExercise('/slide', 'q1');
    expect(loaded?.outcome).toBe('correct');
    expect(loaded?.answer).toBe('a');
    expect(loaded?.attempts).toBe(1);
    expect(loaded?.updatedAt).toBeTypeOf('number');
  });

  it('keeps two exercises on the same slide independent', () => {
    saveExercise('/slide', 'q1', { outcome: 'correct', answer: 'a' });
    saveExercise('/slide', 'q2', { outcome: 'incorrect', answer: 'b' });
    expect(loadExercise('/slide', 'q1')?.answer).toBe('a');
    expect(loadExercise('/slide', 'q2')?.answer).toBe('b');
  });

  it('keeps the same exercise id on different slides independent', () => {
    saveExercise('/a', 'q1', { outcome: 'correct', answer: 'x' });
    saveExercise('/b', 'q1', { outcome: 'incorrect', answer: 'y' });
    expect(loadExercise('/a', 'q1')?.answer).toBe('x');
    expect(loadExercise('/b', 'q1')?.answer).toBe('y');
  });

  it('increments attempts on subsequent saves', () => {
    saveExercise('/slide', 'q1', { outcome: 'incorrect', answer: 'a' });
    saveExercise('/slide', 'q1', { outcome: 'correct', answer: 'b' });
    expect(loadExercise('/slide', 'q1')?.attempts).toBe(2);
  });
});
