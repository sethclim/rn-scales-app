import { Box, Text, Column, Row, VStack } from "native-base"
import React, { useEffect } from 'react';
import PracticeGraph from "./PracticeGraph/PracticeGraph";

const weeks = [0,1,2,3]
const days  = [0,1,2,3,4,5,6]

const PracticeStats = () => {

    useEffect(()=>{
        console.log("started")
    },[])

    return(
        <VStack flex={1} padding={5} alignItems="center"  bg="nord.primary.1">
                <VStack alignItems="center">
                    <Text color="nord.primary.1" mt={-3} fontSize={20}>Monthly Practice</Text>
                    <Column>
                        {
                            weeks.map((week, i)=>{ return(
                                <Row key={i}>
                                    {
                                        days.map((day, i)=>{ return(
                                            <Box margin={1} height={10} width={10} bg="nord.secondaryBackground"></Box>
                                        )})
                                    }
                                </Row>
                            )})
                        }
                    </Column>
                </VStack>
      
                <PracticeGraph></PracticeGraph>
       
        </VStack>
    )
}

export default PracticeStats;