import {
  ALL_ROOTS,
  EXERCISE_IDS,
  SCALE_TYPES,
  buildRoutineItems,
  getSaveRoutineError,
  getSelections,
  isValidRoutineConfiguration,
} from '../routineOptions';

const none = (n: number) => Array(n).fill(false);
const only = (n: number, ...indexes: number[]) =>
  none(n).map((_, i) => indexes.includes(i));

const ROOTS = ALL_ROOTS.length;
const TYPES = SCALE_TYPES.length;
const EXERCISES = EXERCISE_IDS.length;

describe('getSelections', () => {
  it('maps natural root checkboxes to note names', () => {
    const s = getSelections(only(ROOTS, 0, 4), none(TYPES), none(EXERCISES));

    expect(s.roots).toEqual(['C', 'G']);
  });

  it('maps accidental root checkboxes (after the 7 naturals)', () => {
    const s = getSelections(only(ROOTS, 7, 11), none(TYPES), none(EXERCISES));

    expect(s.roots).toEqual(['C#', 'Bb']);
  });

  it('maps type checkboxes', () => {
    const s = getSelections(none(ROOTS), only(TYPES, 1, 3), none(EXERCISES));

    expect(s.types).toEqual(['Minor', 'Diminished']);
  });

  it('maps exercise checkboxes to exercise types', () => {
    const s = getSelections(none(ROOTS), none(TYPES), only(EXERCISES, 0, 5));

    expect(s.exercises).toEqual(['scale', 'brokenOctave']);
  });

  it('selects everything when everything is checked', () => {
    const all = (n: number) => Array(n).fill(true);
    const s = getSelections(all(ROOTS), all(TYPES), all(EXERCISES));

    expect(s.roots).toEqual(ALL_ROOTS);
    expect(s.types).toEqual(SCALE_TYPES);
    expect(s.exercises).toEqual(EXERCISE_IDS);
  });

  it("matches the Generate screen's default checkboxes", () => {
    // Naturals ticked, accidentals not
    const defaults = [...Array(7).fill(true), ...Array(5).fill(false)];
    const s = getSelections(defaults, none(TYPES), none(EXERCISES));

    expect(s.roots).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
  });
});

describe('buildRoutineItems', () => {
  const build = (types: string[], exercises: string[]) =>
    buildRoutineItems({roots: ['C'], types, exercises}).map(i => i.displayItem);

  it('skips combinations that do not make sense', () => {
    expect(build(['Dorian', 'Dominant 7th'], ['scale', 'arpeggio'])).toEqual([
      'C Dorian Scale',
      'C Dominant 7th Arpeggio',
    ]);
  });

  it('only offers major and minor progressions', () => {
    expect(build(['Major', 'Minor', 'Augmented'], ['chordProgression'])).toEqual([
      'C Major I-IV-V-I Progression',
      'C Minor I-IV-V-I Progression',
    ]);
  });

  it('uses the long name for scale variations', () => {
    expect(
      build(['Harmonic Minor'], ['contraryScale', 'scaleThirds', 'brokenOctave']),
    ).toEqual([
      'C Harmonic Minor Scale in Contrary Motion',
      'C Harmonic Minor Scale in Thirds',
      'C Harmonic Minor Broken Octaves',
    ]);
  });

  it('counts new exercises towards their stats family', () => {
    const items = buildRoutineItems({
      roots: ['C'],
      types: ['Major'],
      exercises: ['scaleSixths', 'brokenOctave', 'chordInversions'],
    });

    expect(items.map(i => i.exerciseType)).toEqual(['scale', 'octave', 'solidChord']);
  });

  it('every type works with at least one exercise', () => {
    for (const type of SCALE_TYPES)
      expect(build([type], EXERCISE_IDS).length).toBeGreaterThan(0);
  });
});

describe('isValidRoutineConfiguration', () => {
  const valid = {roots: ['C'], types: ['Major'], exercises: ['scale']};

  it('accepts at least one of each', () => {
    expect(isValidRoutineConfiguration(valid)).toBe(true);
  });

  it.each(['roots', 'types', 'exercises'] as const)(
    'rejects when no %s are picked',
    key => {
      expect(isValidRoutineConfiguration({...valid, [key]: []})).toBe(false);
    },
  );
});

describe('getSaveRoutineError', () => {
  const valid = {roots: ['C'], types: ['Major'], exercises: ['scale']};

  it('allows a named, valid routine', () => {
    expect(getSaveRoutineError('Warmup', valid)).toBeNull();
  });

  it.each(['', '   '])('needs a name (got %p)', name => {
    expect(getSaveRoutineError(name, valid)).toMatch(/name/);
  });

  it('needs a valid selection', () => {
    expect(getSaveRoutineError('Warmup', {...valid, roots: []})).toMatch(
      /root, type and exercise/,
    );
  });

  it('needs at least one combination that makes sense', () => {
    expect(
      getSaveRoutineError('Warmup', {...valid, types: ['Dorian'], exercises: ['arpeggio']}),
    ).toMatch(/go with/);
  });
});
