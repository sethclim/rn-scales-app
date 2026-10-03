import {
  ALL_ROOTS,
  EXERCISE_TYPES,
  SCALE_TYPES,
  getSaveRoutineError,
  getSelections,
  isValidRoutineConfiguration,
} from '../routineOptions';

const none = (n: number) => Array(n).fill(false);
const only = (n: number, ...indexes: number[]) =>
  none(n).map((_, i) => indexes.includes(i));

const ROOTS = ALL_ROOTS.length;
const TYPES = SCALE_TYPES.length;
const EXERCISES = EXERCISE_TYPES.length;

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
    const s = getSelections(none(ROOTS), none(TYPES), only(EXERCISES, 0, 4));

    expect(s.exercises).toEqual(['scale', 'brokenChord']);
  });

  it('selects everything when everything is checked', () => {
    const all = (n: number) => Array(n).fill(true);
    const s = getSelections(all(ROOTS), all(TYPES), all(EXERCISES));

    expect(s.roots).toEqual(ALL_ROOTS);
    expect(s.types).toEqual(SCALE_TYPES);
    expect(s.exercises).toEqual([
      'scale',
      'octave',
      'arpeggio',
      'solidChord',
      'brokenChord',
    ]);
  });

  it("matches the Generate screen's default checkboxes", () => {
    // Naturals ticked, accidentals not
    const defaults = [...Array(7).fill(true), ...Array(5).fill(false)];
    const s = getSelections(defaults, none(TYPES), none(EXERCISES));

    expect(s.roots).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
  });
});

describe('isValidRoutineConfiguration', () => {
  const valid = {roots: ['C'], types: ['Major'], exercises: ['scale' as const]};

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
  const valid = {roots: ['C'], types: ['Major'], exercises: ['scale' as const]};

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
});
