import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { RootState } from "./store"
import { ExerciseType, Routine, RoutineItem } from "../data/Models/DataModels";
import dbInstance from "../data/Database/database";
import { Exercises } from "../screens/Generate";

export interface IRoutineState {
  error: string;
  loading: boolean;
  generatedRoutine: Array<RoutineItem>;
  currentTask: RoutineItem | null;
  saving: any;
  deleting: any;
  routines: Array<Routine>;
  status: 'idle' | 'pending' | 'fulfilled' | 'rejected'
}

const initialState: IRoutineState = {
  error: '',
  loading: false,
  generatedRoutine: [],
  currentTask: null,
  saving: null,
  deleting: null,
  routines: [],
  status: 'idle'
};

export const getAllRoutines = createAsyncThunk("routine/getAllRoutines", async() => {
  const res = await dbInstance.getAllRoutines();
  return res
})

export const saveRoutines = createAsyncThunk("routine/saveRoutine", async(options : [string, string[], string[], ExerciseType[]], { dispatch, getState }) => {
  dispatch(routineSlice.actions.generateRoutine(options.slice(1, 4)));
  const state = getState() as RootState;

  const routineToSave: Routine = {
    id: '-1',
    title: options[0],
    RoutineItems: state.routine.generatedRoutine, //generatedRoutine
    createdAt: '99',
  };

  const res = await dbInstance.saveRoutine(routineToSave);
  return res
})

export const resumeRoutine = createAsyncThunk("routine/resumeRoutine", async(id : string) => {
  return await dbInstance.getRoutineItems(id);
})

export const deleteRoutine = createAsyncThunk("routine/saveRoutine", async(id : string) => {
  return await dbInstance.deleteRoutine(id);
}) 

//Reducer
const routineSlice = createSlice({
    name: "routine",
    initialState,
    reducers: {
      generateRoutine: (state, action) => {
        console.log(`Calling GenerateRoutine ${JSON.stringify(action.payload)} !`);
        state.generatedRoutine = []
        console.log(`Calling GenerateRoutine ${state.generatedRoutine} !`);
      
        const roots = action.payload[0];
        const types = action.payload[1];
        const exercises = action.payload[2];
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
        state.generatedRoutine = results;
      },
      getTask : (state, action) => {
        const index = Math.floor(Math.random() * state.generatedRoutine.length);
        state.currentTask = state.generatedRoutine.splice(index, 1)[0];
      }      
    },
    extraReducers: (builder) => {
        builder
        //getAllRoutines
          .addCase(getAllRoutines.pending, (state) => {
            state.status = 'pending';
          })
          .addCase(getAllRoutines.fulfilled, (state, action) => {
            state.status = 'fulfilled';
            state.routines = action.payload;
          })
          .addCase(getAllRoutines.rejected, (state, action) => {
            state.status = 'rejected';
            // state.errors = action.error.message;
          })
          //getAllRoutines
          .addCase(deleteRoutine.pending, (state) => {
            state.status = 'pending';
          })
          .addCase(deleteRoutine.fulfilled, (state, action) => {
            state.status = 'fulfilled';
            // state.routines = action.payload;
          })
          .addCase(deleteRoutine.rejected, (state, action) => {
            state.status = 'rejected';
            // state.errors = action.error.message;
          });
        },
      
})

export const { generateRoutine, getTask } = routineSlice.actions

// // Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.routine.value


export default routineSlice.reducer;