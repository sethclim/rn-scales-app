import React, { useContext, useMemo } from "react";
import { Canvas, createPicture, Path, Picture, Skia, useFont, SkPath } from "@shopify/react-native-skia";
import { DerivedValue, SharedValue, useDerivedValue, useSharedValue } from "react-native-reanimated";
import { Selection } from "./Selection";
import { ExerciseSet, GraphData, GraphGenerator, Labels, layoutXLabels, PathSet, X_LABEL_SLANT } from "./GraphBuilder";

import { useFocusEffect } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { getAllPracticedata } from "../../../state/practiceDataSlice";
import { RootState } from "../../../state/store";
import { IAllPracticeData } from "../../../data/Models/DataModels";
import { ThemeContext } from "../../../context/ThemeContext";

type GraphProps = {
  width: number,
  height: number,
}

type RenderExercisePathSetProps = {
  plots: DerivedValue<PathSet>
  index: SharedValue<number>
  color: string
}

const RenderExercisePathSet = ({ plots, index, color }: RenderExercisePathSetProps) => {

  const animatedPath = useDerivedValue(
    () => {
      "worklet"
      return plots.value.line
    },
    [index, plots]
  );
  
  const animatedPath2 = useDerivedValue(
    () => {
      "worklet"
      return plots.value.dots
    },
    [index, plots]
  );

  return (
    <>
      <Path path={animatedPath} color={color} strokeWidth={2} style="stroke" strokeJoin="round" strokeCap="round" />
      <Path path={animatedPath2} color={color} style="fill" />
    </>
  )
}

type RenderExercisesProps = {
  exercises: ExerciseSet[],
  index: SharedValue<number>
  colours: string[]
}

const RenderExercises = ({ exercises, index, colours }: RenderExercisesProps) => {

  const scale = useDerivedValue(
    () => {
      "worklet"
      console.log(`index ${index.value} ${exercises.length}`)
      return exercises[index.value].scale
    },
    [index, exercises]
  );
  
  const octave = useDerivedValue(
    () => {
      "worklet"
      return exercises[index.value].octave
    }
  );

  const arpeggio = useDerivedValue(
    () => {
      "worklet"
      return exercises[index.value].arpeggio
    }
  );

  const solidChord = useDerivedValue(
    () => {
      "worklet"
      return exercises[index.value].solidChord
    }
  );

  const brokenChord = useDerivedValue(
    () => {
      "worklet"
      return exercises[index.value].brokenChord
    }
  );

  return (
    <>
        <RenderExercisePathSet plots={scale} index={index} color={colours[0]} />
        <RenderExercisePathSet plots={octave} index={index} color={colours[1]} />
        <RenderExercisePathSet plots={arpeggio} index={index} color={colours[2]} />
        <RenderExercisePathSet plots={solidChord} index={index} color={colours[3]} />
        <RenderExercisePathSet plots={brokenChord} index={index} color={colours[4]} />
    </>
  )
}

type RenderGridProps = {
  grids: SkPath[],
  index: SharedValue<number>
}

const RenderGrid = ({ grids, index }: RenderGridProps) => {
  const animatedGrid = useDerivedValue(
    () => {
      "worklet"
      return grids[index.value]
    },
    [index, grids]
  );
  return (
    <Path path={animatedGrid} color="#ffffff44" strokeWidth={1} style="stroke" />
  )
}

type RenderLabelsProps = {
  labels: Labels[]
  index: SharedValue<number>
}

const RenderLabels = ({ labels, index }: RenderLabelsProps) => {

  const font = useFont(require("./SF-Mono-Medium.otf"), 12);

  const yLabels = useDerivedValue(() => {
    // console.log("shared value changed " + next.value + " " + graphs.value.length)
    return labels[index.value].yLabels
  })

  // Measure on the JS thread once the font has loaded
  const placedXLabels = useMemo(
    () => font == null
      ? labels.map(() => [])
      : labels.map(l => layoutXLabels(l.xLabels ?? [], text => font.measureText(text).width)),
    [labels, font]
  );

  const xLabels = useDerivedValue(() => {
    return placedXLabels[index.value] ?? []
  }, [index, placedXLabels])

  const ylabelsPicture = useDerivedValue(() => createPicture(
    (canvas) => {
      if (yLabels.value == null || yLabels.value.length <= 0 || font == null)
        return

      const paint = Skia.Paint();

      paint.setColor(Skia.Color("white"));
      yLabels.value.map((obj, index) => {
        canvas.drawText(obj.text, obj.pos.x ? obj.pos.x : 150, obj.pos.y ? obj.pos.y : 150, paint, font)
      })
    }
  ));

  const xLabelsPicture = useDerivedValue(() => createPicture(
    (canvas) => {
      if (xLabels.value == null || xLabels.value.length <= 0 || font == null)
        return

      const paint = Skia.Paint();

      paint.setColor(Skia.Color("white"));
      xLabels.value.map(label => {
        // Rotate around the anchor so the text ends just under its column
        canvas.save()
        canvas.translate(label.x, label.y)
        canvas.rotate(X_LABEL_SLANT, 0, 0)
        canvas.drawText(label.text, -label.width, 0, paint, font)
        canvas.restore()
      })
    }
  ));

  return (
    <>
      <Picture picture={ylabelsPicture} />
      <Picture picture={xLabelsPicture} />
    </>
  )
}

type GraphViewProps = GraphProps & {
  data: IAllPracticeData,
}

// Pure view: renders whatever practice data it's given (see GraphPlayground)
export const GraphView = ({ width, height, data }: GraphViewProps) => {
  // Read outside <Canvas>: context doesn't reliably reach Skia's renderer
  const { chart, chartBackground } = useContext(ThemeContext);

  const currentGraph = useMemo<GraphData>(
    () => new GraphGenerator().getGraph(width, height, data),
    [width, height, data]
  );

  const transition = useSharedValue(0);
  const next = useSharedValue(0);
  const current = useSharedValue(0);

  return (
    <>
      <Canvas style={{ height: height, width: width, backgroundColor: chartBackground }}>
        {
          currentGraph.grids.length > 0 ?
            <RenderGrid grids={currentGraph.grids} index={next} /> : null
        }
        {
          currentGraph.exercises.length > 0 ?
            <RenderExercises index={next} exercises={currentGraph.exercises} colours={chart} /> : null
        }
        {
          currentGraph.labels.length > 0 ?
            <RenderLabels labels={currentGraph.labels} index={next} /> : null
        }
      </Canvas>
      <Selection current={current} next={next} transition={transition} graphData={currentGraph} />
    </>
  )
}

const Graph = ({ width, height }: GraphProps) => {
  const dispatch = useAppDispatch()
  const practiceData = useAppSelector((state: RootState) => state.practice.practiceData)

  useFocusEffect(
    React.useCallback(() => {
      dispatch(getAllPracticedata());
    }, [])
  );

  return <GraphView width={width} height={height} data={practiceData} />
}

export default Graph;
