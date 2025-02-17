import React, { useContext, useEffect, useState } from "react"
import { StyleSheet, TouchableOpacity } from "react-native";

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { BottomTabNavigatorParamList } from "../navigation/types";

import { Box, } from "../native_blocks/primatives/Box";
import { TextButton } from "../components/TextButton";

import { VStack } from "../native_blocks"

import Context from "../state/modules/routine/context";
import PracticeContext from "../state/modules/PracticeData/PracticeContext";
import { requestTask } from "../state/modules/routine/store/actions";
import { recordPracticeDataRequest, savePracticeDataRequest } from "../state/modules/PracticeData/store/actions";
import { ExerciseType, PracticeData } from "../data/Models/DataModels";

const PracticeRoutine = () =>{
    const { state, myDispatch } = useContext(Context);
    const { practiceDatadispatch, practiceDataState } = useContext(PracticeContext);

    const navigation = useNavigation<BottomTabNavigationProp<BottomTabNavigatorParamList>>();


    const Next = () => {

        const requestMSG = requestTask([])
        myDispatch(requestMSG);

        if(state.currentTask != null)
        {
            const recordMSG = recordPracticeDataRequest(state.currentTask.exerciseType)
            practiceDatadispatch(recordMSG);
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            Next();
            return() =>{
                //console.log("triggering save of pd!! ")
                const saveMSG = savePracticeDataRequest()
                practiceDatadispatch(saveMSG);
            }
        }, [])
    ); 

    return(
        // bg="nord.background"
        <Box flexMain={true} p={5} >
            {/* <Center flex={1}> */}
            {
                state.currentTask != null ? 
                <>
                    <VStack flexMain={false}  height={170}>
                        {/* <Text fontSize={50} color="nord.primary.1" textAlign="center">{state.currentTask.displayItem}</Text> */}
                    </VStack>
                    <TouchableOpacity
                        onPress={Next}
                        style={styles.roundButton}>
                        {/* <Text fontSize={50}>Next</Text> */}
                    </TouchableOpacity>
                </>
                : 
                <>
                    {/* <Text fontSize={50} color="nord.primary.1" textAlign="center">Practice Complete</Text> */}
                    <TextButton titles="Go Back" onPress={()=> navigation.navigate('Generate')} />
                </>
            }
            {/* </Center> */}
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
