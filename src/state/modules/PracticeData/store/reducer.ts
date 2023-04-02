import {TAction} from './actions';
import {IState} from './initialState';
import * as types from './types';

import { database } from '../../../../data/Database/database';
import PracticeDataModel from '../../../../data/Database/practice_data.model';
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

const SavePracticeData = async (practiceData : PracticeData) => {
  console.log("SavePracticeData ");

  //Save or update!!!!

  const newPracitceData = await database.write(async () => {
    const practice = await database.get<PracticeDataModel>('practice_data');

    console.log("Practice " + practice)
    
    
    await practice.create((practiceDataModel) => {
      practiceDataModel.date         = new Date();
      practiceDataModel.Scale        = practiceData.Counts['scale'];
      practiceDataModel.Octave      = practiceData.Counts['octave'];
      practiceDataModel.Arpeggio     = practiceData.Counts['arpeggio'];
      practiceDataModel.BrokenChord = practiceData.Counts['brokenchord'];
      practiceDataModel.SolidChord  = practiceData.Counts['solidchord'];
    })
    .catch((error) => {
        // Handle any errors that occur
        console.error("MYERROR " + error);
        return Promise<false>;
    })
    return practice;
  })
  
  return newPracitceData;
}

export default reducer; 
