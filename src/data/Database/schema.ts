import {appSchema, tableSchema} from '@nozbe/watermelondb';

export const AppSchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'routines',
      columns: [
        {name: 'title',     type: 'string'},
        {name: 'createdAt', type: 'string'},
      ],
    }),
    tableSchema({
      name: 'routine_items',
      columns: [
        {name: 'item',       type: 'string'},
        {name: 'routine_id', type: 'string'},
      ],
    }),
    tableSchema({
      name: 'practice_data',
      columns: [
        {name: 'date',         type: 'number'},
        {name: 'scale',        type: 'number'},
        {name: 'octave',       type: 'number'},
        {name: 'arpeggio',     type: 'number'},
        {name: 'broken_chord', type: 'number'},
        {name: 'solid_chord',  type: 'number'},
      ],
    }),
  ],
});
