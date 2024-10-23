import { IAction } from '../../types';
import { useAsyncMiddlewareInResponseToAction } from './middleware';
import Context from './PracticeContext';
import reducer, { initialState } from './store';
import React, { Dispatch, FC, PropsWithChildren, useReducer } from 'react';


const RoutineProvider: FC<PropsWithChildren> = (props) => {
    const [practiceDataState, practiceDatadispatch] = useReducer(reducer, initialState);

    const myDispatch: Dispatch<IAction> = (action : IAction) => {
        console.log("My Dispatch")
        useAsyncMiddlewareInResponseToAction(practiceDatadispatch, action)
        if(!useAsyncMiddlewareInResponseToAction(practiceDatadispatch, action))
            practiceDatadispatch(action)
    }

    return (
        <Context.Provider value={{ practiceDataState, practiceDatadispatch : myDispatch }}>
            { props.children }
        </Context.Provider>
    );
};

export default RoutineProvider;
