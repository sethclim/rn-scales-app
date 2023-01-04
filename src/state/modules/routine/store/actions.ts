import * as types from './types';

export interface IGenerateRequest {
  type: types.GENERATE_REQUEST;
  payload: Array<any>;
}

// export interface IApiSuccess {
//   type: types.API_SUCCESS;
//   payload: Array<any>;
// }

// export interface IApiError {
//   type: types.API_ERROR;
//   payload: string;
// }

export const generateRequest = (payload: Array<any>): IGenerateRequest => ({
  payload,
  type: types.GENERATE_REQUEST,
});

// export const apiSuccess = (payload: Array<any>): IApiSuccess => ({
//   payload,
//   type: types.API_SUCCESS,
// });

// export const apiError = (payload: string): IApiError => ({
//   payload,
//   type: types.API_ERROR,
// });

export type TAction = {
  type: string;
  payload: Array<any>;
};
