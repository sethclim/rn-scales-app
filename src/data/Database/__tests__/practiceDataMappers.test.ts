import {mapWeekRows, mapYearRows} from '../practiceDataMappers';
import type {DBPracticeDataGrouped} from '../database';

// Pin a timezone west of UTC so date-parsing bugs show up on every machine
process.env.TZ = 'America/Toronto';

const row = (
  date_month_year: string,
  counts: Partial<DBPracticeDataGrouped> = {},
): DBPracticeDataGrouped => ({
  id: 1,
  date_month_year,
  scale_count: 0,
  octave_count: 0,
  arpeggio_count: 0,
  solidChord_count: 0,
  brokenChord_count: 0,
  ...counts,
});

describe('mapWeekRows', () => {
  it('copies the summed counts across', () => {
    const [pd] = mapWeekRows([
      row('2026-10-03', {
        scale_count: 1,
        octave_count: 2,
        arpeggio_count: 3,
        solidChord_count: 4,
        brokenChord_count: 5,
      }),
    ]);

    expect(pd).toMatchObject({
      scale: 1,
      octave: 2,
      arpeggio: 3,
      solidChord: 4,
      brokenChord: 5,
    });
  });

  it.each([
    ['2026-09-28', 'Mon', 28],
    ['2026-10-03', 'Sat', 3],
    ['2026-10-04', 'Sun', 4],
    ['2026-01-01', 'Thu', 1],
  ])('keeps %s on the same local day (%s)', (dbDate, weekday, dayOfMonth) => {
    const [pd] = mapWeekRows([row(dbDate)]);
    const local = new Date(pd.date);

    expect(local.toDateString().slice(0, 3)).toBe(weekday);
    expect(local.getDate()).toBe(dayOfMonth);
  });

  it('handles an empty week', () => {
    expect(mapWeekRows([])).toEqual([]);
  });
});

describe('mapYearRows', () => {
  it.each([
    ['01-2026', 0],
    ['03-2026', 2],
    ['12-2026', 11],
  ])('plots %s in month index %d', (dbMonth, month) => {
    const [pd] = mapYearRows([row(dbMonth, {scale_count: 7})]);
    const date = new Date(pd.date);

    expect(date.getMonth()).toBe(month);
    expect(date.getFullYear()).toBe(2026);
    expect(pd.scale).toBe(7);
  });

  it('gives each month of a multi-month year its own date', () => {
    const months = mapYearRows([row('01-2026'), row('02-2026'), row('03-2026')]);
    const unique = new Set(months.map(pd => new Date(pd.date).getMonth()));

    expect(unique.size).toBe(3);
  });
});
