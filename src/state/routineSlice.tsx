import { log } from "../utils/logger";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { RootState } from "./store"
import { Routine, RoutineItem } from "../data/Models/DataModels";
import { buildRoutineItems } from "../data/routineOptions";
import dbInstance from "../data/Database/database";

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

export const saveRoutines = createAsyncThunk("routine/saveRoutine", async(options : [string, string[], string[], string[]], { dispatch, getState }) => {
  dispatch(routineSlice.actions.generateRoutine(options.slice(1, 4)));
  const state = getState() as RootState;

  const routineToSave: Routine = {
    id: '-1',
    title: options[0],
    RoutineItems: state.routine.generatedRoutine, //generatedRoutine
    createdAt: new Date().toISOString(),
  };

  const res = await dbInstance.saveRoutine(routineToSave);
  return res
})

export const resumeRoutine = createAsyncThunk("routine/resumeRoutine", async(id : string) => {
  return await dbInstance.getRoutineItems(id);
})

export const deleteRoutine = createAsyncThunk("routine/deleteRoutine", async(id : string, { dispatch, getState }) => {
  await dbInstance.deleteRoutine(id);
  dispatch(routineSlice.actions.removeDeletedRoutineImmediately(id));
}) 

export const deleteAllRoutines = createAsyncThunk("routine/deleteAllRoutines", async() => {
  await dbInstance.deleteAllRoutines();
})

//Reducer
const routineSlice = createSlice({
    name: "routine",
    initialState,
    reducers: {
      generateRoutine: (state, action) => {
        log.debug(`Calling GenerateRoutine ${JSON.stringify(action.payload)} !`);
        state.generatedRoutine = []
        log.debug(`Calling GenerateRoutine ${state.generatedRoutine} !`);
      
        const [roots, types, exercises] = action.payload;

        // Inputs-------
        // C  D
        // Major Minor
        // Scale Arp
        //--------------
        //RESULT->
        // Cmaj scale, Cmin scale, Dmaj scale, Dmin scale,
        const results = buildRoutineItems({ roots, types, exercises });
        log.debug('Calling GenerateRoutine' + results.length);
        state.generatedRoutine = results;
        // Don't carry a task over from the previous routine
        state.currentTask = null;
      },
      getTask : (state, action) => {
        const index = Math.floor(Math.random() * state.generatedRoutine.length);
        // splice returns [] once the routine is finished
        state.currentTask = state.generatedRoutine.splice(index, 1)[0] ?? null;
      },
      removeDeletedRoutineImmediately : (state, action) => {
        const temp = [...state.routines]
        let itemIndex = null
        temp.forEach((item, index) => {
          if(item.id == action.payload)
          {
            itemIndex = index;
          }
        })

        if (itemIndex === null)
          return

        temp.splice(itemIndex, 1)

        state.routines = temp
      },      
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
          .addCase(resumeRoutine.fulfilled, (state, action) => {
            state.generatedRoutine = (action.payload ?? []).map(item => ({
              displayItem: item.displayItem,
              exerciseType: item.exerciseType,
            }));
            state.currentTask = null;
          })
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
          })
          .addCase(deleteAllRoutines.fulfilled, (state) => {
            state.routines = [];
          })
          .addCase(deleteAllRoutines.rejected, (state) => {
            state.status = 'rejected';
          });
        },
      
})

export const { generateRoutine, getTask } = routineSlice.actions

// // Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.routine.value


export default routineSlice.reducer;