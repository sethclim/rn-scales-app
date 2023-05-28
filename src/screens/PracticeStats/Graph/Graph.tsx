import React from "react";
import { Canvas, Group, Path } from "@shopify/react-native-skia";
import { useMemo } from "react";
import { useSharedValue } from "react-native-reanimated";
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

  export default Graph;