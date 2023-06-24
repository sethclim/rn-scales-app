import React, { useEffect, useState } from "react";
import { Canvas,  Path,   } from "@shopify/react-native-skia";
import { useMemo } from "react";
import {  useDerivedValue, useSharedValue } from "react-native-reanimated";
import { getGraph } from "./GraphBuilder";
import { Selection } from "./Selection";
import PracticeData from "../../../data/Models/PracticeData";

type GraphProps = {
  width : number,
  height : number,
  practiceData :  PracticeData[]
}

const Graph = ({width, height, practiceData}: GraphProps)  => {
  
    const graphs = useMemo(() => getGraph(width, height, practiceData), [width, height, practiceData]);
    
    const transition = useSharedValue(0);
    
    const next    = useSharedValue(0);
    const current = useSharedValue(0);

    const [gIndex, setGIndex] = useState(0);

    const grid = useDerivedValue(() =>{
      console.log("Graph " + current.value + " label " + graphs[current.value].label)

      return graphs[current.value].grid;
    },[current.value])

    // useEffect(() =>{w
    //   console.log("Graph " + graphs[state.value.current].label)
    //   console.log("Current " + state.value.current + " next " + state.value.next)
    // },[graph.current])

    return(
      <>
        <Canvas style={{ height: height, width: width, backgroundColor: "#00000055"}}>
          <Path path={grid} color="#ffffff44" strokeWidth={2} style="stroke"/>
          {/* {
            graphs[gIndex].grid.map(line => {
                return <Path path={line} color="#ffffff44" strokeWidth={2} style="stroke"/>
            })
          }
          {
            graphs[gIndex].pathDescriptors?.map(pathDescriptor => {
              return (
                <Group>
                  <Path path={pathDescriptor.path} color={pathDescriptor.color} strokeWidth={5} style="stroke" strokeJoin="round" strokeCap="round" />
                  <Path path={pathDescriptor.dots} color={pathDescriptor.color} strokeWidth={5} style="fill"/>
                </Group>
              ) 
            })
          } */}
        </Canvas>
        <Selection current={current} next={next} transition={transition} graphs={graphs} />
      </>
    )
  } 

  export default Graph;
