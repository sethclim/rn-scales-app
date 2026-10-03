import {dateToString, getWeekRange} from '../date_utils';

// Pin a timezone west of UTC so date bugs show up on every machine
process.env.TZ = 'America/Toronto';

describe('dateToString', () => {
  it('uses the local date for a late-evening session', () => {
    // 9:30pm in Toronto is already the next day in UTC
    expect(dateToString(new Date(2026, 9, 3, 21, 30))).toBe('2026-10-03');
  });

  it('uses the local date just after midnight', () => {
    expect(dateToString(new Date(2026, 0, 1, 0, 5))).toBe('2026-01-01');
  });
});

describe('getWeekRange', () => {
  it.each([
    ['a Monday', new Date(2026, 8, 28), '2026-09-28', '2026-10-04'],
    ['a Saturday', new Date(2026, 9, 3, 22, 0), '2026-09-28', '2026-10-04'],
    ['a Sunday', new Date(2026, 9, 4), '2026-09-28', '2026-10-04'],
    ['a week spanning two months', new Date(2026, 8, 30), '2026-09-28', '2026-10-04'],
    ['a week spanning two years', new Date(2026, 11, 31), '2026-12-28', '2027-01-03'],
  ])('runs Monday to Sunday for %s', (_, today, start, end) => {
    expect(getWeekRange(today)).toEqual({start, end});
  });
});
