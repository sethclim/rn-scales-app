import React, { useContext, useEffect, useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from "react-native";


//import { database } from "../../data/Database/database";

import {PracticeData, ExerciseType} from "../../data/Models/DataModels";

import Graph from './Graph/Graph';
import PracticeContext from '../../state/modules/PracticeData/PracticeContext';
import { getPracticeDataRequest } from '../../state/modules/PracticeData/store/actions';
import { useFocusEffect } from '@react-navigation/native';
import { Text } from 'react-native-svg';
import { ThemeContext } from '../../context/ThemeContext';

const Padding = 10;

type PracticeStatsProps = {
  practice_data : PracticeData[],
}

const PracticeStats = () => {

    const { width, height } = useWindowDimensions();

    const { primary, background, mode } = useContext(ThemeContext);

    return(
      <View style={{flex: 1, padding: Padding, backgroundColor: mode == 'light' ? primary : background! }}>
        <Graph width={width - Padding * 2 } height={height * 0.5 - 50}/>
      </View>
    )
}

export default PracticeStats;
