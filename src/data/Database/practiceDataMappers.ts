import type {IPracticeData} from '../Models/DataModels';
import type {DBPracticeDataGrouped} from './database';

const toPracticeData = (
  date: Date,
  x: DBPracticeDataGrouped,
): IPracticeData => ({
  date: date.toString(),
  scale: x.scale_count,
  octave: x.octave_count,
  arpeggio: x.arpeggio_count,
  solidChord: x.solidChord_count,
  brokenChord: x.brokenChord_count,
});

// Week rows are grouped by day: date_month_year is 'YYYY-MM-DD'.
// Built in local time; new Date('YYYY-MM-DD') would parse as UTC midnight.
export const mapWeekRows = (rows: DBPracticeDataGrouped[]): IPracticeData[] =>
  rows.map(x => {
    const [year, month, day] = x.date_month_year.split('-').map(Number);
    return toPracticeData(new Date(year, month - 1, day), x);
  });

// Year rows are grouped by month: date_month_year is 'MM-YYYY'
export const mapYearRows = (rows: DBPracticeDataGrouped[]): IPracticeData[] =>
  rows.map(x => {
    const [month, year] = x.date_month_year.split('-').map(Number);
    return toPracticeData(new Date(year, month - 1, 1), x);
  });
