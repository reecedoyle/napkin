import { useEffect, useState, type ReactNode } from 'react';
import { loadExercise, saveExercise, currentSlidePath } from '../lib/progress';

type Difficulty = 'standard' | 'starred' | 'daggered';

interface Props {
  id: string;
  prompt: ReactNode;
  hint?: ReactNode;
  solution: ReactNode;
  /**
   * Source's `\begin{problem}` is "standard"; `\begin{sproblem}` is "starred"
   * (more challenging); `\begin{dproblem}` is "daggered" (very hard).
   */
  difficulty?: Difficulty;
}

const difficultyBadge: Record<Difficulty, { glyph: string; label: string }> = {
  standard: { glyph: '', label: 'Problem' },
  starred: { glyph: '★', label: 'Problem (challenging)' },
  daggered: { glyph: '✦', label: 'Problem (hard)' },
};

type Stage = 'idle' | 'hinted' | 'solved';

export default function Problem({ id, prompt, hint, solution, difficulty = 'standard' }: Props) {
  const [stage, setStage] = useState<Stage>('idle');
  const badge = difficultyBadge[difficulty];

  useEffect(() => {
    const prev = loadExercise(currentSlidePath(), id);
    if (prev?.outcome === 'revealed') setStage('solved');
  }, [id]);

  function revealHint() {
    if (stage === 'idle') setStage('hinted');
  }

  function revealSolution() {
    setStage('solved');
    saveExercise(currentSlidePath(), id, { outcome: 'revealed' });
  }

  return (
    <div className="not-prose my-6 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 p-5">
      <div className="text-sm uppercase tracking-wider text-stone-500 mb-2 flex items-center gap-2">
        <span>{badge.label}</span>
        {badge.glyph && (
          <span aria-hidden="true" className="text-amber-600 dark:text-amber-400">
            {badge.glyph}
          </span>
        )}
      </div>

      <div className="mb-4">{prompt}</div>

      {hint && stage === 'idle' && (
        <button
          type="button"
          onClick={revealHint}
          className="rounded-md border border-stone-300 dark:border-stone-700 px-3 py-1.5 text-sm hover:bg-stone-100 dark:hover:bg-stone-800 mr-2"
        >
          Show hint
        </button>
      )}
      {stage === 'idle' && (
        <button
          type="button"
          onClick={revealSolution}
          className="rounded-md border border-stone-300 dark:border-stone-700 px-3 py-1.5 text-sm hover:bg-stone-100 dark:hover:bg-stone-800"
        >
          Show solution
        </button>
      )}

      {stage !== 'idle' && hint && (
        <div className="mt-2 border-l-2 border-stone-300 dark:border-stone-700 pl-3 text-sm text-stone-700 dark:text-stone-300">
          <div className="text-xs uppercase tracking-wider text-stone-500 mb-1">Hint</div>
          {hint}
        </div>
      )}

      {stage === 'hinted' && (
        <div className="mt-3">
          <button
            type="button"
            onClick={revealSolution}
            className="rounded-md border border-stone-300 dark:border-stone-700 px-3 py-1.5 text-sm hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            Show solution
          </button>
        </div>
      )}

      {stage === 'solved' && (
        <div className="mt-4 border-t border-stone-200 dark:border-stone-800 pt-4">
          <div className="text-xs uppercase tracking-wider text-stone-500 mb-2">Solution</div>
          <div>{solution}</div>
        </div>
      )}
    </div>
  );
}
