import * as SQLite from 'expo-sqlite';

import {PracticeData, Routine} from '../Models/DataModels';
import {dateToString} from '../../utils/date_utils';
import {GRAPH_ID} from '../../screens/PracticeStats/Graph/GraphBuilder';

type DBRoutine = {
  id: number;
  title: string;
  createdAt: string;
};

export type DBPracticeDataGrouped = {
  id: number;
  date_month_year: string;
  scale_count: number;
  octave_count: number;
  arpeggio_count: number;
  solidChord_count: number;
  brokenChord_count: number;
};

export type DBPracticeData = {
  id: number;
  date: string;
  scale: number;
  octave: number;
  arpeggio: number;
  solidChord: number;
  brokenChord: number;
};

export class Database {
  constructor() {
    this.db = null;
    this.createDatabase();
  }

  db: SQLite.SQLiteDatabase | null;

  createDatabase = async () => {
    this.db = await SQLite.openDatabaseAsync('databaseName');

    await this.db.execAsync(`
        PRAGMA journal_mode = WAL;
        PRAGMA foreign_keys = ON;
        CREATE TABLE IF NOT EXISTS Routine(id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL, createdAt TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS RoutineItem (id INTEGER PRIMARY KEY NOT NULL, displayItem TEXT NOT NULL, exerciseType TEXT NOT NULL, routineForeignKey INTEGER NOT NULL, FOREIGN KEY(routineForeignKey) REFERENCES Routine(id));
        CREATE TABLE IF NOT EXISTS PracticeData 
        (
          id INTEGER PRIMARY KEY NOT NULL, 
          date TEXT NOT NULL, 
          scale INTEGER NOT NULL, 
          octave INTEGER NOT NULL, 
          arpeggio INTEGER NOT NULL, 
          solidChord INTEGER NOT NULL, 
          brokenChord INTEGER NOT NULL 
        );
      `);
  };

  async saveRoutine(routine: Routine) {
    if (this.db == null) {
      console.log('DB not created');
      return;
    }

    await this.db.withExclusiveTransactionAsync(async txn => {
      await txn.execAsync(
        `INSERT INTO Routine (title, createdAt) VALUES ('${routine.title}', '${routine.createdAt}')`,
      );

      type result = {
        id: number;
      };

      const insertedRoutineIdResult = await txn.getFirstAsync<result>(
        'SELECT id FROM ROUTINE WHERE title = $title',
        {$title: routine.title},
      );

      if (insertedRoutineIdResult == null) return;

      console.log(
        'insertedRoutineId ' + JSON.stringify(insertedRoutineIdResult),
      );

      let source = '';
      const insert = `INSERT INTO RoutineItem (displayItem, exerciseType, routineForeignKey) VALUES `;
      const end = ';';

      routine.RoutineItems.forEach(value => {
        source += insert;
        source += `('${value.displayItem}', '${value.exerciseType}', '${insertedRoutineIdResult.id}')`;
        source += end;
      });

      // console.log('source ' + source);

      const insertedRoutineItemsIdResult = await txn.execAsync(source);
      console.log('Done save routine ' + insertedRoutineItemsIdResult);
    });
  }

  async getAllRoutines() {
    if (this.db == null) {
      console.log('DB not created');
      return [];
    }

    const routines = await this.db.getAllAsync<DBRoutine>(
      'SELECT * FROM Routine',
    );

    const exportRoutines: Routine[] = routines.map(x => {
      const r: Routine = {
        id: x.id.toString(),
        title: x.title,
        createdAt: x.createdAt,
        RoutineItems: [],
      };
      return r;
    });

    return exportRoutines;
  }

  async getRoutineItems(routineId: number) {
    console.log('getRoutineItems HERE');

    if (this.db == null) {
      console.log('DB not created');
      return;
    }

    const request = "SELECT * FROM RoutineItem WHERE routineForeignKey='12';";
    console.log('request ' + request);

    const allRows2 = await this.db.getAllAsync(request);
    //      {$value: routineId.toString()},
    console.log('allRows2 ' + JSON.stringify(allRows2));

    return allRows2;
  }

  async savePracticedata(practiceData: PracticeData) {
    if (this.db == null) {
      console.log('DB not created');
      return;
    }

    const string_date = dateToString(practiceData._date);

    // const time_stamp = Math.round(practiceData.getDate().valueOf() / 1000);

    const res = await this.db.getFirstAsync<DBPracticeDataGrouped>(
      'SELECT * FROM PracticeData WHERE date = $d',
      {
        $d: string_date,
      },
    );

    if (res == null) {
      await this.db.execAsync(
        `INSERT INTO 
          PracticeData (date, scale, octave, arpeggio, solidChord, brokenChord) 
          VALUES ('${string_date}', '${practiceData.scale}', '${practiceData.octave}', '${practiceData.arpeggio}', '${practiceData.solidChord}', '${practiceData.brokenChord}')`,
      );
    } else {
      console.log('updating row ');
      //
      const updateRes = await this.db.runAsync(
        'UPDATE PracticeData SET scale = $1, octave = $2, arpeggio = $3, solidChord = $4, brokenChord = $5 WHERE date = $d',
        {
          $1: practiceData.scale,
          $2: practiceData.octave,
          $3: practiceData.arpeggio,
          $4: practiceData.solidChord,
          $5: practiceData.brokenChord,
          $d: string_date,
        },
      );

      //console.log('updateRes ' + JSON.stringify(updateRes));
    }
  }

