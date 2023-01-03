import React from "react"

import { Box, HStack, VStack, Text, Checkbox, Button } from 'native-base';

const Generate = () => {

    const naturalRoots    = ["C", "D", "E", "F", "G", "A", "B"]
    const accidentalRoots = ["C#", "Eb", "F#", "G#", "Bb"]
    const scaleTypes      = ["Major", "Minor", "Augmented", "Diminished"]
    const exercises       = ["Scale", "Octaves", "Arpeggio", "Broken Chords", "Solid Chords"]

    return (
        <Box flex={1} padding={5}>
            <Text marginTop={20} fontSize={30}>Generate Routine</Text>

            <VStack marginTop={20} alignItems="center">

                <Box marginTop={5} bg="primary.600" py="4" px="3" borderRadius="5" rounded="md" width={375} maxWidth="100%">
                    <HStack space={3} flexWrap={'wrap'}>
                    
                        <HStack>
                        {
                            naturalRoots.map( (naturalRoot, i) => { return (
                                <Checkbox key={i} value={naturalRoot} >{naturalRoot}</Checkbox>
                            )})
                        }
                        </HStack>
                    
                        <HStack>
                        {
                            accidentalRoots.map( (accidentalRoot, i) => { return (
                                <Checkbox key={i} value={accidentalRoot} >{accidentalRoot}</Checkbox>
                            )})
                        }
                        </HStack>
                    
                    </HStack>
                </Box>

                <Box marginTop={5} bg="primary.600" py="4" px="3" borderRadius="5" rounded="md" width={375} maxWidth="100%">
                    <HStack space={3} flexWrap={'wrap'}>
                    {
                        scaleTypes.map( (scaleType, i) => { return (
                            <Checkbox key={i} value={scaleType} >{scaleType}</Checkbox>
                        )})
                    }
                    </HStack>
                </Box>

                <Box marginTop={5} bg="primary.600" py="4" px="3" borderRadius="5" rounded="md" width={375} maxWidth="100%">
                    <HStack space={3} flexWrap={'wrap'}>
                    {
                        exercises.map( (exercise, i) => { return (
                            <Checkbox key={i} value={exercise} >{exercise}</Checkbox>
                        )})
                    }
                    </HStack>
                </Box>

                <HStack marginTop={10} space={4} alignItems="center">
                    <Button  size="lg" width={130}>
                        Start
                    </Button>
                    <Button  size="lg" width={130}>
                        Save
                    </Button>
                </HStack>

            </VStack>
        </Box>
    )
}

export default Generate;