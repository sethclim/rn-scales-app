import React, { FunctionComponent, useContext, useEffect, useState } from "react"

import { useNavigation } from "@react-navigation/native";
import { BottomTabNavigatorParamList } from "../navigation/types";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { ExerciseType } from "../data/Models/DataModels";

import { Box, } from "../native_blocks/primatives/Box";
import { VStack, HStack } from "../native_blocks/";
import { Modal, Alert, Text,  } from "react-native";

import { TextButton } from "../components/TextButton";

import check from "../assets/check.svg"
import { CheckBox } from "../components/Checkbox";
import { ThemeContext } from "../context/ThemeContext";
import { Card } from "../components/Card";
import { StyledTextInputField } from "../native_blocks/TextInput"
import { MiniTextButton } from "../components/MiniTextButton";
import { useAppDispatch } from "../state/hooks";

import { generateRoutine, saveRoutines } from "../state/routineSlice";

import { getTodaysPracticedata } from "../state/practiceDataSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

//Options
const NATURAL_ROOTS    = ["C", "D", "E", "F", "G", "A", "B"]
const ACCIDENTAL_ROOTS = ["C#", "Eb", "F#", "G#", "Bb"]
const SCALE_TYPES      = ["Major", "Minor", "Augmented", "Diminished"]
export const Exercises = new Map<ExerciseType, string>([
    ["scale", "Scale"],
    ["octave", "Octaves"],
    ["arpeggio", "Arpeggio"],
    ["solidChord", "Solid Chords"],
    ["brokenChord", "Broken Chords"]
]);