  async getAllPracticeData(
    today: Date,
  ): Promise<Map<GRAPH_ID, PracticeData[]>> {
    if (this.db == null) {
      console.log('DB not created');
      return new Map([['Year', []]]);
    }

    const startOfWeek = dateToString(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - today.getDay(),
        0,
        0,
      ),
    );

    const endOfWeek = dateToString(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + (7 - today.getDay()),
        23,
        59,
      ),
    );

    const startOfYear = dateToString(new Date(today.getFullYear(), 0, 1, 0, 0));
    const endOfYear = dateToString(
      new Date(today.getFullYear(), 11, 31, 23, 59),
    );

    // const startOfYearTS = Math.round(startOfYear.valueOf() / 1000);
    // const endOfYearTS = Math.round(endOfYear.valueOf() / 1000);

    const practiceDataWeek = await this.db.getAllAsync<DBPracticeDataGrouped>(
      `SELECT id, date AS date_month_year, 
      SUM(scale) AS scale_count,
      SUM(octave) AS octave_count,
      SUM(arpeggio) AS arpeggio_count,
      SUM(solidChord) AS solidChord_count,
      SUM(brokenChord) AS brokenChord_count
      FROM PracticeData WHERE date_month_year BETWEEN $d1 AND $d2`,
      {
        $d1: startOfWeek,
        $d2: endOfWeek,
      },
    );

    console.log(
      '100 practiceData practiceData ' + JSON.stringify(practiceDataWeek),
    );

    const exportPracticeDataWeek: PracticeData[] = practiceDataWeek.map(x => {
      const date = new Date(x.date_month_year);

      //console.log('Date ' + date);

      const pd = new PracticeData(date);
      pd.scale = x.scale_count;
      pd.octave = x.octave_count;
      pd.arpeggio = x.arpeggio_count;
      pd.solidChord = x.solidChord_count;
      pd.brokenChord = x.brokenChord_count;
      return pd;
    });

    const practiceDataYear = await this.db.getAllAsync<DBPracticeDataGrouped>(
      `SELECT id, STRFTIME('%m-%Y', date) AS date_month_year, 
      SUM(scale) AS scale_count,
      SUM(octave) AS octave_count,
      SUM(arpeggio) AS arpeggio_count,
      SUM(solidChord) AS solidChord_count,
      SUM(brokenChord) AS brokenChord_count
      FROM PracticeData WHERE date BETWEEN $d1 AND $d2 GROUP BY STRFTIME('%m-%Y', date_month_year)`,
      {
        $d1: startOfYear,
        $d2: endOfYear,
      },
    );

    //WHERE date BETWEEN $d1 AND $d2

    //GROUP BY STRFTIME('%m-%Y', date_month_year)

    //SUM(scale) AS scale_count
    // SUM(octave) AS octave_count,
    // SUM(arpeggio) AS arpeggio_count,
    // SUM(solidChord) AS solidChord_count,
    // SUM(brokenChord) AS brokenChord_count

    console.log(
      '101 practiceData practiceData ' + JSON.stringify(practiceDataYear),
    );

    const exportPracticeDataYear: PracticeData[] = practiceDataYear.map(x => {
      const date = new Date(x.date_month_year);
      date.setFullYear(
        parseInt(x.date_month_year.split('-')[1]),
        parseInt(x.date_month_year.split('-')[0]) - 1,
        1,
      );

      //console.log('Date ' + date);

      const pd = new PracticeData(date);
      pd.scale = x.scale_count;
      pd.octave = x.octave_count;
      pd.arpeggio = x.arpeggio_count;
      pd.solidChord = x.solidChord_count;
      pd.brokenChord = x.brokenChord_count;
      return pd;
    });

    return new Map([
      ['Week', exportPracticeDataWeek],
      ['Year', exportPracticeDataYear],
    ]);
  }

  async getTodaysPracticeData(todaysDate: Date) {
    if (this.db == null) {
      console.log('DB not created');
      return null;
    }

    const string_date = dateToString(todaysDate);

    //console.log('getTodaysPracticeData string_date' + string_date);

    const practiceData = await this.db.getFirstAsync<DBPracticeData>(
      'SELECT * FROM PracticeData  WHERE date = $d',
      {$d: string_date},
    );

    // console.log(
    //   'getTodaysPracticeData practiceData' + JSON.stringify(practiceData),
    // );

    const pd = new PracticeData(todaysDate);

    if (practiceData == null) return pd;

    pd.scale = practiceData.scale;
    pd.octave = practiceData.octave;
    pd.arpeggio = practiceData.arpeggio;
    pd.solidChord = practiceData.solidChord;
    pd.brokenChord = practiceData.brokenChord;

    return pd;
  }

  async deleteRoutine(routineId: string) {
    if (this.db == null) {
      console.log('DB not created');
      return null;
    }

    console.log('[DB] deleteRoutine');

    await this.db.execAsync(
      `DELETE FROM RoutineItem WHERE routineForeignKey=${routineId}; DELETE FROM Routine WHERE id=${routineId};`,
    );
  }
}

const dbInstance = new Database();
export default dbInstance;
