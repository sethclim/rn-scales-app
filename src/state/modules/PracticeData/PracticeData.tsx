import { IAction } from '../../types';
import { useAsyncMiddlewareInResponseToAction } from './middleware';
import Context from './PracticeContext';
import reducer, { initialState } from './store';
import React, { Dispatch, FC, PropsWithChildren, useEffect, useReducer } from 'react';


const RoutineProvider: FC<PropsWithChildren> = (props) => {
    const [practiceDataState, practiceDatadispatch] = useReducer(reducer, initialState);

    const myDispatch: Dispatch<IAction> = (action : IAction) => {
        if(!useAsyncMiddlewareInResponseToAction(myDispatch, action, practiceDataState))
            practiceDatadispatch(action)
    }

    useEffect(() => {
        console.log("PD STATE" + JSON.stringify(practiceDataState, null, 2))
    }, [practiceDataState])

    return (
        <Context.Provider value={{ practiceDataState, practiceDatadispatch : myDispatch }}>
            { props.children }
        </Context.Provider>
    );
};

export default RoutineProvider;
