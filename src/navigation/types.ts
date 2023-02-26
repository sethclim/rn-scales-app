import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";


export type BottomTabNavigatorParamList = {
    Generate: undefined;
    Practice: undefined;
    SavedRoutines: undefined;
  };

export const defaultBottomTabNavigatorParamList: BottomTabNavigatorParamList = {
  Generate: undefined,
  Practice: undefined,
  SavedRoutines: undefined,
};

export type GenerateNavigationProp = BottomTabNavigationProp<BottomTabNavigatorParamList, 'Generate', 'BottomTabs'>;
