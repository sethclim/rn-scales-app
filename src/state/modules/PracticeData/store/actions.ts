// import Routine from '../../../../data/routine.model';
// import RoutineItem from '../../../../data/routine_item.model';
import * as types from './types';

export interface IRecordPracticeData {
  type: types.RECORD_PRACTICE_DATA;
  payload: [string, number] ;
}

export const recordPracticeDataRequest = (payload: [string, number]): IRecordPracticeData => ({
  payload,
  type: types.RECORD_PRACTICE_DATA,
});

export type TAction = {
  type: string;
  payload: any;
};
