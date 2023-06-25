import { SkPath, Skia } from "@shopify/react-native-skia"

import PracticeData from "../../../data/Models/PracticeData"

export type plot = {
    line: SkPath
    dots: SkPath
}

export type exercises = {
    "scale" : plot,
    "octave" : plot,
    "arpeggio" : plot,
    "solid-chord" : plot,
    "broken-chord" : plot
}

export type Graph = {
    ID : number,
    exercises: exercises,
    grid: SkPath,
    label: string
}

const getMaxY = (data : PracticeData[]) => {
    
    if(data.length <= 0)
    return 10
    
    let max_y = 0;
    data.map(practiceData =>{
        practiceData.Counts.forEach(count => {
            if(count  > max_y)
              max_y = count;
        })
    })
  
    return max_y
}

const getX = (date : number, scale_X : number) => {
    return date * scale_X;
}
  
const getY = (count : number, scale_y : number, height : number) => {
    return height - (count * scale_y)
}

const createPlot = () : plot =>{
    return {
        line : Skia.Path.Make(),
        dots : Skia.Path.Make(),
    }
}

const buildExercisePlots = (data : PracticeData[], WIDTH : number, HEIGHT : number, max_x: number, max_y: number) => {

    const ex : exercises = {
        "scale"        : createPlot(),
        "octave"       : createPlot(),
        "arpeggio"     : createPlot(),
        "solid-chord"  : createPlot(),
        "broken-chord" : createPlot(),
    }

    const scale_X = WIDTH / max_x;
    const scale_y = HEIGHT / max_y;

    if(data.length <= 0)
    {
        return ex;
    }
    
    const start_time  = new Date(data[0].Date.getFullYear(), data[0].Date.getMonth(),data[0].Date.getDate(),0,0,0,0);
    console.log("max_x "  + max_x)
    console.log("WIDTH "  + WIDTH)

    console.log("start_time " + start_time.valueOf())
    console.log("Date " + data[0].Date.valueOf())

    console.log("DIFF " + (data[0].Date.valueOf() - start_time.valueOf()))

    console.log("scale_X " + scale_X)

    // console.log(start_time.valueOf())

    //Move To
    for(let [exercise, count] of data[0].Counts.entries())
    {
        const x = getX(data[0].Date.valueOf() - start_time.valueOf(), scale_X)
        const y = getY(count, scale_y, HEIGHT)

        console.log("X " + x)
        
        ex[exercise].line.moveTo(x, y);
        ex[exercise].dots.addCircle(x, y, 6);
    }

    //Line To
    for(let i = 1; i < data.length; i++)
    {   
      for(let [exercise, count] of data[i].Counts.entries())
      {
        const x = getX(data[i].Date.valueOf() - start_time.valueOf(), scale_X)
        const y = getY(count, scale_y, HEIGHT)

        ex[exercise].line.lineTo(x,y);
        ex[exercise].dots.addCircle(x, y, 6)
      }
    }

    return ex
}


const buildGrid = (width: number, height: number, max_x: number, max_y: number) => {
    //top to bottow div by 7 space

    //const divX = 7
    const scale_x = width / (max_x - 1)

    const gridLines : SkPath = Skia.Path.Make();
    
    for(let i = 1; i < max_x - 1; i++)
    {
        gridLines.moveTo(i * scale_x, 0)
        gridLines.lineTo(i * scale_x, height)
    }

    //const div_y = 5
    const scale_y = height / max_y

    for(let i = 1; i < max_y; i++)
    {
        gridLines.moveTo(0, i * scale_y)
        gridLines.lineTo(width, i * scale_y)
    }

    return gridLines;
}

export const getGraph = (width: number, height: number, data : PracticeData[]) : Graph[] => {

    const max_y = getMaxY(data);


    return [
        {
            ID: 0,
            exercises : buildExercisePlots(data, width, height, 86400000, max_y),
            grid: buildGrid(width, height, 24, max_y),
            label: "Day"
        },
        {
            ID: 1,
            exercises : buildExercisePlots(data, width, height, 604800000, max_y),
            grid: buildGrid(width, height, 7, max_y),
            label: "Week"
        },
        {
            ID: 2,
            exercises : buildExercisePlots(data, width, height, 2628000000, max_y),
            grid: buildGrid(width, height, 31, max_y),
            label: "Month"
        },
        {
            ID: 3,
            exercises : buildExercisePlots(data, width, height, 31540000000, max_y),
            grid: buildGrid(width, height, 12, max_y),
            label: "Year"
        },
    ]
}
