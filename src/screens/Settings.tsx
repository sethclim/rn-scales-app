import React from "react";
import { Box, Button, HStack, Switch, Text, VStack } from "native-base";

const ROW_HEIGHT = 50

const Settings  = () => {
  
    return (
      <Box margin={30} flex={1} >
        <Box marginTop={20} bg="nord.secondaryBackground" height={400} paddingTop={10}>
            <VStack flex={1}>
                <VStack padding={2}>
                    <Text fontSize="lg"  color="nord.primary.1">Theme</Text>
                    <HStack justifyContent="center">
                        <Box height={120} width={75} margin={2} bg="#ff0000"><Text>Nord</Text></Box>
                        <Box height={120} width={75} margin={2} bg="#ff0000"><Text>Dark</Text></Box>
                        <Box height={120} width={75} margin={2} bg="#ff0000"><Text>Color</Text></Box>
                    </HStack>
                </VStack>
                <VStack padding={2}>
                    <Text fontSize="lg" color="nord.primary.1"  marginBottom={2} >Delete All Practice Data</Text>
                    <Button bg="nord.danger" >Delete</Button>
                </VStack>
                <VStack padding={2}>
                    <Text fontSize="lg" color="nord.primary.1" marginBottom={2}>Delete All Saved Routines</Text>
                    <Button bg="nord.danger" >Delete</Button>
                </VStack>
            </VStack>
        </Box>
      </Box>
    );
  };

export default Settings