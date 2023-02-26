import React, { useContext } from "react"

import { Box, HStack, VStack, Text, Checkbox, Button, AlertDialog, ScrollView } from 'native-base';

import withObservables from '@nozbe/with-observables';
const rows = ["One", "Two", "Three","One", "Two", "Three","One", "Two", "Three","One", "Two", "Three","One", "Two", "Three","One", "Two", "Three","One", "Two", "Three",]

import { database } from '../data/database';

const SavedRoutines = () => {

    return (
        <Box flex={1} padding={5} bg="nord.background">
            <ScrollView w={["100%"]} h="80">
            {
                rows.map( row =>{
                    return (
                        <Row />
                    )
                })
            }
            </ScrollView>
        </Box>
    )
}

const Row = () => {

    return(
        <Box w="100%" h={50} bg="nord.primary.1">
            <Text>HELLLLLLO</Text>
            <Button>Start</Button>
        </Box>
    )
}

const enhance = withObservables(['search'], ({ database, search }) => ({
    blogs: database.collections
      .get('blogs')
      .query(Q.where('name', Q.like(`%${Q.sanitizeLikeString(search)}%`))),
  }));

export default enhance(SavedRoutines);
11