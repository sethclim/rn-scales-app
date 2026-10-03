import React, { useContext } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Box, } from "../native_blocks/primatives/Box";
import { VStack, HStack, Button } from "../native_blocks/";
import { TextButton } from "../components/TextButton";
import { ThemeContext } from "../context/ThemeContext";
import { Alert, Text } from "react-native";
import { MiniTextButton } from "../components/MiniTextButton";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { useAppDispatch } from "../state/hooks";
import { deleteAllPracticeData } from "../state/practiceDataSlice";
import { deleteAllRoutines } from "../state/routineSlice";

const ROW_HEIGHT = 50

const Settings  = () => {

    const { requestTheme, background, primary, secondaryBackground, mode} = useContext(ThemeContext);
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const dispatch = useAppDispatch();

    const confirmDelete = (what: string, onDelete: () => void) =>
      Alert.alert(
        `Delete all ${what}?`,
        "This can't be undone.",
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: onDelete },
        ],
      );

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
        <Box mAll={{t : 20}}  height={400} pVH={{v : 10}} justifyContent="flex-start">
            <VStack flexMain={false} align="flex-start" >
                <VStack flexMain={false} pVH={{v: 8, h: 2}} align="flex-start">
                    <Text style={{fontSize: 20, color: primary}}>Theme</Text>
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
                            <Box flexMain={false} height={120} width={75} m={2} p={4} style={{backgroundColor : '#7aa2f7'}} >
                                <Text style={{color: 'white'}}>Tokyo Nights</Text>
                                <VStack justifyContent="flex-end">
                                    <Box flexMain={false}  style={{
                                            backgroundColor : mode == "tokyo" ? '#7aa2f7' : "white", 
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
                <Text style={{fontSize: 20, color: primary}}>Your Data</Text>
                <HStack justifyContent="flex-start"  flexMain={false} mVH={{v: 5}} pVH={{h: 2}} style={{backgroundColor : secondaryBackground!}}>
                    <HStack p={4} justifyContent="flex-start">
                        <Text style={{color: primary}}>Delete All Practice Data</Text>
                    </HStack>
                    <MiniTextButton  titles="Delete" onPress={() => confirmDelete('practice data', () => dispatch(deleteAllPracticeData()))}  />
                </HStack>
                <HStack flexMain={false} mVH={{v: 5}} pVH={{h: 2}} style={{backgroundColor : secondaryBackground!}} >
                    <HStack p={4} justifyContent="flex-start">
                        <Text style={{color: primary}}>Delete All Saved Routines</Text>
                    </HStack>
                    <MiniTextButton titles="Delete" onPress={() => confirmDelete('saved routines', () => dispatch(deleteAllRoutines()))}  />
                </HStack>
                {__DEV__ ?
                  <HStack flexMain={false} mVH={{v: 5}} pVH={{h: 2}} style={{backgroundColor : secondaryBackground!}} >
                      <HStack p={4} justifyContent="flex-start">
                          <Text style={{color: primary}}>Graph Playground (dev)</Text>
                      </HStack>
                      <MiniTextButton titles="Open" onPress={() => navigation.navigate('GraphPlayground')}  />
                  </HStack> : null
                }
            </VStack>
        </Box>
      </Box>
    );
  };

export default Settings