// store.js
import { useDispatch } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import routineReducer from './routineSlice';
import practiceDataReducer from './practiceDataSlice';


const store = configureStore({
  reducer: {
    routine: routineReducer,
    practice: practiceDataReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
});

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = useDispatch.withTypes<AppDispatch>() //

export default store;