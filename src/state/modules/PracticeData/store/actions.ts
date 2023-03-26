// import Routine from '../../../../data/routine.model';
// import RoutineItem from '../../../../data/routine_item.model';
import * as types from './types';

// export interface IGenerateRequest {
//   type: types.GENERATE_REQUEST;
//   payload: Array<any>;
// }

// export const generateRequest = (payload: Array<any>): IGenerateRequest => ({
//   payload,
//   type: types.GENERATE_REQUEST,
// });

export type TAction = {
  type: string;
  payload: any;
};
