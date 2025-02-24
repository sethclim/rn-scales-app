import React, { useContext } from 'react';
import {  useWindowDimensions, View } from "react-native";

import Graph from './Graph/Graph';
import { ThemeContext } from '../../context/ThemeContext';

const Padding = 10;


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
