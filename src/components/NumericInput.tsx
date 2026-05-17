import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { loadExercise, saveExercise, currentSlidePath } from '../lib/progress';
import { answersEqual } from '../lib/answer-normalise';

interface Props {
  id: string;
  prompt: ReactNode;
  /** Canonical expected answer as a string (e.g. "1/2", "0.5", "42"). */
  expected: string;
  /** Optional placeholder hint for the input. */
  placeholder?: string;
  explanation?: ReactNode;
}

export default function NumericInput({ id, prompt, expected, placeholder, explanation }: Props) {
  const [value, setValue] = useState('');
  const [outcome, setOutcome] = useState<'idle' | 'correct' | 'incorrect'>('idle');

  useEffect(() => {
    const prev = loadExercise(currentSlidePath(), id);
    if (prev?.answer) {
      setValue(prev.answer);
      setOutcome(prev.outcome === 'correct' ? 'correct' : 'incorrect');
    }
  }, [id]);

  function submit(e: FormEvent) {
    e.preventDefault();
    const ok = answersEqual(value, expected);
    setOutcome(ok ? 'correct' : 'incorrect');
    saveExercise(currentSlidePath(), id, {
      outcome: ok ? 'correct' : 'incorrect',
      answer: value,
    });
  }

  return (
    <form
      onSubmit={submit}
      className="not-prose my-6 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 p-5"
    >
      <div className="text-sm uppercase tracking-wider text-stone-500 mb-2">Exercise</div>
      <div className="mb-4">{prompt}</div>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder ?? 'Your answer'}
          className="flex-1 rounded-md border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 px-3 py-2 font-mono"
          spellCheck={false}
          autoComplete="off"
        />
        <button
          type="submit"
          className="rounded-md bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 px-4 py-2 hover:opacity-90"
        >
          Check
        </button>
      </div>
      {outcome === 'correct' && (
        <div className="mt-3 text-emerald-700 dark:text-emerald-400">Correct.</div>
      )}
      {outcome === 'incorrect' && (
        <div className="mt-3 text-rose-700 dark:text-rose-400">Not quite — try again.</div>
      )}
      {outcome === 'correct' && explanation && (
        <div className="mt-3 text-sm text-stone-700 dark:text-stone-300">
          <strong>Why:</strong> {explanation}
        </div>
      )}
    </form>
  );
}
