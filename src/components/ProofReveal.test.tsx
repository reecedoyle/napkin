import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProofReveal from './ProofReveal';
import { loadExercise } from '../lib/progress';

beforeEach(() => {
  window.history.replaceState({}, '', '/proof-slide');
});

describe('ProofReveal', () => {
  it('hides the solution by default', () => {
    render(<ProofReveal id="p1" prompt="Prove it" solution="Here is the proof." />);
    expect(screen.queryByText('Here is the proof.')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reveal/i })).toBeInTheDocument();
  });

  it('reveals the solution on click and persists', async () => {
    const user = userEvent.setup();
    render(<ProofReveal id="p2" prompt="Prove it" solution="The proof." />);

    await user.click(screen.getByRole('button', { name: /reveal/i }));

    expect(screen.getByText('The proof.')).toBeInTheDocument();
    expect(loadExercise('/proof-slide', 'p2')?.outcome).toBe('revealed');
  });

  it('rehydrates as revealed if previously revealed', () => {
    window.localStorage.setItem(
      'napkin:exercise:/proof-slide#p3',
      JSON.stringify({ outcome: 'revealed', attempts: 1, updatedAt: 1 }),
    );
    render(<ProofReveal id="p3" prompt="Prove it" solution="The proof." />);
    expect(screen.getByText('The proof.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /reveal/i })).not.toBeInTheDocument();
  });
});
