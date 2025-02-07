import React, { useContext, useEffect, useState } from "react"
import { StyleSheet, Text, TouchableOpacity } from "react-native";

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
import { withStyle } from "../native_blocks/hoc/WithStyle";
import { FontWeight } from "@shopify/react-native-skia";
import { ThemeContext } from "../context/ThemeContext";

type RoundButtonProps = {
    next : () => void
    roundButton?: {}
    textStyle?: {}
}

const RoundButton = (props : RoundButtonProps) => {
    return (
        <TouchableOpacity
            onPress={props.next}
            style={props.roundButton}>
            <Text style={props.textStyle}>NEXT</Text>
        </TouchableOpacity>
    )
}

const makeRoundedButtonStyle = (theme: any) => {
    return {
        roundButton: {
            marginTop: 20,
            width: 150,
            height: 150,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 10,
            borderRadius: 100,
            backgroundColor: theme.primary,
        },
        textStyle: {
            color: "white",
            fontSize: 45,
            FontWeight: "bold"
        }
    };
  };
  
  export const StyledRoundButton = withStyle<RoundButtonProps>(
      RoundButton,
      makeRoundedButtonStyle
  );



const PracticeRoutine = () =>{
    const { state, myDispatch } = useContext(Context);
    const { practiceDatadispatch, practiceDataState } = useContext(PracticeContext);

    const navigation = useNavigation<BottomTabNavigationProp<BottomTabNavigatorParamList>>();
    const { primary, background } = useContext(ThemeContext);


    const Next = () => {

        const requestMSG = requestTask([])

        if (myDispatch == null)
            return

        myDispatch(requestMSG);

        // if(state.currentTask != null)
        // {
        //     const recordMSG = recordPracticeDataRequest(state.currentTask.exerciseType)
        //     practiceDatadispatch(recordMSG);
        // }
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
        <Box flexMain={true} p={5} style={{backgroundColor: background!}} >
            {/* <Center flex={1}> */}
            {
                state.currentTask != null ? 
                <>
                    <VStack flexMain={false}  height={170}>
                        <Text style={{color: primary, fontSize: 40, textAlign: "center"}}>{state.currentTask.displayItem}</Text>
                    </VStack>
                    <StyledRoundButton next={Next} />
                </>
                : 
                <>
                    <Text style={{color: primary, fontSize: 40, textAlign: "center"}}>Practice Complete</Text>
                    <TextButton titles="Go Back" onPress={()=> navigation.navigate('Generate')} />
                </>
            }
            {/* </Center> */}
        </Box>
    )
}
  
export default PracticeRoutine;
