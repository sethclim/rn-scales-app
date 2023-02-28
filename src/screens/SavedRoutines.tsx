import React, { FunctionComponent } from 'react';

import {Box, Text, Button, ScrollView} from 'native-base';

import withObservables from '@nozbe/with-observables';
import {database} from '../data/database';
import Routine from '../data/routine.model';
const rows = ['One', 'Two', 'Three'];

const SavedRoutines = ({routines}) => {
  return (
    <Box flex={1} padding={5} bg="nord.background">
      <ScrollView w={['100%']} h="80">
        {routines.map((routine : Routine) => {
          return <Row routine={routine} />;
        })}
      </ScrollView>
    </Box>
  );
};

interface RowProps {
  routine: Routine,  
}

const Row :  FunctionComponent<RowProps>  = ({routine}) => {  
  return (
    <Box w="100%" h={50} bg="nord.primary.1">
      <Text>{routine.title}</Text>
      <Button>Start</Button>
    </Box>
  );
};

const data = database.collections.get('routines');

const observabeRoutine = () => data?.query().observe();

const enhanceWithRoutines = withObservables([], () => ({
  routines: observabeRoutine(),
}));


export default enhanceWithRoutines(SavedRoutines);

