
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React from 'react';

// import { NativeBaseProvider } from "native-base";
import RootNavigator from './src/navigation';

//Providers
// import RoutineProvider from './src/state/modules/routine/routine';
import PracticeDataProvider from './src/state/modules/PracticeData/PracticeData';
import dbInstance from './src/data/Database/database';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import { ThemeProvider } from './src/context';

import { Provider } from "react-redux";
import store from "./src/state/store"

const App = () => {

  useDrizzleStudio(dbInstance.db);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
       <Provider store={store}>
          <ThemeProvider>
            {/* <RoutineProvider> */}
              {/* <PracticeDataProvider> */}
                <RootNavigator />
              {/* </PracticeDataProvider> */}
            {/* </RoutineProvider> */}
          </ThemeProvider>
        </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
