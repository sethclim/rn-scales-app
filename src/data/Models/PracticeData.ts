interface Dictionary<T> {
    [Key: string]: T;
}

export default class PracticeData
{
    Counts : Dictionary<number> = {}
    Total : number = 0

    PracticeData()
    {
        this.Counts['Scales'] = 0;
        this.Counts['Octaves'] = 0;
    }
}