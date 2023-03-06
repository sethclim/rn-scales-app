import React from 'react';

import {Box, HStack, Pressable } from 'native-base';

import withObservables from '@nozbe/with-observables';
import {database} from '../../data/database';
import Routine from '../../data/routine.model';
import { IRoutines } from '../../data/types';
import { SavedRoutinesProps } from './types';
import { EnhancedSavedRoutineRow } from './SavedRoutineRow';
import { SwipeListView } from 'react-native-swipe-list-view';


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

  const deleteRow = (rowMap  : any, rowKey  : any) => {
    // closeRow(rowMap, rowKey);
    // const newData = [...listData];
    // const prevIndex = listData.findIndex(item => item.key === rowKey);
    // newData.splice(prevIndex, 1);
    // setListData(newData);
  };

  const renderHiddenItem = (data : any, rowMap  : any) => <HStack flex={1} pl={2}>
      <Pressable px={4} ml="auto" bg="dark.500" justifyContent="center" onPress={() => closeRow(rowMap, data.item.key)} _pressed={{
      opacity: 0.5
    }}>
        {/* <Icon as={<Ionicons name="close" />} color="white" /> */}
      </Pressable>
      <Pressable px={4} bg="red.500" justifyContent="center" onPress={() => deleteRow(rowMap, data.item.key)} _pressed={{
      opacity: 0.5
    }}>
        {/* <Icon as={<MaterialIcons name="delete" />} color="white" /> */}
      </Pressable>
    </HStack>;

    
  const onRowDidOpen = ({rowKey} : any) => {
    console.log('This row opened', rowKey);
  };

  return (
    <Box flex={1} padding={5} bg="nord.background">
      <SwipeListView 
        data={routines} 
        renderItem={ (data, rowMap) => (
          <EnhancedSavedRoutineRow routine={data.item}  rowKey={data.item.id}/>
        )} 
        renderHiddenItem={renderHiddenItem} 
        rightOpenValue={-130} 
        previewRowKey={'0'} 
        previewOpenValue={-40} 
        previewOpenDelay={3000} 
        onRowDidOpen={onRowDidOpen} 
        />

      {/* <ScrollView w={['100%']} h="80">
        {routines.sort(compareDatesFn).map((routine, key) => {
          return <EnhancedSavedRoutineRow key={key} routine={routine} index={key} />;
        })}
      </ScrollView> */}
    </Box>
  );
};

const data = database.collections.get('routines');

const observabeRoutine = () => data?.query().observe();

const enhanceWithRoutines = withObservables<IRoutines, any>([], () => ({
  routines: observabeRoutine(),
}));

export default enhanceWithRoutines(SavedRoutines);
