import React, { FunctionComponent, useContext } from "react";

import { HStack, Button, VStack } from "../../native_blocks/";

//Navigation
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { BottomTabNavigatorParamList } from "../../navigation/types";

import { RowProps } from "./types";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Text } from "react-native";
import { ThemeContext } from "../../context/ThemeContext";
import { useAppDispatch } from "../../state/hooks";
import { resumeRoutine } from "../../state/routineSlice";


export const SavedRoutineRow :  FunctionComponent<RowProps>  = ({routine, index, routineItems}) => {  

    // const { myDispatch } = useContext(Context);
    const navigation = useNavigation<BottomTabNavigationProp<BottomTabNavigatorParamList>>();
    const { primary, background, secondary, secondaryBackground, mode } = useContext(ThemeContext);

    const dispatch = useAppDispatch()

    const StartSavedRoutine = async () => {
        await dispatch(resumeRoutine(routine.id));
        navigation.navigate('Practice')
    }
  
    return (
      <HStack   height={50} style={{"backgroundColor" : mode == "light" ? primary : secondaryBackground!}}>
        <HStack gap={3} justifyContent="flex-start" align="center" p={6}>
          <HStack justifyContent="flex-start" p={5}>
            <Text style={{color : "white", fontSize: 20}}>{routine.title.charAt(0).toUpperCase() + routine.title.slice(1)}</Text>
          </HStack>

          <Button onPress={() => StartSavedRoutine()}>
            <MaterialIcons name="play-arrow" color="#fff" size={25} />
          </Button>
        </HStack>
      </HStack>
    );
  };
