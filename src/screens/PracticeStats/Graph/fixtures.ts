import {
  ExerciseType,
  IAllPracticeData,
  IPracticeData,
} from '../../../data/Models/DataModels';

// Sample datasets for the Graph Playground screen and GraphBuilder tests

type Counts = Partial<Record<ExerciseType, number>>;

const entry = (date: Date, counts: Counts = {}): IPracticeData => ({
  date: date.toString(),
  scale: 0,
  octave: 0,
  arpeggio: 0,
  solidChord: 0,
  brokenChord: 0,
  ...counts,
});

// Mon 28 Sep 2026 + offset, in local time
const weekday = (offset: number) => new Date(2026, 8, 28 + offset);
const month = (m: number) => new Date(2026, m, 1);

const data = (d: Partial<IAllPracticeData>): IAllPracticeData => ({
  Year: [],
  Month: [],
  Week: [],
  Day: [],
  ...d,
});

export const GRAPH_FIXTURES: Record<string, IAllPracticeData> = {
  'No data': data({}),

  'All zeros': data({
    Week: [entry(weekday(0)), entry(weekday(1))],
    Year: [entry(month(9))],
  }),

  'Single day': data({
    Week: [entry(weekday(2), {scale: 4, arpeggio: 2})],
    Year: [entry(month(9), {scale: 4, arpeggio: 2})],
  }),

  'Monday only': data({
    Week: [entry(weekday(0), {scale: 5, octave: 3})],
  }),

  'Sunday only': data({
    Week: [entry(weekday(6), {scale: 5, octave: 3})],
  }),

  'Full week': data({
    Week: [
      entry(weekday(0), {scale: 3, octave: 1, arpeggio: 2, solidChord: 0, brokenChord: 1}),
      entry(weekday(1), {scale: 5, octave: 2, arpeggio: 4, solidChord: 1, brokenChord: 2}),
      entry(weekday(2), {scale: 2, octave: 4, arpeggio: 1, solidChord: 3, brokenChord: 0}),
      entry(weekday(3), {scale: 8, octave: 3, arpeggio: 6, solidChord: 2, brokenChord: 4}),
      entry(weekday(4), {scale: 6, octave: 6, arpeggio: 3, solidChord: 5, brokenChord: 3}),
      entry(weekday(5), {scale: 9, octave: 2, arpeggio: 7, solidChord: 4, brokenChord: 6}),
      entry(weekday(6), {scale: 4, octave: 5, arpeggio: 5, solidChord: 6, brokenChord: 2}),
    ],
  }),

  'Gaps in week': data({
    Week: [
      entry(weekday(0), {scale: 3, brokenChord: 2}),
      entry(weekday(3), {scale: 7, brokenChord: 5}),
      entry(weekday(6), {scale: 2, brokenChord: 8}),
    ],
  }),

  'Exactly 10': data({
    Week: [entry(weekday(1), {scale: 10}), entry(weekday(2), {scale: 5})],
  }),

  'Huge numbers': data({
    Week: [
      entry(weekday(0), {scale: 999, octave: 1}),
      entry(weekday(1), {scale: 1000, octave: 500}),
      entry(weekday(2), {scale: 3, octave: 750}),
    ],
    Year: [
      entry(month(0), {arpeggio: 12000}),
      entry(month(1), {arpeggio: 4}),
    ],
  }),

  'Full year': data({
    Year: Array.from({length: 12}, (_, m) =>
      entry(month(m), {
        scale: 20 + m * 6,
        octave: 40 - m * 2,
        arpeggio: (m % 3) * 15,
        solidChord: m * m,
        brokenChord: 30,
      }),
    ),
  }),

  'Jan + Dec only': data({
    Year: [entry(month(0), {scale: 12}), entry(month(11), {scale: 30})],
  }),
};
