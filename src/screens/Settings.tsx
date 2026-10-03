import React, { useContext } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Box, } from "../native_blocks/primatives/Box";
import { VStack, HStack, Button } from "../native_blocks/";
import { TextButton } from "../components/TextButton";
import { ThemeContext } from "../context/ThemeContext";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
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

    const textColor = mode == 'light' ? '#2E3440' : '#c0caf5'
    const dangerColor = mode == 'light' ? '#BF616A' : '#f7768e'
    const dividerColor = mode == 'light' ? '#2E344033' : '#c0caf533'

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
        <Box mAll={{t : 20}} pVH={{v : 10}} justifyContent="flex-start">
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
                <Text style={{fontSize: 20, color: primary, marginTop: 32, marginBottom: 10}}>Your Data</Text>
                <View style={{alignSelf: 'stretch', backgroundColor: secondaryBackground!, borderRadius: 10, overflow: 'hidden'}}>
                    <SettingsRow
                        label="Delete all practice data"
                        action="Delete"
                        color={dangerColor}
                        textColor={textColor}
                        onPress={() => confirmDelete('practice data', () => dispatch(deleteAllPracticeData()))} />
                    <View style={{height: StyleSheet.hairlineWidth, backgroundColor: dividerColor, marginLeft: 16}} />
                    <SettingsRow
                        label="Delete all saved routines"
                        action="Delete"
                        color={dangerColor}
                        textColor={textColor}
                        onPress={() => confirmDelete('saved routines', () => dispatch(deleteAllRoutines()))} />
                    {__DEV__ ?
                      <>
                        <View style={{height: StyleSheet.hairlineWidth, backgroundColor: dividerColor, marginLeft: 16}} />
                        <SettingsRow
                            label="Graph Playground (dev)"
                            action="Open"
                            color={primary}
                            textColor={textColor}
                            onPress={() => navigation.navigate('GraphPlayground')} />
                      </> : null
                    }
                </View>
            </VStack>
        </Box>
      </Box>
    );
  };

type SettingsRowProps = {
    label: string
    action: string
    color: string
    textColor: string
    onPress: () => void
}

// One row in a grouped settings list: label on the left, text action on the right
const SettingsRow = ({ label, action, color, textColor, onPress }: SettingsRowProps) => (
    <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={label}
        style={({ pressed }) => ({
            height: ROW_HEIGHT,
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            opacity: pressed ? 0.6 : 1,
        })}>
        <Text style={{color: textColor, fontSize: 16}}>{label}</Text>
        <Text style={{color, fontSize: 16, fontWeight: '600'}}>{action}</Text>
    </Pressable>
)

export default Settings