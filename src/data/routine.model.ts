import {Model} from '@nozbe/watermelondb';
import {field, readonly, date} from '@nozbe/watermelondb/decorators';

export default class Routine extends Model {
  static table = 'weights';

  @field('note') note: any;
  @field('weight') weight: any;
  @readonly @date('created_at') createdAt: any;
}