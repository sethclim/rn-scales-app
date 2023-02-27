import React from 'react';

import {Box, Text, Button, ScrollView} from 'native-base';

import withObservables from '@nozbe/with-observables';
import {database} from '../data/database';
const rows = ['One', 'Two', 'Three'];

const SavedRoutines = ({routines}) => {
  return (
    <Box flex={1} padding={5} bg="nord.background">
      <ScrollView w={['100%']} h="80">
        {routines.map(() => {
          return <Row />;
        })}
      </ScrollView>
    </Box>
  );
};

const Row = () => {
  return (
    <Box w="100%" h={50} bg="nord.primary.1">
      <Text>HELLLLLLO</Text>
      <Button>Start</Button>
    </Box>
  );
};

const data = database.collections.get('Routine');

const observabeRoutine = () => data?.query().observe();

const enhanceWithRoutines = withObservables([], () => ({
  routines: observabeRoutine(),
}));


export default enhanceWithRoutines(SavedRoutines);

