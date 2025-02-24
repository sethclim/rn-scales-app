// store.js
import { configureStore } from '@reduxjs/toolkit';
import routineReducer from './routineSlice';
import { useDispatch } from 'react-redux';

const store = configureStore({
  reducer: {
    routine: routineReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
});

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = useDispatch.withTypes<AppDispatch>() //

export default store;