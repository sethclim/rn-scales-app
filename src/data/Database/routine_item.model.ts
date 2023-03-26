import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';
import { relation } from '@nozbe/watermelondb/decorators'
import { Associations } from '@nozbe/watermelondb/Model';

import Routine from './routine.model';

export default class RoutineItem extends Model {
  static table = 'routine_items';

  static associations : Associations = {
    routine_items: { type: 'belongs_to', key: 'routine_id' },
  }

  @field('item') item: any;

  @relation('routines', 'routine_id')
  routine : Routine | any;
}