import React from "react"

import { Text, Box, Button, Center } from "native-base"
import { StyleSheet, TouchableOpacity } from "react-native";

const PracticeRoutine = () =>{

    return(
        <Box flex={1} padding={5} bg="nord.background">
            <Center flex={1}>
                <Text fontSize={50} color="nord.primary.1">C min Oct</Text>
                <TouchableOpacity
                    //onPress={buttonClickedHandler}
                    style={styles.roundButton}>
                    <Text fontSize={50}>Next</Text>
                </TouchableOpacity>
            </Center>
        </Box>
    )
}

const styles = StyleSheet.create({
    roundButton: {
      marginTop: 20,
      width: 150,
      height: 150,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
      borderRadius: 100,
      backgroundColor: '#5E81AC',
    },
  });
  

export default PracticeRoutine;
