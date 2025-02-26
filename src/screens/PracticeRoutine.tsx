import React, { useContext } from "react"
import { Text, TouchableOpacity } from "react-native";

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { BottomTabNavigatorParamList } from "../navigation/types";

import { Box } from "../native_blocks/primatives/Box";
import { TextButton } from "../components/TextButton";

import { VStack } from "../native_blocks"

import { withStyle } from "../native_blocks/hoc/WithStyle";

import { ThemeContext } from "../context/ThemeContext";
import { useAppSelector, useAppDispatch } from "../state/hooks";
import { RootState } from "../state/store";
import { getTask } from "../state/routineSlice";
import { recordPracticeData, savePracticeData } from "../state/practiceDataSlice";

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

    const navigation = useNavigation<BottomTabNavigationProp<BottomTabNavigatorParamList>>();
    const { primary, background } = useContext(ThemeContext);
    const dispatch = useAppDispatch()

    const task = useAppSelector((state: RootState) => state.routine.currentTask)

    const Next = () => {

        dispatch(getTask(null))

        if(task != null)
        {
            dispatch(recordPracticeData([task.exerciseType, 1]))
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            Next();
            return() =>{
                dispatch(savePracticeData(null));
            }
        }, [])
    ); 


    return(
        // bg="nord.background"
        <Box flexMain={true} p={5} style={{backgroundColor: background!}} >
            {/* <Center flex={1}> */}
            {
                task != null ? 
                <>
                    <VStack flexMain={false}  height={170}>
                        <Text style={{color: primary, fontSize: 40, textAlign: "center"}}>{task.displayItem}</Text>
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
