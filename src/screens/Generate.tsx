import { log } from "../utils/logger";
import React, { FunctionComponent, useContext, useEffect, useLayoutEffect, useState } from "react"

import { useNavigation } from "@react-navigation/native";
import { BottomTabNavigatorParamList } from "../navigation/types";
import { BottomTabNavigationProp, useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { VStack, HStack } from "../native_blocks/";
import { Modal, Alert, Text, Pressable, TextInput, ScrollView, StyleSheet, View } from "react-native";

import { TextButton } from "../components/TextButton";

import check from "../assets/CheckIcon"
import { CheckBox } from "../components/Checkbox";
import { ThemeContext } from "../context/ThemeContext";
import { Card } from "../components/Card";
import { useAppDispatch } from "../state/hooks";

import { generateRoutine, saveRoutines } from "../state/routineSlice";

import { getTodaysPracticedata } from "../state/practiceDataSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
    ACCIDENTAL_ROOTS,
    EXERCISE_GROUPS,
    EXERCISE_OPTIONS,
    NATURAL_ROOTS,
    SCALE_TYPES,
    TYPE_GROUPS,
    getSaveRoutineError,
    getSelectionError,
    getSelections,
} from "../data/routineOptions";

const Generate = () => {

    const navigation = useNavigation<BottomTabNavigationProp<BottomTabNavigatorParamList>>();

    const [showModal, setShowModal] = useState(false);

    const { background, primary, onPrimary, text, requestTheme } = useContext(ThemeContext);

    const dispatch = useAppDispatch()

    const tabBarHeight = useBottomTabBarHeight()

    const readTheme = async () => {
        try {
            const mode = await AsyncStorage.getItem('theme');

            if(mode != null)
            {
                requestTheme(mode)
            }
        } catch (e) {
            log.warn(e)
        }
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: ({ tintColor }) => (
                <Pressable
                    onPress={() => setShowModal(true)}
                    hitSlop={10}
                    style={{ marginRight: 16 }}
                    accessibilityRole="button"
                    accessibilityLabel="Save routine">
                    <Text style={{ color: tintColor, fontSize: 16, fontWeight: "600" }}>Save</Text>
                </Pressable>
            ),
        })
    }, [navigation])

    useEffect(() => {
        dispatch(getTodaysPracticedata())
        readTheme()
    }, [])

    const StartRoutine = () => {
        const { roots, types, exercises } = getSelections(manageRoots, manageTypes, manageExercise)
        const error = getSelectionError({ roots, types, exercises })

        if (error == null)
        {    
            dispatch(generateRoutine([roots, types, exercises]))
            navigation.navigate('Practice')
        }
        else
            showAlert(error)
    }

    const SaveRoutine = (saveName : string) => {
        const selections = getSelections(manageRoots, manageTypes, manageExercise)
        const error = getSaveRoutineError(saveName, selections)

        if (error != null) {
            showAlert(error)
            return
        }

        const { roots, types, exercises } = selections
        dispatch(saveRoutines([saveName.trim(), roots, types, exercises]))
        setShowModal(false);
    }

    const [isOpen, setIsOpen] = React.useState(false); 

    const onClose = () => setIsOpen(false);
  
    const cancelRef = React.useRef(null);

    const [manageRoots, setManageRoots] = useState([true, true, true, true, true, true, true, false, false, false, false, false])
    const [manageTypes, setManageTypes] = useState(() => SCALE_TYPES.map(() => false))
    const [manageExercise, setManageExercise] = useState(() => EXERCISE_OPTIONS.map(() => false))

    const onClickNaturalRoot = (index : number, root : string) => {
        let temp = [...manageRoots];
        temp[index] = !temp[index]
        setManageRoots(temp)
    }

    const onClickSelectType = (index : number) => {
        let temp = [...manageTypes];
        temp[index] = !temp[index]
        setManageTypes(temp)
    }

    const onClickSelectExercise = (index : number) => {
        let temp = [...manageExercise];
        temp[index] = !temp[index]
        setManageExercise(temp)
    }

    const showAlert = (message : string) =>
        Alert.alert(
          'Invalid Routine Configuration',
          message,
          [
            {
              text: 'Ok',
            //   onPress: () => Alert.alert('Cancel Pressed'),
              style: 'cancel',
            },
          ],
          {
            cancelable: true,
            onDismiss: () =>
              Alert.alert(
                'This alert was dismissed by tapping outside of the alert dialog.',
              ),
          },
        );

    return (
        <View style={{ flex: 1, backgroundColor: background! }}>

            {/* The tab bar floats over the screen, so pad the end to scroll Start clear of it */}
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: 10, paddingBottom: tabBarHeight + 10 }}>
            <VStack flexMain={false} align="center" justifyContent="center" >
                <Card padding={10}>
                    <Text style={{color : primary, fontSize: 18, fontWeight: "700", marginBottom: 4}}>Roots</Text>
                        <VStack gap={6} pVH={{v: 4}} >
                            <HStack colGap={4}>
                            {
                                NATURAL_ROOTS.map( (naturalRoot, i) => { return (
                                    <CheckBox 
                                        iconColor={onPrimary} 
                                        iconSize={20} 
                                        checked={manageRoots[i]} 
                                        checkMark={check} 
                                        key={i} 
                                        onPress={() => onClickNaturalRoot(i, naturalRoot)} 
                                        title={naturalRoot} />
                                )})
                            }
                            </HStack>
                            <HStack colGap={4}>
                            {
                                ACCIDENTAL_ROOTS.map( (accidentalRoot, i) => { return (
                                    <CheckBox 
                                        iconColor={onPrimary} 
                                        iconSize={20} 
                                        checked={manageRoots[i + 7]} 
                                        checkMark={check} 
                                        key={i} 
                                        onPress={() => onClickNaturalRoot(i + 7, accidentalRoot)} 
                                        title={accidentalRoot} />
                                )})
                            }
                            </HStack>
                        </VStack>
                </Card>
                
                {/* borderRadius="5" rounded="md"  maxWidth="100%" shadow={9} */}
                <Card padding={10}>
                    <Text style={{color : primary, fontSize: 18, fontWeight: "700", marginBottom: 4}}>Type</Text>
                    {
                        TYPE_GROUPS.map(group => (
                            <VStack key={group.title} flexMain={false} align="stretch" pVH={{v: 4}}>
                                <Text style={{color : text, fontSize: 13, fontWeight: "600", opacity: 0.7, textAlign: "left", paddingBottom: 2, marginBottom: 6, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: text + "66"}}>{group.title}</Text>
                                <HStack flexMain={false} colGap={14} rowGap={8} flexWrap="wrap" justifyContent="flex-start">
                                {
                                    group.types.map(scaleType => {
                                        const i = SCALE_TYPES.indexOf(scaleType)
                                        return (
                                            <CheckBox 
                                                checkMark={check} 
                                                iconSize={20} 
                                                iconColor={onPrimary} 
                                                key={scaleType} 
                                                onPress={() => onClickSelectType(i)} 
                                                checked={manageTypes[i]} 
                                                title={scaleType} />
                                        )
                                    })
                                }
                                </HStack>
                            </VStack>
                        ))
                    }
                </Card>

                <Card padding={10}>
                    <Text style={{color : primary, fontSize: 18, fontWeight: "700", marginBottom: 4}}>Exercise</Text>
                    {
                        EXERCISE_GROUPS.map(group => (
                            <VStack key={group.title} flexMain={false} align="stretch" pVH={{v: 4}}>
                                <Text style={{color : text, fontSize: 13, fontWeight: "600", opacity: 0.7, textAlign: "left", paddingBottom: 2, marginBottom: 6, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: text + "66"}}>{group.title}</Text>
                                <HStack flexMain={false} colGap={14} rowGap={8} flexWrap="wrap" justifyContent="flex-start">
                                {
                                    group.exercises.map(exercise => {
                                        const i = EXERCISE_OPTIONS.indexOf(exercise)
                                        return (
                                            <CheckBox 
                                                key={exercise.id} 
                                                iconColor={onPrimary} 
                                                checkMark={check} 
                                                iconSize={20} 
                                                onPress={() => onClickSelectExercise(i)}  
                                                checked={manageExercise[i]}   
                                                title={exercise.label} />
                                        )
                                    })
                                }
                                </HStack>
                            </VStack>
                        ))
                    }
                </Card>

            </VStack>

            <View style={{ paddingTop: 10, paddingHorizontal: 20 }}>
                <TextButton titles="Start" onPress={() => StartRoutine()} />
            </View>
            </ScrollView>

            {/* <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
                <AlertDialog.Content>
                    <AlertDialog.CloseButton />
                    <AlertDialog.Header>Invalid Routine Configuration</AlertDialog.Header>
                    <AlertDialog.Body>
                        Please Select at least one option from each section!
                    </AlertDialog.Body>
                </AlertDialog.Content>
            </AlertDialog> */}

            <SaveModal showModal={showModal} setShowModal={setShowModal} save={SaveRoutine} />

        </View>
    )
}

