import React from 'react';
import {Provider} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import {fireEvent, render, screen} from '@testing-library/react-native';

import PracticeRoutine from '../PracticeRoutine';
import routineReducer, {
  generateRoutine,
  getTask,
  resumeRoutine,
} from '../../state/routineSlice';
import practiceDataReducer from '../../state/practiceDataSlice';
import {ThemeProvider} from '../../context';
import dbInstance from '../../data/Database/database';

jest.mock('../../data/Database/database', () => ({
  __esModule: true,
  default: {
    getTodaysPracticeData: jest.fn(),
    savePracticedata: jest.fn(),
    getRoutineItems: jest.fn(),
  },
}));

const mockNavigate = jest.fn();
// Focus = mount, blur = unmount
jest.mock('@react-navigation/native', () => {
  const {useEffect} = jest.requireActual('react');
  return {
    useNavigation: () => ({navigate: mockNavigate}),
    useFocusEffect: (effect: () => void | (() => void)) => useEffect(effect, []),
  };
});

const db = dbInstance as jest.Mocked<typeof dbInstance>;

const makeStore = () =>
  configureStore({
    reducer: {routine: routineReducer, practice: practiceDataReducer},
  });

const renderPractice = (store: ReturnType<typeof makeStore>) =>
  render(
    <Provider store={store}>
      <ThemeProvider>
        <PracticeRoutine />
      </ThemeProvider>
    </Provider>,
  );

const pressNext = () => fireEvent.press(screen.getByText('NEXT'));

const sessionCounts = (store: ReturnType<typeof makeStore>) => {
  const {scale, octave, arpeggio, solidChord, brokenChord} =
    store.getState().practice.currentSessionPracticeData;
  return {scale, octave, arpeggio, solidChord, brokenChord};
};

const ZERO = {scale: 0, octave: 0, arpeggio: 0, solidChord: 0, brokenChord: 0};

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'log').mockImplementation(() => {});
  db.getTodaysPracticeData.mockResolvedValue({
    date: new Date().toString(),
    ...ZERO,
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('PracticeRoutine', () => {
  it('records each exercise once and finishes after the last one', async () => {
    const store = makeStore();
    // 4 items: C/D Major x Scale/Octaves
    store.dispatch(generateRoutine([['C', 'D'], ['Major'], ['scale', 'octave']]));
    await renderPractice(store);

    for (let i = 0; i < 4; i++) {
      expect(screen.queryByText('Practice Complete')).toBeNull();
      await pressNext();
    }

    expect(screen.getByText('Practice Complete')).toBeTruthy();
    expect(sessionCounts(store)).toEqual({...ZERO, scale: 2, octave: 2});
  });

  it('shows every exercise in the routine exactly once', async () => {
    const store = makeStore();
    store.dispatch(generateRoutine([['C', 'D', 'E'], ['Minor'], ['arpeggio']]));
    await renderPractice(store);

    const shown: string[] = [];
    while (screen.queryByText('Practice Complete') == null) {
      shown.push(screen.getByText(/Minor Arpeggio$/).props.children);
      await pressNext();
    }

    expect(shown.sort()).toEqual([
      'C Minor Arpeggio',
      'D Minor Arpeggio',
      'E Minor Arpeggio',
    ]);
  });

  it('saves the session when leaving the screen', async () => {
    // Always pick the first remaining task, so Scale comes up first
    jest.spyOn(Math, 'random').mockReturnValue(0);
    const store = makeStore();
    store.dispatch(generateRoutine([['C'], ['Major'], ['scale', 'arpeggio']]));
    const {unmount} = await renderPractice(store);
    await pressNext();

    await unmount();

    expect(db.savePracticedata).toHaveBeenCalledWith(
      expect.objectContaining({scale: 1, arpeggio: 0}),
    );
  });

  it('does not count a task left over from an unfinished routine', async () => {
    const store = makeStore();
    // Start a routine and leave it with a task still showing
    store.dispatch(generateRoutine([['G'], ['Major'], ['octave', 'scale']]));
    store.dispatch(getTask(null));

    // Then resume a saved one-item routine
    db.getRoutineItems.mockResolvedValue([
      {id: 1, displayItem: 'C Major Scale', exerciseType: 'scale', routineForeignKey: 1},
    ]);
    await store.dispatch(resumeRoutine('1'));
    await renderPractice(store);
    await pressNext();

    expect(screen.getByText('Practice Complete')).toBeTruthy();
    expect(sessionCounts(store)).toEqual({...ZERO, scale: 1});
  });

  it('goes back to Generate when the routine is done', async () => {
    const store = makeStore();
    store.dispatch(generateRoutine([['C'], ['Major'], ['scale']]));
    await renderPractice(store);
    await pressNext();

    await fireEvent.press(screen.getByText('Go Back'));

    expect(mockNavigate).toHaveBeenCalledWith('Main', {screen: 'Generate'});
  });
});
