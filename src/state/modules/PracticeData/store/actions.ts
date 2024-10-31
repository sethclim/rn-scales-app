import {ExerciseType, PracticeData} from '../../../../data/Models/DataModels';
import {IAction} from '../../../types';

export enum PracticeTypes {
  RECORD_PRACTICE_DATA,
  SAVE_PRACTICE_DATA,
  SAVING_PRACTICE_DATA,
  SAVED_PRACTICE_DATA,
  GET_ALL_PRACTICE_DATA,
  ERROR,
  GETTING_ALL_PRACTICE_DATA,
  RECEIVED_ALL_PRACTICE_DATA,
  GET_TODAYS_PRACTICE_DATA,
  GETTING_TODAYS_PRACTICE_DATA,
  RECEIVED_TODAYS_PRACTICE_DATA,
}

export const recordPracticeDataRequest = (payload: ExerciseType): IAction => ({
  payload,
  type: PracticeTypes.RECORD_PRACTICE_DATA,
});

export const savePracticeDataRequest = (): IAction => ({
  payload: null,
  type: PracticeTypes.SAVE_PRACTICE_DATA,
});

export const getPracticeDataRequest = (): IAction => ({
  payload: null,
  type: PracticeTypes.GET_ALL_PRACTICE_DATA,
});

export const getTodaysPracticeDataRequest = (payload: Date): IAction => ({
  payload,
  type: PracticeTypes.GET_TODAYS_PRACTICE_DATA,
});
