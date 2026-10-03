import {Database} from '../database';
import {Routine} from '../../Models/DataModels';

jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn(async () => ({execAsync: jest.fn()})),
}));

// Fake SQLite that records every write and hands out increasing row ids
const makeFakeDb = () => {
  let nextId = 1;
  const runs: {sql: string; params: unknown[]}[] = [];
  const txn = {
    runAsync: jest.fn(async (sql: string, params: unknown[]) => {
      runs.push({sql, params});
      return {lastInsertRowId: nextId++, changes: 1};
    }),
    execAsync: jest.fn(),
    getFirstAsync: jest.fn(),
  };
  const db = {
    withExclusiveTransactionAsync: jest.fn(async (cb: (t: typeof txn) => Promise<void>) =>
      cb(txn),
    ),
  };
  return {db, txn, runs};
};

const makeDatabase = async () => {
  const fake = makeFakeDb();
  const database = new Database();
  // Let the constructor's async open finish so it can't overwrite our fake
  await new Promise(resolve => setTimeout(resolve, 0));
  database.db = fake.db as unknown as Database['db'];
  return {database, ...fake};
};

const routine = (title: string, items: [string, Routine['RoutineItems'][0]['exerciseType']][]): Routine => ({
  id: '-1',
  title,
  createdAt: '2026-10-03T12:00:00.000Z',
  RoutineItems: items.map(([displayItem, exerciseType]) => ({displayItem, exerciseType})),
});

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Database.saveRoutine', () => {
  it('saves the routine and links each item to its new id', async () => {
    const {database, runs} = await makeDatabase();

    await database.saveRoutine(
      routine('Warmup', [
        ['C Major Scale', 'scale'],
        ['C Major Octaves', 'octave'],
      ]),
    );

    expect(runs[0].params).toEqual(['Warmup', '2026-10-03T12:00:00.000Z']);
    expect(runs.slice(1).map(r => r.params)).toEqual([
      ['C Major Scale', 'scale', 1],
      ['C Major Octaves', 'octave', 1],
    ]);
  });

  it('handles apostrophes and quotes in the title', async () => {
    const {database, runs} = await makeDatabase();
    const title = `Seth's "fast" warmup'); DROP TABLE Routine;--`;

    await database.saveRoutine(routine(title, [['C Major Scale', 'scale']]));

    // Passed as a value, never pasted into the SQL itself
    expect(runs[0].params[0]).toBe(title);
    for (const run of runs) {
      expect(run.sql).not.toContain('Seth');
    }
  });

  it('links items to the right routine when two share a name', async () => {
    const {database, runs} = await makeDatabase();

    await database.saveRoutine(routine('Warmup', [['C Major Scale', 'scale']]));
    await database.saveRoutine(routine('Warmup', [['G Minor Arpeggio', 'arpeggio']]));

    // Routine #1 -> item #2, routine #3 -> item #4
    const itemLinks = runs
      .filter(r => r.sql.includes('RoutineItem'))
      .map(r => [r.params[0], r.params[2]]);
    expect(itemLinks).toEqual([
      ['C Major Scale', 1],
      ['G Minor Arpeggio', 3],
    ]);
  });

  it('does everything in one transaction', async () => {
    const {database, db} = await makeDatabase();

    await database.saveRoutine(routine('Warmup', [['C Major Scale', 'scale']]));

    expect(db.withExclusiveTransactionAsync).toHaveBeenCalledTimes(1);
  });

  it('returns false if the database is not open yet', async () => {
    const {database} = await makeDatabase();
    database.db = null;

    expect(await database.saveRoutine(routine('Warmup', []))).toBe(false);
  });
});
