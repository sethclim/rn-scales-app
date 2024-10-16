import React, { useContext, useEffect } from 'react';

import { Box, Text } from 'native-base';

// import withObservables from '@nozbe/with-observables';
import {database} from '../../data/Database/database';
import RoutineModel from '../../data/Database/routine.model';
import { IRoutines } from '../../data/Database/types';
import { SavedRoutinesProps } from './types';
import { EnhancedSavedRoutineRow } from './SavedRoutineRow';
import { SwipeListView } from 'react-native-swipe-list-view';

import { StyleSheet } from 'react-native';

import  SavedRoutineHiddenItem  from './SavedRoutineHiddenItem';
import { Collection } from '@nozbe/watermelondb';
import { withObservables } from '@nozbe/watermelondb/react'

const SavedRoutines  = ({routines} : SavedRoutinesProps) => {

  function compareDatesFn(a : RoutineModel, b : RoutineModel) {
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
    <Box flex={1} margin={30}  bg="#77777733">
      <SwipeListView<RoutineModel> 
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
        ListEmptyComponent={() =>(
          <Box   justifyContent="center" alignItems="center" height="500">
            <Text color="#000">No Saved Routines</Text>
          </Box>
        )}
        />
    </Box>
  );
};

const styles = StyleSheet.create({
  roundButton: {
    backgroundColor: '#77777733',
  },
});

const data : Collection<RoutineModel> = database.collections.get('routines');

const observabeRoutine = () => data?.query().observe();

const enhanceWithRoutines = withObservables<IRoutines, any>([], () => ({
  routines: observabeRoutine(),
}));

export default enhanceWithRoutines(SavedRoutines);
