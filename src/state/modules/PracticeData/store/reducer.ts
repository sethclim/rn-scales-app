import {TAction} from './actions';
import {IState} from './initialState';
import * as types from './types';

import {database} from '../../../../data/Database/database';
import Routine from '../../../../data/Database/routine.model';
import RoutineItem from '../../../../data/Database/routine_item.model';

const reducer = (state: IState, action: TAction): IState => {
  const {type, payload} = action;
  switch (type) {
    case types.RECORD_PRACTICE_DATA :
      return {...state, loading: true, currentSessionPracticeData: RecordPracticeData(payload)};
    case types.SAVE_PRACTICE_DATA :
      return {...state, loading: true, savingPracticeData: SavePracticeData(payload)};

    default:
      return state;
  }
};


const RecordPracticeData = (practiceData : any): Array<string> => {


  return practiceData
}

const SavePracticeData = (practiceData : any) => {


  return true;
}


export default reducer; 
