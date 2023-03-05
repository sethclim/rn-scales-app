import Routine from "../../data/routine.model";
import RoutineItem from "../../data/routine_item.model";

export interface SavedRoutinesProps {
    routines: Routine[],  
}
  
export interface RowProps {
    routine: Routine,
    index: number,
    routineItems : RoutineItem[]  
}