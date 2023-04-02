import * as types from './types';

export interface IRecordPracticeData {
  type: types.RECORD_PRACTICE_DATA;
  payload: [string, number] ;
}

export interface ISavePracticeData {
  type: types.SAVE_PRACTICE_DATA;
  payload: null;
}

export const recordPracticeDataRequest = (payload: [string, number]): IRecordPracticeData => ({
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
