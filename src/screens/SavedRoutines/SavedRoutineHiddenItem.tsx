import React from "react";
import { FunctionComponent, useContext } from "react";

import { HStack, Pressable } from "native-base";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {RoutineItem, RoutineModel} from "../../data/Models/DataModels";

import Context from "../../state/modules/routine/context";
import { deleteRoutine } from "../../state/modules/routine/store/actions";
import { RowProps } from "./types";


const SavedRoutineHiddenItem :  FunctionComponent<RowProps>  = ({routine, index, routineItems}) => {  
   
    const { dispatch } = useContext(Context);

    const deleteRow = (routine  : RoutineModel, routineItems  : RoutineItem[]) => {
        const deleteMSG = deleteRoutine([routine])
        dispatch(deleteMSG)
      };
  
    return (
        <HStack flex={1} pl={2} justifyContent="flex-end">
        <Pressable bg="nord.danger" 
                   px={4}
                   justifyContent="center" 
                   onPress={() => deleteRow(routine, routineItems)} 
                   _pressed={{ opacity: 0.5 }}>
          <MaterialIcons name="delete" color="#fff" size={25} />
        </Pressable>
      </HStack>
    );
  };

  export default SavedRoutineHiddenItem;

// export const EnhancedSavedRoutineHiddenItem = withObservables<RoutineItem[], any>([], () => ({
//   //routineItems: routineItems
// }))(SavedRoutineHiddenItem);
