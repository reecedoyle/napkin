import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NumericInput from './NumericInput';
import { loadExercise } from '../lib/progress';

beforeEach(() => {
  window.history.replaceState({}, '', '/numeric-slide');
});

describe('NumericInput', () => {
  it('accepts an exact-match answer', async () => {
    const user = userEvent.setup();
    render(<NumericInput id="n1" prompt="2 + 2 = ?" expected="4" />);

    await user.type(screen.getByRole('textbox'), '4');
    await user.click(screen.getByRole('button', { name: /check/i }));

    expect(screen.getByText('Correct.')).toBeInTheDocument();
    expect(loadExercise('/numeric-slide', 'n1')?.outcome).toBe('correct');
  });

  it('accepts a fraction equivalent', async () => {
    const user = userEvent.setup();
    render(<NumericInput id="n2" prompt="What is half?" expected="0.5" />);

    await user.type(screen.getByRole('textbox'), '1/2');
    await user.click(screen.getByRole('button', { name: /check/i }));

    expect(screen.getByText('Correct.')).toBeInTheDocument();
  });

  it('rejects a wrong answer', async () => {
    const user = userEvent.setup();
    render(<NumericInput id="n3" prompt="2 + 2 = ?" expected="4" />);

    await user.type(screen.getByRole('textbox'), '5');
    await user.click(screen.getByRole('button', { name: /check/i }));

    expect(screen.getByText(/not quite/i)).toBeInTheDocument();
    expect(loadExercise('/numeric-slide', 'n3')?.outcome).toBe('incorrect');
  });

  it('rehydrates a previous correct answer', () => {
    window.localStorage.setItem(
      'napkin:exercise:/numeric-slide#n4',
      JSON.stringify({ outcome: 'correct', answer: '4', attempts: 1, updatedAt: 1 }),
    );
    render(<NumericInput id="n4" prompt="2 + 2 = ?" expected="4" />);
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('4');
    expect(screen.getByText('Correct.')).toBeInTheDocument();
  });
});
