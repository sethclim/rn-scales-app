import { TextButton as TB, TextButtonProps } from "../native_blocks/buttons/TextButton"
import { withStyle } from "../native_blocks/hoc/WithStyle";
import { ButtonStyle, TextStyle } from "../native_design";

const makeStyle = (theme: any) => {
    return {
      style: {
        ...ButtonStyle.mini,
        backgroundColor: theme.primary,
      },
      textStyle: {
        ...TextStyle.h3,
        color: "white",
      },
    };
  };
  
export const MiniTextButton = withStyle<TextButtonProps>(
    TB,
    makeStyle
);
  
  