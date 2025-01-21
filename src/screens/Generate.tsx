import React, { FunctionComponent, useContext, useEffect, useState } from "react"

import { HStack, VStack, Text, Button, AlertDialog, FormControl, Input, Modal } from 'native-base';
import Context from "../state/modules/routine/context";
import { generateRequest,saveRoutine } from "../state/modules/routine/store/actions";

import { useNavigation } from "@react-navigation/native";
import { BottomTabNavigatorParamList } from "../navigation/types";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { ExerciseType } from "../data/Models/DataModels";
import PracticeContext from "../state/modules/PracticeData/PracticeContext";
import { getTodaysPracticeDataRequest } from "../state/modules/PracticeData/store/actions";
import { Box } from "../native_blocks/primatives/Box";
import { StyleSheet } from "react-native";


import check from "../assets/check.svg"
import { CheckBox } from "../components/Checkbox";

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

    const { myDispatch } = useContext(Context);
    const { practiceDatadispatch, practiceDataState } = useContext(PracticeContext);
    const navigation = useNavigation<BottomTabNavigationProp<BottomTabNavigatorParamList>>();

    const [showModal, setShowModal] = useState(false);

    const CheckValidRoutineConfiguration = () : boolean => {
        return (selectedRoots.length > 0 && selectedTypes.length > 0 && selectedExercises.length > 0)
    }

    useEffect(() => {
        practiceDatadispatch(getTodaysPracticeDataRequest(new Date()))
    }, [])

    const StartRoutine = () => {

        console.log("WERID " + JSON.stringify([selectedRoots, selectedTypes, selectedExercises]))

        const generateReq = generateRequest([selectedRoots, selectedTypes, selectedExercises])

        myDispatch(generateReq)

        if(CheckValidRoutineConfiguration())
            navigation.navigate('Practice')
        else
            setIsOpen(!isOpen)
    }

    const SaveRoutine = (saveName : string) => {

        const saveRoutineMSG = saveRoutine([selectedRoots, selectedTypes, selectedExercises, saveName])
        myDispatch(saveRoutineMSG) 

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

    return (
        <Box flexMain={true} p={1} style={style.bg}> 

            <VStack marginTop={5} alignItems="center">
                <Box flexMain={false} align="flex-start" mAll={{t: 5}} style={style.bg2} p={4} width={375}>
                    <Text color="nord.primary.1" mt={-3} fontSize={20}>Roots</Text>
                        <HStack space={3} flexWrap={'wrap'}>
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
                        </HStack>
                </Box>

                <Box flexMain={false} align="flex-start" mAll={{t: 50}} style={style.bg2} py="4" px="3" borderRadius="5" rounded="md" width={375} maxWidth="100%" shadow={9}>
                    <Text color="nord.primary.1" mt={-3} fontSize={20}>Type</Text>
                        <HStack space={3} flexWrap={'wrap'}>
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
                </Box>

                <Box flexMain={false} align="flex-start" mAll={{t: 50}} style={style.bg2} py="4" px="3" borderRadius="5" rounded="md" width={375} maxWidth="100%" shadow={9}>
                    <Text color="nord.primary.1" mt={-3} fontSize={20}>Exercise</Text>
                        <HStack space={3} flexWrap={'wrap'}>
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
                </Box>

                <HStack marginTop={10} space={4} alignItems="center">
                    <Button  size="lg" width={130} onPress={() => StartRoutine()}>
                        Start
                    </Button>
                    <Button  size="lg" width={130} onPress={() => setShowModal(true)}>
                        Save
                    </Button>

                </HStack> 

            </VStack>

            <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
                <AlertDialog.Content>
                    <AlertDialog.CloseButton />
                    <AlertDialog.Header>Invalid Routine Configuration</AlertDialog.Header>
                    <AlertDialog.Body>
                        Please Select at least one option from each section!
                    </AlertDialog.Body>
                </AlertDialog.Content>
            </AlertDialog>

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

    return(
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
            <Modal.Content bg="nord.secondaryBackground" maxWidth="400px">
                <Modal.Header bg="nord.primary.1">Save Routine</Modal.Header>
                <Modal.Body bg="nord.secondaryBackground">
                    <FormControl>
                        <FormControl.Label>Routine Name</FormControl.Label>
                        <Input color="black" onChangeText={(text) => setValue(text)} />
                    </FormControl>
                </Modal.Body>
                <Modal.Footer bg="nord.secondaryBackground">
                    <Button.Group space={2}>
                        <Button w={20} onPress={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        <Button w={20} onPress={() => save(value)}>
                            Save
                        </Button>
                    </Button.Group>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    )
}

const style = StyleSheet.create({
    bg:{
        backgroundColor: "#ECEFF4", //nord.background
    },
    bg2:{
        backgroundColor: "#E5E9F0", //"nord.secondaryBackground"
        elevation: 8,
        borderRadius: 5,
    }
})

export default Generate;
