import { SkPath, SkPoint, Skia } from "@shopify/react-native-skia"

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

type AxisLabelInfo = {
    text : string,
    pos : SkPoint
}

export type Graph = {
    ID : GRAPH_ID,
    exercises: exercises,
    grid: SkPath,
    yLabels: AxisLabelInfo[],
    xLabels: AxisLabelInfo[],
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

    //Move To
    for(let [exercise, count] of data[0].Counts.entries())
    {
        const x = getX(data[0].Date.valueOf() - start_time.valueOf(), scale_X, start_x)
        const y = getY(count, scale_y, HEIGHT, start_y)
        
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

const YlineCount = 10

const buildGrid = (start_x : number, start_y : number, width: number, height: number, max_x: number, max_y: number) => {
    //top to bottow div by 7 space


    //const divX = 7
    const scale_x = width / (max_x - 1)

    
    const gridLines : SkPath = Skia.Path.Make();
    
    for(let i = 0; i <= max_x; i++)
    {
        gridLines.moveTo(i * scale_x + start_x, start_y)
        gridLines.lineTo(i * scale_x + start_x, height + start_y)
    }


    //const div_y = 5
    const scale_y = height / YlineCount

    for(let i = 0; i <= YlineCount; i++)
    {
        gridLines.moveTo(start_x, i * scale_y + start_y)
        gridLines.lineTo(width + start_x, i * scale_y + start_y)
    }

    return gridLines;
}

const buildYAxisLabels = (max_y : number, height : number, xStart : number, yStart : number) => {

    const scale_y = height / YlineCount  * 0.87

    const labels : AxisLabelInfo[] = []

    for(let i = 0; i <= YlineCount; i++)
    {
        labels.push({
            text : (max_y - ((max_y / YlineCount) * i)).toString(),
            pos : {x: xStart, y :i * scale_y +  yStart + 28}
        })
    }

    return labels
}

const buildXAxisLabels = (ID : GRAPH_ID, width : number, max_x: number, labelY : number, startX : number) => {
    const labels = {
        "Day"   : [0,4,8,12,16,20,24],
        "Week"  : ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"],
        "Month" : [1,2,3],
        "Year"  : ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"]
    }

    const res : AxisLabelInfo[] = []

    const scale_x = width / (max_x - 1)

    for(let i = 0; i < max_x; i++){
        res.push({
            text : labels[ID][i] != null ? labels[ID][i]!.toString() : "Hi",
            pos : {x : i * scale_x + startX, y : labelY}
        })
    }

    return res;
}

const PADDING = 20
const GRID_RIGHT_MARGIN = 30
const GRID_BOTTOM_MARGIN = 50

const GRAPH_INFO = {
    "Day" : {
        grid_div : 7,
        total_milli: 86400000
    },
    "Week" : {
        grid_div : 7,
        total_milli: 604800000
    },
    "Month" : {
        grid_div : 3,
        total_milli: 2628000000
    },
    "Year" : {
        grid_div : 12,
        total_milli: 31540000000
    }
}

const filterData = (ID : GRAPH_ID, data : PracticeData[]) => {

    const endDate = new Date()

    if(ID == "Year")
    {
        return data;
    }
    else if(ID == "Month")
    {
        const startDate = new Date();
        startDate.setDate(1);
        return data.filter(a => {
            return (a.Date >= startDate && a.Date <= endDate);
        })
    }
    else if(ID == "Week")
    {
        const startDate = new Date();
        startDate.setDate(endDate.getDay() - 7);
        return data.filter(a => {
            return (a.Date >= startDate && a.Date <= endDate);
        })
    }
    else
    {
        const startDate = new Date()
        startDate.setHours(0,0,0,0);
        endDate.setHours(24, 60, 60, 10000)
 
        return data.filter(a => {
            return (a.Date >= startDate && a.Date <= endDate);
        })
    }
}

const getStartEndDate = (ID : GRAPH_ID, date : Date) =>{

    const time_stamp = date.valueOf()
    const startDate = date
    if(ID == "Year")
    {
        startDate.setDate(1)
        startDate.setHours(0,0,0,0)
        time_stamp + GRAPH_INFO["Month"].total_milli
    }
    else if(ID == "Month")
    {
        startDate.setHours(0,0,0,0)
        time_stamp + GRAPH_INFO["Week"].total_milli
    }
    else if(ID == "Week")
    {
        startDate.setHours(0,0,0,0)
        time_stamp + GRAPH_INFO["Day"].total_milli
    }
    else
    {
        startDate.setHours(startDate.getHours(),0,0,0)
        time_stamp + 3600000
    }

    return [startDate ,new Date(time_stamp)]
}

const groupData = (ID : GRAPH_ID, data : PracticeData[]) =>{

    if(data.length <= 0)
        return []

    const grouped_data : PracticeData[] = []
    const [startDate, endDate] = getStartEndDate(ID, data[0].Date);
    let currentEnd : Date = endDate
    let groupedPD : PracticeData = new PracticeData(startDate);

    data.map((pd) =>{
        if(pd.Date > currentEnd)
        {
            grouped_data.push(groupedPD)

            const [startDate, endDate] = getStartEndDate(ID, pd.Date);
            groupedPD = new PracticeData(startDate);
            currentEnd = endDate
        }

        pd.Counts.forEach((value, key) =>{
            const val = groupedPD.Counts.get(key)
            
            if(val != undefined)
                groupedPD.Counts.set(key, (val + value))
        })
    })

    return grouped_data
}

const buildGraph = (data : PracticeData[], WIDTH : number, HEIGHT : number, ID : GRAPH_ID) : Graph =>{

    console.log("BUILD GRAPH ")

    const grid_div    =  GRAPH_INFO[ID].grid_div
    const total_milli =  GRAPH_INFO[ID].total_milli

    const pad_width     = WIDTH - PADDING
    const pad_height    = HEIGHT - PADDING
    const inner_width   = pad_width - GRID_RIGHT_MARGIN
    const pad_x_start   = (PADDING / 2)
    const inner_x_start = pad_x_start + GRID_RIGHT_MARGIN
    const inner_height  = pad_height - GRID_BOTTOM_MARGIN

    const filtered_data = filterData(ID, data);
    const group_data    = groupData(ID, filtered_data)

    let max_y         = getMaxY(group_data);
    max_y =  Math.ceil(max_y / 10) * 10;

    return {
        ID:         ID,
        exercises : buildExercisePlots(group_data,inner_x_start, PADDING,inner_width, inner_height, total_milli, max_y),
        grid:       buildGrid(inner_x_start,PADDING, inner_width, inner_height, grid_div, max_y),
        yLabels:    buildYAxisLabels(max_y, pad_height, pad_x_start, pad_x_start),
        xLabels :   buildXAxisLabels(ID, WIDTH, grid_div,pad_height, inner_x_start),
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
