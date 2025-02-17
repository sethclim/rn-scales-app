import React, { useContext, useEffect, useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from "react-native";


//import { database } from "../../data/Database/database";

import {PracticeData, ExerciseType} from "../../data/Models/DataModels";

import Graph from './Graph/Graph';
import PracticeContext from '../../state/modules/PracticeData/PracticeContext';
import { getPracticeDataRequest } from '../../state/modules/PracticeData/store/actions';
import { useFocusEffect } from '@react-navigation/native';
import { Text } from 'react-native-svg';

const Padding = 10;

type PracticeStatsProps = {
  practice_data : PracticeData[],
}

const PracticeStats = () => {

    const { width, height } = useWindowDimensions();


    // const convertData = (practice_data : PracticeData[] | null) : PracticeData[] => {

    //   if( practice_data == null)
    //     return;

    //   console.log("practice_data " + practice_data.length)

    //   return practice_data.map((data, index) => {
    //     const item = new PracticeData(data.date);
    //     item.Counts = new Map<ExerciseType, number>([
    //       ["scale", data.Counts.get("scale")],
    //       ["octave", data.Counts.get("octave")],
    //       ["arpeggio", data.Arpeggio],
    //       ["solid-chord", data.SolidChord],
    //       ["broken-chord", data.BrokenChord],
    //     ])
    //     return item;
    //   })
    // }

    // const pd = useMemo(() => convertData(practiceDataState.practiceData), [practiceDataState.practice_data])


    return(
      <View style={styles.container}>
        <Graph width={width - Padding * 2 } height={height * 0.5 - 50}/>
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Padding,
    backgroundColor: "#5E81AC"
  },
});

// const data : Collection<PracticeDataModel> = database.collections.get('practice_data');

// const observabeRoutine = () => data?.query().observe();

// const enhanceWithPracticeData = withObservables<IPracticeDatas, any>([], () => ({
//   practice_data: observabeRoutine(),
// }));

export default PracticeStats;
