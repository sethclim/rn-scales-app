
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React from 'react';

import { NativeBaseProvider } from "native-base";
import CustomTheme from "./theme/index"
import RootNavigator from './src/navigation';

//Providers
import RoutineProvider from './src/state/modules/routine/routine';
import PracticeDataProvider from './src/state/modules/PracticeData/PracticeData';
import dbInstance from './src/data/Database/database';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import { ThemeProvider } from './src/context';


const App = () => {

  useDrizzleStudio(dbInstance.db);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NativeBaseProvider theme={CustomTheme}>
        <ThemeProvider>
          <RoutineProvider>
            <PracticeDataProvider>
              <RootNavigator />
            </PracticeDataProvider>
          </RoutineProvider>
        </ThemeProvider>
      </NativeBaseProvider>
    </GestureHandlerRootView>
  );
};

export default App;
