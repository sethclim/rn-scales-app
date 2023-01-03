import React from "react"

import { Box, HStack, VStack, Text, Checkbox, Button } from 'native-base';

const Generate = () => {

    const naturalRoots    = ["C", "D", "E", "F", "G", "A", "B"]
    const accidentalRoots = ["C#", "Eb", "F#", "G#", "Bb"]
    const scaleTypes      = ["Major", "Minor", "Augmented", "Diminished"]
    const exercises       = ["Scale", "Octaves", "Arpeggio", "Broken Chords", "Solid Chords"]

    return (
        <Box flex={1} padding={5} bg="nord.background">
            <Text color="nord.primary.1" marginTop={20} fontSize={30}>Generate Routine</Text>

            <VStack marginTop={20} alignItems="center">

                <Box marginTop={5} bg="nord.secondaryBackground" py="4" px="3" borderRadius="5" rounded="md" width={375} maxWidth="100%" shadow={9}>
                    <Text color="nord.primary.1" mt={-3} fontSize={20}>Roots</Text>
                    <HStack space={3} flexWrap={'wrap'}>
                    
                        <HStack>
                        {
                            naturalRoots.map( (naturalRoot, i) => { return (
                                <Checkbox key={i} value={naturalRoot} size="md" >{naturalRoot}</Checkbox>
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
                </Box>

                <Box marginTop={5}bg="nord.secondaryBackground" py="4" px="3" borderRadius="5" rounded="md" width={375} maxWidth="100%" shadow={9}>
                    <Text color="nord.primary.1" mt={-3} fontSize={20}>Type</Text>
                    <HStack space={3} flexWrap={'wrap'}>
                    {
                        scaleTypes.map( (scaleType, i) => { return (
                            <Checkbox key={i} value={scaleType} size="md" >{scaleType}</Checkbox>
                        )})
                    }
                    </HStack>
                </Box>

                <Box marginTop={5} bg="nord.secondaryBackground" py="4" px="3" borderRadius="5" rounded="md" width={375} maxWidth="100%" shadow={9}>
                    <Text color="nord.primary.1" mt={-3} fontSize={20}>Exercise</Text>
                    <HStack space={3} flexWrap={'wrap'}>
                    {
                        exercises.map( (exercise, i) => { return (
                            <Checkbox key={i} value={exercise} size="md"  >{exercise}</Checkbox>
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