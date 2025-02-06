import React, { useContext } from "react";

import { Box, } from "../native_blocks/primatives/Box";
import { VStack, HStack } from "../native_blocks/";
import { TextButton } from "../components/TextButton";
import { ThemeContext } from "../context/ThemeContext";

const ROW_HEIGHT = 50

const Settings  = () => {

    const { toggleTheme, background } = useContext(ThemeContext);
  
    return (
      <Box p={30} flexMain={true} style={{backgroundColor : background!}} >
        {/* bg="nord.secondaryBackground" */}
        <Box mAll={{t : 20}}  height={400} pVH={{v : 10}}>
            <VStack flexMain={true}>
                <VStack p={2}>
                    {/* <Text fontSize="lg"  color="nord.primary.1">Theme</Text> */}
                    <HStack justifyContent="center">
                        <Box height={120} width={75} m={2} >
                            <TextButton  titles="Nord" onPress={() => toggleTheme()}  />
                        </Box>
                        {/* <Box height={120} width={75} m={2} >
                            <TextButton  titles="Blackout" onPress={() => {}}  />
                        </Box> */}
                        <Box height={120} width={75} m={2}>
                            <TextButton  titles="Tokyo Nights" onPress={() => toggleTheme()}  />
                        </Box>
                    </HStack>
                </VStack>
                <VStack p={2}>
                    {/* <Text fontSize="lg" color="nord.primary.1"  marginBottom={2} >Delete All Practice Data</Text> */}
                    <TextButton  titles="Delete" onPress={() => {}}  />
                </VStack>
                <VStack p={2}>
                    {/* <Text fontSize="lg" color="nord.primary.1" marginBottom={2}>Delete All Saved Routines</Text> */}

                    {/* bg="nord.danger" */}
                    <TextButton titles="Delete" onPress={() => {}}  />
                </VStack>
            </VStack>
        </Box>
      </Box>
    );
  };

export default Settings