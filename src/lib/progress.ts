/**
 * Per-exercise outcome persisted to localStorage.
 * Keyed by `${slidePath}#${exerciseId}` so two exercises on the same
 * slide stay independent.
 */
export type Outcome = 'attempted' | 'correct' | 'incorrect' | 'revealed';

export interface ExerciseState {
  outcome: Outcome;
  answer?: string;
  attempts: number;
  updatedAt: number;
}

const NAMESPACE = 'napkin:exercise';

function key(slidePath: string, exerciseId: string): string {
  return `${NAMESPACE}:${slidePath}#${exerciseId}`;
}

export function loadExercise(slidePath: string, exerciseId: string): ExerciseState | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(key(slidePath, exerciseId));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ExerciseState;
  } catch {
    return null;
  }
}

export function saveExercise(
  slidePath: string,
  exerciseId: string,
  patch: Partial<ExerciseState> & { outcome: Outcome },
): ExerciseState {
  const prev = loadExercise(slidePath, exerciseId);
  const next: ExerciseState = {
    ...prev,
    ...patch,
    attempts: (prev?.attempts ?? 0) + (patch.outcome === 'attempted' ? 0 : 1),
    updatedAt: Date.now(),
  };
  window.localStorage.setItem(key(slidePath, exerciseId), JSON.stringify(next));
  return next;
}

export function currentSlidePath(): string {
  if (typeof window === 'undefined') return '';
  return window.location.pathname;
}
