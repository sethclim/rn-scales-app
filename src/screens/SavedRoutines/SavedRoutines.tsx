import React, { useContext } from 'react';

import {Box, HStack, Pressable, } from 'native-base';

import withObservables from '@nozbe/with-observables';
import {database} from '../../data/database';
import Routine from '../../data/routine.model';
import { IRoutines } from '../../data/types';
import { SavedRoutinesProps } from './types';
import { EnhancedSavedRoutineRow } from './SavedRoutineRow';
import { SwipeListView } from 'react-native-swipe-list-view';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { StyleSheet } from 'react-native';
import { IDeleteRoutine, IGenerateRequest } from '../../state/modules/routine/store/actions';
import { DELETE_ROUTINE } from '../../state/modules/routine/store/types';
import Context from '../../state/modules/routine/context';

const SavedRoutines  = ({routines} : SavedRoutinesProps) => {
  
  const { dispatch } = useContext(Context);

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

  const deleteRow = (routine  : any, rowKey  : any) => {
    const msg : IDeleteRoutine  = {
      type: DELETE_ROUTINE,
      payload: [routine]
    }
    dispatch(msg)
  };

  const RenderHiddenItem = (routine  : any, rowMap  : any) => {
    return(
      <HStack flex={1} pl={2} justifyContent="flex-end">
          <Pressable bg="nord.danger" 
                     px={4}justifyContent="center" 
                     onPress={() => deleteRow(rowMap, routine)} 
                     _pressed={{ opacity: 0.5 }}>
            <MaterialIcons name="delete" color="#fff" size={25} />
          </Pressable>
      </HStack>
    )
  }
  
  return (
    <Box flex={1} padding={5} >
      <SwipeListView 
        data={routines} 
        renderItem={ (data, rowMap) => (
          <EnhancedSavedRoutineRow routine={data.item}  rowKey={rowMap}/>
        )} 
        renderHiddenItem={ (data, rowMap) => (
          <HStack flex={1} pl={2} justifyContent="flex-end">
            <Pressable bg="nord.danger" 
                      px={4}justifyContent="center" 
                      onPress={() => deleteRow(data.item, data.item.id)} 
                      _pressed={{ opacity: 0.5 }}>
              <MaterialIcons name="delete" color="#fff" size={25} />
            </Pressable>
          </HStack>
        )} 
        rightOpenValue={-55} 
        previewRowKey={'0'} 
        previewOpenValue={-40} 
        previewOpenDelay={3000}  
        swipeRowStyle={styles.roundButton} 
        disableRightSwipe={true}
        keyExtractor={(item, index) => item.id}
        recalculateHiddenLayout={true}
        // onRowDidOpen={() => onRowDidOpen(data.item.id)} 
        />
    </Box>
  );
};

const styles = StyleSheet.create({
  roundButton: {
    backgroundColor: '#77777733',
  },
});


const data = database.collections.get('routines');

const observabeRoutine = () => data?.query().observe();

const enhanceWithRoutines = withObservables<IRoutines, any>([], () => ({
  routines: observabeRoutine(),
}));

export default enhanceWithRoutines(SavedRoutines);
