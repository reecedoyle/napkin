import { useEffect, useState, type ReactNode } from 'react';
import { loadExercise, saveExercise, currentSlidePath } from '../lib/progress';

export interface MCQOption {
  id: string;
  label: ReactNode;
}

interface Props {
  id: string;
  prompt: ReactNode;
  options: MCQOption[];
  correct: string;
  explanation?: ReactNode;
}

export default function MCQ({ id, prompt, options, correct, explanation }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const prev = loadExercise(currentSlidePath(), id);
    if (prev?.answer) {
      setSelected(prev.answer);
      setRevealed(true);
    }
  }, [id]);

  function choose(optionId: string) {
    setSelected(optionId);
    setRevealed(true);
    saveExercise(currentSlidePath(), id, {
      outcome: optionId === correct ? 'correct' : 'incorrect',
      answer: optionId,
    });
  }

  return (
    <div className="not-prose my-6 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 p-5">
      <div className="text-sm uppercase tracking-wider text-stone-500 mb-2">Exercise</div>
      <div className="mb-4">{prompt}</div>
      <ul className="space-y-2">
        {options.map((opt) => {
          const isSelected = selected === opt.id;
          const isCorrect = revealed && opt.id === correct;
          const isWrong = revealed && isSelected && opt.id !== correct;
          return (
            <li key={opt.id}>
              <button
                type="button"
                onClick={() => choose(opt.id)}
                disabled={revealed}
                className={[
                  'w-full text-left rounded-md border px-4 py-2 transition',
                  'border-stone-300 dark:border-stone-700',
                  'hover:bg-stone-100 dark:hover:bg-stone-800',
                  'disabled:cursor-default',
                  isCorrect ? 'bg-emerald-100 border-emerald-500 dark:bg-emerald-950/50' : '',
                  isWrong ? 'bg-rose-100 border-rose-500 dark:bg-rose-950/50' : '',
                ].join(' ')}
              >
                {opt.label}
              </button>
            </li>
          );
        })}
      </ul>
      {revealed && explanation && (
        <div className="mt-4 text-sm text-stone-700 dark:text-stone-300">
          <strong>Why:</strong> {explanation}
        </div>
      )}
    </div>
  );
}
