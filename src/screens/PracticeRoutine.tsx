import React, { useContext, useEffect } from "react"
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { Text, Box, Center, Button } from "native-base"
import { StyleSheet, TouchableOpacity } from "react-native";
import Context from "../state/modules/routine/context";
import { IRequestTask } from "../state/modules/routine/store/actions";
import { REQUEST_TASK } from "../state/modules/routine/store/types";
import { BottomTabNavigatorParamList } from "../navigation/types";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";


const PracticeRoutine = () =>{

    const { state, dispatch } = useContext(Context);

    const navigation = useNavigation<BottomTabNavigationProp<BottomTabNavigatorParamList>>();

    const Next = () => {

        const msg : IRequestTask  = {
            type: REQUEST_TASK,
            payload: []
        }

        dispatch(msg);

    }

    useFocusEffect(
        React.useCallback(() => {
            Next();
        }, [])
    ); 

    return(
        <Box flex={1} padding={5} bg="nord.background">
            <Center flex={1}>
            {
                state.currentTask != null ? 
                <>
                    <Text fontSize={50} color="nord.primary.1" textAlign="center">{state.currentTask}</Text>
                    <TouchableOpacity
                        onPress={Next}
                        style={styles.roundButton}>
                        <Text fontSize={50}>Next</Text>
                    </TouchableOpacity>
                </>
                : 
                <>
                    <Text fontSize={50} color="nord.primary.1" textAlign="center">Practice Complete</Text>
                    <Button  size="lg" width={130} onPress={()=> navigation.navigate('Generate')}>
                        Go Back
                    </Button>
                </>
            }
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
