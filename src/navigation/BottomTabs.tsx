import * as React from 'react';
import {BottomTabNavigationProp, createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomTabNavigatorParamList} from './types';

//Screens
import Generate from '../screens/Generate';
import SavedRoutines from '../screens/SavedRoutines/SavedRoutines';
import PracticeStats  from '../screens/PracticeStats/PracticeStats'

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Button } from "../native_blocks/";

import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../context/ThemeContext';

const BottomTab = createBottomTabNavigator<BottomTabNavigatorParamList>();

const BottomTabs = () => {
    
    const navigation = useNavigation<BottomTabNavigationProp<BottomTabNavigatorParamList>>();

    const { primary, background, mode } = React.useContext(ThemeContext);

    return(
        <BottomTab.Navigator 
            screenOptions={({ route }) => ({
                headerShown: true,
                tabBarStyle: {
                height: 80,
                paddingHorizontal: 5,
                paddingTop: 3,
                backgroundColor: background!,
                position: 'absolute',
                borderTopWidth: 0,
            },
            })}
        >
            <BottomTab.Screen name="Generate" component={Generate}
                options={{ 
                    title: 'Generate',
                    headerStyle: {
                        backgroundColor: primary,
                    },
                    headerTintColor: background!,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerRight: () => (
                        <Button onPress={() => navigation.navigate('Settings')} >
                            <MaterialIcons name="settings" color="#fff" size={20} />
                        </Button>
                      ),
                    //tabBarInactiveTintColor:"#00ff00",
                    tabBarActiveTintColor:primary,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="create" color={color} size={size} />
                    ),
                    
                }}
            />
            <BottomTab.Screen name="SavedRoutines" component={SavedRoutines} 
                options={{
                    title: 'Saved Routines',
                    headerStyle: {
                        backgroundColor: primary,
                    },
                    headerTintColor: background!,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    //tabBarInactiveTintColor:"#00ff00",
                    tabBarActiveTintColor:primary,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="folder" color={color} size={size} />
                    ),
              }}
            />

            <BottomTab.Screen name="PracticeStats" component={PracticeStats} 
                options={{
                    title: 'Practice Stats',
                    headerStyle: {
                        backgroundColor: primary,
                    },
                    headerTintColor: background!,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    //tabBarInactiveTintColor:"#00ff00",
                    tabBarActiveTintColor: primary,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="folder" color={color} size={size} />
                    ),
              }}
            />
        </BottomTab.Navigator>
    )
}

export default BottomTabs;
