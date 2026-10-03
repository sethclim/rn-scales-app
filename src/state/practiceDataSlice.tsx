import { ExerciseType, IAllPracticeData, IPracticeData } from "../data/Models/DataModels";
import { dateToString } from "../utils/date_utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import dbInstance from "../data/Database/database";
import { RootState } from "./store";


export interface IPracticeDataState {
  error: string;
  loading: boolean;
  currentSessionPracticeData: IPracticeData;
  savingPracticeData: any;
  practiceData: IAllPracticeData;
  status: 'idle' | 'pending' | 'fulfilled' | 'rejected'
}
 
const initialState: IPracticeDataState = {
  error: '',
  loading: false,
  currentSessionPracticeData: {date: "", Total: 0, scale: 0, octave: 0, arpeggio: 0, solidChord : 0, brokenChord: 0},
  savingPracticeData: false,
  practiceData: {Year: [], Month: [], Week: [], Day: []},
  status: 'idle' 
};

export const getAllPracticedata = createAsyncThunk("practice/getAllPracticeData", async() => {
    return await dbInstance.getAllPracticeData(new Date());
})

// The session starts with date "" until today's data loads; save it under today then
const withValidDate = (pd: IPracticeData): IPracticeData =>
  isNaN(new Date(pd.date).getTime()) ? { ...pd, date: new Date().toString() } : pd

export const savePracticeData = createAsyncThunk("practice/savePracticeData", async(empty : any, { dispatch, getState }) => {
    const state = getState() as RootState;
    
    return await dbInstance.savePracticedata(withValidDate(state.practice.currentSessionPracticeData));
})

export const getTodaysPracticedata = createAsyncThunk("practice/getTodaysPracticedata", async() => {
    return await dbInstance.getTodaysPracticeData(new Date());
})

export const deleteAllPracticeData = createAsyncThunk("practice/deleteAllPracticeData", async() => {
    await dbInstance.deleteAllPracticeData();
})

const emptySession = (date: string): IPracticeData =>
  ({date, Total: 0, scale: 0, octave: 0, arpeggio: 0, solidChord : 0, brokenChord: 0})

const isSameLocalDay = (date: string, now: Date) =>
  !isNaN(new Date(date).getTime()) && dateToString(new Date(date)) === dateToString(now)

//Reducer
const practiceDataSlice = createSlice({
    name: "practiceData",
    initialState,
    reducers: {
      startSession: (state, action: { payload: string }) => {
        state.currentSessionPracticeData = emptySession(action.payload)
      },
      recordPracticeData: (state, action) => {      
        if(state.currentSessionPracticeData == null)
          state.currentSessionPracticeData = {date: "", Total: 0, scale: 0, octave: 0, arpeggio: 0, solidChord : 0, brokenChord: 0}

        switch (action.payload[0]) {
          case 'scale':
            state.currentSessionPracticeData.scale += action.payload[1];
            break;
          case 'octave':
            state.currentSessionPracticeData.octave += action.payload[1];
            break;
          case 'arpeggio':
            state.currentSessionPracticeData.arpeggio += action.payload[1];
            break;
          case 'solidChord':
            state.currentSessionPracticeData.solidChord += action.payload[1];
            break;
          case 'brokenChord':
            state.currentSessionPracticeData.brokenChord += action.payload[1];
            break;
        }
      }
    },
    extraReducers: (builder) => {
        builder
        //getAllRoutines
          .addCase(getAllPracticedata.pending, (state) => {
            state.status = 'pending';
          })
          .addCase(getAllPracticedata.fulfilled, (state, action) => {
            state.status = 'fulfilled';
            state.practiceData = action.payload;
          })
          .addCase(getAllPracticedata.rejected, (state, action) => {
            state.status = 'rejected';
            // state.errors = action.error.message;
          })
          //getAllRoutines
          .addCase(savePracticeData.pending, (state) => {
            state.status = 'pending';
          })
          .addCase(savePracticeData.fulfilled, (state, action) => {
            state.status = 'fulfilled';
            // state.routines = action.payload;
          })
          .addCase(savePracticeData.rejected, (state, action) => {
            state.status = 'rejected';
            // state.errors = action.error.message;
          })
          //getAllRoutines
          .addCase(getTodaysPracticedata.pending, (state) => {
            state.status = 'pending';
          })
          .addCase(getTodaysPracticedata.fulfilled, (state, action) => {
            state.status = 'fulfilled';
            // null means the DB isn't open yet; keep the session we have
            if (action.payload != null)
              state.currentSessionPracticeData = action.payload;
          })
          .addCase(getTodaysPracticedata.rejected, (state, action) => {
            state.status = 'rejected';
            // state.errors = action.error.message;
          })
          .addCase(deleteAllPracticeData.fulfilled, (state) => {
            state.practiceData = initialState.practiceData;
            state.currentSessionPracticeData = emptySession(state.currentSessionPracticeData.date);
          })
          .addCase(deleteAllPracticeData.rejected, (state) => {
            state.status = 'rejected';
          });
        },
      
})

export const { recordPracticeData, startSession } = practiceDataSlice.actions

// Count one practised exercise against today. If the app was left open past
// midnight, yesterday's session is saved under yesterday before starting today's.
export const recordPractice = createAsyncThunk("practice/recordPractice", async(exercise : ExerciseType, { dispatch, getState }) => {
    const now = new Date();
    const session = (getState() as RootState).practice.currentSessionPracticeData;

    if (!isSameLocalDay(session.date, now)) {
        if (!isNaN(new Date(session.date).getTime()))
            await dispatch(savePracticeData(null));

        const today = await dispatch(getTodaysPracticedata());
        // DB not open yet: start today from zero rather than adding to an old day
        if (today.payload == null)
            dispatch(startSession(now.toString()));
    }

    dispatch(recordPracticeData([exercise, 1]));
})

// // Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.routine.value


export default practiceDataSlice.reducer;