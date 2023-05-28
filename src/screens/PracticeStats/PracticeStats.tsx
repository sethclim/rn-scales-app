import React, { useMemo } from 'react';
import { StyleSheet, useWindowDimensions } from "react-native";

import { View } from "native-base"
import {Canvas,Group,Path,} from "@shopify/react-native-skia";

import { Collection } from "@nozbe/watermelondb";
import PracticeDataModel from "../../data/Database/practice_data.model";
import { database } from "../../data/Database/database";
import { IPracticeDatas } from "../../data/Database/types";
import withObservables from '@nozbe/with-observables';

import PracticeData from "../../data/Models/PracticeData";
import { ExerciseType } from "../../data/Models/ExerciseType";
import { getGraph } from "./GraphBuilder";
import { GraphState, Selection } from './Graph/Selection';
import { useSharedValue } from 'react-native-reanimated';

const Padding = 10;

type PracticeStatsProps = {
  practice_data : PracticeDataModel[],
}

const PracticeStats = ({practice_data }: PracticeStatsProps) => {

    const { width, height } = useWindowDimensions();

    const convertData = (practice_data : PracticeDataModel[]) : PracticeData[] => {
      return practice_data.map((data, index) => {
        const item = new PracticeData();
        item.Counts = new Map<ExerciseType, number>([
          ["scale", data.Scale],
          ["octave", data.Octave],
          ["arpeggio", data.Arpeggio],
          ["solid-chord", data.SolidChord],
          ["broken-chord", data.BrokenChord],
        ])
        item.Date = index
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

type GraphProps = {
  width : number,
  height : number,
  practiceData :  PracticeData[]
}


const Graph = ({width, height, practiceData}: GraphProps)  => {
  
  const graphs = useMemo(() => getGraph(width, height, practiceData), [width, height, practiceData]);
  
  const transition = useSharedValue(0);
  
  const state = useSharedValue({
    next: 0,
    current: 0,
  });

  return(
    <>
      <Canvas style={{ height: height, width: width, backgroundColor: "#00000055"}}>
        {
          graphs[0].grid.map(line => {
              return <Path path={line} color="#ffffff44" strokeWidth={2} style="stroke"/>
          })
        }
        {
          graphs[0].pathDescriptors?.map(pathDescriptor => {
            return (
              <Group>
                <Path path={pathDescriptor.path} color={pathDescriptor.color} strokeWidth={5} style="stroke" strokeJoin="round" strokeCap="round" />
                <Path path={pathDescriptor.dots} color={pathDescriptor.color} strokeWidth={5} style="fill"/>
              </Group>
            ) 
          })
        }
      </Canvas>
      <Selection state={state} transition={transition} graphs={graphs} />
    </>
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
