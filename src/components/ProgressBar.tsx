import { FontWeight } from "@shopify/react-native-skia";
import { withStyle } from "../native_blocks/hoc/WithStyle";
import { ProgessBar as _ProgressBar, ProgressBarProps } from "../native_blocks/ProgressBar";

const makeStyle = (theme: any) => {
    return {
      backgroundStyle: {
        backgroundColor: "#77777777",
      },
      barStyle: {
        backgroundColor: theme.primary,
        paddingLeft: 10
      },
      textStyle: {
        color: theme.background,
        fontWeight: 700,
        fontSize: 30,
      },
    };
  };
  
export const ProgessBar = withStyle<ProgressBarProps>(
    _ProgressBar,
    makeStyle
);
  