import { useAsyncMiddlewareInResponseToAction } from './middleware';
import { IAction } from '../../types';
import Context from './context';
import reducer, { initialState } from './store';
import React, { Dispatch, FC, PropsWithChildren, useReducer, useState } from 'react';


const RoutineProvider: FC<PropsWithChildren> = (props) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const myDispatch: Dispatch<IAction> = (action : IAction) => {
        useAsyncMiddlewareInResponseToAction(dispatch, action)
        if(!useAsyncMiddlewareInResponseToAction(dispatch, action))
            dispatch(action)
    }

    return (
        <Context.Provider value={{ state, myDispatch }}>
            { props.children }
        </Context.Provider>
    );
};

export default RoutineProvider;