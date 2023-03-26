import Context from './PracticeContext';
import reducer, { initialState } from './store';
import React, { FC, PropsWithChildren, useReducer, useState } from 'react';


const RoutineProvider: FC<PropsWithChildren> = (props) => {
    const [practiceDataState, practiceDatadispatch] = useReducer(reducer, initialState);

    return (
        <Context.Provider value={{ practiceDataState, practiceDatadispatch }}>
            { props.children }
        </Context.Provider>
    );
};

export default RoutineProvider;