interface SaveModalProps {
    showModal: any,
    setShowModal: any,
    save : any  
}

const SaveModal : FunctionComponent<SaveModalProps> = ({showModal, setShowModal, save}) => {

    const [value, setValue] = React.useState("");
    const { background, primary, secondaryBackground, text } = useContext(ThemeContext);

    const textColor = text

    // Start with an empty name each time the dialog opens
    useEffect(() => {
        if (showModal) setValue("")
    }, [showModal])

    return(
        <Modal
            animationType="fade"
            transparent={true} 
            visible={showModal} 
            onRequestClose={() => setShowModal(false)}>
                <Pressable
                    onPress={() => setShowModal(false)}
                    style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    {/* Inner Pressable swallows taps so only the backdrop closes the dialog */}
                    <Pressable onPress={() => {}} style={{
                        width: '85%',
                        backgroundColor: background!,
                        borderRadius: 12,
                        padding: 20,
                        gap: 16,
                        elevation: 8,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.25,
                        shadowRadius: 8,
                    }}>
                        <Text style={{color: textColor, fontSize: 18, fontWeight: "700"}}>Save routine</Text>

                        <TextInput
                            value={value}
                            onChangeText={setValue}
                            placeholder="Routine name"
                            placeholderTextColor={text + '99'}
                            autoFocus
                            returnKeyType="done"
                            onSubmitEditing={() => save(value)}
                            style={{
                                color: textColor,
                                backgroundColor: secondaryBackground!,
                                borderRadius: 8,
                                paddingHorizontal: 12,
                                paddingVertical: 10,
                                fontSize: 16,
                            }}
                        />

                        <HStack flexMain={false} justifyContent="flex-end" gap={8}>
                            <Pressable onPress={() => setShowModal(false)} hitSlop={6} style={{paddingVertical: 8, paddingHorizontal: 14}}>
                                <Text style={{color: primary, fontSize: 16, fontWeight: "600"}}>Cancel</Text>
                            </Pressable>
                            <Pressable onPress={() => save(value)} style={{backgroundColor: primary, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 18}}>
                                <Text style={{color: background!, fontSize: 16, fontWeight: "600"}}>Save</Text>
                            </Pressable>
                        </HStack>
                    </Pressable>
                </Pressable>
        </Modal>
    )
}

export default Generate;
