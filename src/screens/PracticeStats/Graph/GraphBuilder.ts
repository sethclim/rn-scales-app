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

type GRAPH_ID = "Day" | "Week" | "Month" | "Year"

export type Graph = {
    ID : GRAPH_ID,
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

const getX = (date : number, scale_X : number, start : number) => {
    return date * scale_X + start;
}
  
const getY = (count : number, scale_y : number, height : number, start : number) => {
    return height - (count * scale_y - start)
}

const createPlot = () : plot =>{
    return {
        line : Skia.Path.Make(),
        dots : Skia.Path.Make(),
    }
}

const buildExercisePlots = (data : PracticeData[],start_x : number, start_y : number,  WIDTH : number, HEIGHT : number, max_x: number, max_y: number) => {


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
    // console.log("max_x "  + max_x)
    // console.log("WIDTH "  + WIDTH)

    // console.log("start_time " + start_time.valueOf())
    // console.log("Date " + data[0].Date.valueOf())

    // console.log("DIFF " + (data[0].Date.valueOf() - start_time.valueOf()))

    // console.log("scale_X " + scale_X)

    // console.log(start_time.valueOf())

    //Move To
    for(let [exercise, count] of data[0].Counts.entries())
    {
        const x = getX(data[0].Date.valueOf() - start_time.valueOf(), scale_X, start_x)
        const y = getY(count, scale_y, HEIGHT, start_y)

        console.log("X " + x)
        
        ex[exercise].line.moveTo(x, y);
        ex[exercise].dots.addCircle(x, y, 6);
    }

    //Line To
    for(let i = 1; i < data.length; i++)
    {   
      for(let [exercise, count] of data[i].Counts.entries())
      {
        const x = getX(data[i].Date.valueOf() - start_time.valueOf(), scale_X, start_x)
        const y = getY(count, scale_y, HEIGHT, start_y)

        ex[exercise].line.lineTo(x,y);
        ex[exercise].dots.addCircle(x, y, 6)
      }
    }

    return ex
}


const buildGrid = (start_x : number, start_y : number, width: number, height: number, max_x: number, max_y: number) => {
    //top to bottow div by 7 space

    console.log("Grid width " + width)
    console.log("max_x " + max_x)
    //const divX = 7
    const scale_x = width / (max_x - 1)
    console.log("scale_x " + scale_x)
    
    const gridLines : SkPath = Skia.Path.Make();
    
    for(let i = 0; i < max_x; i++)
    {
        console.log("Y Width " + (i * scale_x + start_x))
        gridLines.moveTo(i * scale_x + start_x, start_y)
        gridLines.lineTo(i * scale_x + start_x, height + start_y)
    }

    //const div_y = 5
    const scale_y = height / max_y

    console.log("Start " + start_x)
    console.log("width " + width)

    for(let i = 0; i <= max_y; i++)
    {
        gridLines.moveTo(start_x, i * scale_y + start_y)
        gridLines.lineTo(width + start_x, i * scale_y + start_y)
    }

    return gridLines;
}

const PADDING = 20
const GRID_RIGHT_MARGIN = 30
const GRID_BOTTOM_MARGIN = 30

const GRAPH_INFO = {
    "Day" : {
        grid_div : 24,
        total_milli: 86400000
    },
    "Week" : {
        grid_div : 7,
        total_milli: 604800000
    },
    "Month" : {
        grid_div : 31,
        total_milli: 2628000000
    },
    "Year" : {
        grid_div : 12,
        total_milli: 31540000000
    }
}

const buildGraph = (data : PracticeData[], WIDTH : number, HEIGHT : number, ID : GRAPH_ID) : Graph =>{

    const grid_div    =  GRAPH_INFO[ID].grid_div
    const total_milli =  GRAPH_INFO[ID].total_milli

    const pad_width     = WIDTH - PADDING
    const pad_height    = HEIGHT - PADDING
    const inner_width   = pad_width - GRID_RIGHT_MARGIN
    const inner_x_start = (PADDING / 2 ) + GRID_RIGHT_MARGIN
    const inner_height  = pad_height - GRID_BOTTOM_MARGIN

    console.log("Full Width " + WIDTH)
    console.log("inner_width " + inner_width)
    console.log("inner_start " + inner_x_start)

    console.log("inner_width + pad + pad" + (inner_width + inner_x_start + inner_x_start))

    const max_y = getMaxY(data);

    return {
        ID:         ID,
        exercises : buildExercisePlots(data,inner_x_start, PADDING,inner_width, inner_height, total_milli, max_y),
        grid:       buildGrid(inner_x_start,PADDING, inner_width, inner_height, grid_div, max_y),
        label:      ID
    }
}


export const getGraph = (width: number, height: number, data : PracticeData[]) : Graph[] => {

    return [
        buildGraph(data, width, height, "Day"),
        buildGraph(data, width, height, "Week"),
        buildGraph(data, width, height, "Month"),
        buildGraph(data, width, height, "Year"),
    ]
}
