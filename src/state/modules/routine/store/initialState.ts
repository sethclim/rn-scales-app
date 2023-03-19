export interface IState {
  error: string;
  loading: boolean;
  generatedRoutine: Array<string>;
  currentTask : string;
  saving : any;
  deleting : any
}

const initialState: IState = {
  error: '',
  loading: false,
  generatedRoutine: [],
  currentTask: "",
  saving: null,
  deleting: null,
};

export function GetInitialState(): IState {
  return initialState;
}

export default initialState;
