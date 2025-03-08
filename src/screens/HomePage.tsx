import React, { useContext, useEffect, useState } from "react"
import { Text } from "react-native"
import { VStack, HStack, Button } from "../native_blocks"
import { ThemeContext } from "../context/ThemeContext";
import { Card } from "../components/Card";
import { BottomTabNavigatorParamList } from "../navigation/types";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { TextButton } from "../components/TextButton";
import { MiniTextButton } from "../components/MiniTextButton";

type GridPallet = {
    one: string,
    two: string,
    three: string,
    four: string,
    five: string,
    six: string
}
const gridPalletTokyo : GridPallet = {
    one: "#ff9e64",
    two: "#f7768e",
    three: "#2ac3de",
    four: "#bb9af7",
    five: "#b4f9f8",
    six: "#9ece6a"
}

type SquareHomeButtonProps = {
    onPress : () => void,
    text : string,
    color : string,
    size : number
}

const SquareHomeButton = (props : SquareHomeButtonProps) => {

    useEffect(()=>{
        console.log("props " + props.color)
    },[])

    return (
        <Button onPress={props.onPress}>
            <VStack flexMain={false} height={props.size} width={props.size} style={{backgroundColor : props.color}}>
                <Text style={{color : "white", fontWeight: "bold", fontSize: 20, textAlign: "center"}}>{props.text}</Text>
            </VStack>
        </Button>
    )
}

export const HomePage = () => {


const { primary, background, mode } = useContext(ThemeContext);
const navigation = useNavigation<BottomTabNavigationProp<BottomTabNavigatorParamList>>();

const [pallet, setGridPallet] = useState(gridPalletTokyo)

useEffect(()=>{
    console.log("pallet " + JSON.stringify(pallet))
},[])

 return (
    <VStack justifyContent="center" align="center" style={{backgroundColor: background!}} gap={20}>
        <HStack flexMain={false} justifyContent="center"  p={0} m={0} gap={20}>
            {/* <Card height={120} padding={4}  > */}
                {/* <Text style={{color: primary, fontSize: 20}}>Settings</Text>
                <HStack justifyContent="flex-end" p={20}>
                    <MiniTextButton titles="Settings" onPress={() => navigation.navigate("Settings")} />
                </HStack> */}

                <SquareHomeButton onPress={() => navigation.navigate("Generate")} text="Generate" color={pallet.one} size={110}/>
                <SquareHomeButton onPress={() => navigation.navigate("Generate")} text="Saved Routines" color={pallet.two} size={110}/>
                <SquareHomeButton onPress={() => navigation.navigate("Settings")} text="Stats" color={pallet.three} size={110}/>
            {/* </Card> */}
        </HStack>
        {/* <HStack flexMain={false} justifyContent="center"  p={0} m={0} gap={20}>
            <SquareHomeButton onPress={() => navigation.navigate("Generate")} text="Stats" color={pallet.four} size={110}/>
            <SquareHomeButton onPress={() => navigation.navigate("Settings")} text="Settings" color={pallet.five} size={110}/>
            <SquareHomeButton onPress={() => navigation.navigate("Settings")} text="Settings" color={pallet.six} size={110}/>
        </HStack> */}
    </VStack>
 )   
}