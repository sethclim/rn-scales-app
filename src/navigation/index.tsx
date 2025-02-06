import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';

import BottomTabs from "./BottomTabs"

import PracticeRoutine from '../screens/PracticeRoutine';
import Settings from '../screens/Settings';

import { createStackNavigator } from '@react-navigation/stack';
import { ThemeContext } from '../context/ThemeContext';

const Stack = createStackNavigator();

const RootNavigator = () => {

    const { primary, background, mode } = React.useContext(ThemeContext);

    const headerForeground = mode == 'light' ? background! : primary 
    const headerBackground = mode == 'light' ? primary : background! 

    return (
      <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="Main" component={BottomTabs} 
                options={{ 
                  headerShown: false,  
                  headerStyle: {
                    backgroundColor: primary!,
                  },
                }}
              />
              <Stack.Screen name="Practice" component={PracticeRoutine}
                  options={{ 
                    headerStyle: {
                        backgroundColor: headerBackground,
                    },
                    headerTintColor: headerForeground,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    }
                }} />
                <Stack.Screen name="Settings" component={Settings}
                  options={{ 
                    title:"Settings",
                    headerStyle: {
                        backgroundColor: headerBackground,
                    },
                    headerTintColor: headerForeground,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    }
                }} />
            </Stack.Navigator>
      </NavigationContainer>
    );
  };
  
  export default RootNavigator;
  