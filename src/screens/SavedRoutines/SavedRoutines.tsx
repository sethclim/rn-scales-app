import React, { useEffect, useState }  from 'react';

import { Box, Text } from 'native-base';

// import withObservables from '@nozbe/with-observables';
import {Routine} from '../../data/Models/DataModels';
import { SavedRoutinesProps } from './types';
import { SavedRoutineRow } from './SavedRoutineRow';
import { SwipeListView } from 'react-native-swipe-list-view';

import { StyleSheet } from 'react-native'

import  SavedRoutineHiddenItem  from './SavedRoutineHiddenItem';

const SavedRoutines  = () => {

  const [routines, setRoutines] = useState<Routine[]>()


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
    <Box flex={1} margin={30}  bg="#77777733">
      <SwipeListView<Routine> 
        data={routines} 
        renderItem={ (data, rowMap) => (
          <SavedRoutineRow routine={data.item} routineItems={data.item.RoutineItems} index={0}  />
        )} 
        renderHiddenItem={ (data, rowMap) => (
          <SavedRoutineHiddenItem routine={data.item} routineItems={data.item.RoutineItems} index={0} />
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


export default SavedRoutines;
