interface Dictionary<T> {
    [Key: string]: T;
}

export default class PracticeData
{
    Counts : Dictionary<number> = {}
    Total : number = 0

    PracticeData()
    {
        this.Counts['scale']       = 0;
        this.Counts['octave']      = 0;  
        this.Counts['arpeggio']     = 0;
        this.Counts['brokenChord'] = 0;
        this.Counts['solidChord']  = 0;
    }
}