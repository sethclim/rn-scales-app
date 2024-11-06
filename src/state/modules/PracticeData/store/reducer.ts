import {IAction} from '../../../types';
import {IState} from './initialState';
// import * as types from './types';

//import {database} from '../../../../data/Database/database';
import {PracticeData, ExerciseType} from '../../../../data/Models/DataModels';
import {PracticeTypes} from './actions';
import {GRAPH_ID} from '../../../../screens/PracticeStats/Graph/GraphBuilder';

const reducer = (state: IState, action: IAction): IState => {
  const {type, payload} = action;
  switch (type) {
    case PracticeTypes.RECORD_PRACTICE_DATA:
      return {
        ...state,
        loading: false,
        currentSessionPracticeData: RecordPracticeData(
          payload,
          state.currentSessionPracticeData,
        ),
      };
    case PracticeTypes.SAVE_PRACTICE_DATA:
      return {
        ...state,
        loading: true,
        savingPracticeData: SavePracticeData(state.currentSessionPracticeData),
      };

    case PracticeTypes.RECEIVED_ALL_PRACTICE_DATA:
      return {
        ...state,
        loading: true,
        practiceData: HandleLoadedPracticeData(payload),
      };

    case PracticeTypes.RECEIVED_TODAYS_PRACTICE_DATA:
      return {
        ...state,
        loading: true,
        currentSessionPracticeData: HandleLoadedTodaysPracticeData(payload),
      };

    default:
      return state;
  }
};

const RecordPracticeData = (
  stepData: ExerciseType,
  currentPracticeData: PracticeData,
): PracticeData => {
  const cloneCurrentPracticeData = new PracticeData(
    currentPracticeData.getDate(),
  );

  currentPracticeData.getCounts().forEach((value, key) => {
    cloneCurrentPracticeData.updateValues(key, value);
  });

  cloneCurrentPracticeData.updateValues(stepData, 1);

  // const currentCount = currentPracticeData.Counts.get(stepData);
  // console.log('RecordPracticeData currentCount ' + currentCount);

  // cloneCurrentPracticeData.Counts.set(stepData, (currentCount ?? 0) + 1);

  // console.log(
  //   'RecordPracticeData cloneCurrentPracticeData ' +
  //     JSON.stringify(cloneCurrentPracticeData),
  // );

  return cloneCurrentPracticeData;
};

const SavePracticeData = async (practiceData: PracticeData) => {
  //console.log('SavePracticeData ');
  //Save or update!!!!
  // const newPracitceData = await database.write(async () => {
  //   const practice = await database.get<PracticeDataModel>('practice_data');
  //   console.log('Practice ' + practice);
  //   await practice
  //     .create(practiceDataModel => {
  //       practiceDataModel.date = new Date();
  //       practiceDataModel.Scale = practiceData.Counts.get('scale');
  //       practiceDataModel.Octave = practiceData.Counts.get('octave');
  //       practiceDataModel.Arpeggio = practiceData.Counts.get('arpeggio');
  //       practiceDataModel.BrokenChord = practiceData.Counts.get('broken-chord');
  //       practiceDataModel.SolidChord = practiceData.Counts.get('solid-chord');
  //     })
  //     .catch(error => {
  //       // Handle any errors that occur
  //       console.error('MYERROR ' + error);
  //       return Promise<false>;
  //     });
  //   return practice;
  // });
  //return newPracitceData;
};

const HandleLoadedPracticeData = (payload: Map<GRAPH_ID, PracticeData[]>) => {
  return payload;
};

const HandleLoadedTodaysPracticeData = (payload: PracticeData) => {
  //console.log('HandleLoadedTodaysPracticeData' + JSON.stringify(payload));
  return payload;
};

export default reducer;
