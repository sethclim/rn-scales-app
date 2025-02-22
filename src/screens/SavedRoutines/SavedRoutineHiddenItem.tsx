import React from "react";
import { FunctionComponent, useContext } from "react";

import { HStack, Button } from "../../native_blocks/";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {RoutineItem, Routine} from "../../data/Models/DataModels";

import Context from "../../state/modules/routine/context";
import { deleteRoutine, requestAllRoutines } from "../../state/modules/routine/store/actions";
import { RowProps } from "./types";


const SavedRoutineHiddenItem :  FunctionComponent<RowProps>  = ({routine, index, routineItems}) => {  
   
    const { myDispatch } = useContext(Context);

    const deleteRow = async() => {

        console.log("deleteRow")

        if(myDispatch == null)
          return

        const deleteMSG = deleteRoutine(routine.id)
        console.log("deleteMSG " + JSON.stringify(deleteMSG))
        await myDispatch(deleteMSG)
        myDispatch(requestAllRoutines());
      };
  
    return (
        <HStack pAll={{l : 5}} justifyContent="flex-end" style={{"backgroundColor" : "#FF474C"}}>
          <Button onPress={() => deleteRow()}>
            <MaterialIcons name="delete" color="white" size={25} />
          </Button>
      </HStack>
    );
  };

  export default SavedRoutineHiddenItem;

// export const EnhancedSavedRoutineHiddenItem = withObservables<RoutineItem[], any>([], () => ({
//   //routineItems: routineItems
// }))(SavedRoutineHiddenItem);
