import {IState} from './initialState';
import {RoutineTypes} from './actions';

// import {database} from '../../../../data/Database/database';
import {
  ExerciseType,
  RoutineItem,
  RoutineModel,
} from '../../../../data/Models/DataModels';
import {Exercises} from '../../../../screens/Generate';
import {IAction} from '../../../types';
import dbInstance, {Database} from '../../../../data/Database/database';

const reducer = (state: IState, action: IAction): IState => {
  const {type, payload} = action;
  switch (type) {
    case RoutineTypes.GENERATE_REQUEST:
      return {
        ...state,
        loading: true,
        generatedRoutine: GenerateRoutine(payload),
      };
    case RoutineTypes.REQUEST_TASK:
      return {
        ...state,
        loading: false,
        currentTask: GetTask(state.generatedRoutine),
      };
    case RoutineTypes.SAVE_ROUTINE:
      return {
        ...state,
        loading: false,
        saving: SaveRoutine(state.generatedRoutine, payload),
      };
    case RoutineTypes.DELETE_ROUTINE:
      return {...state, loading: false, deleting: DeleteRoutine(payload)};
    case RoutineTypes.RESUME_ROUTINE:
      return {
        ...state,
        loading: false,
        generatedRoutine: ResumeRoutine(payload),
      };
    default:
      return state;
  }
};

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

const GetTask = (routine: Array<RoutineItem>): RoutineItem => {
  const index = getRandomInt(routine.length);
  const result = routine.splice(index, 1)[0];

  return result;
};

const GenerateRoutine = (inputOptions: Array<any>): Array<RoutineItem> => {
  console.log('Calling GenerateRoutine');

  const roots = inputOptions[0];
  const types = inputOptions[1];
  const exercises = inputOptions[2];
  //const exType    = inputOptions[3];

  const results: Array<RoutineItem> = [];

  // Inputs-------
  // C  D
  // Major Minor
  // Scale Arp
  //--------------
  //RESULT->
  // Cmaj scale, Cmin scale, Dmaj scale, Dmin scale,
  for (var r = 0; r < roots.length; r++) {
    for (var t = 0; t < types.length; t++) {
      for (var e = 0; e < exercises.length; e++) {
        const root = roots[r];
        const type = types[t];
        const exerciseType = exercises[e] as ExerciseType;

        var exerciseDisplay = Exercises.get(exerciseType);

        const result = `${root} ${type} ${exerciseDisplay}`;

        var routineItem: RoutineItem = {
          displayItem: result,
          exerciseType: exerciseType,
        };
        // routineItem.displayItem = result;
        // routineItem.exerciseType = exerciseType;

        results.push(routineItem);
      }
    }
  }
  console.log('Calling GenerateRoutine' + results.length);
  return results;
};

const SaveRoutine = async (
  routineData: Array<RoutineItem>,
  payload: Array<string>,
) => {
  const inputOptions = payload.slice(0, 3);
  const title = payload[3];

  //console.log("Save Name " + title);
  //console.log("inputOptions " + inputOptions[0].length + " " + inputOptions[1].length+ " " + inputOptions[2].length);

  console.log('routineData.length ' + routineData.length);
  console.log('routineData.length <=0 ' + (routineData.length <= 0));
  if (routineData.length <= 0) {
    routineData = GenerateRoutine(inputOptions);
    console.log('GenerateRoutine routineData.length ' + routineData.length);
  }

  const res = await dbInstance.saveRoutines(routineData);

  //Do Watermelon logic
  // const newRoutine = await database.write(async () => {
  //   const routine = await database
  //     .get<RoutineModel>('routines')
  //     .create(one => {
  //       one.title = title;
  //       one.createdAt = new Date().getDate().toString();
  //     })
  //     .catch(error => {
  //       // Handle any errors that occur
  //       console.error('MYERROR ' + error);
  //     });

  //   if (routine != null) {
  //     const RoutineItems = database.get<RoutineItem[]>('routine_items');

  //     for (var i = 0; i < routineData.length; i++) {
  //       const item = routineData[i];
  //       RoutineItems.create(routineItem => {
  //         routineItem.routine.set(routine!);
  //         routineItem.item = item.displayItem;
  //         routineItem.type = item.exerciseType;
  //       });
  //     }
  //   }

  //   return routine;
  // });

  //return newRoutine;
};

const ResumeRoutine = (routineItems: Array<RoutineItem>) => {
  // const resumeRoutineArray = Array<RoutineItem>();

  // for (var i = 0; i < routineItems.length; i++) {
  //   resumeRoutineArray[i] = routineItems[i].item;
  // }
  // console.log('routineItems.length ' + routineItems.length);

  return routineItems;
};

const DeleteRoutine = async (payload: Array<RoutineModel>) => {
  //Do Watermelon Delete
  // await database.write(async () => {
  //   const routine = await database
  //     .get<RoutineModel>('routines')
  //     .find(payload[0].id);
  //   const items = await routine.routineItems;
  //   const deleted = items.map(routineItem =>
  //     routineItem.prepareDestroyPermanently(),
  //   );
  //   await database.batch(...deleted);
  //   await routine.destroyPermanently();
  // });
};

export default reducer;
