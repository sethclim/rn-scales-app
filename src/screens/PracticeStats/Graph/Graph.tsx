import React from "react";
import { Canvas,  Drawing, Path, Skia, useFont   } from "@shopify/react-native-skia";
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
      return graphs[next.value].grid;
    },[next.value])

    const scale_line = useDerivedValue(() =>{
      return graphs[next.value].exercises.scale.line;
    },[next.value])

    const scale_dots = useDerivedValue(() =>{
      return  graphs[next.value].exercises.scale.dots;
    },[next.value])

    const octaves_line = useDerivedValue(() =>{
      return graphs[next.value].exercises.octave.line;
    },[next.value])

    const octaves_dots = useDerivedValue(() =>{
      return  graphs[next.value].exercises.octave.dots
    },[next.value])

    const arp_line = useDerivedValue(() =>{
      return graphs[next.value].exercises.arpeggio.line;
    },[next.value])

    const arp_dots = useDerivedValue(() =>{
      return  graphs[next.value].exercises.arpeggio.dots
    },[next.value])

    const solid_ch_line = useDerivedValue(() =>{
      return graphs[next.value].exercises["solid-chord"].line;
    },[next.value])

    const solid_ch_dots = useDerivedValue(() =>{
      return  graphs[next.value].exercises["solid-chord"].dots
    },[next.value])

    const broken_ch_line = useDerivedValue(() =>{
      return graphs[next.value].exercises["broken-chord"].line
    },[next.value])

    const broken_ch_dots = useDerivedValue(() =>{
      return  graphs[next.value].exercises["broken-chord"].dots
    },[next.value])

    const font = useFont(require("./SF-Mono-Medium.otf"), 12);

    const yLabels = useDerivedValue(() =>{
      return  graphs[next.value].yLabels ? graphs[next.value].yLabels : []
    },[next.value])

    const xLabels = useDerivedValue(() =>{
      return  graphs[next.value].xLabels ? graphs[next.value].xLabels : []
    },[next.value])

    const path = Skia.Path.Make();
    path.moveTo(0,0)
    path.lineTo(10,10)
      
    return(
      graphs.length > 0 ?
      <>
        <Canvas style={{ height: height, width: width, backgroundColor: "#00000055"}}>
          <Path path={grid} color="#ffffff44" strokeWidth={2} style="stroke"/>

          <Path path={scale_line} color={"#ed174f"} strokeWidth={5} style="stroke" strokeJoin="round" strokeCap="round" />
          <Path path={scale_dots} color={"#ed174f"} strokeWidth={5} style="fill"/>

          <Path path={octaves_line} color={"#f4dc00"} strokeWidth={5} style="stroke" strokeJoin="round" strokeCap="round" />
          <Path path={octaves_dots} color={"#f4dc00"} strokeWidth={5} style="fill"/>

          <Path path={arp_line} color={"#327fa6"} strokeWidth={5} style="stroke" strokeJoin="round" strokeCap="round" />
          <Path path={arp_dots} color={"#327fa6"} strokeWidth={5} style="fill"/>

          <Path path={solid_ch_line} color={"#e20177"} strokeWidth={5} style="stroke" strokeJoin="round" strokeCap="round" />
          <Path path={solid_ch_dots} color={"#e20177"} strokeWidth={5} style="fill"/>

          <Path path={broken_ch_line} color={"#f8981d"} strokeWidth={5} style="stroke" strokeJoin="round" strokeCap="round" />
          <Path path={broken_ch_dots} color={"#f8981d"} strokeWidth={5} style="fill"/>

          <Drawing
            drawing={({ canvas, paint }) => {
              paint.setColor(Skia.Color("white"));
              yLabels.value.map((obj, index) => {
                canvas.drawText(obj.text, obj.pos.x ? obj.pos.x : 150 , obj.pos.y ? obj.pos.y : 150, paint, font! )
              })
            }}
          />

          <Drawing
            drawing={({ canvas, paint }) => {
              paint.setColor(Skia.Color("white"));
              xLabels.value.map((obj, index) => {
                canvas.drawText(obj.text, obj.pos.x ? obj.pos.x : 150 , obj.pos.y ? obj.pos.y : 150, paint, font! )
              })
            }}
          />
        </Canvas>
        <Selection current={current} next={next} transition={transition} graphs={graphs} />
      </>
      : null
    )
  } 

  export default Graph;
