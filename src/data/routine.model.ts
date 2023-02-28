import {Model} from '@nozbe/watermelondb';
import {field, children, action} from '@nozbe/watermelondb/decorators';
import { Associations } from '@nozbe/watermelondb/Model';
import RoutineItem from './routine_item.model';

export default class Routine extends Model {
  static table = 'routines';

  static associations : Associations = {
    routineitems: { type: 'has_many', foreignKey: 'routine_id' },
  };

  @field('title') title: any;
  @field('createdAt') createdAt: any;

  @children('routineItems')
  routineItems: any;

  @action async addRoutineItem(body : RoutineItem) {
    return this.collections.get<RoutineItem>('routineitems').create((item) => {
      item.routine.set(this);
      item.item = body;
    });
  }
}
