import { Dispatch } from "react";
import { IAction } from "../../types";
import dbInstance from "../../../data/Database/database";
import { PracticeTypes } from "./store/actions";

export const useAsyncMiddlewareInResponseToAction = (dispatch : Dispatch<IAction>, action: IAction) => {
    console.log("[Middleware] Practice Data")
    if ( action.type === PracticeTypes.SAVE_PRACTICE_DATA) {
        const fetchData = async () => {
            dispatch({ type: PracticeTypes.SAVING_PRACTICE_DATA,  payload: null});
            try {
                console.log("[Middleware] saving practice data")
                const res = await dbInstance.savePracticedata(action.payload);
                console.log("[Middleware] saved practice data ")
                dispatch({ type: PracticeTypes.SAVED_PRACTICE_DATA,  payload: res});
            } catch (error) {
                dispatch({ type: PracticeTypes.ERROR,  payload: error});
            }
        };
        fetchData();
        return true
    }
    else if ( action.type === PracticeTypes.GET_PRACTICE_DATA) {
        console.log("[Middleware] GET_PRACTICE_DATA")
        const fetchData = async () => {
            dispatch({ type: PracticeTypes.GETTING_PRACTICE_DATA,  payload: null});
            try {
                console.log("[Middleware] get practice data")
                const res = await dbInstance.getPracticeData();
                console.log("[Middleware] got practice data ")
                dispatch({ type: PracticeTypes.RECEIVED_PRACTICE_DATA,  payload: res});
            } catch (error) {
                dispatch({ type: PracticeTypes.ERROR,  payload: error});
            }
        };
        fetchData();
        return true
    }
    else
    {
        console.log("[Middleware] passing to reducer ")
        return false;
    }
};
