import {RoutineModel, RoutineItem} from '../../data/Models/DataModels';

export interface SavedRoutinesProps {
  routines: RoutineModel[];
}

export interface RowProps {
  routine: RoutineModel;
  index: number;
  routineItems: RoutineItem[];
}
