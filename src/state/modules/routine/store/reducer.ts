import {TAction} from './actions';
import {IState} from './initialState';
import * as types from './types';

import {database} from '../../../../data/database';
import Routine from '../../../../data/routine.model';
import RoutineItem from '../../../../data/routine_item.model';

const reducer = (state: IState, action: TAction): IState => {
  const {type, payload} = action;
  switch (type) {
    case types.GENERATE_REQUEST:
      return {...state, loading: true, generatedRoutine: GenerateRoutine(payload)};
    case types.REQUEST_TASK:
      return {...state, loading: false, currentTask: GetTask(state.generatedRoutine)};
    case types.SAVE_ROUTINE:
      return {...state, loading: false, saving: SaveRoutine(state.generatedRoutine)};
    default:
      return state;
  }
};

function getRandomInt(max : number) {
  return Math.floor(Math.random() * max);
}

const GetTask = (routine : Array<string>) : string => {
   const index = getRandomInt(routine.length);
   const result = routine.splice(index, 1)[0];

   return result;
}

const GenerateRoutine = (inputOptions : Array<any>): Array<string> => {

  const roots     = inputOptions[0];
  const types     = inputOptions[1];
  const exercises = inputOptions[2];

  const results: Array<string> = [];

  // Inputs-------
  // C  D
  // Major Minor
  // Scale Arp 
  //--------------
  //RESULT->
  // Cmaj scale, Cmin scale, Dmaj scale, Dmin scale, 
  for(var r = 0; r < roots.length; r++)
  {
    for(var t = 0; t < types.length; t++)
    {
      for(var e = 0; e < exercises.length; e++)
      {

        const root = roots[r];
        const type = types[t];
        const exercise = exercises[e];

        const result = `${root} ${type} ${exercise}`
        results.push(result);
      }
    }
  }

  return results;
}

const SaveRoutine = async  (routineData : Array<string>)=>{
  //Do Watermelon logic 
  const newRoutine = await database.write(async () => {
    const routine = await database.get<Routine>("routines").create((one) => {
      one.title = 'New post'
      one.createdAt = "Hello"
    })
    .catch((error) => {
        // Handle any errors that occur
        console.error("MYERROR " + error);
    });

    const RoutineItems = database.get<RoutineItem>('routine_items');

    for(var item in routineData)
    {
      RoutineItems.create((routineItems) => {
        routineItems.item = item;
      });
    }

    return routine;
  })

  return newRoutine;
}


export default reducer; 
