import {appSchema, tableSchema} from '@nozbe/watermelondb';

export const AppSchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'Routine',
      columns: [
        {name: 'title', type: 'string'},
      ],
    }),
  ],
});
