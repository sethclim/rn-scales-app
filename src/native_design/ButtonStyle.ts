import {StyleSheet} from 'react-native';
import {colors} from './Colors';

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
  ...padding(12, 32),
  ...buttonCore.rounded,
  elevation: 4,
  backgroundColor: colors.danger_red,
};

export const square = {
  ...buttonCore.center,
  height: 24,
  width: 24,
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
