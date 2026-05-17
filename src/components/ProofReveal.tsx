import { useEffect, useState, type ReactNode } from 'react';
import { loadExercise, saveExercise, currentSlidePath } from '../lib/progress';

interface Props {
  id: string;
  prompt: ReactNode;
  /** The worked solution / proof, shown after reveal. */
  solution: ReactNode;
}

export default function ProofReveal({ id, prompt, solution }: Props) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const prev = loadExercise(currentSlidePath(), id);
    if (prev?.outcome === 'revealed') setRevealed(true);
  }, [id]);

  function reveal() {
    setRevealed(true);
    saveExercise(currentSlidePath(), id, { outcome: 'revealed' });
  }

  return (
    <div className="not-prose my-6 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 p-5">
      <div className="text-sm uppercase tracking-wider text-stone-500 mb-2">Exercise (proof)</div>
      <div className="mb-4">{prompt}</div>
      {!revealed ? (
        <div>
          <p className="text-sm text-stone-600 dark:text-stone-400 mb-3">
            Try this on paper or in your head before revealing.
          </p>
          <button
            type="button"
            onClick={reveal}
            className="rounded-md border border-stone-300 dark:border-stone-700 px-4 py-2 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            Reveal solution
          </button>
        </div>
      ) : (
        <div className="border-t border-stone-200 dark:border-stone-800 pt-4">
          <div className="text-sm uppercase tracking-wider text-stone-500 mb-2">Solution</div>
          <div>{solution}</div>
        </div>
      )}
    </div>
  );
}
