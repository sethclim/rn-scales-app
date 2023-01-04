import * as types from './types';

export interface IApiRequest {
  type: types.API_REQUEST;
  payload: Array<any>;
}

export interface IApiSuccess {
  type: types.API_SUCCESS;
  payload: Array<any>;
}

export interface IApiError {
  type: types.API_ERROR;
  payload: string;
}

export const apiRequest = (payload: Array<any>): IApiRequest => ({
  payload,
  type: types.API_REQUEST,
});

export const apiSuccess = (payload: Array<any>): IApiSuccess => ({
  payload,
  type: types.API_SUCCESS,
});

export const apiError = (payload: string): IApiError => ({
  payload,
  type: types.API_ERROR,
});

export type TAction = {
  type: string;
  payload: Array<any>;
};
