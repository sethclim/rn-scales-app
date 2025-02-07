import {Routine} from '../../../../data/Models/DataModels';
import {RoutineItem} from '../../../../data/Models/DataModels';
import {IAction} from '../../../types';

export enum RoutineTypes {
  ERROR,
  GENERATE_REQUEST,
  REQUEST_TASK,
  SAVE_ROUTINE,
  DELETE_ROUTINE,
  RESUME_ROUTINE,
  REQUEST_ALL_ROUTINES,
  LOADING_ALL_ROUTINES,
  LOADED_ALL_ROUTINES,
  ROUTINE_SAVED,
  RESUMED_ROUTINE_ITEMS,
}

export const generateRequest = (payload: Array<any>): IAction => ({
  type: RoutineTypes.GENERATE_REQUEST,
  payload,
});

export const requestTask = (payload: Array<any>): IAction => ({
  type: RoutineTypes.REQUEST_TASK,
  payload,
});

export const saveRoutine = (payload: Array<any>): IAction => ({
  type: RoutineTypes.SAVE_ROUTINE,
  payload,
});

export const deleteRoutine = (payload: string): IAction => ({
  type: RoutineTypes.DELETE_ROUTINE,
  payload,
});

export const resumeRoutine = (payload: string): IAction => ({
  type: RoutineTypes.RESUME_ROUTINE,
  payload,
});

export const requestAllRoutines = (): IAction => ({
  type: RoutineTypes.REQUEST_ALL_ROUTINES,
  payload: null,
});

export const routineSaved = (): IAction => ({
  type: RoutineTypes.ROUTINE_SAVED,
  payload: null,
});
