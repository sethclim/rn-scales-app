import { log } from "../utils/logger";
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

const THEME_TILES = [
    { mode: 'light', title: 'Nord', color: '#5E81AC', foreground: undefined },
    { mode: 'latte', title: 'Latte', color: '#8839ef', foreground: undefined },
    { mode: 'tokyo', title: 'Tokyo Nights', color: '#7aa2f7', foreground: undefined },
    { mode: 'rosepine', title: 'Rosé Pine', color: '#ebbcba', foreground: '#191724' },
    { mode: 'mocha', title: 'Mocha', color: '#cba6f7', foreground: '#1e1e2e' },
]

const Settings  = () => {

    const { requestTheme, background, primary, secondaryBackground, mode, text, danger} = useContext(ThemeContext);
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const dispatch = useAppDispatch();

    const textColor = text
    const dangerColor = danger
    const dividerColor = text + '33'

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
          log.warn(e)
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
                <Text style={{fontSize: 20, color: primary, marginBottom: 10}}>Theme</Text>
                {/* Three tiles per row; the negative margin cancels the outer cell padding */}
                <View style={{alignSelf: 'stretch', flexDirection: 'row', flexWrap: 'wrap', margin: -6}}>
                    {THEME_TILES.map(tile => (
                        <View key={tile.mode} style={{width: '33.333%', padding: 6}}>
                            <ThemeTile
                                title={tile.title}
                                color={tile.color}
                                foreground={tile.foreground}
                                selected={mode == tile.mode}
                                onPress={() => changeTheme(tile.mode)} />
                        </View>
                    ))}
                </View>
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

type ThemeTileProps = {
    title: string
    color: string
    foreground?: string
    selected: boolean
    onPress: () => void
}

// Theme swatch: name at the top, radio dot at the bottom showing the active theme
const ThemeTile = ({ title, color, foreground = 'white', selected, onPress }: ThemeTileProps) => (
    <Pressable
        onPress={onPress}
        accessibilityRole="radio"
        accessibilityState={{ selected }}
        accessibilityLabel={`${title} theme`}
        style={({ pressed }) => ({
            height: 100,
            padding: 12,
            borderRadius: 10,
            backgroundColor: color,
            justifyContent: 'space-between',
            opacity: pressed ? 0.8 : 1,
        })}>
        <Text style={{color: foreground, fontSize: 15, fontWeight: '600'}}>{title}</Text>
        <View style={{
            width: 18,
            height: 18,
            borderRadius: 9,
            borderWidth: 2,
            borderColor: foreground,
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            {selected ? <View style={{width: 8, height: 8, borderRadius: 4, backgroundColor: foreground}} /> : null}
        </View>
    </Pressable>
)

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