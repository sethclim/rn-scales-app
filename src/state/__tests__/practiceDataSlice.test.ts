import {configureStore} from '@reduxjs/toolkit';
import practiceDataReducer, {
  deleteAllPracticeData,
  getAllPracticedata,
  recordPractice,
  getTodaysPracticedata,
  recordPracticeData,
  savePracticeData,
} from '../practiceDataSlice';
import routineReducer from '../routineSlice';
import dbInstance from '../../data/Database/database';
import {IAllPracticeData, IPracticeData} from '../../data/Models/DataModels';

jest.mock('../../data/Database/database', () => ({
  __esModule: true,
  default: {
    getAllPracticeData: jest.fn(),
    getTodaysPracticeData: jest.fn(),
    savePracticedata: jest.fn(),
    deleteAllPracticeData: jest.fn(),
  },
}));

const db = dbInstance as jest.Mocked<typeof dbInstance>;

const makeStore = () =>
  configureStore({
    reducer: {routine: routineReducer, practice: practiceDataReducer},
  });

const today = (counts: Partial<IPracticeData> = {}): IPracticeData => ({
  date: new Date(2026, 9, 3).toString(),
  Total: 0,
  scale: 0,
  octave: 0,
  arpeggio: 0,
  solidChord: 0,
  brokenChord: 0,
  ...counts,
});

const session = (store: ReturnType<typeof makeStore>) =>
  store.getState().practice.currentSessionPracticeData;

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('recordPracticeData', () => {
  it.each([
    'scale',
    'octave',
    'arpeggio',
    'solidChord',
    'brokenChord',
  ] as const)('counts a %s', exercise => {
    const store = makeStore();
    store.dispatch(recordPracticeData([exercise, 1]));

    expect(session(store)[exercise]).toBe(1);
  });

  it('adds up repeated practice of the same exercise', () => {
    const store = makeStore();
    store.dispatch(recordPracticeData(['scale', 1]));
    store.dispatch(recordPracticeData(['scale', 1]));
    store.dispatch(recordPracticeData(['scale', 3]));

    expect(session(store).scale).toBe(5);
    expect(session(store).octave).toBe(0);
  });

  it('ignores an unknown exercise type', () => {
    const store = makeStore();
    const before = session(store);
    store.dispatch(recordPracticeData(['kazoo', 1]));

    expect(session(store)).toEqual(before);
  });

  it("adds on top of today's earlier practice", async () => {
    db.getTodaysPracticeData.mockResolvedValue(today({scale: 4}));
    const store = makeStore();
    await store.dispatch(getTodaysPracticedata());

    store.dispatch(recordPracticeData(['scale', 1]));

    expect(session(store).scale).toBe(5);
  });
});

describe('getTodaysPracticedata', () => {
  it("loads today's session from the database", async () => {
    db.getTodaysPracticeData.mockResolvedValue(today({octave: 2}));
    const store = makeStore();

    await store.dispatch(getTodaysPracticedata());

    expect(session(store)).toEqual(today({octave: 2}));
    expect(store.getState().practice.status).toBe('fulfilled');
  });

  it('keeps a usable session when the database is not ready yet', async () => {
    // getTodaysPracticeData returns null before the DB has opened
    db.getTodaysPracticeData.mockResolvedValue(null);
    const store = makeStore();

    await store.dispatch(getTodaysPracticedata());

    expect(session(store)).not.toBeNull();
  });
});

describe('savePracticeData', () => {
  it('saves the current session', async () => {
    db.getTodaysPracticeData.mockResolvedValue(today());
    const store = makeStore();
    await store.dispatch(getTodaysPracticedata());
    store.dispatch(recordPracticeData(['arpeggio', 2]));

    await store.dispatch(savePracticeData(null));

    expect(db.savePracticedata).toHaveBeenCalledWith(today({arpeggio: 2}));
  });

  it('never saves a session without a valid date', async () => {
    // e.g. practising before getTodaysPracticedata has resolved
    const store = makeStore();
    store.dispatch(recordPracticeData(['scale', 1]));

    await store.dispatch(savePracticeData(null));

    const saved = db.savePracticedata.mock.calls[0][0];
    expect(new Date(saved.date).toDateString()).toBe(new Date().toDateString());
    expect(saved.scale).toBe(1);
  });

  it('reports failure when the database errors', async () => {
    db.savePracticedata.mockRejectedValue(new Error('disk full'));
    const store = makeStore();

    await store.dispatch(savePracticeData(null));

    expect(store.getState().practice.status).toBe('rejected');
  });
});

