import { ExerciseType } from "./ExerciseType";


export default class PracticeData
{
    Counts : Map<ExerciseType, number> = new Map()
    Total : number = 0
    Date : number = 0
}