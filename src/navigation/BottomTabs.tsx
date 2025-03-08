import * as React from 'react';
import {BottomTabNavigationProp, createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomTabNavigatorParamList} from './types';

//Screens
import Generate from '../screens/Generate';
import SavedRoutines from '../screens/SavedRoutines/SavedRoutines';
import PracticeStats  from '../screens/PracticeStats/PracticeStats'
import { HomePage } from "../screens/HomePage"

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Button } from "../native_blocks/";

import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../context/ThemeContext';
import { Box } from '../native_blocks/primatives/Box';

const BottomTab = createBottomTabNavigator<BottomTabNavigatorParamList>();

const BottomTabs = () => {
    
    const navigation = useNavigation<BottomTabNavigationProp<BottomTabNavigatorParamList>>();

    const { primary, background, mode } = React.useContext(ThemeContext);

    const headerForeground = mode == 'light' ? background! : primary 
    const headerBackground = mode == 'light' ? primary : background! 

    return(
        <BottomTab.Navigator 
            screenOptions={({ route }) => ({
                headerShown: true,
                tabBarStyle: {
                height: 70,
                paddingHorizontal: 5,
                paddingTop: 3,
                paddingBottom: 5,
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
                        backgroundColor: headerBackground!,
                    },
                    headerTintColor: headerForeground,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerRight: () => (
                        <Box align='flex-end' p={10}>
                            <Button onPress={() => navigation.navigate('Settings')} >
                                <MaterialIcons name="settings" color={headerForeground} size={25} />
                            </Button>
                        </Box>
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
                        backgroundColor: headerBackground,
                    },
                    headerTintColor:  headerForeground,
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

            <BottomTab.Screen name="HomePage" component={HomePage} 
                options={{
                    title: 'Home',
                    headerStyle: {
                        backgroundColor: headerBackground,
                    },
                    headerTintColor:  headerForeground,
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
                        backgroundColor: headerBackground,
                    },
                    headerTintColor:  headerForeground,
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
