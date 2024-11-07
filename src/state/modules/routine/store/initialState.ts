import {Routine, RoutineItem} from '../../../../data/Models/DataModels';

export interface IState {
  error: string;
  loading: boolean;
  generatedRoutine: Array<RoutineItem>;
  currentTask: RoutineItem | null;
  saving: any;
  deleting: any;
  routines: Array<Routine>;
}

const initialState: IState = {
  error: '',
  loading: false,
  generatedRoutine: [],
  currentTask: null,
  saving: null,
  deleting: null,
  routines: [],
};

export function GetInitialState(): IState {
  return initialState;
}

export default initialState;
