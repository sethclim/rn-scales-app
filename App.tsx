
import React from 'react';

import { NativeBaseProvider } from "native-base";
import CustomTheme from "./theme/index"
import RootNavigator from './src/navigation';

//Providers
import RoutineProvider from './src/state/modules/routine/routine';
import PracticeDataProvider from './src/state/modules/PracticeData/PracticeData';

const App = () => {
  return (
    <NativeBaseProvider theme={CustomTheme}>
      <RoutineProvider>
        <PracticeDataProvider>
          <RootNavigator />
        </PracticeDataProvider>
      </RoutineProvider>
    </NativeBaseProvider>
  );
};

export default App;
