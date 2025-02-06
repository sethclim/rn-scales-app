import React from "react";
import { FunctionComponent, useContext } from "react";

import { HStack, Button } from "../../native_blocks/";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {RoutineItem, Routine} from "../../data/Models/DataModels";

import Context from "../../state/modules/routine/context";
import { deleteRoutine } from "../../state/modules/routine/store/actions";
import { RowProps } from "./types";


const SavedRoutineHiddenItem :  FunctionComponent<RowProps>  = ({routine, index, routineItems}) => {  
   
    const { myDispatch } = useContext(Context);

    const deleteRow = (routine  : Routine, routineItems  : RoutineItem[]) => {
        const deleteMSG = deleteRoutine([routine])
        myDispatch(deleteMSG)
      };
  
    return (
        <HStack pAll={{l : 5}} justifyContent="flex-end" style={{"backgroundColor" : "#FF474C"}}>
          <Button onPress={() => deleteRow(routine, routineItems)}>
            <MaterialIcons name="delete" color="white" size={25} />
          </Button>
      </HStack>
    );
  };

  export default SavedRoutineHiddenItem;

// export const EnhancedSavedRoutineHiddenItem = withObservables<RoutineItem[], any>([], () => ({
//   //routineItems: routineItems
// }))(SavedRoutineHiddenItem);
