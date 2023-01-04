import Context from './context';
import reducer, { initialState } from './store';
import React, { FC, useReducer, useState } from 'react';

const Routine: FC<{}> = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <Context.Provider value={{ state, dispatch }}>
            {/* <MyComponent /> */}
        </Context.Provider>
    );
};

export default Routine;