import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Problem from './Problem';
import { loadExercise } from '../lib/progress';

beforeEach(() => {
  window.history.replaceState({}, '', '/problem-slide');
});

describe('Problem', () => {
  it('hides hint and solution by default; offers both buttons when hint is provided', () => {
    render(
      <Problem id="p1" prompt="Prove it" hint="A clever hint." solution="The proof." />,
    );
    expect(screen.queryByText('A clever hint.')).not.toBeInTheDocument();
    expect(screen.queryByText('The proof.')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show hint/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show solution/i })).toBeInTheDocument();
  });

  it('only offers Show solution when no hint is provided', () => {
    render(<Problem id="p2" prompt="Prove it" solution="The proof." />);
    expect(screen.queryByRole('button', { name: /show hint/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show solution/i })).toBeInTheDocument();
  });

  it('reveals hint, then solution on subsequent click; persists to localStorage', async () => {
    const user = userEvent.setup();
    render(
      <Problem id="p3" prompt="Prove it" hint="A clever hint." solution="The proof." />,
    );

    await user.click(screen.getByRole('button', { name: /show hint/i }));
    expect(screen.getByText('A clever hint.')).toBeInTheDocument();
    expect(screen.queryByText('The proof.')).not.toBeInTheDocument();
    // Storage not yet written — viewing the hint isn't a "completion" event.
    expect(loadExercise('/problem-slide', 'p3')).toBeNull();

    await user.click(screen.getByRole('button', { name: /show solution/i }));
    expect(screen.getByText('The proof.')).toBeInTheDocument();
    expect(loadExercise('/problem-slide', 'p3')?.outcome).toBe('revealed');
  });

  it('rehydrates as solved if previously revealed', () => {
    window.localStorage.setItem(
      'napkin:exercise:/problem-slide#p4',
      JSON.stringify({ outcome: 'revealed', attempts: 1, updatedAt: 1 }),
    );
    render(
      <Problem id="p4" prompt="Prove it" hint="The hint." solution="The proof." />,
    );
    expect(screen.getByText('The proof.')).toBeInTheDocument();
    expect(screen.getByText('The hint.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /show solution/i })).not.toBeInTheDocument();
  });

  it('renders the starred difficulty badge', () => {
    render(
      <Problem
        id="p5"
        prompt="Prove it"
        solution="The proof."
        difficulty="starred"
      />,
    );
    expect(screen.getByText(/Problem.*challenging/)).toBeInTheDocument();
    expect(screen.getByText('★')).toBeInTheDocument();
  });
});
