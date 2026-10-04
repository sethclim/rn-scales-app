import React, { useContext } from 'react';
import {  useWindowDimensions, View } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import Graph from './Graph/Graph';
import { ThemeContext } from '../../context/ThemeContext';

const Padding = 10;


const PracticeStats = () => {

    const { width } = useWindowDimensions();
    // The tab bar floats over the screen, so stop the graph above it
    const tabBarHeight = useBottomTabBarHeight();

    // Page matches the graph panel so the graph runs edge to edge
    const { chartBackground } = useContext(ThemeContext);

    return(
      <View style={{flex: 1, padding: Padding, paddingBottom: tabBarHeight, backgroundColor: chartBackground }}>
        <Graph width={width - Padding * 2 } />
      </View>
    )
}

export default PracticeStats;
