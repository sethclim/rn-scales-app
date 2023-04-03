import React, { useMemo } from 'react'
import { Canvas, Group, LinearGradient, Path, useComputedValue, useValue, vec } from "@shopify/react-native-skia"
import { useGraphTouchHandler } from './Components/useGraphTouchHandler';
import { useWindowDimensions } from 'react-native';
import { COLORS, PADDING, getGraph } from './Model';
import { getYForX } from './Math';
import { Label } from './Components/Label';
import { Cursor } from './Components/Cursor';

const PracticeGraph = () =>{

    const window = useWindowDimensions();
    const { width } = window;
    const height = Math.min(window.width, window.height) / 2;
    const translateY = height + PADDING;
    const graphs = useMemo(() => getGraph(width, height), [width, height]);
    // animation value to transition from one graph to the next
    const transition = useValue(0);
    // indicices of the current and next graphs
    const state = useValue({
      next: 0,
      current: 0,
    });
    // path to display
    const path = useComputedValue(() => {
      const { current, next } = state.current;
      const start = graphs[current].data.path;
      const end = graphs[next].data.path;
      return end.interpolate(start, transition.current)!;
    }, [state, transition]);
    // x and y values of the cursor
    const x = useValue(0);
    const y = useComputedValue(
      () => getYForX(path.current.toCmds(), x.current),
      [x, path]
    );


    const onTouch = useGraphTouchHandler(x, y, width, height);
    
    return(
        <Canvas style={{ width : width, height: 2 * height + 30 }} onTouch={onTouch}>
            <Label
            state={state}
            y={y}
            graphs={graphs}
            width={width}
            height={height}
            />
            <Group transform={[{ translateY }]}>
                <Path
                    style="stroke"
                    path={path}
                    strokeWidth={4}
                    strokeJoin="round"
                    strokeCap="round"
                >
                    <LinearGradient
                        start={vec(0, 0)}
                        end={vec(width, 0)}
                        colors={COLORS}
                    />
                </Path>
                <Cursor x={x} y={y} width={width} />
            </Group>
        </Canvas>
    )
}

export default PracticeGraph;