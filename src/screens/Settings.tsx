import React, { useContext } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Box, } from "../native_blocks/primatives/Box";
import { VStack, HStack, Button } from "../native_blocks/";
import { TextButton } from "../components/TextButton";
import { ThemeContext } from "../context/ThemeContext";
import { Text } from "react-native";

const ROW_HEIGHT = 50

const Settings  = () => {

    const { requestTheme, background, primary, secondaryBackground, mode} = useContext(ThemeContext);

    const storeData = async (value: string) => {
        try {
          await AsyncStorage.setItem('theme', value);
        } catch (e) {
          // saving error
          console.warn(e)
        }
      };

      const changeTheme = (theme : string) => {
        requestTheme(theme)
        storeData(theme)
      }

  
    return (
      <Box p={30} flexMain={true} style={{backgroundColor : background!}} >
        {/* bg="nord.secondaryBackground" */}
        <Box mAll={{t : 20}}  height={400} pVH={{v : 10}}>
            <VStack flexMain={true}>
                <VStack p={2}>
                    {/* <Text fontSize="lg"  color="nord.primary.1">Theme</Text> */}
                    <HStack justifyContent="center" align="flex-start">
                        <Button  onPress={() => changeTheme('light')} style={{height: 120}}>
                            <Box flexMain={false} height={120} width={75} m={2} p={4} style={{backgroundColor : '#5E81AC'}} >
                                <Text style={{color: 'white'}}>Nord</Text>
                                <VStack justifyContent="flex-end">
                                    <Box flexMain={false}  style={{
                                            backgroundColor : mode == "light" ? '#5E81AC' : "white", 
                                            borderRadius: 1000,
                                            borderWidth:  mode == "light" ? 2 : 0, 
                                            borderColor: "white"
                                        }} 
                                        width={12} height={12}
                                    >
                                    </Box>
                                </VStack>
                            </Box>
                        </Button>
                        {/* <Box height={120} width={75} m={2} >
                            <TextButton  titles="Blackout" onPress={() => {}}  />
                        </Box> */}
                        <Button  onPress={() => changeTheme('tokyo')} style={{height: 120}}>
                            <Box flexMain={false} height={120} width={75} m={2} p={4} style={{backgroundColor : '#ff9e64'}} >
                                <Text style={{color: 'white'}}>Tokyo Nights</Text>
                                <VStack justifyContent="flex-end">
                                    <Box flexMain={false}  style={{
                                            backgroundColor : mode == "tokyo" ? '#ff9e64' : "white", 
                                            borderRadius: 1000,
                                            borderWidth:  mode == "tokyo" ? 2 : 0, 
                                            borderColor: "white"
                                        }} 
                                        width={12} height={12}
                                    >

                                    </Box>
                                </VStack>
                            </Box>
                        </Button>
           
                    </HStack>
                </VStack>
                <HStack justifyContent="flex-start"  flexMain={false} mVH={{v: 5}} pVH={{h: 2}} style={{backgroundColor : secondaryBackground!}}>
                    <HStack p={4} justifyContent="flex-start">
                        <Text style={{color: primary}}>Delete All Practice Data</Text>
                    </HStack>
                    <TextButton  titles="Delete" onPress={() => {}}  />
                </HStack>
                <HStack flexMain={false} mVH={{v: 5}} pVH={{h: 2}} style={{backgroundColor : secondaryBackground!}} >
                    <HStack p={4} justifyContent="flex-start">
                        <Text style={{color: primary}}>Delete All Saved Routines</Text>
                    </HStack>
                    <TextButton titles="Delete" onPress={() => {}}  />
                </HStack>
            </VStack>
        </Box>
      </Box>
    );
  };

export default Settings