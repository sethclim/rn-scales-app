import React, { FunctionComponent, useContext } from "react";
//Watermelon
import { withObservables } from '@nozbe/watermelondb/react'

//NativeBase
import { Box, HStack, Spacer, Button, Text, Icon, IconButton } from "native-base";

//Navigation
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { BottomTabNavigatorParamList } from "../../navigation/types";

//Project
import { resumeRoutine } from "../../state/modules/routine/store/actions";

import { RowProps } from "./types";
import RoutineItemModel from "../../data/Database/routine_item.model";
import Context from "../../state/modules/routine/context";

import {database} from '../../data/Database/database';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { background } from "native-base/lib/typescript/theme/styled-system";

const SavedRoutineRow :  FunctionComponent<RowProps>  = ({routine, index, routineItems}) => {  

    const { dispatch } = useContext(Context);
    const navigation = useNavigation<BottomTabNavigationProp<BottomTabNavigatorParamList>>();

    const StartSavedRoutine = (routineItems : RoutineItemModel[]) => {
        const resumeMSG = resumeRoutine(routineItems)   
        dispatch(resumeMSG)
        navigation.navigate('Practice')
    }
  
    return (
      <Box w="100%" h={50} bg="nord.primary.1" padding={1}>
        <HStack space={3} justifyContent="flex-start" alignItems="center">
          <Text marginLeft={5} fontWeight="bold">{routine.title}</Text>
          <Spacer />
          <IconButton 
            variant="unstyled"
            icon={<MaterialIcons name="play-arrow" color="#fff" size={20} />} 
            borderRadius="full"
            onPress={() => StartSavedRoutine(routineItems)}
              _pressed={{
                bg: "#00000000",
                _icon: {
                  color:"#ff0000"
                }
              }}
            />
          {/* <Button bg="#FFFFFF33" _text={{color:"white"}} onPress={() => StartSavedRoutine(routineItems)}>Start</Button> */}
        </HStack>
      </Box>
    );
  };

const data = database.collections.get('routine_items');
const observabeRoutineItems = () => data?.query().observe();

export const EnhancedSavedRoutineRow = withObservables<RoutineItemModel[], any>([], () => ({
  routineItems: observabeRoutineItems()
}))(SavedRoutineRow);
