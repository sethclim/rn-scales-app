import { Dispatch, useEffect } from "react";
import { IAction } from "../../types";
import { requestAllRoutines, routineSaved, RoutineTypes } from "./store/actions";
import dbInstance from "../../../data/Database/database";
import { IState } from "./store/initialState";
import { Routine } from "../../../data/Models/DataModels";
import { GenerateRoutine } from "./store/reducer";


export const useAsyncMiddlewareInResponseToAction = async(dispatch : Dispatch<IAction>, action: IAction, state : IState) => {
    console.log("[MIDDLEWARE] Action Type: " + action.type)
    if ( action.type === RoutineTypes.REQUEST_ALL_ROUTINES) {
        console.log("[MIDDLEWARE] REQUEST_ALL_ROUTINES")
        const fetchData = async () => {
            dispatch({ type: RoutineTypes.LOADING_ALL_ROUTINES,  payload: null});
            try {
                const res = await dbInstance.getAllRoutines();
                dispatch({ type: RoutineTypes.LOADED_ALL_ROUTINES,  payload: res});
            } catch (error) {
                dispatch({ type: RoutineTypes.ERROR,  payload: error});
            }
        };
        fetchData();
        return true
    }
    else if(action.type === RoutineTypes.SAVE_ROUTINE) {
        const inputOptions = action.payload.slice(0, 3);
        // dispatch({ type: RoutineTypes.GENERATE_REQUEST,  payload: inputOptions});

        const generatedRoutine = GenerateRoutine(inputOptions)

        console.log("state.generatedRoutine " + JSON.stringify(generatedRoutine))

        const routineToSave: Routine = {
            id: '-1',
            title: action.payload[3],
            RoutineItems: generatedRoutine,
            createdAt: '99',
          };
        
        const saveData = async () => {
            // dispatch({ type: RoutineTypes.LOADING_ALL_ROUTINES,  payload: null});
            try {
                const res = await dbInstance.saveRoutine(routineToSave);
                dispatch(routineSaved());
            } catch (error) {
                dispatch({ type: RoutineTypes.ERROR,  payload: error});
            }
        };
        saveData();
        return true
    }
    else if(action.type === RoutineTypes.RESUME_ROUTINE) {
        const fetchData = async () => {
            // dispatch({ type: RoutineTypes.LOADING_ALL_ROUTINES,  payload: null});
            try {
                const res = await dbInstance.getRoutineItems(action.payload);
                console.log("RESUME_ROUTINE res " + JSON.stringify(res))
                dispatch({ type: RoutineTypes.RESUMED_ROUTINE_ITEMS,  payload: res});
            } catch (error) {
                dispatch({ type: RoutineTypes.ERROR,  payload: error});
            }
        };
        await fetchData();
    }
    else if(action.type === RoutineTypes.DELETE_ROUTINE) {
        console.log("[MIDDLEWARE] DELETE_ROUTINE")
        const fetchData = async () => {
            // dispatch({ type: RoutineTypes.LOADING_ALL_ROUTINES,  payload: null});
            try {
                const res = await dbInstance.deleteRoutine(action.payload);
                // const msg = requestAllRoutines()
                console.log("deleteRoutine res " + JSON.stringify(res))

                // dispatch({ type: RoutineTypes.RESUMED_ROUTINE_ITEMS,  payload: res});
            } catch (error) {
                dispatch({ type: RoutineTypes.ERROR,  payload: error});
            }
        };
        await fetchData();
    }
    else
    {
        return false;
    }
};