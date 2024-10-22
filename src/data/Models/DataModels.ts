export type ExerciseType =
  | 'scale'
  | 'octave'
  | 'arpeggio'
  | 'solid-chord'
  | 'broken-chord';

export class PracticeData {
  Counts: Map<ExerciseType, number> = new Map();
  Total: number = 0;
  Date: Date;

  constructor(Date: Date) {
    this.Date = Date;
    this.Counts.set('scale', 0);
    this.Counts.set('octave', 0);
    this.Counts.set('arpeggio', 0);
    this.Counts.set('solid-chord', 0);
    this.Counts.set('solid-chord', 0);
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
