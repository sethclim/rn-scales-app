import { ExerciseType } from '../../../../data/Models/ExerciseType';
import * as types from './types';

export interface IRecordPracticeData {
  type: types.RECORD_PRACTICE_DATA;
  payload: ExerciseType;
}

export interface ISavePracticeData {
  type: types.SAVE_PRACTICE_DATA;
  payload: null;
}

export const recordPracticeDataRequest = (payload: ExerciseType): IRecordPracticeData => ({
  payload,
  type: types.RECORD_PRACTICE_DATA,
});

export const savePracticeDataRequest =(payload : null): ISavePracticeData =>({
  payload,
  type: types.SAVE_PRACTICE_DATA
})

export type TAction = {
  type: string;
  payload: any;
};
