import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomTabNavigatorParamList} from './types';

//Screens
import Generate from '../screens/Generate';
import PracticeRoutine from '../screens/PracticeRoutine';

const BottomTab = createBottomTabNavigator<BottomTabNavigatorParamList>();

const BottomTabs = () => {

    return(
        <BottomTab.Navigator>
            <BottomTab.Screen name="Generate" component={Generate} />
            <BottomTab.Screen name="Practice" component={PracticeRoutine} />
        </BottomTab.Navigator>
    )
}

export default BottomTabs;