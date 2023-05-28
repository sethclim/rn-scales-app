import { ExerciseType } from '../../../../data/Models/ExerciseType';
import { IAction } from '../../../types';

export enum PracticeTypes{
  RECORD_PRACTICE_DATA,
  SAVE_PRACTICE_DATA,
}

export const recordPracticeDataRequest = (payload: ExerciseType): IAction => ({
  payload,
  type: PracticeTypes.RECORD_PRACTICE_DATA,
});

export const savePracticeDataRequest =(payload : null): IAction =>({
  payload,
  type: PracticeTypes.SAVE_PRACTICE_DATA
})