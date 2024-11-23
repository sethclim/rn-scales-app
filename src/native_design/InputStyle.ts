import { StyleSheet } from 'react-native';
import { Radius } from './Sizes';
// import * as TextStyle from './TextStyle';
import { colors } from './Colors';

export const PrimaryInputStyle = StyleSheet.create({
  // titleStyle: {
  //   ...TextStyle.body,
  //   color: colors.dark,
  //   paddingLeft: 10,
  // },
  inputTextStyle: {
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.grey,
    // width: 300,
    height: 50,
    alignSelf: 'stretch',
  },
  inputContainer: {
    flexGrow: 0,
  },
});

export const SquareInputStyle = StyleSheet.create({
  // titleStyle: {
  //   ...TextStyle.body,
  //   color: colors.dark,
  //   paddingLeft: 5,
  // },
  inputTextStyle: {
    borderRadius: Radius.s,
    borderWidth: 2,
    borderColor: colors.grey,
    height: 45,
    alignSelf: 'stretch',
  },
  inputContainer: {
    alignSelf: 'stretch',
  },
});
