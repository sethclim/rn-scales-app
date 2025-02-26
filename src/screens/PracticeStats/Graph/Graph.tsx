import React, { useEffect, useState } from "react";
import { Canvas,  createPicture, Path, Picture, Skia, useFont, SkPath } from "@shopify/react-native-skia";
import {  SharedValue, useDerivedValue, useSharedValue } from "react-native-reanimated";
import { Selection } from "./Selection";
import { ExercisesPathSetMap, GraphData, GraphGenerator, Labels, PathSet } from "./GraphBuilder";

import { useFocusEffect } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { getAllPracticedata } from "../../../state/practiceDataSlice";
import { RootState } from "../../../state/store";

type GraphProps = {
  width : number,
  height : number,
}

type RenderExercisePathSetProps = {
  plots : PathSet[]
  index : SharedValue<number>
  color : string
}

const RenderExercisePathSet = ({ plots, index, color } : RenderExercisePathSetProps) => {

  const paths = useSharedValue(plots);

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
      <Path path={animatedPath} color={color} strokeWidth={5} style="stroke" strokeJoin="round" strokeCap="round" />
      <Path path={animatedPath2} color={color} strokeWidth={5} style="fill"/>
    </>
  )
}

type RenderExercisesProps = {
  exercises : ExercisesPathSetMap,
  index : SharedValue<number>
}

const RenderExercises = ({exercises, index} : RenderExercisesProps) => {

  const colours = ["red", "blue", "pink", "orange", "purple", "white", "yellow"]

  return(
    <>
    {
      [...exercises.entries()].map((entry, i) => {
        return <RenderExercisePathSet plots={entry[1]} index={index} key={i} color={colours[i]} />
      })
    }
    </>
  )
}

type RenderGridProps = {
  grids : SkPath[],
  index : SharedValue<number> 
}

const RenderGrid = ({ grids, index } : RenderGridProps) => {
   // Save current and next paths (initially the same)
   const paths = useSharedValue(grids);
 
   const animatedGrid = useDerivedValue(
     () =>{
       "worklet"
       return paths.value[index.value]
     },
     [index, paths]
   );
   return(
      <Path path={animatedGrid} color="#ffffff44" strokeWidth={2} style="stroke"/>
   )
}

type RenderLabelsProps = {
  labels : Labels[]
  index : SharedValue<number>
}

const RenderLabels = ({labels, index} : RenderLabelsProps) => {

  const font = useFont(require("./SF-Mono-Medium.otf"), 12);

  const yLabels = useDerivedValue(() =>{
    // console.log("shared value changed " + next.value + " " + graphs.value.length)
    return  labels[index.value].yLabels
  })

  const xLabels = useDerivedValue(() => {
    return labels[index.value].xLabels ? labels[index.value].xLabels : []
  })

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
  ));

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
  ));

  return(
    <>
      <Picture picture={ylabelsPicture}  />
      <Picture picture={xLabelsPicture}  />
    </>
  )
}

const initialGraph : GraphData = {
  exercises: new Map(),
  grids: [],
  titles: [],
  labels: []
}

const Graph = ({width, height}: GraphProps)  => {
    const dispatch = useAppDispatch()
    const practiceData = useAppSelector((state: RootState) => state.practice.practiceData)

    const fetchPracticeData = () => {
      dispatch(getAllPracticedata())
    }
    
    useFocusEffect(
      React.useCallback(() => {
        fetchPracticeData();
      }, [])
    ); 
    
    const [currentGraph, setCurrentGraph] = useState<GraphData>(initialGraph);
    
    const transition = useSharedValue(0);
    const next    = useSharedValue(0);
    const current = useSharedValue(0);
    
    useEffect(() => {
      const GG = new GraphGenerator();
      setCurrentGraph(GG.getGraph(width, height, practiceData))
    }, [practiceData])

    return(
      <>
        <Canvas style={{ height: height, width: width, backgroundColor: "#00000055"}}>
          {
            currentGraph.grids.length > 0 ?
              <RenderGrid grids={currentGraph.grids} index={next} /> : null
          }
          <RenderExercises index={next} exercises={currentGraph.exercises}  />
          {
            currentGraph.labels.length > 0 ?
              <RenderLabels labels={currentGraph.labels} index={next} />
              : null
          }
        </Canvas>
        <Selection current={current} next={next} transition={transition} graphData={currentGraph} />
      </>
    )
  } 

  export default Graph;
