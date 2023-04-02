import PracticeData from "../../../../data/Models/PracticeData";

export interface IState {
  error: string;
  loading: boolean;
  currentSessionPracticeData: PracticeData;
  savingPracticeData : any
}

const initialState: IState = {
  error: '',
  loading: false,
  currentSessionPracticeData: new PracticeData,
  savingPracticeData : false
};

export function GetInitialState(): IState {
  return initialState;
}

export default initialState;
