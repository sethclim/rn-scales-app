import { Dispatch } from "react";
import PracticeData from "../../../../data/Models/PracticeData";
import { IAction } from "../../../types";

export interface IState {
  error: string;
  loading: boolean;
  currentSessionPracticeData: PracticeData;
  savingPracticeData : any;
  practiceDatadispatch: Dispatch<IAction>
}

const initialState: IState = {
  error: '',
  loading: false,
  currentSessionPracticeData: new PracticeData(new Date()),
  savingPracticeData : false,
  practiceDatadispatch: () => {
    // Dispatch initial value
   },
};

export function GetInitialState(): IState {
  return initialState;
}

export default initialState;
