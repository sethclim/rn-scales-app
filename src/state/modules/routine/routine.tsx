import { useAsyncMiddlewareInResponseToAction } from './middleware';
import { IAction } from '../../types';
import Context from './context';
import reducer, { initialState } from './store';
import React, { Dispatch, FC, PropsWithChildren, useCallback, useReducer, useState } from 'react';


const RoutineProvider: FC<PropsWithChildren> = (props) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const myDispatch = useCallback(
        async (action: IAction) => {
            if(!await useAsyncMiddlewareInResponseToAction(dispatch, action, state))
                dispatch(action)
        },
    [state]);

    return (
        <Context.Provider value={{ state, myDispatch }}>
            { props.children }
        </Context.Provider>
    );
};

export default RoutineProvider;