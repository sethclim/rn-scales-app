export type ExerciseType =
  | 'scale'
  | 'octave'
  | 'arpeggio'
  | 'solidChord'
  | 'brokenChord';

export class PracticeData {
  Total: number = 0;
  _date: Date;
  scale: number = 0;
  octave: number = 0;
  arpeggio: number = 0;
  solidChord: number = 0;
  brokenChord: number = 0;

  constructor(Date: Date) {
    this._date = Date;
  }

  getDate() {
    return this._date;
  }

  getCounts = (): Map<ExerciseType, number> => {
    return new Map([
      ['scale', this.scale],
      ['octave', this.octave],
      ['arpeggio', this.arpeggio],
      ['solidChord', this.solidChord],
      ['brokenChord', this.brokenChord],
    ]);
  };

  updateValues(ex: ExerciseType, amt: number) {
    switch (ex) {
      case 'scale':
        this.scale += amt;
        break;
      case 'octave':
        this.octave += amt;
        break;
      case 'arpeggio':
        this.arpeggio += amt;
        break;
      case 'solidChord':
        this.solidChord += amt;
        break;
      case 'brokenChord':
        this.brokenChord += amt;
        break;
    }
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
