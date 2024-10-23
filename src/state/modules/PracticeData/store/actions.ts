import {ExerciseType, PracticeData} from '../../../../data/Models/DataModels';
import {IAction} from '../../../types';

export enum PracticeTypes {
  RECORD_PRACTICE_DATA,
  SAVE_PRACTICE_DATA,
  SAVING_PRACTICE_DATA,
  SAVED_PRACTICE_DATA,
  GET_PRACTICE_DATA,
  ERROR,
  GETTING_PRACTICE_DATA,
  RECEIVED_PRACTICE_DATA,
}

export const recordPracticeDataRequest = (payload: ExerciseType): IAction => ({
  payload,
  type: PracticeTypes.RECORD_PRACTICE_DATA,
});

export const savePracticeDataRequest = (payload: PracticeData): IAction => ({
  payload,
  type: PracticeTypes.SAVE_PRACTICE_DATA,
});

export const getPracticeDataRequest = (): IAction => ({
  payload: null,
  type: PracticeTypes.GET_PRACTICE_DATA,
});
