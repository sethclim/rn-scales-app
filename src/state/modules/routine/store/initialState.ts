export interface IState {
  error: string;
  loading: boolean;
  generatedRoutine: Array<string>;
  currentTask : string;
  saving : any;
}

const initialState: IState = {
  error: '',
  loading: false,
  generatedRoutine: [],
  currentTask: "",
  saving: null,
};

export function GetInitialState(): IState {
  return initialState;
}

export default initialState;
