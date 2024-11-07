import { Dispatch, useEffect } from "react";
import { IAction } from "../../types";
import { RoutineTypes } from "./store/actions";
import dbInstance from "../../../data/Database/database";


export const useAsyncMiddlewareInResponseToAction = (dispatch : Dispatch<IAction>, action: IAction) => {
    if ( action.type === RoutineTypes.REQUEST_ALL_ROUTINES) {
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
    else
    {
        return false;
    }
};