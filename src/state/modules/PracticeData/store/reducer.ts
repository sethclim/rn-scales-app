import {IAction} from '../../../types';
import {IState} from './initialState';
// import * as types from './types';

import { database } from '../../../../data/Database/database';
import PracticeDataModel from '../../../../data/Database/practice_data.model';
import PracticeData from '../../../../data/Models/PracticeData';
import { ExerciseType } from '../../../../data/Models/ExerciseType';
import { PracticeTypes } from './actions';


const reducer = (state: IState, action: IAction): IState => {
  const {type, payload} = action;
  switch (type) {
    case PracticeTypes.RECORD_PRACTICE_DATA :
      return {...state, loading: true, currentSessionPracticeData: RecordPracticeData(payload, state.currentSessionPracticeData)};
    case PracticeTypes.SAVE_PRACTICE_DATA :
      return {...state, loading: true, savingPracticeData: SavePracticeData(state.currentSessionPracticeData)};

    default:
      return state;
  }
};

const RecordPracticeData = (stepData : ExerciseType, currentPracticeData : PracticeData): PracticeData => {
  
  
  const currentCount = currentPracticeData.Counts.get(stepData)
  console.log("currentCount " + currentPracticeData.Counts.get(stepData))

  currentPracticeData.Counts.set(stepData, (currentCount ?? 0) + 1);

    console.log("stepData " + currentPracticeData.Counts.get(stepData))

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
      practiceDataModel.Scale        = practiceData.Counts.get('scale');
      practiceDataModel.Octave       = practiceData.Counts.get('octave');
      practiceDataModel.Arpeggio     = practiceData.Counts.get('arpeggio');
      practiceDataModel.BrokenChord  = practiceData.Counts.get('broken-chord');
      practiceDataModel.SolidChord   = practiceData.Counts.get('solid-chord');
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
