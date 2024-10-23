import { Dispatch, useEffect } from "react";
import { IAction } from "../state/types";
import { RoutineTypes } from "../state/modules/routine/store/actions";
import dbInstance from "../data/Database/database";


export const useAsyncMiddlewareInResponseToAction = (dispatch : Dispatch<IAction>, action: IAction) => {
    console.log("useAsyncMiddlewareInResponseToAction")
        if ( action.type === RoutineTypes.REQUEST_ALL_ROUTINES) {
            const fetchData = async () => {
                dispatch({ type: RoutineTypes.LOADING_ALL_ROUTINES,  payload: null});
                try {
                    console.log("[Middleware] getting all routines")
                    const res = await dbInstance.getAllRoutines();
                    console.log("[Middleware] getting all routines " + res.length)
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