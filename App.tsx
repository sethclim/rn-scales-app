
import React from 'react';

import { NativeBaseProvider } from "native-base";
import CustomTheme from "./theme/index"
import RootNavigator from './src/navigation';
import RoutineProvider from './src/state/modules/routine/routine';

const App = () => {
  return (
    <NativeBaseProvider theme={CustomTheme}>
      <RoutineProvider>
        <RootNavigator />
      </RoutineProvider>
    </NativeBaseProvider>
  );
};

export default App;
