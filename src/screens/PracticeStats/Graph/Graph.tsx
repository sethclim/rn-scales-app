import React, { useContext, useEffect, useState } from "react";
import { Canvas,  createPicture, Path, Picture, Skia, useFont, Text, SkPath   } from "@shopify/react-native-skia";
import { useMemo } from "react";
import {  SharedValue, useDerivedValue, useSharedValue } from "react-native-reanimated";
// import { getGraph } from "./GraphBuilder";
import { Selection } from "./Selection";
import { PracticeData } from "../../../data/Models/DataModels";
import { GraphGenerator, PathSet as Plot } from "./GraphBuilder";
import PracticeContext from "../../../state/modules/PracticeData/PracticeContext";
import { getPracticeDataRequest } from "../../../state/modules/PracticeData/store/actions";
import { useFocusEffect } from "@react-navigation/native";

type GraphProps = {
  width : number,
  height : number,
}

type RenderExercisePathSetProps = {
  plots : Plot[]
  index : SharedValue<number>
}

const RenderExercisePathSet = ({ plots, index } : RenderExercisePathSetProps) => {

  // Save current and next paths (initially the same)
  const paths = useSharedValue(plots);
  //const currentDotPath = useSharedValue(plot.dots);

  // Progress value drives the animation
  //const index = useSharedValue(0);

  const animatedPath = useDerivedValue(
    () =>{
      "worklet"
      return paths.value[index.value].line
    },
    [index, paths]
  );

  const animatedPath2 = useDerivedValue(
    () =>{
      "worklet"
      return paths.value[index.value].dots
    },
    [index, paths]
  );

  return(
    <>
      <Path path={animatedPath} color={"#ed174f"} strokeWidth={5} style="stroke" strokeJoin="round" strokeCap="round" />
      <Path path={animatedPath2} color={"#ed174f"} strokeWidth={5} style="fill"/>
    </>
  )
}

const Graph = ({width, height}: GraphProps)  => {

  const { practiceDatadispatch, practiceDataState } = useContext(PracticeContext);

    const fetchPracticeData = () => {
      practiceDatadispatch(getPracticeDataRequest())
    }
    
    useFocusEffect(
      React.useCallback(() => {
        fetchPracticeData();
      }, [])
    ); 
    
    const GG = new GraphGenerator();
    const [currentGraph, setCurrentGraph] = useState(() =>
      GG.getGraph(width, height, practiceDataState.practiceData)
    );
    //const graphs = useSharedValue(getGraph(width, height, practiceDataState.practiceData));

    const transition = useSharedValue(0);
    const next    = useSharedValue(0);
    const current = useSharedValue(0);

    // useEffect(() => {
    //   console.log("next value!! " + next.value)
    //     setCurrentGraph(buildGraph(practiceDataState.practiceData, width, height, "Year"));
    // }, [height, width, practiceDataState.practiceData, next.value]);
  
    // const g = useMemo(() => getGraph(width, height, practiceData), [width, height, practiceData])

    // const graph = useDerivedValue(() => {
    //   return  graphs.value[next.value]
    // })

    // useEffect(() => {
    //   console.log("Updating graph " + JSON.stringify(practiceDataState.practiceData))
    //   graphs.value = getGraph(width, height, practiceDataState.practiceData);

    //   console.log("Updating graph " + graphs.value.length)
    // },[width, height, practiceDataState.practiceData])

    // useEffect(() => {
    //   console.log("practiceData change " + JSON.stringify(practiceDataState.practiceData))
    // }, [practiceDataState.practiceData])

    const font = useFont(require("./SF-Mono-Medium.otf"), 12);

    // const yLabels = useDerivedValue(() =>{
    //   console.log("shared value changed " + next.value + " " + graphs.value.length)
    //   return  graphs.value[next.value].yLabels ? graphs.value[next.value].yLabels : []
    // },[next.value])

    // const xLabels = useDerivedValue(() => {
    //   return  graph.value.xLabels ? graph.value.xLabels : []
    // })


    useEffect(() => {
      console.log("BABABABABA  " + GG.getGraph(width, height, practiceDataState.practiceData))
      setCurrentGraph(GG.getGraph(width, height, practiceDataState.practiceData))
    }, [practiceDataState.practiceData])

    const path = Skia.Path.Make();
    path.moveTo(0,0)
    path.lineTo(width, height)

    const path2 = Skia.Path.Make();
    path2.moveTo(0,height)
    path2.lineTo(width, 0)

    const plot : Plot = {
      line: path,
      dots: path
    }

    const plot2 : Plot = {
      line: path2,
      dots: path2
    }

    const plots : Plot[] = [plot, plot2]

    // const ylabelsPicture = useDerivedValue(() => createPicture(
    //   (canvas) => {
    //     if(yLabels.value == null || yLabels.value.length <= 0 || font == null)
    //       return

    //     const paint = Skia.Paint();

    //     paint.setColor(Skia.Color("white"));
    //     yLabels.value.map((obj, index) => {
    //         canvas.drawText(obj.text, obj.pos.x ? obj.pos.x : 150 , obj.pos.y ? obj.pos.y : 150, paint, font)
    //     })
    //   }
    // ), [yLabels.value]);

    // const xLabelsPicture = useDerivedValue(() => createPicture(
    //   (canvas) => {
    //     if(xLabels.value == null || xLabels.value.length <= 0 || font == null)
    //       return

    //     const paint = Skia.Paint();

    //     paint.setColor(Skia.Color("white"));
    //     xLabels.value.map(info => {
    //       canvas.drawText(info.text, info.pos.x ? info.pos.x : 150 , info.pos.y ? info.pos.y : 150, paint, font)
    //       canvas.drawTextBlob
    //     })
    //   }
    // ), [xLabels.value]);
      
    return(
      <>
        <Canvas style={{ height: height, width: width, backgroundColor: "#00000055"}}>

          {/* <Path path={currentGraph.grid} color="#ffffff44" strokeWidth={2} style="stroke"/> */}

          <RenderExercisePathSet plots={plots} index={next} />

          {/* <Path path={graphs.value[next.value].exercises.octave.line} color={"#f4dc00"} strokeWidth={5} style="stroke" strokeJoin="round" strokeCap="round" />
          <Path path={graphs.value[next.value].exercises.octave.dots} color={"#f4dc00"} strokeWidth={5} style="fill"/>

          <Path path={graphs.value[next.value].exercises.arpeggio.line} color={"#327fa6"} strokeWidth={5} style="stroke" strokeJoin="round" strokeCap="round" />
          <Path path={graphs.value[next.value].exercises.octave.dots} color={"#327fa6"} strokeWidth={5} style="fill"/>

          <Path path={graphs.value[next.value].exercises.solidChord.line} color={"#e20177"} strokeWidth={5} style="stroke" strokeJoin="round" strokeCap="round" />
          <Path path={graphs.value[next.value].exercises.solidChord.dots} color={"#e20177"} strokeWidth={5} style="fill"/>

          <Path path={graphs.value[next.value].exercises.brokenChord.line} color={"#f8981d"} strokeWidth={5} style="stroke" strokeJoin="round" strokeCap="round" />
          <Path path={graphs.value[next.value].exercises.brokenChord.dots} color={"#f8981d"} strokeWidth={5} style="fill"/>  

          <Picture picture={ylabelsPicture}  />
          <Picture picture={xLabelsPicture}  /> */}

        </Canvas>
        {/* <Selection current={current} next={next} transition={transition} graphs={graphs.value} /> */}
      </>
    )
  } 

  export default Graph;
