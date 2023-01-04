import {TAction} from './actions';
import {IState} from './initialState';
import * as types from './types';

const reducer = (state: IState, action: TAction): IState => {
  const {type, payload} = action;
  switch (type) {
    case types.GENERATE_REQUEST:
      return {...state, loading: true, generatedRoutine: GenerateRoutine(payload)};
    // case types.API_SUCCESS:
    //   return {...state, loading: false, data: payload};
    // case types.API_ERROR:
    //   return {...state, loading: false, error: payload};
    default:
      return state;
  }
};


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

        const result = `${root}${type} ${exercise}`
        results.push(result);
      }
    }
  }

  return results;
}

export default reducer;
