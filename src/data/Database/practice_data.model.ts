import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export default class PracticeDataModel extends Model {
  static table = 'practice_data';

  @field('date') date: Date | undefined;

  @field('scale')    Scale: any;
  @field('octave')   Octave: any;
  @field('arpeggio') Arpeggio: any;
  @field('broken_chord') BrokenChord: any;
  @field('solid_chord')  SolidChord: any;
}