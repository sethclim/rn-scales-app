import { Dispatch } from "react";
import { IAction } from "../../types";
import dbInstance from "../../../data/Database/database";
import { PracticeTypes } from "./store/actions";
import { IState } from "./store/initialState";

export const useAsyncMiddlewareInResponseToAction = (dispatch : Dispatch<IAction>, action: IAction, currentState : IState) => {
    if ( action.type === PracticeTypes.SAVE_PRACTICE_DATA) {
        const fetchData = async () => {
            dispatch({ type: PracticeTypes.SAVING_PRACTICE_DATA,  payload: null});
            try {
                console.log("[Middleware] savePracticedata " + JSON.stringify(currentState.currentSessionPracticeData))
                const res = await dbInstance.savePracticedata(currentState.currentSessionPracticeData);
                dispatch({ type: PracticeTypes.SAVED_PRACTICE_DATA,  payload: res});
            } catch (error) {
                dispatch({ type: PracticeTypes.ERROR,  payload: error});
            }
        };
        fetchData();
        return true
    }
    else if (action.type === PracticeTypes.GET_ALL_PRACTICE_DATA) {
        //console.log("[Middleware] GET_ALL PRACTICE_DATA")
        const fetchData = async () => {
            dispatch({ type: PracticeTypes.GETTING_ALL_PRACTICE_DATA,  payload: null});
            try {
                const res = await dbInstance.getAllPracticeData(new Date());
                dispatch({ type: PracticeTypes.RECEIVED_ALL_PRACTICE_DATA,  payload: res});
            } catch (error) {
                dispatch({ type: PracticeTypes.ERROR,  payload: error});
            }
        };
        fetchData();
         //captured
        return true
    }
    else if (action.type === PracticeTypes.GET_TODAYS_PRACTICE_DATA) {
        //console.log("[Middleware] GET_TODAYS PRACTICE_DATA")
        const fetchData = async () => {
            dispatch({ type: PracticeTypes.GETTING_TODAYS_PRACTICE_DATA,  payload: null});
            try {
                const res = await dbInstance.getTodaysPracticeData(action.payload);

                //console.log("[Middleware] GET_TODAYS PRACTICE_DATA" + JSON.stringify(res))

                dispatch({ type: PracticeTypes.RECEIVED_TODAYS_PRACTICE_DATA,  payload: res});
            } catch (error) {
                dispatch({ type: PracticeTypes.ERROR,  payload: error});
            }
        };
        fetchData();
         //captured
        return true
    }
    else
    {
        //passing to reducer
        return false;
    }
};
