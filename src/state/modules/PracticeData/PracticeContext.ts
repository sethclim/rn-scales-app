import { createContext, Dispatch } from 'react';
import { TAction } from './store/actions';
import initialState, { IState } from './store/initialState';

interface IContextProps {
  practiceDataState: IState;
  practiceDatadispatch: Dispatch<TAction>;
}

const Context = createContext<IContextProps>({
  practiceDatadispatch: () => {
   // Dispatch initial value
  },
  practiceDataState: initialState
  });

export default Context;
