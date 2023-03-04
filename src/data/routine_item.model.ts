import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';
import { relation } from '@nozbe/watermelondb/decorators'
import { Associations } from '@nozbe/watermelondb/Model';
import Routine from './routine.model';

export default class RoutineItem extends Model {
    static table = 'routine_items';

    @field('item') item: any;
  
    @relation('routines', 'routineid')
    routine : Routine | any;
  }