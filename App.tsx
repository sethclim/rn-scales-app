
import React from 'react';
import {useColorScheme} from 'react-native';


import { NativeBaseProvider } from "native-base";
import CustomTheme from "./theme/index"
import Generate from "./src/screens/Generate"
import PracticeRoutine from './src/screens/PracticeRoutine';



const App = () => {
  return (
    <NativeBaseProvider theme={CustomTheme}>
      <PracticeRoutine />
    </NativeBaseProvider>
  );
};

export default App;
