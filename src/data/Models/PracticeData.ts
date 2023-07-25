import { ExerciseType } from "./ExerciseType";


export default class PracticeData
{
    Counts : Map<ExerciseType, number> = new Map()
    Total : number = 0
    Date : Date;

    constructor(Date: Date) {
        this.Date = Date;
        this.Counts.set("scale", 0);
        this.Counts.set("octave", 0);
        this.Counts.set("arpeggio", 0);
        this.Counts.set("solid-chord", 0);
        this.Counts.set("solid-chord", 0);
    }
}