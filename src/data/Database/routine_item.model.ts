// import { Model } from '@nozbe/watermelondb';
// import { field } from '@nozbe/watermelondb/decorators';
// import { relation } from '@nozbe/watermelondb/decorators'
// import { Associations } from '@nozbe/watermelondb/Model';

// import RoutineModel from './routine.model';

// export default class RoutineItemModel extends Model {
//   static table = 'routine_items';

//   static associations : Associations = {
//     routine_items: { type: 'belongs_to', key: 'routine_id' },
//   }

//   @field('item') item: any;
//   @field('type') type: any;

//   @relation('routines', 'routine_id')
//   routine : RoutineModel | any;
// }
