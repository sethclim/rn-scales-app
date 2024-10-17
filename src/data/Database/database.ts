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
      CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY NOT NULL, value TEXT NOT NULL, intValue INTEGER);
      INSERT INTO test (value, intValue) VALUES ('test1', 123);
      INSERT INTO test (value, intValue) VALUES ('test2', 456);
      INSERT INTO test (value, intValue) VALUES ('test3', 789);
      `);
  };

  async saveRoutines(routineData: Array<RoutineItem>) {}
}

const dbInstance = new Database();
export default dbInstance;
