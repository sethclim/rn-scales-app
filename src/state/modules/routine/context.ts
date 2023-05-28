import { createContext, Dispatch } from 'react';
import { IAction } from '../../types';
import initialState, { IState } from './store/initialState';

interface IContextProps {
  state: IState;
  dispatch: Dispatch<IAction>;
}

const Context = createContext<IContextProps>({
  dispatch: () => {
   // Dispatch initial value
  },
   state: initialState
  });

export default Context;
