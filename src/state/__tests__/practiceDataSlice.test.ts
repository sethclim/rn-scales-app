import {configureStore} from '@reduxjs/toolkit';
import practiceDataReducer, {
  getAllPracticedata,
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
