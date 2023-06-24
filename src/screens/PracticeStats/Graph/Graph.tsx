import React, { useEffect, useState } from "react";
import { Canvas,  Group,  Path,   } from "@shopify/react-native-skia";
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

    const grid = useDerivedValue(() =>{
      return graphs[current.value].grid;
    },[current.value])

    const scale_line = useDerivedValue(() =>{
      return graphs[current.value].exercises.scale.line;
    },[current.value])

    const scale_dots = useDerivedValue(() =>{
      return  graphs[current.value].exercises.scale.dots;
    },[current.value])

    const octaves_line = useDerivedValue(() =>{
      return graphs[current.value].exercises.octave.line;
    },[current.value])

    const octaves_dots = useDerivedValue(() =>{
      return  graphs[current.value].exercises.octave.dots
    },[current.value])

    const arp_line = useDerivedValue(() =>{
      return graphs[current.value].exercises.arpeggio.line;
    },[current.value])

    const arp_dots = useDerivedValue(() =>{
      return  graphs[current.value].exercises.arpeggio.dots
    },[current.value])

    const solid_ch_line = useDerivedValue(() =>{
      return graphs[current.value].exercises["solid-chord"].line;
    },[current.value])

    const solid_ch_dots = useDerivedValue(() =>{
      return  graphs[current.value].exercises["solid-chord"].dots
    },[current.value])

    const broken_ch_line = useDerivedValue(() =>{
      return graphs[current.value].exercises["broken-chord"].line
    },[current.value])

    const broken_ch_dots = useDerivedValue(() =>{
      return  graphs[current.value].exercises["broken-chord"].dots
    },[current.value])

    return(
      <>
        <Canvas style={{ height: height, width: width, backgroundColor: "#00000055"}}>
          <Path path={grid} color="#ffffff44" strokeWidth={2} style="stroke"/>
          <Group>
            <Path path={scale_line} color={"#ed174f"} strokeWidth={5} style="stroke" strokeJoin="round" strokeCap="round" />
            <Path path={scale_dots} color={"#ed174f"} strokeWidth={5} style="fill"/>
          </Group>

          <Group>
            <Path path={octaves_line} color={"#f4dc00"} strokeWidth={5} style="stroke" strokeJoin="round" strokeCap="round" />
            <Path path={octaves_dots} color={"#f4dc00"} strokeWidth={5} style="fill"/>
          </Group>

          <Group>
            <Path path={arp_line} color={"#327fa6"} strokeWidth={5} style="stroke" strokeJoin="round" strokeCap="round" />
            <Path path={arp_dots} color={"#327fa6"} strokeWidth={5} style="fill"/>
          </Group>

          <Group>
            <Path path={solid_ch_line} color={"#e20177"} strokeWidth={5} style="stroke" strokeJoin="round" strokeCap="round" />
            <Path path={solid_ch_dots} color={"#e20177"} strokeWidth={5} style="fill"/>
          </Group>

          <Group>
            <Path path={broken_ch_line} color={"#f8981d"} strokeWidth={5} style="stroke" strokeJoin="round" strokeCap="round" />
            <Path path={broken_ch_dots} color={"#f8981d"} strokeWidth={5} style="fill"/>
          </Group>
        </Canvas>
        <Selection current={current} next={next} transition={transition} graphs={graphs} />
      </>
    )
  } 

  export default Graph;
