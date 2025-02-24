import React, { FunctionComponent, useContext, useEffect, useState } from "react"

// import Context from "../state/modules/routine/context";
// import { generateRequest,saveRoutine } from "../state/modules/routine/store/actions";

import { useNavigation } from "@react-navigation/native";
import { BottomTabNavigatorParamList } from "../navigation/types";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { ExerciseType, Routine } from "../data/Models/DataModels";
import PracticeContext from "../state/modules/PracticeData/PracticeContext";
import { getTodaysPracticeDataRequest } from "../state/modules/PracticeData/store/actions";
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
import { useAppDispatch, useAppSelector } from "../state/hooks";
// import { RootState } from "../state/store";
// import { GenerateRoutine } from "../state/modules/routine/store/reducer";
import { generateRoutine, saveRoutines } from "../state/routineSlice";
import { RootState } from "../state/store";
import { getTodaysPracticedata } from "../state/practiceDataSlice";

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
    //State
    const [selectedRoots, setSelectedRoots] = React.useState(["C", "D", "E", "F", "G", "A", "B"]);    
    const [selectedTypes, setSelectedTypes] = React.useState<string []>([]);    
    const [selectedExercises, setSelectedExercises] = React.useState<Array<ExerciseType>>([]); 

    // const { myDispatch } = useContext(Context);
    // const { practiceDatadispatch, practiceDataState } = useContext(PracticeContext);
    const navigation = useNavigation<BottomTabNavigationProp<BottomTabNavigatorParamList>>();

    const [showModal, setShowModal] = useState(false);

    const { background, primary, secondaryBackground } = useContext(ThemeContext);

    // const count = useAppSelector((state: RootState) => state.routine.value)
    const dispatch = useAppDispatch()

    const generatedRoutine = useAppSelector((state: RootState) => state.routine.generatedRoutine)

    const CheckValidRoutineConfiguration = () : boolean => {
        return (selectedRoots.length > 0 && selectedTypes.length > 0 && selectedExercises.length > 0)
    }

    useEffect(() => {
        dispatch(getTodaysPracticedata())
    }, [])

    const StartRoutine = () => {

        console.log("WERID " + JSON.stringify([selectedRoots, selectedTypes, selectedExercises]))

        // const generateReq = generateRequest([selectedRoots, selectedTypes, selectedExercises])

        dispatch(generateRoutine([selectedRoots, selectedTypes, selectedExercises]))

        if(CheckValidRoutineConfiguration())
            navigation.navigate('Practice')
        else
            showAlert()
            // setIsOpen(!isOpen)
    }

    const SaveRoutine = (saveName : string) => {

        // const saveRoutineMSG = saveRoutine([selectedRoots, selectedTypes, selectedExercises, saveName])

        // console.log("saveRoutineMSG " + JSON.stringify(saveRoutineMSG))

        // dispatch(SaveRoutine()) 

        dispatch(generateRoutine([selectedRoots, selectedTypes, selectedExercises]))

        const routineToSave: Routine = {
            id: '-1',
            title: saveName,
            RoutineItems: generatedRoutine, //generatedRoutine
            createdAt: '99',
          };

        dispatch(saveRoutines(routineToSave))

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
        const action = !temp[index]
        temp[index] = action
        setManageRoots(temp)

        let localRoots = [...selectedRoots]

        if (action)
        {
            localRoots.push(root)
        }
        else
        {
            const idx = localRoots.indexOf(root)
            localRoots = localRoots.splice(idx, 1)
        }
        setSelectedRoots(localRoots)
    }

    const onClickSelectType = (index : number, type : string) => {
        let temp = [...manageTypes];
        const action = !temp[index]
        temp[index] = !temp[index]
        setManageTypes(temp)

        let localTypes = [...selectedTypes]

        if (action)
        {
            localTypes.push(type)
        }
        else
        {
            const idx = localTypes.indexOf(type)
            localTypes = localTypes.splice(idx, 1)
        }
        setSelectedTypes(localTypes)
    }

    const onClickSelectExercise = (index : number, exercise : ExerciseType) => {
        let temp = [...manageExercise];
        const action = !temp[index]
        temp[index] = !temp[index]
        setManageExercise(temp)

        let localExercise = [...selectedExercises]

        if (action)
        {
            localExercise.push(exercise)
        }
        else
        {
            const idx = localExercise.indexOf(exercise)
            localExercise = localExercise.splice(idx, 1)
        }
        setSelectedExercises(localExercise)
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
                                    onPress={() => onClickSelectType(i, scaleType)} 
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
