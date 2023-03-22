import React, { useContext, useEffect } from 'react';

import { Box } from 'native-base';

import withObservables from '@nozbe/with-observables';
import {database} from '../../data/database';
import Routine from '../../data/routine.model';
import { IRoutines } from '../../data/types';
import { SavedRoutinesProps } from './types';
import { EnhancedSavedRoutineRow } from './SavedRoutineRow';
import { SwipeListView } from 'react-native-swipe-list-view';

import { StyleSheet } from 'react-native';

import  SavedRoutineHiddenItem  from './SavedRoutineHiddenItem';
import { Collection } from '@nozbe/watermelondb';

const SavedRoutines  = ({routines} : SavedRoutinesProps) => {

  function compareDatesFn(a : Routine, b : Routine) {
    if (Date.parse(a.createdAt) > Date.parse(b.createdAt) ) {
      return 1;
    }
    return -1;
  }

  const closeRow = (rowMap : any, rowKey : any) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  return (
    <Box flex={1} padding={5}>
      <SwipeListView<Routine> 
        data={routines} 
        renderItem={ (data, rowMap) => (
          <EnhancedSavedRoutineRow routine={data.item} routineItems={data.item.routineItems}  rowKey={rowMap}/>
        )} 
        renderHiddenItem={ (data, rowMap) => (
          <SavedRoutineHiddenItem routine={data.item} routineItems={data.item.routineItems} index={0} />
        )} 
        rightOpenValue={-55} 
        previewRowKey={'0'} 
        previewOpenValue={-40} 
        previewOpenDelay={3000}  
        swipeRowStyle={styles.roundButton} 
        disableRightSwipe={true}
        keyExtractor={(item, index) => item.id}
        recalculateHiddenLayout={true}
        />
    </Box>
  );
};

const styles = StyleSheet.create({
  roundButton: {
    backgroundColor: '#77777733',
  },
});

const data : Collection<Routine> = database.collections.get('routines');

const observabeRoutine = () => data?.query().observe();

const enhanceWithRoutines = withObservables<IRoutines, any>([], () => ({
  routines: observabeRoutine(),
}));

export default enhanceWithRoutines(SavedRoutines);
