import { TAction } from './actions';
import { IState } from './initialState';
import * as types from './types';

const reducer = (state: IState, action: TAction): IState => {
    const { type, payload } = action;
    switch (type) {
        case types.API_REQUEST:
            return { ...state, loading: true };
        case types.API_SUCCESS:
            return { ...state, loading: false, data: payload };
        case types.API_ERROR:
            return { ...state, loading: false, error: payload };
        default:
            return state;
    }
};

export default reducer;