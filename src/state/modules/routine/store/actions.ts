import RoutineModel from '../../../../data/Database/routine.model';
import RoutineItemModel from '../../../../data/Database/routine_item.model';
import { IAction } from '../../../types';

export enum RoutineTypes{
  GENERATE_REQUEST,
  REQUEST_TASK,
  SAVE_ROUTINE,
  DELETE_ROUTINE,
  RESUME_ROUTINE
}

export const generateRequest = (payload: Array<any>): IAction => ({
  type: RoutineTypes.GENERATE_REQUEST,
  payload
});

export const requestTask = (payload: Array<any>): IAction => ({
  type: RoutineTypes.REQUEST_TASK,
  payload,
});

export const saveRoutine = (payload : Array<any>): IAction => ({
  type: RoutineTypes.SAVE_ROUTINE,
  payload,
});

export const deleteRoutine = (payload : Array<RoutineModel>): IAction => ({
  type: RoutineTypes.DELETE_ROUTINE,
  payload,
});

export const ResumeRoutine = (payload : Array<RoutineItemModel>): IAction => ({
  type: RoutineTypes.RESUME_ROUTINE,
  payload,
});

