import {Dispatch} from 'react';
import {IPracticeData} from '../../../../data/Models/DataModels';
import {IAction} from '../../../types';
import {GRAPH_ID} from '../../../../screens/PracticeStats/Graph/GraphBuilder';

export interface IState {
  error: string;
  loading: boolean;
  currentSessionPracticeData: IPracticeData;
  savingPracticeData: any;
  practiceDatadispatch: Dispatch<IAction>;
  practiceData: Map<GRAPH_ID, IPracticeData[]>;
}

const initialState: IState = {
  error: '',
  loading: false,
  currentSessionPracticeData: new PracticeData(new Date()),
  savingPracticeData: false,
  practiceDatadispatch: () => {
    // Dispatch initial value
  },
  practiceData: new Map(),
};

export function GetInitialState(): IState {
  return initialState;
}

export default initialState;
