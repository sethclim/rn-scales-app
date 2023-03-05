import React from 'react';

import {Box, ScrollView} from 'native-base';

import withObservables from '@nozbe/with-observables';
import {database} from '../../data/database';
import Routine, { IRoutines } from '../../data/routine.model';
import { SavedRoutinesProps } from './types';
import { EnhancedSavedRoutineRow } from './SavedRoutineRow';


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
          return <EnhancedSavedRoutineRow key={key} routine={routine} index={key} />;
        })}
      </ScrollView>
    </Box>
  );
};

const data = database.collections.get('routines');

const observabeRoutine = () => data?.query().observe();

const enhanceWithRoutines = withObservables<IRoutines, any>([], () => ({
  routines: observabeRoutine(),
}));

export default enhanceWithRoutines(SavedRoutines);
