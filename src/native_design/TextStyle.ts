import {Dimensions, PixelRatio, type TextStyle} from 'react-native';
import {colors} from './Colors';
import {GetNormalizedSize} from '../utils/responsive_utils';

const {width} = Dimensions.get('window');

const textCore: {[key: string]: TextStyle} = {
  defaultFont: {
    // fontFamily: "Inter",
    color: colors.dark,
  },
};

export const h1: TextStyle = {
  ...textCore.defaultFont,
  fontSize: 32,
  fontWeight: 'bold',
};

export const h2: TextStyle = {
  ...textCore.defaultFont,
  fontSize: 24,
  fontWeight: 'bold',
};

export const h3: TextStyle = {
  ...textCore.defaultFont,
  fontSize: GetNormalizedSize(20, width),
};

export const h4: TextStyle = {
  ...textCore.defaultFont,
  fontSize: 18,
};

export const body: TextStyle = {
  ...textCore.defaultFont,
  fontSize: 16,
};
