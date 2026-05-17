import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MCQ from './MCQ';
import { loadExercise } from '../lib/progress';

const options = [
  { id: 'a', label: 'The integers' },
  { id: 'b', label: 'The naturals' },
];

beforeEach(() => {
  // Pretend we're on a known slide path so progress keys are stable.
  window.history.replaceState({}, '', '/some-slide');
});

describe('MCQ', () => {
  it('marks the correct option as correct and persists', async () => {
    const user = userEvent.setup();
    render(<MCQ id="q1" prompt="Pick one" options={options} correct="a" />);

    await user.click(screen.getByRole('button', { name: 'The integers' }));

    const stored = loadExercise('/some-slide', 'q1');
    expect(stored?.outcome).toBe('correct');
    expect(stored?.answer).toBe('a');
  });

  it('marks a wrong option as incorrect and persists', async () => {
    const user = userEvent.setup();
    render(<MCQ id="q2" prompt="Pick one" options={options} correct="a" />);

    await user.click(screen.getByRole('button', { name: 'The naturals' }));

    const stored = loadExercise('/some-slide', 'q2');
    expect(stored?.outcome).toBe('incorrect');
    expect(stored?.answer).toBe('b');
  });

  it('disables further interaction once revealed', async () => {
    const user = userEvent.setup();
    render(<MCQ id="q3" prompt="Pick one" options={options} correct="a" />);

    await user.click(screen.getByRole('button', { name: 'The integers' }));

    expect(screen.getByRole('button', { name: 'The integers' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'The naturals' })).toBeDisabled();
  });

  it('rehydrates selection from localStorage on mount', () => {
    window.localStorage.setItem(
      'napkin:exercise:/some-slide#q4',
      JSON.stringify({ outcome: 'correct', answer: 'a', attempts: 1, updatedAt: 1 }),
    );
    render(
      <MCQ
        id="q4"
        prompt="Pick one"
        options={options}
        correct="a"
        explanation="because"
      />,
    );
    expect(screen.getByText('Why:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'The integers' })).toBeDisabled();
  });
});
