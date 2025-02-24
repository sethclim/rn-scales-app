import { ExerciseType, IAllPracticeData, IPracticeData } from "../data/Models/DataModels";
import { GRAPH_ID } from "../screens/PracticeStats/Graph/GraphBuilder";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import dbInstance from "../data/Database/database";


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

export const savePracticeData = createAsyncThunk("practice/savePracticeData", async(practiceData : IPracticeData) => {
    return await dbInstance.savePracticedata(practiceData);
})

export const getTodaysPracticedata = createAsyncThunk("practice/getTodaysPracticedata", async() => {
    return await dbInstance.getTodaysPracticeData(new Date());
})

const updateValues = (currentSessionPracticeData : IPracticeData, ex: ExerciseType, amt: number) => {
  switch (ex) {
    case 'scale':
      currentSessionPracticeData.scale += amt;
      break;
    case 'octave':
      currentSessionPracticeData.octave += amt;
      break;
    case 'arpeggio':
      currentSessionPracticeData.arpeggio += amt;
      break;
    case 'solidChord':
      currentSessionPracticeData.solidChord += amt;
      break;
    case 'brokenChord':
      currentSessionPracticeData.brokenChord += amt;
      break;
  }
}


//Reducer
const practiceDataSlice = createSlice({
    name: "practiceData",
    initialState,
    reducers: {
      recordPracticeData: (state, action) => {      
        // if (state.currentSessionPracticeData === null) {
        //     state.currentSessionPracticeData = new PracticeData()
        //     state.currentSessionPracticeData.date = new Date().toString();
        // }
        

        updateValues(state.currentSessionPracticeData, action.payload[0], action.payload[1])
      
        // const cloneCurrentPracticeData = new PracticeData(date);
      
        // currentPracticeData?.getCounts().forEach((value, key) => {
        //   cloneCurrentPracticeData.updateValues(key, value);
        // });
      
        // cloneCurrentPracticeData.updateValues(stepData, 1);
      
        // const currentCount = currentPracticeData.Counts.get(stepData);
        // console.log('RecordPracticeData currentCount ' + currentCount);
      
        // cloneCurrentPracticeData.Counts.set(stepData, (currentCount ?? 0) + 1);
      
        // console.log(
        //   'RecordPracticeData cloneCurrentPracticeData ' +
        //     JSON.stringify(cloneCurrentPracticeData),
        // );
      
        // return cloneCurrentPracticeData;
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