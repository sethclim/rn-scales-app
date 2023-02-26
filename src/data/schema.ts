import {appSchema, tableSchema} from '@nozbe/watermelondb';

export const AppSchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'Routine',
      columns: [
        {name: 'title', type: 'string'},
        {name: 'body', type: 'string'},
        {name: 'blog_id', type: 'string', isIndexed: true},
        {name: 'is_nasty', type: 'boolean'},
      ],
    }),
  ],
});
