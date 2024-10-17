import React, { useMemo } from 'react';
import { StyleSheet, useWindowDimensions } from "react-native";

import { View } from "native-base"

//import { database } from "../../data/Database/database";

import {PracticeData, ExerciseType} from "../../data/Models/DataModels";

import Graph from './Graph/Graph';

const Padding = 10;

type PracticeStatsProps = {
  practice_data : PracticeData[],
}

const PracticeStats = () => {

    const { width, height } = useWindowDimensions();

    const pd = null;

    // const convertData = (practice_data : PracticeData[]) : PracticeData[] => {

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

    // const pd = useMemo(() => convertData(practice_data), [practice_data])


    return(
      <View style={styles.container} bg="nord.primary.1">

        {/* <Graph width={width - Padding * 2 } height={height * 0.5 - 50} practiceData={pd}/> */}
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Padding,
  },
});

// const data : Collection<PracticeDataModel> = database.collections.get('practice_data');

// const observabeRoutine = () => data?.query().observe();

// const enhanceWithPracticeData = withObservables<IPracticeDatas, any>([], () => ({
//   practice_data: observabeRoutine(),
// }));

export default PracticeStats;
