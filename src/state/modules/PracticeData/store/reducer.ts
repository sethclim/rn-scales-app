import {TAction} from './actions';
import {IState} from './initialState';
import * as types from './types';

import PracticeData from '../../../../data/Models/PracticeData';

const reducer = (state: IState, action: TAction): IState => {
  const {type, payload} = action;
  switch (type) {
    case types.RECORD_PRACTICE_DATA :
      return {...state, loading: true, currentSessionPracticeData: RecordPracticeData(payload, state.currentSessionPracticeData)};
    case types.SAVE_PRACTICE_DATA :
      return {...state, loading: true, savingPracticeData: SavePracticeData(payload)};

    default:
      return state;
  }
};


const RecordPracticeData = (stepData : [string, number], currentPracticeData : PracticeData): PracticeData => {

  currentPracticeData.Counts[stepData[0]] = currentPracticeData.Counts[stepData[0]] + stepData[1];

  return currentPracticeData
}

const SavePracticeData = (practiceData : any) => {


  return true;
}


export default reducer; 
