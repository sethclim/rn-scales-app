import {Database} from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import Routine from './routine.model';
import RoutineItem from './routine_item.model';
import {AppSchema as schema} from './schema';

const adapter = new SQLiteAdapter({
  schema,
});

export const database = new Database({
  adapter,
  modelClasses: [Routine, RoutineItem],
});
