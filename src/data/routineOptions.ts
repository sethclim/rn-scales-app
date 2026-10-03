import {ExerciseType, Exercises} from './Models/DataModels';

// Checkbox options on the Generate screen, in display order
export const NATURAL_ROOTS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
export const ACCIDENTAL_ROOTS = ['C#', 'Eb', 'F#', 'G#', 'Bb'];
export const ALL_ROOTS = [...NATURAL_ROOTS, ...ACCIDENTAL_ROOTS];
export const SCALE_TYPES = ['Major', 'Minor', 'Augmented', 'Diminished'];
export const EXERCISE_TYPES: ExerciseType[] = [...Exercises.keys()];

export type RoutineSelections = {
  roots: string[];
  types: string[];
  exercises: ExerciseType[];
};

const pick = <T>(options: T[], checked: boolean[]) =>
  options.filter((_, i) => checked[i]);

// Turn the screen's checkbox states into the chosen option names
export const getSelections = (
  rootChecks: boolean[],
  typeChecks: boolean[],
  exerciseChecks: boolean[],
): RoutineSelections => ({
  roots: pick(ALL_ROOTS, rootChecks),
  types: pick(SCALE_TYPES, typeChecks),
  exercises: pick(EXERCISE_TYPES, exerciseChecks),
});

export const isValidRoutineConfiguration = (s: RoutineSelections) =>
  s.roots.length > 0 && s.types.length > 0 && s.exercises.length > 0;

// Returns why a routine can't be saved, or null if it can
export const getSaveRoutineError = (
  name: string,
  s: RoutineSelections,
): string | null => {
  if (!isValidRoutineConfiguration(s))
    return 'Pick at least one root, type and exercise.';
  if (name.trim().length === 0) return 'Give the routine a name.';
  return null;
};
