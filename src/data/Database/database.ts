// import {Database} from '@nozbe/watermelondb';
// import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

// import RoutineModel from './routine.model';
// import RoutineItemModel from './routine_item.model';
// import PracticeDataModel from './practice_data.model';

// import {AppSchema as schema} from './schema';

// const adapter = new SQLiteAdapter({
//   schema,
// });

// export const database = new Database({
//   adapter,
//   modelClasses: [RoutineModel, RoutineItemModel, PracticeDataModel],
// });

import * as SQLite from 'expo-sqlite';

import {RoutineItem} from '../Models/DataModels';

type RoutineItem2 = {
  id: number;
  displayItem: string;
  exerciseType: string;
};

type Routine = {
  id: number;
  name: string;
};

export class Database {
  constructor() {
    this.db = null;
    this.createDatabase();
  }

  db: SQLite.SQLiteDatabase | null;

  createDatabase = async () => {
    console.log('createDatabase...');
    this.db = await SQLite.openDatabaseAsync('databaseName');
    console.log('DB' + JSON.stringify(this.db));
    const res = await this.db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS RoutineItem (id INTEGER PRIMARY KEY NOT NULL, displayItem TEXT NOT NULL, exerciseType TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS Routine (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL);
      INSERT INTO Routine (name) VALUES ('Hello')
      `);

    console.log('DB' + JSON.stringify(res));
  };

  async saveRoutines(routineData: Array<RoutineItem>) {
    if (this.db == null) {
      console.log('DB not created');
      return;
    }

    await this.db.withExclusiveTransactionAsync(async txn => {
      let source = '';
      const insert = `INSERT INTO RoutineItem (displayItem, exerciseType) VALUES `;
      const end = ';';

      routineData.forEach(value => {
        source += insert;
        source += `('${value.displayItem}', '${value.exerciseType}')`;
        source += end;
      });

      // console.log('source ' + source);

      await txn.execAsync(source);
      // console.log('res2 ' + JSON.stringify(res2));
    });
  }

  async getAllRoutines() {
    if (this.db == null) {
      console.log('DB not created');
      return;
    }

    const allRows = await this.db.getAllAsync<Routine>('SELECT * FROM Routine');

    return allRows;
  }
}

const dbInstance = new Database();
export default dbInstance;
