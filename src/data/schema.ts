import {appSchema, tableSchema} from '@nozbe/watermelondb';

export const AppSchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'routines',
      columns: [
        {name: 'title',    type: 'string'},
        {name: 'createdAt', type: 'string'},
      ],
    }),
    tableSchema({
      name: 'routine_items',
      columns: [
        {name: 'routineid', type: 'number'},
        {name: 'item',      type: 'string'},
      ],
    }),
  ],
});
