import {Routine, RoutineItem} from '../../data/Models/DataModels';

export interface SavedRoutinesProps {
  routines: Routine[];
}

export interface RowProps {
  routine: Routine;
  index: number;
  routineItems: RoutineItem[];
}