describe('getAllPracticedata', () => {
  it('stores the graph data from the database', async () => {
    const data: IAllPracticeData = {
      Week: [today({scale: 1})],
      Year: [today({scale: 9})],
      Month: [],
      Day: [],
    };
    db.getAllPracticeData.mockResolvedValue(data);
    const store = makeStore();

    await store.dispatch(getAllPracticedata());

    expect(store.getState().practice.practiceData).toEqual(data);
  });

  it('keeps the previous graph data when the database errors', async () => {
    const data: IAllPracticeData = {
      Week: [today({scale: 1})],
      Year: [],
      Month: [],
      Day: [],
    };
    db.getAllPracticeData.mockResolvedValueOnce(data);
    const store = makeStore();
    await store.dispatch(getAllPracticedata());

    db.getAllPracticeData.mockRejectedValueOnce(new Error('db locked'));
    await store.dispatch(getAllPracticedata());

    expect(store.getState().practice.practiceData).toEqual(data);
    expect(store.getState().practice.status).toBe('rejected');
  });
});

describe('recordPractice', () => {
  const OCT_2 = new Date(2026, 9, 2, 23, 50);
  const OCT_3 = new Date(2026, 9, 3, 0, 10);
  const onDay = (date: Date, counts: Partial<IPracticeData> = {}) => ({
    ...today(counts),
    date: date.toString(),
  });

  // Fake only Date so "now" can be moved; promises and timers run normally
  const setNow = (date: Date) => {
    jest.useFakeTimers({
      now: date,
      doNotFake: ['nextTick', 'setImmediate', 'setTimeout', 'setInterval', 'queueMicrotask', 'requestAnimationFrame'],
    });
  };

  afterEach(() => {
    jest.useRealTimers();
  });

  it('adds to the session without touching the DB on the same day', async () => {
    setNow(OCT_2);
    db.getTodaysPracticeData.mockResolvedValue(onDay(OCT_2, {scale: 2}));
    const store = makeStore();
    await store.dispatch(getTodaysPracticedata());
    jest.clearAllMocks();

    await store.dispatch(recordPractice('scale'));
    await store.dispatch(recordPractice('octave'));

    expect(session(store)).toMatchObject({scale: 3, octave: 1});
    expect(db.savePracticedata).not.toHaveBeenCalled();
    expect(db.getTodaysPracticeData).not.toHaveBeenCalled();
  });

  it("saves yesterday's session and starts today's after midnight", async () => {
    setNow(OCT_2);
    db.getTodaysPracticeData.mockResolvedValueOnce(onDay(OCT_2, {scale: 5}));
    const store = makeStore();
    await store.dispatch(getTodaysPracticedata());
    await store.dispatch(recordPractice('scale'));

    setNow(OCT_3);
    db.getTodaysPracticeData.mockResolvedValueOnce(onDay(OCT_3));
    await store.dispatch(recordPractice('arpeggio'));

    // Yesterday kept its own counts, under its own date
    expect(db.savePracticedata).toHaveBeenCalledWith(
      onDay(OCT_2, {scale: 6}),
    );
    // Today only has today's practice
    expect(session(store)).toMatchObject({
      date: OCT_3.toString(),
      scale: 0,
      arpeggio: 1,
    });
  });

  it("starts today from zero after midnight if the DB isn't ready", async () => {
    setNow(OCT_2);
    db.getTodaysPracticeData.mockResolvedValueOnce(onDay(OCT_2, {scale: 5}));
    const store = makeStore();
    await store.dispatch(getTodaysPracticedata());

    setNow(OCT_3);
    db.getTodaysPracticeData.mockResolvedValueOnce(null);
    await store.dispatch(recordPractice('octave'));

    expect(session(store)).toMatchObject({
      date: OCT_3.toString(),
      scale: 0,
      octave: 1,
    });
  });

  it("loads today's earlier practice first if it hasn't loaded yet", async () => {
    setNow(OCT_3);
    db.getTodaysPracticeData.mockResolvedValue(onDay(OCT_3, {scale: 4}));
    const store = makeStore();

    await store.dispatch(recordPractice('scale'));

    expect(session(store)).toMatchObject({scale: 5});
    // Nothing to save: the empty starting session has no day
    expect(db.savePracticedata).not.toHaveBeenCalled();
  });
});

describe('deleteAllPracticeData', () => {
  it('clears the graph and zeroes the current session', async () => {
    db.getAllPracticeData.mockResolvedValue({
      Week: [today({scale: 1})],
      Year: [today({scale: 9})],
      Month: [],
      Day: [],
    });
    db.getTodaysPracticeData.mockResolvedValue(today({scale: 4}));
    const store = makeStore();
    await store.dispatch(getAllPracticedata());
    await store.dispatch(getTodaysPracticedata());

    await store.dispatch(deleteAllPracticeData());

    expect(db.deleteAllPracticeData).toHaveBeenCalled();
    expect(store.getState().practice.practiceData).toEqual({
      Week: [],
      Year: [],
      Month: [],
      Day: [],
    });
    expect(session(store)).toMatchObject({date: today().date, scale: 0});
  });

  it('keeps everything if the database delete fails', async () => {
    db.getTodaysPracticeData.mockResolvedValue(today({scale: 4}));
    db.deleteAllPracticeData.mockRejectedValue(new Error('db locked'));
    const store = makeStore();
    await store.dispatch(getTodaysPracticedata());

    await store.dispatch(deleteAllPracticeData());

    expect(session(store).scale).toBe(4);
    expect(store.getState().practice.status).toBe('rejected');
  });
});
