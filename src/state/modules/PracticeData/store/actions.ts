import { ExerciseType } from '../../../../data/Models/ExerciseType';
import { IAction } from '../../../types';
// import * as types from './types';


export enum PracticeTypes{
  RECORD_PRACTICE_DATA,
  SAVE_PRACTICE_DATA,
}

// export interface IRecordPracticeData {
//   type: types.RECORD_PRACTICE_DATA;
//   payload: ExerciseType;
// }

// export interface ISavePracticeData {
//   type: types.SAVE_PRACTICE_DATA;
//   payload: null;
// }

export const recordPracticeDataRequest = (payload: ExerciseType): IAction => ({
  payload,
  type: PracticeTypes.RECORD_PRACTICE_DATA,
});

export const savePracticeDataRequest =(payload : null): IAction =>({
  payload,
  type: PracticeTypes.SAVE_PRACTICE_DATA
})