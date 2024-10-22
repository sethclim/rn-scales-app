import {Routine} from '../../../../data/Models/DataModels';
import {RoutineItem} from '../../../../data/Models/DataModels';
import {IAction} from '../../../types';

export enum RoutineTypes {
  GENERATE_REQUEST,
  REQUEST_TASK,
  SAVE_ROUTINE,
  DELETE_ROUTINE,
  RESUME_ROUTINE,
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

export const deleteRoutine = (payload: Array<Routine>): IAction => ({
  type: RoutineTypes.DELETE_ROUTINE,
  payload,
});

export const resumeRoutine = (payload: Array<RoutineItem>): IAction => ({
  type: RoutineTypes.RESUME_ROUTINE,
  payload,
});
