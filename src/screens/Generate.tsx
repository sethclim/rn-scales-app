import React, { FunctionComponent, useContext, useState } from "react"

import { Box, HStack, VStack, Text, Checkbox, Button, AlertDialog, FormControl, Input, Modal } from 'native-base';
import Context from "../state/modules/routine/context";
import { generateRequest,saveRoutine } from "../state/modules/routine/store/actions";

import { useNavigation } from "@react-navigation/native";
import { BottomTabNavigatorParamList } from "../navigation/types";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { ExerciseType } from "../data/Models/DataModels";

export const Exercises = new Map<ExerciseType, string>([
    ["scale", "Scale"],
    ["octave", "Octaves"],
    ["arpeggio", "Arpeggio"],
    ["solid-chord", "Solid Chords"],
    ["broken-chord", "Broken Chords"]
]);

const Generate = () => {

    //Options
    const naturalRoots    = ["C", "D", "E", "F", "G", "A", "B"]
    const accidentalRoots = ["C#", "Eb", "F#", "G#", "Bb"]
    const scaleTypes      = ["Major", "Minor", "Augmented", "Diminished"]
    const exercises2       = ["Scale", "Octaves", "Arpeggio", "Broken Chords", "Solid Chords"]


    //State
    const [selectedRoots, setSelectedRoots] = React.useState(["C", "D", "E", "F", "G", "A", "B", "C#", "Eb", "F#", "G#", "Bb"]);    
    const [selectedTypes, setSelectedTypes] = React.useState([]);    
    const [selectedExercises, setSelectedExercises] = React.useState<Array<ExerciseType>>([]); 

    const { myDispatch } = useContext(Context);
    const navigation = useNavigation<BottomTabNavigationProp<BottomTabNavigatorParamList>>();

    const [showModal, setShowModal] = useState(false);

    const CheckValidRoutineConfiguration = () : boolean => {
        return (selectedRoots.length > 0 && selectedTypes.length > 0 && selectedExercises.length > 0)
    }

    const StartRoutine = () => {

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

    return (
        <Box flex={1} padding={1} bg="nord.background">
            <VStack marginTop={20} alignItems="center">
                <Box marginTop={5} bg="nord.secondaryBackground" py="4" px="3" borderRadius="5" rounded="md" width={375} maxWidth="100%" shadow={9}>
                    <Text color="nord.primary.1" mt={-3} fontSize={20}>Roots</Text>
                    <Checkbox.Group onChange={setSelectedRoots} value={selectedRoots}>
                        <HStack space={3} flexWrap={'wrap'}>
                            <HStack>
                            {
                                naturalRoots.map( (naturalRoot, i) => { return (
                                    <Checkbox key={i} value={naturalRoot} size="md">{naturalRoot}</Checkbox>
                                )})
                            }
                            </HStack>
                            <HStack>
                            {
                                accidentalRoots.map( (accidentalRoot, i) => { return (
                                    <Checkbox key={i} value={accidentalRoot} size="md" >{accidentalRoot}</Checkbox>
                                )})
                            }
                            </HStack>
                        </HStack>
                    </Checkbox.Group>
                </Box>

                <Box marginTop={5}bg="nord.secondaryBackground" py="4" px="3" borderRadius="5" rounded="md" width={375} maxWidth="100%" shadow={9}>
                    <Text color="nord.primary.1" mt={-3} fontSize={20}>Type</Text>
                    <Checkbox.Group onChange={setSelectedTypes} value={selectedTypes}>
                        <HStack space={3} flexWrap={'wrap'}>
                        {
                            scaleTypes.map( (scaleType, i) => { return (
                                <Checkbox key={i} value={scaleType} size="md" >{scaleType}</Checkbox>
                            )})
                        }
                        </HStack>
                    </Checkbox.Group>
                </Box>

                <Box marginTop={5} bg="nord.secondaryBackground" py="4" px="3" borderRadius="5" rounded="md" width={375} maxWidth="100%" shadow={9}>
                    <Text color="nord.primary.1" mt={-3} fontSize={20}>Exercise</Text>
                    <Checkbox.Group onChange={setSelectedExercises} value={selectedExercises}>
                        <HStack space={3} flexWrap={'wrap'}>
                        {
                            [...Exercises.keys()].map((exerciseType) => {
                                  return  <Checkbox key={exerciseType} value={exerciseType} size="md">{Exercises.get(exerciseType)}</Checkbox>
                            })
                        }
                        </HStack>
                    </Checkbox.Group>
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

export default Generate;
