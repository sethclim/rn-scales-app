import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';

import BottomTabs from "./BottomTabs"

import PracticeRoutine from '../screens/PracticeRoutine';

import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const RootNavigator = () => {
    return (
      <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="Main" component={BottomTabs} options={{ headerShown: false }}/>
              <Stack.Screen name="Practice" component={PracticeRoutine}
                  options={{ 
                    headerStyle: {
                        backgroundColor: '#5E81AC',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    }
                }} />
                <Stack.Screen name="Settings" component={PracticeRoutine}
                  options={{ 
                    title:"Settings",
                    headerStyle: {
                        backgroundColor: '#5E81AC',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    }
                }} />
            </Stack.Navigator>
      </NavigationContainer>
    );
  };
  
  export default RootNavigator;
  