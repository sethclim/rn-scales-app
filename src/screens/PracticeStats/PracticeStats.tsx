import React, { useMemo } from 'react';
import { StyleSheet, useWindowDimensions } from "react-native";

import { View } from "native-base"

import { Collection } from "@nozbe/watermelondb";
import PracticeDataModel from "../../data/Database/practice_data.model";
import { database } from "../../data/Database/database";
import { IPracticeDatas } from "../../data/Database/types";
import { withObservables } from '@nozbe/watermelondb/react'

import PracticeData from "../../data/Models/PracticeData";
import { ExerciseType } from "../../data/Models/ExerciseType";

import Graph from './Graph/Graph';

const Padding = 10;

type PracticeStatsProps = {
  practice_data : PracticeDataModel[],
}

const PracticeStats = ({practice_data }: PracticeStatsProps) => {

    const { width, height } = useWindowDimensions();

    const convertData = (practice_data : PracticeDataModel[]) : PracticeData[] => {

      console.log("practice_data " + practice_data.length)

      return practice_data.map((data, index) => {
        const item = new PracticeData(data.date);
        item.Counts = new Map<ExerciseType, number>([
          ["scale", data.Scale],
          ["octave", data.Octave],
          ["arpeggio", data.Arpeggio],
          ["solid-chord", data.SolidChord],
          ["broken-chord", data.BrokenChord],
        ])
        return item;
      })
    }

    const pd = useMemo(() => convertData(practice_data), [practice_data])


    return(
      <View style={styles.container} bg="nord.primary.1">

        <Graph width={width - Padding * 2 } height={height * 0.5 - 50} practiceData={pd}/>
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Padding,
  },
});

const data : Collection<PracticeDataModel> = database.collections.get('practice_data');

const observabeRoutine = () => data?.query().observe();

const enhanceWithPracticeData = withObservables<IPracticeDatas, any>([], () => ({
  practice_data: observabeRoutine(),
}));

export default enhanceWithPracticeData(PracticeStats);
