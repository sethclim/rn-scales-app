
import React from 'react';
import {useColorScheme} from 'react-native';


import { NativeBaseProvider } from "native-base";
import CustomTheme from "./theme/index"
import Generate from "./src/screens/Generate"



const App = () => {

  const isDarkMode = useColorScheme() === 'dark';

  return (
    <NativeBaseProvider theme={CustomTheme}>
      <Generate />
    </NativeBaseProvider>
  );
};


export default App;
