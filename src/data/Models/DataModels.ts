export type ExerciseType =
  | 'scale'
  | 'octave'
  | 'arpeggio'
  | 'solidChord'
  | 'brokenChord';

export interface IPracticeData {
  Total?: number;
  date: string;
  scale: number;
  octave: number;
  arpeggio: number;
  solidChord: number;
  brokenChord: number;
}

export interface Routine {
  id: string;
  title: string;
  createdAt: string;
  RoutineItems: RoutineItem[];
}

export interface RoutineItem {
  displayItem: string;
  exerciseType: ExerciseType;
}

export interface IAllPracticeData {
  Year: IPracticeData[];
  Month: IPracticeData[];
  Week: IPracticeData[];
  Day: IPracticeData[];
}

export const Exercises = new Map<ExerciseType, string>([
  ["scale", "Scale"],
  ["octave", "Octaves"],
  ["arpeggio", "Arpeggio"],
  ["solidChord", "Solid Chords"],
  ["brokenChord", "Broken Chords"],
]);
