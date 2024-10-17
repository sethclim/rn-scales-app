import {RoutineItem} from '../../../../data/Models/DataModels';

export interface IState {
  error: string;
  loading: boolean;
  generatedRoutine: Array<RoutineItem>;
  currentTask: RoutineItem | null;
  saving: any;
  deleting: any;
}

const initialState: IState = {
  error: '',
  loading: false,
  generatedRoutine: [],
  currentTask: null,
  saving: null,
  deleting: null,
};

export function GetInitialState(): IState {
  return initialState;
}

export default initialState;
