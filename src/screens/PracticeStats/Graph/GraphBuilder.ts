import { SkPath, Skia } from "@shopify/react-native-skia"

import PracticeData from "../../../data/Models/PracticeData"
import { ExerciseType } from "../../../data/Models/ExerciseType"
import { Label } from "../PracticeGraph/Components/Label";

class RenderPathDescriptor{
    path : SkPath;
    dots : SkPath;
    color : string;

    constructor(color : string = "#ff0000"){
        this.path = Skia.Path.Make(),
        this.dots = Skia.Path.Make(),
        this.color = color
    }
}

export type Graph = {
    ID : number,
    pathDescriptors: RenderPathDescriptor []
    grid: SkPath[],
    label: string
}

const getMax = (data : PracticeData[]) => {
    let max_x = 0;
    let max_y = 0;
  
    data.map(practiceData =>{
        practiceData.Counts.forEach(count => {
            if(count  > max_y)
              max_y = count;
        })

        if(practiceData.Date  > max_x)
          max_x = practiceData.Date;
    })
  
    return[max_x, max_y]
}

const getX = (date : number, scale_X : number) => {
    return date * scale_X;
}
  
const getY = (count : number, scale_y : number, height : number) => {
    return height - (count * scale_y)
}

const buildGraph = (data : PracticeData[], WIDTH : number, HEIGHT : number, max_x: number, max_y: number) => {

    const pathDescriptorMap = new Map<ExerciseType, RenderPathDescriptor>([
        ["scale",        new RenderPathDescriptor("#ed174f")],
        ["octave",       new RenderPathDescriptor("#f4dc00")],
        ["arpeggio",     new RenderPathDescriptor("#327fa6")],
        ["solid-chord",  new RenderPathDescriptor("#e20177")],
        ["broken-chord", new RenderPathDescriptor("#f8981d")],
    ]);

    const scale_X = WIDTH / max_x;
    const scale_y = HEIGHT / max_y;

    if(data.length <= 0)
    {
        return [];
    }

    //Move To
    for(let [exercise, count] of data[0].Counts.entries())
    {
        const ex = pathDescriptorMap.get(exercise);
        const x = getX(data[0].Date, scale_X)
        const y = getY(count, scale_y, HEIGHT)
        
        ex!.path?.moveTo(x, y);
        ex!.dots?.addCircle(x, y, 6);
    }

    //Line To
    for(let i = 1; i < data.length; i++)
    {   
      for(let [exercise, count] of data[i].Counts.entries())
      {
        const ex = pathDescriptorMap.get(exercise);
        const x = getX(data[i].Date, scale_X)
        const y = getY(count, scale_y, HEIGHT)

        ex!.path?.lineTo(x,y);
        ex!.dots?.addCircle(x, y, 6)
      }
    }

    return Array.from(pathDescriptorMap.values());
}

const buildGrid = (width: number, height: number, max_x: number, max_y: number) => {
    //top to bottow div by 7 space

    //const divX = 7
    const scale_x = width / (max_x - 1)

    const gridLines : SkPath[] = []
    
    for(let i = 1; i < max_x - 1; i++)
    {
        const path = Skia.Path.Make();
        path.moveTo(i * scale_x, 0)
        path.lineTo(i * scale_x, height)
        gridLines.push(path);
    }

    //const div_y = 5
    const scale_y = height / max_y


    for(let i = 1; i < max_y; i++)
    {
        const path = Skia.Path.Make();
        path.moveTo(0, i * scale_y)
        path.lineTo(width, i * scale_y)
        gridLines.push(path);
    }

    return gridLines;
}

export const getGraph = (width: number, height: number, data : PracticeData[]) : Graph[] => {

    const [max_x, max_y] = getMax(data);

    return [
        {
            ID: 0,
            pathDescriptors : buildGraph(data, width, height, 6, max_y),
            grid: buildGrid(width, height, 24, max_y),
            label: "Day"
        },
        {
            ID: 1,
            pathDescriptors : buildGraph(data, width, height, 7, max_y),
            grid: buildGrid(width, height, 7, max_y),
            label: "Week"
        },
        {
            ID: 2,
            pathDescriptors : buildGraph(data, width, height, 31, max_y),
            grid: buildGrid(width, height, 31, max_y),
            label: "Month"
        },
        {
            ID: 3,
            pathDescriptors : buildGraph(data, width, height, 12, max_y),
            grid: buildGrid(width, height, 12, max_y),
            label: "Year"
        },
    ]
}
