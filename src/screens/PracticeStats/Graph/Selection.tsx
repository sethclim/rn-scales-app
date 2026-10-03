import React, { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
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
import { useDerivedValue, withTiming } from "react-native-reanimated";

import type { GraphData } from "./GraphBuilder";
import { ThemeContext } from "../../../context/ThemeContext";

// const buttonWidth = 98;
const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 0,
    paddingBottom: 16,
  },
  container: {
    borderRadius: 16,
    flexDirection: "row",
  },
  button: {
    height: 64,
    // width: buttonWidth,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
  label: {
    // fontFamily: "Helvetica",
    fontSize: 16,
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

  const [b_Width, setB_Width] = useState(98)
  // Mirrors next for text colour; both start on the first title
  const [selected, setSelected] = useState(0)
  const { chartBackground, toggle } = useContext(ThemeContext)
  
  const find_dimesions = (layout: any) => {
    const { x, y, width, height } = layout;
    // console.warn(x);
    // console.warn(y);
    // console.warn(width);
    // console.warn(height);
  
    setB_Width(width / graphData.titles.length)
  }

  const translateX = useSharedValue(0);

  const workletMix = (value: number, current: number, next: number) => {
    //console.log("value " + value + " current " + current + " next " + next)
    "worklet";
    translateX.value = mix(value, current, next)
  }

  const transform = useDerivedValue(() => {

    // console.log("b_Width " + b_Width + " next.value " + next.value)
    // console.log("current " + state.value.current + " next " + state.value.next)
    workletMix(transition.value, current.value * b_Width, next.value * b_Width)

    // console.log("next.value 2: " + next.value)

    return [
      {
        translateX: translateX.value
      },
    ];
  });


  const onPress = (index: number) => {
    //onsole.log("index " + index)
    //console.log("state.value.next " + state.value.next)
    current.value = next.value;
    next.value = index;
    setSelected(index);

    // console.log("next.value " + next.value)

    //console.log("state.value.next " + state.value.next)

    transition.value = 0;
    transition.value = withTiming(1, {
      duration: 750,
    });
  }

  const getButtonStyle = () => {
    return StyleSheet.create({
      button: {
        height: 64,
        width: b_Width,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 16,
      }
    })
  }


  return (
    <View style={styles.root}>
      <View style={[styles.container, { backgroundColor: chartBackground }]} onLayout={(event) => { find_dimesions(event.nativeEvent.layout) }}>
        <Canvas style={StyleSheet.absoluteFill}>
          <Group transform={transform}>
            <RoundedRect x={0} y={0} height={64} width={b_Width} r={16}>
              <LinearGradient
                colors={toggle.gradient}
                start={vec(0, 0)}
                end={vec(b_Width, 64)}
              />
            </RoundedRect>
          </Group>
        </Canvas>
        {graphData.titles.map((title, index) => (
          <TouchableWithoutFeedback
            key={index}
            onPress={() => onPress(index)}

          >
            <View style={[styles.button,  {width : b_Width }]} 
            >
              <Text style={[styles.label, { color: index === selected ? toggle.activeText : toggle.text }]}>{title}</Text>
            </View>
          </TouchableWithoutFeedback>
        ))}
      </View>
    </View>
  );
};

// style={getButtonStyle().button} 