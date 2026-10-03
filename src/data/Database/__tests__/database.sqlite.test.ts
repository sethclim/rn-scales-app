import {Database} from '../database';
import {IPracticeData, Routine} from '../../Models/DataModels';

// Runs database.ts's real SQL against an in-memory SQLite
jest.mock('expo-sqlite', () => require('../../../testUtils/nodeSqlite'));

// Pin a timezone west of UTC so date bugs show up on every machine
process.env.TZ = 'America/Toronto';

const openDatabase = async () => {
  const database = new Database();
  // Wait for the constructor's async open + CREATE TABLEs
  await new Promise<void>(resolve => setTimeout(resolve, 0));
  return database;
};

const session = (
  date: Date,
  counts: Partial<IPracticeData> = {},
): IPracticeData => ({
  date: date.toString(),
  scale: 0,
  octave: 0,
  arpeggio: 0,
  solidChord: 0,
  brokenChord: 0,
  ...counts,
});

const routine = (title: string, items: string[]): Routine => ({
  id: '-1',
  title,
  createdAt: '2026-10-03T12:00:00.000Z',
  RoutineItems: items.map(displayItem => ({
    displayItem,
    exerciseType: 'scale',
  })),
});

// Sat 3 Oct 2026; its Mon-Sun week is 28 Sep - 4 Oct
const TODAY = new Date(2026, 9, 3, 15, 0);
const day = (month: number, date: number, hour = 12) =>
  new Date(2026, month, date, hour);

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('practice data', () => {
  it("saves a session and loads it back as today's", async () => {
    const db = await openDatabase();

    await db.savePracticedata(session(TODAY, {scale: 3, arpeggio: 1}));
    const today = await db.getTodaysPracticeData(TODAY);

    expect(today).toMatchObject({scale: 3, arpeggio: 1, octave: 0});
  });

  it('starts at zero on a day with no practice', async () => {
    const db = await openDatabase();

    const today = await db.getTodaysPracticeData(TODAY);

    expect(today).toMatchObject({
      scale: 0,
      octave: 0,
      arpeggio: 0,
      solidChord: 0,
      brokenChord: 0,
    });
  });

  it('updates the same row when saving twice in one day', async () => {
    const db = await openDatabase();

    await db.savePracticedata(session(TODAY, {scale: 2}));
    await db.savePracticedata(session(TODAY, {scale: 5, octave: 1}));

    const {Week} = await db.getAllPracticeData(TODAY);
    expect(Week).toHaveLength(1);
    expect(Week[0]).toMatchObject({scale: 5, octave: 1});
  });

  it('saves a late-evening session under the local day', async () => {
    const db = await openDatabase();

    // 11pm in Toronto is already tomorrow in UTC
    await db.savePracticedata(session(day(9, 2, 23), {scale: 4}));

    expect(await db.getTodaysPracticeData(day(9, 2))).toMatchObject({scale: 4});
    expect(await db.getTodaysPracticeData(day(9, 3))).toMatchObject({scale: 0});
  });

  it('returns each day of the current Mon-Sun week, in order', async () => {
    const db = await openDatabase();
    await db.savePracticedata(session(day(8, 27), {scale: 9})); // previous Sunday
    await db.savePracticedata(session(day(9, 4), {scale: 7})); // Sunday
    await db.savePracticedata(session(day(8, 28), {scale: 1})); // Monday
    await db.savePracticedata(session(day(9, 1), {scale: 4})); // Thursday
    await db.savePracticedata(session(day(9, 5), {scale: 9})); // next Monday

    const {Week} = await db.getAllPracticeData(TODAY);

    expect(Week.map(pd => new Date(pd.date).getDate())).toEqual([28, 1, 4]);
    expect(Week.map(pd => pd.scale)).toEqual([1, 4, 7]);
  });

  it('sums each month separately for the year, in order', async () => {
    const db = await openDatabase();
    await db.savePracticedata(session(day(0, 5), {scale: 1}));
    await db.savePracticedata(session(day(0, 20), {scale: 2, octave: 3}));
    await db.savePracticedata(session(day(2, 10), {scale: 4}));
    await db.savePracticedata(session(day(9, 2), {scale: 8}));

    const {Year} = await db.getAllPracticeData(TODAY);

    expect(Year.map(pd => new Date(pd.date).getMonth())).toEqual([0, 2, 9]);
    expect(Year.map(pd => pd.scale)).toEqual([3, 4, 8]);
    expect(Year[0].octave).toBe(3);
  });

  it("leaves last year's practice out of this year", async () => {
    const db = await openDatabase();
    await db.savePracticedata(session(new Date(2025, 11, 31, 12), {scale: 5}));
    await db.savePracticedata(session(day(0, 1), {scale: 1}));

    const {Year} = await db.getAllPracticeData(TODAY);

    expect(Year.map(pd => pd.scale)).toEqual([1]);
  });

  it('deletes all practice data', async () => {
    const db = await openDatabase();
    await db.savePracticedata(session(TODAY, {scale: 3}));
    await db.savePracticedata(session(day(0, 5), {scale: 1}));

    await db.deleteAllPracticeData();

    const {Week, Year} = await db.getAllPracticeData(TODAY);
    expect(Week).toEqual([]);
    expect(Year).toEqual([]);
  });
});

