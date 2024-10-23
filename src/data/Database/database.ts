import * as SQLite from 'expo-sqlite';

import {Routine, RoutineItem} from '../Models/DataModels';

type DBRoutine = {
  id: number;
  title: string;
  createdAt: string;
};

export class Database {
  constructor() {
    this.db = null;
    this.createDatabase();
  }

  db: SQLite.SQLiteDatabase | null;

  createDatabase = async () => {
    this.db = await SQLite.openDatabaseAsync('databaseName');

    const res = await this.db.execAsync(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;
      CREATE TABLE IF NOT EXISTS Routine(id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL, createdAt TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS RoutineItem (id INTEGER PRIMARY KEY NOT NULL, displayItem TEXT NOT NULL, exerciseType TEXT NOT NULL, routineForeignKey INTEGER NOT NULL, FOREIGN KEY(routineForeignKey) REFERENCES Routine(id));
      `);

    console.log('DB' + JSON.stringify(res));
  };

  async saveRoutine(routine: Routine) {
    if (this.db == null) {
      console.log('DB not created');
      return;
    }

    console.log('routine' + JSON.stringify(routine));

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

      await txn.execAsync(source);
      // console.log('res2 ' + JSON.stringify(res2));
      console.log('Done save routine');
    });
  }

  async getAllRoutines() {
    if (this.db == null) {
      console.log('DB not created');
      return [];
    }
    console.log('getAllRoutines');

    const routines = await this.db.getAllAsync<DBRoutine>(
      'SELECT * FROM Routine',
    );

    // console.log('done ' + JSON.stringify(routines));

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
    if (this.db == null) {
      console.log('DB not created');
      return;
    }

    const allRows2 = await this.db.getAllAsync(
      `SELECT * FROM RoutineItems WHERE routineForeignKey = $value`,
      {$value: routineId},
    );
  }
}

const dbInstance = new Database();
export default dbInstance;
