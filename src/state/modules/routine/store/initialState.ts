export interface IState {
  error: string;
  loading: boolean;
  generatedRoutine: Array<string>;
}

const initialState: IState = {
  error: '',
  loading: false,
  generatedRoutine: [],
};

export function GetInitialState(): IState {
  return initialState;
}

export default initialState;
