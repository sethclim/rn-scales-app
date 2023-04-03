import {Model} from '@nozbe/watermelondb';
import {field, children, action, reader} from '@nozbe/watermelondb/decorators';
import { Associations } from '@nozbe/watermelondb/Model';
import RoutineItemModel from './routine_item.model';

export default class RoutineModel extends Model {
  static table = 'routines';

  static associations : Associations = {
    routine_items: { type: 'has_many', foreignKey: 'routine_id' },
  }

  @field('title') title: any;
  @field('createdAt') createdAt: any;

  @children('routine_items')
  routineItems: RoutineItemModel[] = [];

  @action async addRoutineItem(body : RoutineItemModel) {
    return this.collections.get<RoutineItemModel>('routineitems').create((item) => {
      item.routine.set(this);
      item.item = body;
    });
  }
}
