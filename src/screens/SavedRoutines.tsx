import React, { FunctionComponent } from 'react';

import {Box, Text, Button, ScrollView, HStack, Spacer} from 'native-base';

import withObservables from '@nozbe/with-observables';
import {database} from '../data/database';
import Routine, { IRoutines } from '../data/routine.model';

interface SavedRoutinesProps {
  routines: Routine[],  
}

interface RowProps {
  routine: Routine,
  index: number  
}

const SavedRoutines  = ({routines} : SavedRoutinesProps) => {

  function compareDatesFn(a : Routine, b : Routine) {
    if (Date.parse(a.createdAt) > Date.parse(b.createdAt) ) {
      return 1;
    }
    return -1;
  }


  return (
    <Box flex={1} padding={5} bg="nord.background">
      <ScrollView w={['100%']} h="80">
        {routines.sort(compareDatesFn).map((routine, key) => {
          return <Row routine={routine} index={key} />;
        })}
      </ScrollView>
    </Box>
  );
};


const Row :  FunctionComponent<RowProps>  = ({routine, index}) => {  

  const StartSavedRoutine = (routine : Routine) => {
    const items = routine.getRoutineItems();
    console.log("Items " +  JSON.stringify(items))
  }

  return (
    <Box w="100%" h={50} bg="nord.primary.1" padding={1}>
      <HStack space={3} justifyContent="flex-start" alignItems="center">
        <Text>{routine.title}</Text>
        <Spacer />
        <Button onPress={() => StartSavedRoutine(routine)}>Start</Button>
      </HStack>
    </Box>
  );
};

const data = database.collections.get('routines');

const observabeRoutine = () => data?.query().observe();

const enhanceWithRoutines = withObservables<IRoutines, any>([], () => ({
  routines: observabeRoutine(),
}));


export default enhanceWithRoutines(SavedRoutines);
