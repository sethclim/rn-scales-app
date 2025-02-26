import { IAllPracticeData, IPracticeData } from "../data/Models/DataModels";
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

export const savePracticeData = createAsyncThunk("practice/savePracticeData", async(empty : any, { dispatch, getState }) => {
    const state = getState() as RootState;
    
    return await dbInstance.savePracticedata(state.practice.currentSessionPracticeData);
})

export const getTodaysPracticedata = createAsyncThunk("practice/getTodaysPracticedata", async() => {
    return await dbInstance.getTodaysPracticeData(new Date());
})

//Reducer
const practiceDataSlice = createSlice({
    name: "practiceData",
    initialState,
    reducers: {
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
            state.currentSessionPracticeData = action.payload!;
          })
          .addCase(getTodaysPracticedata.rejected, (state, action) => {
            state.status = 'rejected';
            // state.errors = action.error.message;
          });
        },
      
})

export const { recordPracticeData } = practiceDataSlice.actions

// // Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.routine.value


export default practiceDataSlice.reducer;