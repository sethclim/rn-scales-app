import React, { useContext } from "react"

import { Box, HStack, VStack, Text, Checkbox, Button, AlertDialog } from 'native-base';
import Context from "../state/modules/routine/context";
import { IGenerateRequest, ISaveRoutine } from "../state/modules/routine/store/actions";
import { GENERATE_REQUEST, SAVE_ROUTINE } from "../state/modules/routine/store/types";

import { useNavigation } from "@react-navigation/native";
import { BottomTabNavigatorParamList } from "../navigation/types";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";


const Generate = () => {

    //Options
    const naturalRoots    = ["C", "D", "E", "F", "G", "A", "B"]
    const accidentalRoots = ["C#", "Eb", "F#", "G#", "Bb"]
    const scaleTypes      = ["Major", "Minor", "Augmented", "Diminished"]
    const exercises       = ["Scale", "Octaves", "Arpeggio", "Broken Chords", "Solid Chords"]

    //State
    const [selectedRoots, setSelectedRoots] = React.useState(["C", "D", "E", "F", "G", "A", "B", "C#", "Eb", "F#", "G#", "Bb"]);    
    const [selectedTypes, setSelectedTypes] = React.useState([]);    
    const [selectedExercises, setSelectedExercises] = React.useState([]); 

    const { state, dispatch } = useContext(Context);
    const navigation = useNavigation<BottomTabNavigationProp<BottomTabNavigatorParamList>>();

    const CheckValidRoutineConfiguration = () : boolean => {
        return (selectedRoots.length > 0 && selectedTypes.length > 0 && selectedExercises.length > 0)
    }

    const StartRoutine = () => {
        const msg : IGenerateRequest  = {
            type: GENERATE_REQUEST,
            payload: [selectedRoots, selectedTypes, selectedExercises]
        }

        dispatch(msg)

        if(CheckValidRoutineConfiguration())
            navigation.navigate('Practice')
        else
            setIsOpen(!isOpen)
    }

    const SaveRoutine = () => {
        const saveRoutine : ISaveRoutine  = {
            type: SAVE_ROUTINE,
            payload: []
        }

        dispatch(saveRoutine)
    }

    const [isOpen, setIsOpen] = React.useState(false);

    const onClose = () => setIsOpen(false);
  
    const cancelRef = React.useRef(null);

    return (
        <Box flex={1} padding={5} bg="nord.background">

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
                            exercises.map( (exercise, i) => { return (
                                <Checkbox key={i} value={exercise} size="md">{exercise}</Checkbox>
                            )})
                        }
                        </HStack>
                    </Checkbox.Group>
                </Box>

                <HStack marginTop={10} space={4} alignItems="center">
                    <Button  size="lg" width={130} onPress={() => StartRoutine()}>
                        Start
                    </Button>
                    <Button  size="lg" width={130} onPress={() => SaveRoutine()}>
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

        </Box>
    )
}

export default Generate;
