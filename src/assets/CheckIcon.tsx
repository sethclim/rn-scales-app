import React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

const CheckIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M4 12.6111L8.92308 17.5L20 6.5"
      stroke={props.color ?? "white"}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default CheckIcon;
