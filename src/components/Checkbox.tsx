import { CheckBox as CB, CheckBoxProps } from "native-blocks-core/buttons/CheckBox"
import { ButtonStyle, TextStyle as MyTextStyle } from '../native_design';
import { withStyle } from "native-blocks-core/hoc/WithStyle";

const makeStyle = (theme: any) => {
    return {
      style: {
        ...ButtonStyle.square,
        backgroundColor: "#11111100",
        borderWidth: 2,
        borderRadius: 2,
      },
      textStyle: {
        ...MyTextStyle.h2,
        color: theme.primary,
      },
    };
  };
  
  export const CheckBox = withStyle<CheckBoxProps>(
      CB,
      makeStyle
  );