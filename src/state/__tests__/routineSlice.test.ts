import {configureStore} from '@reduxjs/toolkit';
import routineReducer, {
  deleteAllRoutines,
  deleteRoutine,
  generateRoutine,
  getAllRoutines,
  getTask,
  resumeRoutine,
  saveRoutines,
} from '../routineSlice';
import practiceDataReducer from '../practiceDataSlice';
import dbInstance from '../../data/Database/database';
import {Routine} from '../../data/Models/DataModels';

jest.mock('../../data/Database/database', () => ({
  __esModule: true,
  default: {
    getAllRoutines: jest.fn(),
    saveRoutine: jest.fn(),
    getRoutineItems: jest.fn(),
    deleteRoutine: jest.fn(),
    deleteAllRoutines: jest.fn(),
  },
}));

const db = dbInstance as jest.Mocked<typeof dbInstance>;

const makeStore = () =>
  configureStore({
    reducer: {routine: routineReducer, practice: practiceDataReducer},
  });

const routine = (id: string, title = `Routine ${id}`): Routine => ({
  id,
  title,
  createdAt: '99',
  RoutineItems: [],
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('generateRoutine', () => {
  it('makes every root x type x exercise combination, in order', () => {
    const store = makeStore();
    store.dispatch(
      generateRoutine([['C', 'D'], ['Major', 'Minor'], ['scale', 'arpeggio']]),
    );

    expect(store.getState().routine.generatedRoutine).toEqual([
      {displayItem: 'C Major Scale', exerciseType: 'scale'},
      {displayItem: 'C Major Arpeggio', exerciseType: 'arpeggio'},
      {displayItem: 'C Minor Scale', exerciseType: 'scale'},
      {displayItem: 'C Minor Arpeggio', exerciseType: 'arpeggio'},
      {displayItem: 'D Major Scale', exerciseType: 'scale'},
      {displayItem: 'D Major Arpeggio', exerciseType: 'arpeggio'},
      {displayItem: 'D Minor Scale', exerciseType: 'scale'},
      {displayItem: 'D Minor Arpeggio', exerciseType: 'arpeggio'},
    ]);
  });

  it('uses the display name for every exercise type', () => {
    const store = makeStore();
    store.dispatch(
      generateRoutine([
        ['F#'],
        ['Major'],
        ['scale', 'octave', 'arpeggio', 'solidChord', 'brokenChord'],
      ]),
    );

    expect(
      store.getState().routine.generatedRoutine.map(i => i.displayItem),
    ).toEqual([
      'F# Major Scale',
      'F# Major Octaves',
      'F# Major Arpeggio',
      'F# Major Solid Chords',
      'F# Major Broken Chords',
    ]);
  });

  it.each([
    ['roots', [[], ['Major'], ['scale']]],
    ['types', [['C'], [], ['scale']]],
    ['exercises', [['C'], ['Major'], []]],
  ])('is empty when no %s are selected', (_, payload) => {
    const store = makeStore();
    store.dispatch(generateRoutine(payload));

    expect(store.getState().routine.generatedRoutine).toEqual([]);
  });

  it('replaces the previous routine instead of appending', () => {
    const store = makeStore();
    store.dispatch(generateRoutine([['C'], ['Major'], ['scale']]));
    store.dispatch(generateRoutine([['G'], ['Minor'], ['octave']]));

    expect(store.getState().routine.generatedRoutine).toEqual([
      {displayItem: 'G Minor Octaves', exerciseType: 'octave'},
    ]);
  });
});

describe('getTask', () => {
  it('takes a task out of the routine so it is not repeated', () => {
    const store = makeStore();
    store.dispatch(generateRoutine([['C', 'D', 'E'], ['Major'], ['scale']]));

    const seen = new Set<string>();
    for (let i = 0; i < 3; i++) {
      store.dispatch(getTask(null));
      seen.add(store.getState().routine.currentTask!.displayItem);
    }

    expect(seen).toEqual(
      new Set(['C Major Scale', 'D Major Scale', 'E Major Scale']),
    );
    expect(store.getState().routine.generatedRoutine).toEqual([]);
  });

  it('picks the task at the random index', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.99);
    const store = makeStore();
    store.dispatch(generateRoutine([['C', 'D', 'E'], ['Major'], ['scale']]));
    store.dispatch(getTask(null));

    expect(store.getState().routine.currentTask?.displayItem).toBe(
      'E Major Scale',
    );
  });

  it('clears the current task when a new routine is generated', () => {
    const store = makeStore();
    store.dispatch(generateRoutine([['C', 'D'], ['Major'], ['scale']]));
    store.dispatch(getTask(null));
    store.dispatch(generateRoutine([['G'], ['Minor'], ['octave']]));

    expect(store.getState().routine.currentTask).toBeNull();
  });

  it('sets currentTask back to null once the routine is finished', () => {
    const store = makeStore();
    store.dispatch(generateRoutine([['C'], ['Major'], ['scale']]));
    store.dispatch(getTask(null));
    store.dispatch(getTask(null));

    expect(store.getState().routine.currentTask).toBeNull();
  });
});

