import { CheckBox as CB, CheckBoxProps } from "../native_blocks/buttons/CheckBox"
import { ButtonStyle, TextStyle as MyTextStyle } from '../native_design';
import { withStyle } from "../native_blocks/hoc/WithStyle";

const makeStyle = (theme: any) => {
    return {
      style: {
        ...ButtonStyle.square,
        backgroundColor: "white",
        borderWidth: 1,
        borderRadius: 4,
        borderColor: "#5E81AC"
      },
      checkedBtnstyle:{
        ...ButtonStyle.square,
        backgroundColor: theme.primary,
        // borderWidth: 1,
        // borderRadius: 2,
        ZStack: 1
      },
      textStyle: {
        ...MyTextStyle.h3,
        color: theme.primary,
        margin: 4
      },
    };
  };
  
  export const CheckBox = withStyle<CheckBoxProps>(
      CB,
      makeStyle
  );