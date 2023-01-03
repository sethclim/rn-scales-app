
import React from 'react';
import {useColorScheme} from 'react-native';


import { NativeBaseProvider } from "native-base";
import CustomTheme from "./theme/index"
import Generate from "./src/screens/Generate"
import PracticeRoutine from './src/screens/PracticeRoutine';
import RootNavigator from './src/navigation';



const App = () => {
  return (
    <NativeBaseProvider theme={CustomTheme}>
      <RootNavigator />
    </NativeBaseProvider>
  );
};

export default App;
