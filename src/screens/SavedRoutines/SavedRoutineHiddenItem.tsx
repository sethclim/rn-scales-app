import { HStack, Pressable } from "native-base";
import React from "react";
import { FunctionComponent, useContext } from "react";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import RoutineItemModel from "../../data/Database/routine_item.model";
import Context from "../../state/modules/routine/context";
import { IDeleteRoutine } from "../../state/modules/routine/store/actions";
import { DELETE_ROUTINE } from "../../state/modules/routine/store/types";
import { RowProps } from "./types";

import RoutineModel from "../../data/Database/routine.model";

const SavedRoutineHiddenItem :  FunctionComponent<RowProps>  = ({routine, index, routineItems}) => {  
   
    const { dispatch } = useContext(Context);

    const deleteRow = (routine  : RoutineModel, routineItems  : RoutineItemModel[]) => {
        const msg : IDeleteRoutine  = {
          type: DELETE_ROUTINE,
          payload: [routine]
        }
        dispatch(msg)
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
