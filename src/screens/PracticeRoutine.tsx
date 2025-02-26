import React, { useContext, useState } from "react"
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
import { ProgessBar } from "../components/ProgressBar";

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
    const generatedRoutine = useAppSelector((state: RootState) => state.routine.generatedRoutine)

    const [progress, setProgress] = useState<number>(0)

    const [progressAmt, setProgressAmt] = useState<number>(1)

    const Next = () => {

        dispatch(getTask(null))

        if(task != null)
        {
            dispatch(recordPracticeData([task.exerciseType, 1]))
            
            setProgress(progress + progressAmt)
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            Next();
            setProgressAmt((100 / generatedRoutine.length))
            return() =>{
                dispatch(savePracticeData(null));
            }
        }, [])
    ); 


    return(
        <Box flexMain={true} p={5} style={{backgroundColor: background!}} >
            <VStack justifyContent="center">
            {
                task != null ? 
                <>
                    <VStack flexMain={false} height={170}>
                        <Text style={{color: primary, fontSize: 40, textAlign: "center"}}>{task.displayItem}</Text>
                    </VStack>
                    <StyledRoundButton next={Next} />
                </>
                : 
                <>
                    <VStack flexMain={false} height={170}>
                        <Text style={{color: primary, fontSize: 40, textAlign: "center"}}>Practice Complete</Text>
                    </VStack>
                    <TextButton titles="Go Back" onPress={()=> navigation.navigate('Generate')} />
                </>
            }
            </VStack>
            <ProgessBar progress={progress} height={50} />  
        </Box>
    )
}
  
export default PracticeRoutine;