describe('getAllRoutines', () => {
  it('stores the routines from the database', async () => {
    db.getAllRoutines.mockResolvedValue([routine('1'), routine('2')]);
    const store = makeStore();

    await store.dispatch(getAllRoutines());

    expect(store.getState().routine.routines.map(r => r.id)).toEqual([
      '1',
      '2',
    ]);
    expect(store.getState().routine.status).toBe('fulfilled');
  });

  it('keeps the old list and reports failure when the database errors', async () => {
    db.getAllRoutines.mockResolvedValueOnce([routine('1')]);
    const store = makeStore();
    await store.dispatch(getAllRoutines());

    db.getAllRoutines.mockRejectedValueOnce(new Error('db locked'));
    await store.dispatch(getAllRoutines());

    expect(store.getState().routine.routines.map(r => r.id)).toEqual(['1']);
    expect(store.getState().routine.status).toBe('rejected');
  });
});

describe('saveRoutines', () => {
  it('generates the routine and saves it under the given title', async () => {
    db.saveRoutine.mockResolvedValue(true);
    const store = makeStore();

    await store.dispatch(
      saveRoutines(['Warmup', ['C'], ['Major'], ['scale', 'octave']]),
    );

    expect(db.saveRoutine).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Warmup',
        RoutineItems: [
          {displayItem: 'C Major Scale', exerciseType: 'scale'},
          {displayItem: 'C Major Octaves', exerciseType: 'octave'},
        ],
      }),
    );
  });
});

describe('deleteRoutine', () => {
  const storeWithRoutines = async (...ids: string[]) => {
    db.getAllRoutines.mockResolvedValue(ids.map(id => routine(id)));
    const store = makeStore();
    await store.dispatch(getAllRoutines());
    return store;
  };

  it('removes the routine from the list straight away', async () => {
    db.deleteRoutine.mockResolvedValue(undefined as never);
    const store = await storeWithRoutines('1', '2', '3');

    await store.dispatch(deleteRoutine('2'));

    expect(db.deleteRoutine).toHaveBeenCalledWith('2');
    expect(store.getState().routine.routines.map(r => r.id)).toEqual([
      '1',
      '3',
    ]);
  });

  it('leaves the list alone when the id is not in it', async () => {
    db.deleteRoutine.mockResolvedValue(undefined as never);
    const store = await storeWithRoutines('1', '2');

    await store.dispatch(deleteRoutine('99'));

    expect(store.getState().routine.routines.map(r => r.id)).toEqual([
      '1',
      '2',
    ]);
  });

  it('keeps the routine in the list if the database delete fails', async () => {
    db.deleteRoutine.mockRejectedValue(new Error('db locked'));
    const store = await storeWithRoutines('1', '2');

    await store.dispatch(deleteRoutine('1'));

    expect(store.getState().routine.routines.map(r => r.id)).toEqual([
      '1',
      '2',
    ]);
    expect(store.getState().routine.status).toBe('rejected');
  });

  it('has its own action type, separate from saveRoutines', () => {
    expect(deleteRoutine.typePrefix).not.toBe(saveRoutines.typePrefix);
  });
});

describe('resumeRoutine', () => {
  it('loads the saved routine items so Practice can play them', async () => {
    db.getRoutineItems.mockResolvedValue([
      {id: 1, displayItem: 'C Major Scale', exerciseType: 'scale', routineForeignKey: 7},
      {id: 2, displayItem: 'C Major Octaves', exerciseType: 'octave', routineForeignKey: 7},
    ]);
    const store = makeStore();
    store.dispatch(generateRoutine([['B'], ['Minor'], ['arpeggio']]));

    await store.dispatch(resumeRoutine('7'));

    expect(db.getRoutineItems).toHaveBeenCalledWith('7');
    expect(store.getState().routine.currentTask).toBeNull();
    expect(store.getState().routine.generatedRoutine).toEqual([
      {displayItem: 'C Major Scale', exerciseType: 'scale'},
      {displayItem: 'C Major Octaves', exerciseType: 'octave'},
    ]);
  });

  it('starts empty if the database is not ready', async () => {
    db.getRoutineItems.mockResolvedValue(undefined);
    const store = makeStore();
    store.dispatch(generateRoutine([['B'], ['Minor'], ['arpeggio']]));

    await store.dispatch(resumeRoutine('7'));

    expect(store.getState().routine.generatedRoutine).toEqual([]);
  });
});

describe('deleteAllRoutines', () => {
  it('empties the saved routines list', async () => {
    db.getAllRoutines.mockResolvedValue([routine('1'), routine('2')]);
    const store = makeStore();
    await store.dispatch(getAllRoutines());

    await store.dispatch(deleteAllRoutines());

    expect(db.deleteAllRoutines).toHaveBeenCalled();
    expect(store.getState().routine.routines).toEqual([]);
  });

  it('keeps the list if the database delete fails', async () => {
    db.getAllRoutines.mockResolvedValue([routine('1')]);
    db.deleteAllRoutines.mockRejectedValue(new Error('db locked'));
    const store = makeStore();
    await store.dispatch(getAllRoutines());

    await store.dispatch(deleteAllRoutines());

    expect(store.getState().routine.routines.map(r => r.id)).toEqual(['1']);
    expect(store.getState().routine.status).toBe('rejected');
  });
});
