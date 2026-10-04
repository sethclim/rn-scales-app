import {ExerciseType, RoutineItem} from './Models/DataModels';

// Checkbox options on the Generate screen, in display order
export const NATURAL_ROOTS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
export const ACCIDENTAL_ROOTS = ['C#', 'Eb', 'F#', 'G#', 'Bb'];
export const ALL_ROOTS = [...NATURAL_ROOTS, ...ACCIDENTAL_ROOTS];

const TRIADS = ['Major', 'Minor', 'Augmented', 'Diminished'];
const SEVENTHS = ['Dominant 7th', 'Diminished 7th', 'Major 7th', 'Minor 7th'];
// "Minor" on its own means natural minor for scales
const SCALE_ONLY = [
  'Harmonic Minor',
  'Melodic Minor',
  'Chromatic',
  'Whole-tone',
  'Major Pentatonic',
  'Minor Pentatonic',
  'Dorian',
  'Phrygian',
  'Lydian',
  'Mixolydian',
  'Locrian',
];

export const TYPE_GROUPS = [
  {title: 'Triads', types: TRIADS},
  {title: '7ths', types: SEVENTHS},
  {title: 'Scales & Modes', types: SCALE_ONLY},
];
export const SCALE_TYPES = TYPE_GROUPS.flatMap(g => g.types);

const SCALE_KINDS = ['Major', 'Minor', ...SCALE_ONLY];
const CHORD_KINDS = [...TRIADS, ...SEVENTHS];

export type ExerciseOption = {
  id: string;
  label: string; // checkbox text
  display: string; // end of the routine item, e.g. "C Major <display>"
  stat: ExerciseType; // which practice-stats bucket it counts towards
  types: string[]; // types it makes sense with
};

const exercise = (
  id: string,
  label: string,
  stat: ExerciseType,
  types: string[],
  display = label,
): ExerciseOption => ({id, label, display, stat, types});

export const EXERCISE_GROUPS: {title: string; exercises: ExerciseOption[]}[] = [
  {
    title: 'Scales',
    exercises: [
      exercise('scale', 'Scale', 'scale', SCALE_KINDS),
      exercise('contraryScale', 'Contrary Motion', 'scale', SCALE_KINDS, 'Scale in Contrary Motion'),
      exercise('scaleThirds', 'In Thirds', 'scale', SCALE_KINDS, 'Scale in Thirds'),
      exercise('scaleSixths', 'In Sixths', 'scale', SCALE_KINDS, 'Scale in Sixths'),
      exercise('octave', 'Octaves', 'octave', SCALE_KINDS),
      exercise('brokenOctave', 'Broken Octaves', 'octave', SCALE_KINDS),
    ],
  },
  {
    title: 'Arpeggios & Chords',
    exercises: [
      exercise('arpeggio', 'Arpeggio', 'arpeggio', CHORD_KINDS),
      exercise('solidChord', 'Solid Chords', 'solidChord', CHORD_KINDS),
      exercise('brokenChord', 'Broken Chords', 'brokenChord', CHORD_KINDS),
      exercise('chordInversions', 'Inversions', 'solidChord', CHORD_KINDS, 'Chord Inversions'),
      exercise('repeatedChords', 'Repeated Chords', 'solidChord', CHORD_KINDS),
      exercise('chordProgression', 'Progression', 'solidChord', ['Major', 'Minor'], 'I-IV-V-I Progression'),
    ],
  },
];
export const EXERCISE_OPTIONS = EXERCISE_GROUPS.flatMap(g => g.exercises);
export const EXERCISE_IDS = EXERCISE_OPTIONS.map(e => e.id);

export type RoutineSelections = {
  roots: string[];
  types: string[];
  exercises: string[]; // ExerciseOption ids
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
  exercises: pick(EXERCISE_IDS, exerciseChecks),
});

// Every root x type x exercise, skipping combinations that don't make sense
// (e.g. a Dorian arpeggio)
export const buildRoutineItems = (s: RoutineSelections): RoutineItem[] => {
  const exercises = EXERCISE_OPTIONS.filter(e => s.exercises.includes(e.id));
  // Keep the caller's exercise order
  exercises.sort((a, b) => s.exercises.indexOf(a.id) - s.exercises.indexOf(b.id));

  return s.roots.flatMap(root =>
    s.types.flatMap(type =>
      exercises
        .filter(e => e.types.includes(type))
        .map(e => ({
          displayItem: `${root} ${type} ${e.display}`,
          exerciseType: e.stat,
        })),
    ),
  );
};

// Returns why these selections can't make a routine, or null if they can
export const getSelectionError = (s: RoutineSelections): string | null => {
  if (s.roots.length === 0 || s.types.length === 0 || s.exercises.length === 0)
    return 'Pick at least one root, type and exercise.';
  if (buildRoutineItems(s).length === 0)
    return "None of those types go with those exercises (e.g. modes are scales only, 7ths are arpeggios and chords only).";
  return null;
};

export const isValidRoutineConfiguration = (s: RoutineSelections) =>
  getSelectionError(s) === null;

// Returns why a routine can't be saved, or null if it can
export const getSaveRoutineError = (
  name: string,
  s: RoutineSelections,
): string | null => {
  const error = getSelectionError(s);
  if (error != null) return error;
  if (name.trim().length === 0) return 'Give the routine a name.';
  return null;
};
