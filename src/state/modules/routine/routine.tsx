import Context from './context';
import reducer, { initialState } from './store';
import React, { FC, PropsWithChildren, useReducer, useState } from 'react';


const RoutineProvider: FC<PropsWithChildren> = (props) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <Context.Provider value={{ state, dispatch }}>
            { props.children }
        </Context.Provider>
    );
};

export default RoutineProvider;