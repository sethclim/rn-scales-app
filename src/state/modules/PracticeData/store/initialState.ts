export interface IState {
  error: string;
  loading: boolean;
  currentSessionPracticeData: Array<string>;
  savingPracticeData : boolean
}

const initialState: IState = {
  error: '',
  loading: false,
  currentSessionPracticeData: [],
  savingPracticeData : false
};

export function GetInitialState(): IState {
  return initialState;
}

export default initialState;
