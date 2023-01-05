import React, { useContext } from "react"

import { Text, Box, Center } from "native-base"
import { StyleSheet, TouchableOpacity } from "react-native";
import Context from "../state/modules/routine/context";
import { IRequestTask } from "../state/modules/routine/store/actions";
import { REQUEST_TASK } from "../state/modules/routine/store/types";
import navigation from "../navigation";

const PracticeRoutine = () =>{

    const { state, dispatch } = useContext(Context);

    const Next = () => {

        const msg : IRequestTask  = {
            type: REQUEST_TASK,
            payload: []
        }

        dispatch(msg);

    }

    return(
        <Box flex={1} padding={5} bg="nord.background">
            <Center flex={1}>
                <Text fontSize={50} color="nord.primary.1" textAlign="center">{state.currentTask}</Text>
                <TouchableOpacity
                    onPress={Next}
                    style={styles.roundButton}>
                    <Text fontSize={50}>Next</Text>
                </TouchableOpacity>
            </Center>
        </Box>
    )
}

const styles = StyleSheet.create({
    roundButton: {
      marginTop: 20,
      width: 150,
      height: 150,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
      borderRadius: 100,
      backgroundColor: '#5E81AC',
    },
  });
  

export default PracticeRoutine;