describe('routines', () => {
  it('saves a routine and loads its items back', async () => {
    const db = await openDatabase();

    await db.saveRoutine(routine("Seth's warmup", ['C Major Scale', 'D Major Scale']));

    const [saved] = await db.getAllRoutines();
    expect(saved.title).toBe("Seth's warmup");
    const items = await db.getRoutineItems(saved.id);
    expect(items?.map(i => i.displayItem)).toEqual([
      'C Major Scale',
      'D Major Scale',
    ]);
  });

  it('keeps items separate for routines with the same name', async () => {
    const db = await openDatabase();
    await db.saveRoutine(routine('Warmup', ['C Major Scale']));
    await db.saveRoutine(routine('Warmup', ['G Minor Scale']));

    const [first, second] = await db.getAllRoutines();

    expect((await db.getRoutineItems(first.id))?.map(i => i.displayItem)).toEqual(['C Major Scale']);
    expect((await db.getRoutineItems(second.id))?.map(i => i.displayItem)).toEqual(['G Minor Scale']);
  });

  it('deletes one routine and only its items', async () => {
    const db = await openDatabase();
    await db.saveRoutine(routine('Keep', ['C Major Scale']));
    await db.saveRoutine(routine('Remove', ['D Major Scale']));
    const [keep, remove] = await db.getAllRoutines();

    await db.deleteRoutine(remove.id);

    expect((await db.getAllRoutines()).map(r => r.title)).toEqual(['Keep']);
    expect(await db.getRoutineItems(remove.id)).toEqual([]);
    expect((await db.getRoutineItems(keep.id))?.map(i => i.displayItem)).toEqual(['C Major Scale']);
  });

  it('deletes all routines and their items', async () => {
    const db = await openDatabase();
    await db.saveRoutine(routine('One', ['C Major Scale']));
    await db.saveRoutine(routine('Two', ['D Major Scale']));
    const ids = (await db.getAllRoutines()).map(r => r.id);

    await db.deleteAllRoutines();

    expect(await db.getAllRoutines()).toEqual([]);
    for (const id of ids) {
      expect(await db.getRoutineItems(id)).toEqual([]);
    }
  });

  it('does not touch practice data when routines are deleted', async () => {
    const db = await openDatabase();
    await db.savePracticedata(session(TODAY, {scale: 3}));
    await db.saveRoutine(routine('One', ['C Major Scale']));

    await db.deleteAllRoutines();

    expect(await db.getTodaysPracticeData(TODAY)).toMatchObject({scale: 3});
  });
});
