import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";


export type BottomTabNavigatorParamList = {
    Generate: undefined;
    Practice: undefined;
  };

export const defaultBottomTabNavigatorParamList: BottomTabNavigatorParamList = {
  Generate: undefined,
  Practice: undefined,
};

export type GenerateNavigationProp = BottomTabNavigationProp<BottomTabNavigatorParamList, 'Generate', 'BottomTabs'>;
