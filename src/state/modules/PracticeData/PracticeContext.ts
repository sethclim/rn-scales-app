import { createContext, Dispatch } from 'react';
import { IAction } from '../../types/index';
import initialState, { IState } from './store/initialState';

interface IContextProps {
  practiceDataState: IState;
  practiceDatadispatch: Dispatch<IAction>;
}

const Context = createContext<IContextProps>({
  practiceDatadispatch: () => {
   // Dispatch initial value
  },
  practiceDataState: initialState
  });

export default Context;
