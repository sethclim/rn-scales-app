import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NavigatorScreenParams } from "@react-navigation/native";

export type BottomTabNavigatorParamList = {
    Generate: undefined;
    Practice: undefined;
    SavedRoutines: undefined;
    PracticeStats: undefined;
    Settings: undefined;
    HomePage: undefined;
  };

export const defaultBottomTabNavigatorParamList: BottomTabNavigatorParamList = {
  Generate: undefined,
  Practice: undefined,
  SavedRoutines: undefined,
  PracticeStats: undefined,
  Settings: undefined,
  HomePage: undefined
};

export type GenerateNavigationProp = BottomTabNavigationProp<BottomTabNavigatorParamList, 'Generate', 'BottomTabs'>;

export type RootStackParamList = {
  Main: NavigatorScreenParams<BottomTabNavigatorParamList>;
  Practice: undefined;
  Settings: undefined;
};
