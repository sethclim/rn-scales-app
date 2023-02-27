import {Model} from '@nozbe/watermelondb';
import {field, readonly, date} from '@nozbe/watermelondb/decorators';

export default class Routine extends Model {
  static table = 'Routine';

  @field('title') title: any;
}