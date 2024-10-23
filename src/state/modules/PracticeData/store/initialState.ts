import {Dispatch} from 'react';
import {PracticeData} from '../../../../data/Models/DataModels';
import {IAction} from '../../../types';

export interface IState {
  error: string;
  loading: boolean;
  currentSessionPracticeData: PracticeData;
  savingPracticeData: any;
  practiceDatadispatch: Dispatch<IAction>;
  practiceData: PracticeData | null;
}

const initialState: IState = {
  error: '',
  loading: false,
  currentSessionPracticeData: new PracticeData(new Date()),
  savingPracticeData: false,
  practiceDatadispatch: () => {
    // Dispatch initial value
  },
  practiceData: null,
};

export function GetInitialState(): IState {
  return initialState;
}

export default initialState;
