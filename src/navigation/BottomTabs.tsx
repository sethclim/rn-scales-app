import * as React from 'react';
import {BottomTabNavigationProp, createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomTabNavigatorParamList} from './types';

//Screens
import Generate from '../screens/Generate';
import SavedRoutines from '../screens/SavedRoutines/SavedRoutines';
import PracticeStats  from '../screens/PracticeStats/PracticeStats'

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Button, IconButton } from 'native-base';
import { useNavigation } from '@react-navigation/native';

const BottomTab = createBottomTabNavigator<BottomTabNavigatorParamList>();


const BottomTabs = () => {
    
    const navigation = useNavigation<BottomTabNavigationProp<BottomTabNavigatorParamList>>();

    return(
        <BottomTab.Navigator >
            <BottomTab.Screen name="Generate" component={Generate}
                options={{ 
                    title: 'Generate',
                    headerStyle: {
                        backgroundColor: '#5E81AC',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerRight: () => (
                        <IconButton 
                            variant="unstyled"
                            icon={<MaterialIcons name="settings" color="#fff" size={20} />} 
                            borderRadius="full"
                            onPress={() => navigation.navigate('Settings')}
                            _pressed={{
                                bg: "#00000000",
                                _icon: {
                                color:"#ff0000"
                                }
                            }}
                        />
                      ),
                    //tabBarInactiveTintColor:"#00ff00",
                    tabBarActiveTintColor:"#5E81AC",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="create" color={color} size={size} />
                    ),
                    
                }}
            />
            <BottomTab.Screen name="SavedRoutines" component={SavedRoutines} 
                options={{
                    title: 'Saved Routines',
                    headerStyle: {
                        backgroundColor: '#5E81AC',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    //tabBarInactiveTintColor:"#00ff00",
                    tabBarActiveTintColor:"#5E81AC",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="folder" color={color} size={size} />
                    ),
              }}
            />

            <BottomTab.Screen name="PracticeStats" component={PracticeStats} 
                options={{
                    title: 'Practice Stats',
                    headerStyle: {
                        backgroundColor: '#5E81AC',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    //tabBarInactiveTintColor:"#00ff00",
                    tabBarActiveTintColor:"#5E81AC",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="folder" color={color} size={size} />
                    ),
              }}
            />
        </BottomTab.Navigator>
    )
}

export default BottomTabs;