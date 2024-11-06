import React, { useEffect } from "react";
import { Canvas,  createPicture, Path, Picture, Skia, useFont   } from "@shopify/react-native-skia";
import { useMemo } from "react";
import {  useDerivedValue, useSharedValue } from "react-native-reanimated";
// import { getGraph } from "./GraphBuilder";
import { Selection } from "./Selection";
import { PracticeData } from "../../../data/Models/DataModels";
import { getGraph, GRAPH_ID } from "./GraphBuilder";
import { Text } from "native-base";

type GraphProps = {
  width : number,
  height : number,
  practiceData :  Map<GRAPH_ID, PracticeData[]>
}


const Graph = ({width, height, practiceData}: GraphProps)  => {
    // const g = useMemo(() => getGraph(width, height, practiceData), [width, height, practiceData])
    const graphs = useSharedValue(getGraph(width, height, practiceData));

    useEffect(() => {
      console.log("Updating graph")
      graphs.value = getGraph(width, height, practiceData);

      console.log("Updating graph " + graphs.value.length)
    },[width, height, practiceData])

    const transition = useSharedValue(0);
    
    const next    = useSharedValue(0);
    const current = useSharedValue(0);


    const font = useFont(require("./SF-Mono-Medium.otf"), 12);

    const yLabels = useDerivedValue(() =>{
      console.log("shared value changed " + next.value + " " + graphs.value.length)
      return  graphs.value[next.value].yLabels ? graphs.value[next.value].yLabels : []
    },[next.value])

    const xLabels = useDerivedValue(() => {
      return  graphs.value[next.value].xLabels ? graphs.value[next.value].xLabels : []
    },[next.value])

    const path = Skia.Path.Make();
    path.moveTo(0,0)
    path.lineTo(10,10)

    const ylabelsPicture = useDerivedValue(() => createPicture(
      (canvas) => {
        if(yLabels.value == null || yLabels.value.length <= 0 || font == null)
          return

        const paint = Skia.Paint();

        paint.setColor(Skia.Color("white"));
        yLabels.value.map((obj, index) => {
            canvas.drawText(obj.text, obj.pos.x ? obj.pos.x : 150 , obj.pos.y ? obj.pos.y : 150, paint, font)
        })
      }
    ), [yLabels.value]);

    const xLabelsPicture = useDerivedValue(() => createPicture(
      (canvas) => {
        if(xLabels.value == null || xLabels.value.length <= 0 || font == null)
          return

        const paint = Skia.Paint();

        paint.setColor(Skia.Color("white"));
        xLabels.value.map(info => {
          canvas.drawText(info.text, info.pos.x ? info.pos.x : 150 , info.pos.y ? info.pos.y : 150, paint, font)
          canvas.drawTextBlob
        })
      }
    ), [xLabels.value]);
      
    return(
      graphs.value.length > 0 ?
      <>
        <Canvas style={{ height: height, width: width, backgroundColor: "#00000055"}}>
          <Path path={graphs.value[next.value].grid} color="#ffffff44" strokeWidth={2} style="stroke"/>

          <Path path={graphs.value[next.value].exercises.scale.line} color={"#ed174f"} strokeWidth={5} style="stroke" strokeJoin="round" strokeCap="round" />
          <Path path={graphs.value[next.value].exercises.scale.dots} color={"#ed174f"} strokeWidth={5} style="fill"/>

          <Path path={graphs.value[next.value].exercises.octave.line} color={"#f4dc00"} strokeWidth={5} style="stroke" strokeJoin="round" strokeCap="round" />
          <Path path={graphs.value[next.value].exercises.octave.dots} color={"#f4dc00"} strokeWidth={5} style="fill"/>

          <Path path={graphs.value[next.value].exercises.arpeggio.line} color={"#327fa6"} strokeWidth={5} style="stroke" strokeJoin="round" strokeCap="round" />
          <Path path={graphs.value[next.value].exercises.octave.dots} color={"#327fa6"} strokeWidth={5} style="fill"/>

          <Path path={graphs.value[next.value].exercises.solidChord.line} color={"#e20177"} strokeWidth={5} style="stroke" strokeJoin="round" strokeCap="round" />
          <Path path={graphs.value[next.value].exercises.solidChord.dots} color={"#e20177"} strokeWidth={5} style="fill"/>

          <Path path={graphs.value[next.value].exercises.brokenChord.line} color={"#f8981d"} strokeWidth={5} style="stroke" strokeJoin="round" strokeCap="round" />
          <Path path={graphs.value[next.value].exercises.brokenChord.dots} color={"#f8981d"} strokeWidth={5} style="fill"/>  

          <Picture picture={ylabelsPicture}  />
          <Picture picture={xLabelsPicture}  />

        </Canvas>
        <Selection current={current} next={next} transition={transition} graphs={graphs.value} />
      </>
      : <Text>No Graphs</Text>
    )
  } 

  export default Graph;
