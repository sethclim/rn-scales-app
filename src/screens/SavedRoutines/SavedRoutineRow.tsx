import React, { FunctionComponent, useContext } from "react";
//Watermelon
import withObservables from '@nozbe/with-observables';

//NativeBase
import { Box, HStack, Spacer, Button, Text } from "native-base";

//Navigation
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { BottomTabNavigatorParamList } from "../../navigation/types";

//Project
import { IResumeRoutine } from "../../state/modules/routine/store/actions";
import { RESUME_ROUTINE } from "../../state/modules/routine/store/types";
import { RowProps } from "./types";
import RoutineItem from "../../data/routine_item.model";
import Context from "../../state/modules/routine/context";

const SavedRoutineRow :  FunctionComponent<RowProps>  = ({routine, index, routineItems}) => {  

    const { dispatch } = useContext(Context);
    const navigation = useNavigation<BottomTabNavigationProp<BottomTabNavigatorParamList>>();
    

    const StartSavedRoutine = (routineItems : RoutineItem[]) => {

        const msg : IResumeRoutine  = {
            type: RESUME_ROUTINE,
            payload: routineItems
        }

        dispatch(msg)
        navigation.navigate('Practice')
    }
  
    return (
      <Box w="100%" h={50} bg="nord.primary.1" padding={1}>
        <HStack space={3} justifyContent="flex-start" alignItems="center">
          <Text>{routine.title}</Text>
          <Spacer />
          <Button onPress={() => StartSavedRoutine(routineItems)}>Start</Button>
        </HStack>
      </Box>
    );
  };

  export const EnhancedSavedRoutineRow = withObservables(['routine'], ({ routine }) => ({
    routine,
    routineItems: routine.routineItems
  }))(SavedRoutineRow);