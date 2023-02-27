import * as types from './types';

export interface IGenerateRequest {
  type: types.GENERATE_REQUEST;
  payload: Array<any>;
}

export interface IRequestTask {
  type: types.REQUEST_TASK;
  payload: Array<any>;
}

export interface ISaveRoutine {
  type: types.SAVE_ROUTINE;
  payload: Array<any>;
}

export const generateRequest = (payload: Array<any>): IGenerateRequest => ({
  payload,
  type: types.GENERATE_REQUEST,
});

export const requestTask = (payload: Array<any>): IRequestTask => ({
  payload,
  type: types.REQUEST_TASK,
});

export const saveRoutine = (payload : Array<any>): ISaveRoutine => ({
  payload,
  type: types.SAVE_ROUTINE,
});

export type TAction = {
  type: string;
  payload: Array<any>;
};
