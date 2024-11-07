import React, { useCallback } from "react";
import { Text, View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import {
  Canvas,
  Group,
  LinearGradient,
  RoundedRect,
  mix,
  vec,
} from "@shopify/react-native-skia";
import { SharedValue, runOnJS, runOnUI, useSharedValue } from "react-native-reanimated";
import  { useDerivedValue, withTiming } from "react-native-reanimated";

import type { GraphData } from "./GraphBuilder";

const buttonWidth = 98;
const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 0,
    paddingBottom: 16,
  },
  container: {
    backgroundColor: "#272636",
    borderRadius: 16,
    flexDirection: "row",
  },
  button: {
    height: 64,
    width: buttonWidth,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
  label: {
    fontFamily: "Helvetica",
    fontSize: 16,
    color: "white",
    textAlign: "center",
  },
}); 

export interface GraphState {
  next: number;
  current: number;
}

interface SelectionProps {
  current: SharedValue<number>;
  next: SharedValue<number>;
  transition: SharedValue<number>;
  graphData: GraphData;
}

export const Selection = ({ current, next, transition, graphData }: SelectionProps) => {

  const translateX = useSharedValue(0);

  const workletMix = (value : number, current : number, next : number) => {
    //console.log("value " + value + " current " + current + " next " + next)
    "worklet";
    translateX.value = mix(value, current, next)
  }

  const transform = useDerivedValue(() => {
    // console.log("current " + state.value.current + " next " + state.value.next)
    workletMix(transition.value, current.value * buttonWidth,  next.value * buttonWidth)

    // console.log("next.value 2: " + next.value)

    return [
      {
        translateX: translateX.value
      },
    ];
  }, [transition.value, current.value, next.value]);


  const onPress = (index : number) =>{
    //onsole.log("index " + index)
    //console.log("state.value.next " + state.value.next)
    current.value = next.value;
    next.value = index;

    // console.log("next.value " + next.value)

    //console.log("state.value.next " + state.value.next)

    transition.value = 0;
    transition.value = withTiming(1, {
      duration: 750,
    });
  }

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <Canvas style={StyleSheet.absoluteFill}>
          <Group transform={transform}>
            <RoundedRect x={0} y={0} height={64} width={buttonWidth} r={16}>
              <LinearGradient
                colors={["#31CBD1", "#61E0A1"]}
                start={vec(0, 0)}
                end={vec(buttonWidth, 64)}
              />
            </RoundedRect>
          </Group>
        </Canvas>
        {graphData.titles.map((title, index) => (
          <TouchableWithoutFeedback
            key={index}
            onPress={() => onPress(index)}
          >
            <View style={styles.button}>
              <Text style={styles.label}>{title}</Text>
            </View>
          </TouchableWithoutFeedback>
        ))}
      </View>
    </View>
  );
};