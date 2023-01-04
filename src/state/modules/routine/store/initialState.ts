export interface IState {
  error: string;
  loading: boolean;
  generatedRoutine: Array<string>;
  currentTask : string;
}

const initialState: IState = {
  error: '',
  loading: false,
  generatedRoutine: [],
  currentTask: ""
};

export function GetInitialState(): IState {
  return initialState;
}

export default initialState;
