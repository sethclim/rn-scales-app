import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';

import BottomTabs from "./BottomTabs"

import PracticeRoutine from '../screens/PracticeRoutine';
import Settings from '../screens/Settings';
import GraphPlayground from '../screens/PracticeStats/GraphPlayground';

import { createStackNavigator } from '@react-navigation/stack';
import { ThemeContext } from '../context/ThemeContext';
import { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator = () => {

    const { primary, background, scheme } = React.useContext(ThemeContext);

    const headerForeground = scheme == 'light' ? background! : primary 
    const headerBackground = scheme == 'light' ? primary : background! 

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
                {__DEV__ ?
                  <Stack.Screen name="GraphPlayground" component={GraphPlayground}
                    options={{ 
                      title: "Graph Playground",
                      headerStyle: {
                          backgroundColor: headerBackground,
                      },
                      headerTintColor: headerForeground,
                  }} /> : null
                }
            </Stack.Navigator>
      </NavigationContainer>
    );
  };
  
  export default RootNavigator;
  