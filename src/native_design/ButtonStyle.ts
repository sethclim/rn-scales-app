import {Dimensions, StyleSheet} from 'react-native';
import {colors} from './Colors';
import {GetNormalizedSize} from '../utils/responsive_utils';

const {width} = Dimensions.get('window');

const buttonCore = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rounded: {
    borderRadius: 6,
  },
});

const padding = (v: number, h: number) => {
  return {
    paddingVertical: v,
    paddingHorizontal: h,
  };
};

export const primary = {
  ...buttonCore.center,
  ...padding(12, GetNormalizedSize(32, width)),
  ...buttonCore.rounded,
  elevation: 4,
  backgroundColor: colors.danger_red,
};

export const square = {
  ...buttonCore.center,
  height: GetNormalizedSize(24, width),
  width: GetNormalizedSize(24, width),
  backgroundColor: colors.danger_red,
};

export const mini = {
  ...buttonCore.center,
  ...buttonCore.rounded,
  height: 32,
  width: 120,
  elevation: 4,
  backgroundColor: colors.danger_red,
};
