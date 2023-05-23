import { View } from "native-base"
import React, { useMemo, } from 'react';
import {Canvas,Path,} from "@shopify/react-native-skia";

import { StyleSheet, useWindowDimensions } from "react-native";
import PracticeData from "../../data/Models/PracticeData";
import { ExerciseType } from "../../data/Models/ExerciseType";
import { getGraph } from "./GraphBuilder";

const Padding = 10;

const pd1 = new PracticeData();
pd1.Counts = new Map<ExerciseType, number>();
pd1.Counts.set("scale", 10)
pd1.Counts.set("octave", 5)
pd1.Counts.set("arpeggio", 4)
pd1.Counts.set("solid-chord", 3)
pd1.Counts.set("broken-chord", 1)
pd1.Date = 0

const pd2 = new PracticeData();
pd2.Counts = new Map<ExerciseType, number>();
pd2.Counts.set("scale", 5)
pd2.Counts.set("octave", 20)
pd2.Counts.set("arpeggio", 4)
pd2.Counts.set("solid-chord", 19)
pd2.Counts.set("broken-chord", 3)
pd2.Date = 2

const pd3 = new PracticeData();
pd3.Counts = new Map<ExerciseType, number>();
pd3.Counts.set("scale", 50)
pd3.Counts.set("octave", 2)
pd3.Counts.set("arpeggio", 15)
pd3.Counts.set("solid-chord", 13)
pd3.Counts.set("broken-chord", 6)
pd3.Date = 5


const PracticeStats = () => {

    const { width, height } = useWindowDimensions();

    const pd : PracticeData[] = [
      pd1,
      pd2,
      pd3
    ]

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

  const graphs = useMemo(() => getGraph(width, height, practiceData), [width, height]);

  return(
    <Canvas style={{ height: height, width: width, backgroundColor: "#00000055"}}>
      {
        graphs[0].pathDescriptors.map(pathDescriptor => {
          return <Path path={pathDescriptor.path} color={pathDescriptor.color} strokeWidth={5} style="stroke" strokeJoin="round" strokeCap="round" />
        })
      }
      {
        graphs[0].pathDescriptors.map(pathDescriptor => {
          return <Path path={pathDescriptor.dots} color={pathDescriptor.color} strokeWidth={5} style="fill"/>
        })
      }
    </Canvas>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Padding,
  },
});

export default PracticeStats;