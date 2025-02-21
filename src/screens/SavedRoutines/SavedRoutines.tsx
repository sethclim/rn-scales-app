import React, { useContext }  from 'react';

import { Box } from "../../native_blocks/primatives/Box";

// import withObservables from '@nozbe/with-observables';
import {Routine} from '../../data/Models/DataModels';
import { SavedRoutinesProps } from './types';
import { SavedRoutineRow } from './SavedRoutineRow';
import { SwipeListView } from 'react-native-swipe-list-view';

import { StyleSheet, Text } from 'react-native'

import  SavedRoutineHiddenItem  from './SavedRoutineHiddenItem';
import Context from '../../state/modules/routine/context';
import { requestAllRoutines } from '../../state/modules/routine/store/actions';
import { useFocusEffect } from '@react-navigation/native';
import { ThemeContext } from '../../context/ThemeContext';

const SavedRoutines  = () => {

  // const [routines, setRoutines] = useState<Routine[]>()
  const { myDispatch, state } = useContext(Context);

  const { primary, background, mode } = useContext(ThemeContext);

  const DoSideEffect = () => {
    myDispatch(requestAllRoutines())
  }

  useFocusEffect(
    React.useCallback(() => {
        DoSideEffect();
    }, [])
  )

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
    <Box p={30} style={{backgroundColor: background!}}>
      <SwipeListView<Routine> 
        data={state.routines} 
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
          <Box   justifyContent="center" align="center" height={500}>
            <Text>No Saved Routines</Text>
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
