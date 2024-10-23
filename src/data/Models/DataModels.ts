export type ExerciseType =
  | 'scale'
  | 'octave'
  | 'arpeggio'
  | 'solid-chord'
  | 'broken-chord';

export class PracticeData {
  Total: number = 0;
  Date: Date;
  scale: number = 0;
  octave: number = 0;
  arpeggio: number = 0;
  solidChord: number = 0;
  brokenChord: number = 0;

  constructor(Date: Date) {
    this.Date = Date;
  }
}

export interface Routine {
  RoutineItems: RoutineItem[];
  createdAt: string;
  title: string;
  id: string;
}

export interface RoutineItem {
  displayItem: string;
  exerciseType: ExerciseType;
}