const Generate = () => {

    const navigation = useNavigation<BottomTabNavigationProp<BottomTabNavigatorParamList>>();

    const [showModal, setShowModal] = useState(false);

    const { background, primary, secondaryBackground, requestTheme } = useContext(ThemeContext);

    const dispatch = useAppDispatch()

    const CheckValidRoutineConfiguration = (selectedRoots : string[], selectedTypes : string[], selectedExercises : any) : boolean => {
        return (selectedRoots.length > 0 && selectedTypes.length > 0 && selectedExercises.length > 0)
    }

    const readTheme = async () => {
        try {
            const mode = await AsyncStorage.getItem('theme');

            if(mode != null)
            {
                requestTheme(mode)
            }
        } catch (e) {
            console.warn(e)
        }
    };

    useEffect(() => {
        dispatch(getTodaysPracticedata())
        readTheme()
    }, [])

    const StartRoutine = () => {
        const selectedRoots : string[] = []
        const selectedTypes : string[] = []
        const selectedExercises : ExerciseType[] = []

        const array3 = NATURAL_ROOTS.concat(ACCIDENTAL_ROOTS);
        manageRoots.forEach((type, index) => {
            if(type)
                selectedRoots.push(array3[index])
        });
        
        manageTypes.forEach((type, index) => {
            if(type)
                selectedTypes.push(SCALE_TYPES[index])
        });

        manageExercise.forEach((type, index) =>{
            if(type)
                selectedExercises.push(Array.from(Exercises.keys())[index])
        });

        // console.log("StartRoutine " + JSON.stringify([selectedRoots, selectedTypes, selectedExercises]))
        
        if(CheckValidRoutineConfiguration(selectedRoots, selectedTypes, selectedExercises))
        {    
            dispatch(generateRoutine([selectedRoots, selectedTypes, selectedExercises]))
            navigation.navigate('Practice')
        }
        else
            showAlert()
            // setIsOpen(!isOpen)
    }

    const SaveRoutine = (saveName : string) => {
        const selectedRoots : string[] = []
        const selectedTypes : string[] = []
        const selectedExercises : ExerciseType[] = []

        const array3 = NATURAL_ROOTS.concat(ACCIDENTAL_ROOTS);
        manageRoots.forEach((type, index) => {
            if(type)
                selectedRoots.push(array3[index])
        });
        
        manageTypes.forEach((type, index) => {
            if(type)
                selectedTypes.push(SCALE_TYPES[index])
        });

        manageExercise.forEach((type, index) =>{
            if(type)
                selectedExercises.push(Array.from(Exercises.keys())[index])
        });
        dispatch(saveRoutines([saveName, selectedRoots, selectedTypes, selectedExercises]))
        setShowModal(false);
    }

    const [isOpen, setIsOpen] = React.useState(false); 

    const onClose = () => setIsOpen(false);
  
    const cancelRef = React.useRef(null);

    const [manageRoots, setManageRoots] = useState([true, true, true, true, true, true, true, false, false, false, false, false])
    const [manageTypes, setManageTypes] = useState([false, false, false, false])
    const [manageExercise, setManageExercise] = useState([false, false, false, false, false])

    const onClickNaturalRoot = (index : number, root : string) => {
        let temp = [...manageRoots];
        temp[index] = !temp[index]
        setManageRoots(temp)
    }

    const onClickSelectType = (index : number) => {
        let temp = [...manageTypes];
        temp[index] = !temp[index]
        setManageTypes(temp)
    }

    const onClickSelectExercise = (index : number, exercise : ExerciseType) => {
        let temp = [...manageExercise];
        temp[index] = !temp[index]
        setManageExercise(temp)
    }

    const showAlert = () =>
        Alert.alert(
          'Warning',
          'Invalid Routine Configuration',
          [
            {
              text: 'Ok',
            //   onPress: () => Alert.alert('Cancel Pressed'),
              style: 'cancel',
            },
          ],
          {
            cancelable: true,
            onDismiss: () =>
              Alert.alert(
                'This alert was dismissed by tapping outside of the alert dialog.',
              ),
          },
        );

    return (
        <Box flexMain={true} p={1} style={{backgroundColor: background!}}> 

            <VStack mAll={{t: -60}} align="center" justifyContent="center" >
                <Card height={120} padding={10}>
                    <Text style={{color : primary, fontSize: 20, fontWeight: "700"}}>Roots</Text>
                        <VStack gap={3} pVH={{v: 4}} >
                            <HStack>
                            {
                                NATURAL_ROOTS.map( (naturalRoot, i) => { return (
                                    <CheckBox 
                                        iconColor="white" 
                                        iconSize={20} 
                                        checked={manageRoots[i]} 
                                        checkMark={check} 
                                        key={i} 
                                        onPress={() => onClickNaturalRoot(i, naturalRoot)} 
                                        title={naturalRoot} />
                                )})
                            }
                            </HStack>
                            <HStack>
                            {
                                ACCIDENTAL_ROOTS.map( (accidentalRoot, i) => { return (
                                    <CheckBox 
                                        iconColor="white" 
                                        iconSize={20} 
                                        checked={manageRoots[i + 7]} 
                                        checkMark={check} 
                                        key={i} 
                                        onPress={() => onClickNaturalRoot(i + 7, accidentalRoot)} 
                                        title={accidentalRoot} />
                                )})
                            }
                            </HStack>
                        </VStack>
                </Card>
                
                {/* borderRadius="5" rounded="md"  maxWidth="100%" shadow={9} */}
                <Card height={120} padding={10}>
                    <Text style={{color : primary, fontSize: 20, fontWeight: "700"}}>Type</Text>
                        <HStack gap={3} flexWrap="wrap" pVH={{v: 4}} >
                        {
                            SCALE_TYPES.map( (scaleType, i) => { return (
                                <CheckBox 
                                    checkMark={check} 
                                    iconSize={20} 
                                    iconColor="white" 
                                    key={i} 
                                    onPress={() => onClickSelectType(i)} 
                                    checked={manageTypes[i]} 
                                    title={scaleType} />
                            )})
                        }
                        </HStack>
                </Card>

                <Card height={120} padding={10}>
                    <Text style={{color : primary, fontSize: 20, fontWeight: "700"}}>Exercise</Text>
                        <HStack gap={3} flexWrap="wrap" pVH={{v: 4}} >
                        {
                            [...Exercises.keys()].map((exerciseType, i) => {
                                  return  <CheckBox 
                                            key={i} 
                                            iconColor="white" 
                                            checkMark={check} 
                                            iconSize={20} 
                                            onPress={() => onClickSelectExercise(i, exerciseType)}  
                                            checked={manageExercise[i]}   
                                            title={Exercises.get(exerciseType)!} />
                            })
                        }
                        </HStack>
                </Card>

                <HStack flexMain={false} mAll={{t:10}} gap={4} align="center">
                    <TextButton titles="Start" onPress={() => StartRoutine()} />
                    <TextButton titles="Save" onPress={() => setShowModal(true)} />
                </HStack> 

            </VStack>

            {/* <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
                <AlertDialog.Content>
                    <AlertDialog.CloseButton />
                    <AlertDialog.Header>Invalid Routine Configuration</AlertDialog.Header>
                    <AlertDialog.Body>
                        Please Select at least one option from each section!
                    </AlertDialog.Body>
                </AlertDialog.Content>
            </AlertDialog> */}

            <SaveModal showModal={showModal} setShowModal={setShowModal} save={SaveRoutine} />

        </Box>
    )
}

interface SaveModalProps {
    showModal: any,
    setShowModal: any,
    save : any  
}

const SaveModal : FunctionComponent<SaveModalProps> = ({showModal, setShowModal, save}) => {

    const [value, setValue] = React.useState("");
    const { background, primary, secondaryBackground } = useContext(ThemeContext);

    const save_routine = () => _WORKLET

    return(
        <Modal
            animationType="fade"
            transparent={true} 
            visible={showModal} 
            onRequestClose={() => setShowModal(false)}>
                <VStack justifyContent="center"  style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <VStack flexMain={false} m={30} style={{
                        backgroundColor: secondaryBackground!, 
                        borderColor: primary, 
                        borderWidth: 2,
                        shadowColor: '#000',
                        shadowOffset: {
                          width: 0,
                          height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,    
                        elevation: 5,
                    }}>
                        <HStack style={{backgroundColor : primary}} height={60}>
                            <Text style={{color : background!, fontSize: 32, fontWeight: 700}}>Save Routine</Text>
                        </HStack>

                        <VStack p={10}>
                            <StyledTextInputField text={value} textChanged={(text) => setValue(text)} errorMessage="" />
                        </VStack>
                        <HStack gap={4} p={8}>
                                <MiniTextButton titles="Cancel" onPress={() => setShowModal(false)} />
                                <MiniTextButton titles="Save" onPress={() => save(value)} />
                        </HStack>
                    </VStack>
                </VStack>
        </Modal>
    )
}

export default Generate;
