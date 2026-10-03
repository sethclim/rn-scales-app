// Test-only stand-in for expo-sqlite, backed by Node's built-in SQLite.
// Lets tests run database.ts's real SQL against an in-memory database:
//   jest.mock('expo-sqlite', () => require('<path>/testUtils/nodeSqlite'));
// node:sqlite prints an "experimental" warning on load; keep test output clean
const emitWarning = process.emitWarning;
process.emitWarning = () => {};
// eslint-disable-next-line @typescript-eslint/no-require-imports
const {DatabaseSync} = require('node:sqlite');
process.emitWarning = emitWarning;

type Params = unknown[] | Record<string, unknown> | undefined;

// expo-sqlite takes either positional arrays or {$name: value} objects
const bind = (params: Params): unknown[] => {
  if (params == null) return [];
  return Array.isArray(params) ? params : [params];
};

type FakeExpoDatabase = {
  execAsync: (sql: string) => Promise<void>;
  getAllAsync: <T>(sql: string, params?: Params) => Promise<T[]>;
  getFirstAsync: <T>(sql: string, params?: Params) => Promise<T | null>;
  runAsync: (
    sql: string,
    params?: Params,
  ) => Promise<{lastInsertRowId: number; changes: number}>;
  withExclusiveTransactionAsync: (
    cb: (txn: FakeExpoDatabase) => Promise<void>,
  ) => Promise<void>;
};

export const createNodeSqliteDatabase = (): FakeExpoDatabase => {
  const db = new DatabaseSync(':memory:');

  const api: FakeExpoDatabase = {
    execAsync: async (sql: string) => {
      db.exec(sql);
    },
    getAllAsync: async <T>(sql: string, params?: Params): Promise<T[]> =>
      db.prepare(sql).all(...bind(params)) as T[],
    getFirstAsync: async <T>(sql: string, params?: Params): Promise<T | null> =>
      (db.prepare(sql).get(...bind(params)) as T | undefined) ?? null,
    runAsync: async (sql: string, params?: Params) => {
      const res = db.prepare(sql).run(...bind(params));
      return {
        lastInsertRowId: Number(res.lastInsertRowid),
        changes: Number(res.changes),
      };
    },
    withExclusiveTransactionAsync: async cb => {
      db.exec('BEGIN EXCLUSIVE');
      try {
        await cb(api);
        db.exec('COMMIT');
      } catch (e) {
        db.exec('ROLLBACK');
        throw e;
      }
    },
  };

  return api;
};

export const openDatabaseAsync = async () => createNodeSqliteDatabase();
