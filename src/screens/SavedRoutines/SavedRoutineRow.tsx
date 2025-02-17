import React, { FunctionComponent, useContext } from "react";

import { Box } from "../../native_blocks/primatives/Box";
import { HStack, Button, VStack } from "../../native_blocks/";

//Navigation
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { BottomTabNavigatorParamList } from "../../navigation/types";

//Project
import { resumeRoutine } from "../../state/modules/routine/store/actions";

import { RowProps } from "./types";
import {RoutineItem} from "../../data/Models/DataModels";
import Context from "../../state/modules/routine/context";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Text } from "react-native";


export const SavedRoutineRow :  FunctionComponent<RowProps>  = ({routine, index, routineItems}) => {  

    const { myDispatch } = useContext(Context);
    const navigation = useNavigation<BottomTabNavigationProp<BottomTabNavigatorParamList>>();

    const StartSavedRoutine = (routineItems : RoutineItem[]) => {
        const resumeMSG = resumeRoutine(routineItems)   
        myDispatch(resumeMSG)
        navigation.navigate('Practice')
    }
  
    return (
      <VStack width={370}  height={50} style={{"backgroundColor" : "#6B8F71"}}>
        <HStack gap={3} justifyContent="flex-start" align="center" p={6}>
          <HStack justifyContent="flex-start" p={5}>
            <Text style={{color : "white"}}>{routine.title}</Text>

          </HStack>

          <Button onPress={() => StartSavedRoutine(routineItems)}>
            <MaterialIcons name="play-arrow" color="#fff" size={25} />
          </Button>

          {/* <Button bg="#FFFFFF33" _text={{color:"white"}} onPress={() => StartSavedRoutine(routineItems)}>Start</Button> */}
        </HStack>
      </VStack>
    );
  };
