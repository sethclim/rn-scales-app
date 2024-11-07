import {SkPath, SkPoint, Skia} from '@shopify/react-native-skia';
import {ExerciseType, PracticeData} from '../../../data/Models/DataModels';

export type PathSet = {
  line: SkPath;
  dots: SkPath;
};

export type Exercises = Map<ExerciseType, PathSet[]>;
// {
//   scales: PathSet[];
//   // octave: PathSet[];
//   // arpeggio: PathSet[];
//   // solidChord: PathSet[];
//   // brokenChord: PathSet[];
// };

export type GRAPH_ID = 'Day' | 'Week' | 'Month' | 'Year';

// const LABELS = {
//   Day: [0, 4, 8, 12, 16, 20, 24],
//   Week: ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'],
//   Month: [1, 2, 3],
//   Year: [
//     'Jan',
//     'Feb',
//     'Mar',
//     'Apr',
//     'May',
//     'Jun',
//     'Jul',
//     'Aug',
//     'Sept',
//     'Oct',
//     'Nov',
//     'Dec',
//   ],
// };

const LABELS = [
  ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'],
  [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ],
];

type AxisLabelInfo = {
  text: string;
  pos: SkPoint;
};

export type GraphData = {
  //ID: GRAPH_ID;
  exercises: Exercises;
  grids: SkPath[];
  // yLabels: AxisLabelInfo[];
  // xLabels: AxisLabelInfo[];
  titles: string[];
  labels: Labels[];
};

const getMaxY = (data: PracticeData[]) => {
  if (data.length <= 0) return 10;

  let max_y = 0;
  data.map(practiceData => {
    practiceData.getCounts().forEach(count => {
      if (count > max_y) max_y = count;
    });
  });

  return max_y;
};

const getX = (
  dateXPositionMap: {[id: number]: number},
  index: number,
  date: Date,
) => {
  console.log(`Datex ${JSON.stringify(dateXPositionMap[0])} ${index} ${date}`);

  if (index == 1) {
    return dateXPositionMap[date.getMonth()];
  } else if (index == 0) {
    return dateXPositionMap[date.getDay()];
  }

  return dateXPositionMap[date.getMonth()];
};

const getY = (
  count: number,
  scale_y: number,
  height: number,
  start: number,
) => {
  console.log(
    'count ' +
      count +
      'scale_y ' +
      scale_y +
      ' height ' +
      height +
      ' start ' +
      start,
  );

  return height - (count * scale_y - start);
};

const createPlot = (): PathSet => {
  return {
    line: Skia.Path.Make(),
    dots: Skia.Path.Make(),
  };
};

// const buildExercisePlots = (
//   ID: GRAPH_ID,
//   data: PracticeData[],
//   start_x: number,
//   start_y: number,
//   WIDTH: number,
//   HEIGHT: number,
//   max_x: number,
//   max_y: number,
//   dateXPositionMap: {[id: number]: number},
// ) => {
//   const ex: Record<ExerciseType, PathSet> = {
//     scale: createPlot(),
//     octave: createPlot(),
//     arpeggio: createPlot(),
//     solidChord: createPlot(),
//     brokenChord: createPlot(),
//   };

//   const scale_X = WIDTH / max_x;
//   const scale_y = HEIGHT / max_y;

//   if (data.length <= 0) {
//     console.log('No data');
//     return ex;
//   }

//   let start_time = null;
//   if (ID == 'Year') {
//     start_time = new Date(data[0].getDate().getFullYear(), 0, 1, 0, 0, 0, 0);
//   } else if (ID == 'Week') {
//     start_time = new Date(
//       data[0].getDate().getFullYear(),
//       data[0].getDate().getMonth(),
//       data[0].getDate().getDate() - data[0].getDate().getDay(),
//       0,
//       0,
//       0,
//       0,
//     );
//   }

//   //Line To
//   for (let i = 0; i < data.length; i++) {
//     for (let [exercise, count] of data[i].getCounts()) {
//       const x = getX(dateXPositionMap, ID, data[i].getDate());
//       const y = getY(count, scale_y, HEIGHT, start_y);

//       console.log('SETH X ' + x + ' y ' + y);

//       if (i == 0) {
//         ex[exercise].line.moveTo(x, y);
//       } else {
//         ex[exercise].line.lineTo(x, y);
//       }
//       ex[exercise].dots.addCircle(x, y, 6);
//     }
//   }

//   return ex;
// };

const YlineCount = 10;

const buildGrid = (
  start_x: number,
  start_y: number,
  width: number,
  height: number,
  max_x: number,
  max_y: number,
  xPositions: number[],
) => {
  //top to bottow div by 7 space

  //const divX = 7
  // const scale_x = width / (max_x - 1);

  const gridLines: SkPath = Skia.Path.Make();

  for (let i = 0; i < xPositions.length; i++) {
    gridLines.moveTo(xPositions[i], start_y);
    gridLines.lineTo(xPositions[i], height + start_y);
  }

  //const div_y = 5
  const scale_y = height / YlineCount;

  for (let i = 0; i <= YlineCount; i++) {
    gridLines.moveTo(start_x, i * scale_y + start_y);
    gridLines.lineTo(width + start_x, i * scale_y + start_y);
  }

  return gridLines;
};

const buildYAxisLabels = (
  max_y: number,
  height: number,
  xStart: number,
  yStart: number,
) => {
  const scale_y = (height / YlineCount) * 0.87;

  const labels: AxisLabelInfo[] = [];

  for (let i = 0; i <= YlineCount; i++) {
    labels.push({
      text: (max_y - (max_y / YlineCount) * i).toString(),
      pos: {x: xStart, y: i * scale_y + yStart + 28},
    });
  }

  return labels;
};

const buildXAxisLabels = (
  index: number,
  width: number,
  max_x: number,
  labelY: number,
  startX: number,
) => {
  const res: AxisLabelInfo[] = [];

  const scale_x = width / (max_x + 0.6);

  for (let i = 0; i < max_x; i++) {
    res.push({
      text: LABELS[index][i] != null ? LABELS[index][i]!.toString() : 'Hi',
      pos: {x: i * scale_x + startX, y: labelY},
    });
  }

  return res;
};

const PADDING = 20;
const GRID_RIGHT_MARGIN = 30;
const GRID_BOTTOM_MARGIN = 50;

const GRAPH_INFO = {
  Day: {
    grid_div: 7,
    total_milli: 86400000,
  },
  Week: {
    grid_div: 7,
    total_milli: 604800000,
  },
  Month: {
    grid_div: 3,
    total_milli: 2628000000,
  },
  Year: {
    grid_div: 12,
    total_milli: 31540000000,
  },
};

// export const buildGraph = (
//   data: Map<GRAPH_ID, PracticeData[]>,
//   WIDTH: number,
//   HEIGHT: number,
//   ID: GRAPH_ID,
// ): GraphData => {
//   console.log('DATA ' + JSON.stringify(Array.from(data.entries()), null, 2));

//   const grid_div = GRAPH_INFO[ID].grid_div;
//   const total_milli = GRAPH_INFO[ID].total_milli;

//   const pad_width = WIDTH - PADDING;
//   const pad_height = HEIGHT - PADDING;
//   const inner_width = pad_width - GRID_RIGHT_MARGIN;
//   const pad_x_start = PADDING / 2;
//   const inner_x_start = pad_x_start + GRID_RIGHT_MARGIN;
//   const inner_height = pad_height - GRID_BOTTOM_MARGIN;

//   const data_group = data.get(ID);
//   var dateXPositionMap: {[id: number]: number} = {};
//   var xPositions: number[] = [];

//   const scale_x = inner_width / (grid_div - 1);

//   for (let i = 0; i < grid_div; i++) {
//     dateXPositionMap[i] = parseFloat((i * scale_x + inner_x_start).toFixed(2));

//     xPositions.push(parseFloat((i * scale_x + inner_x_start).toFixed(2)));
//   }

//   if (data_group == undefined)
//     return {
//       ID: ID,
//       exercises: buildExercisePlots(
//         ID,
//         [],
//         inner_x_start,
//         PADDING,
//         inner_width,
//         inner_height,
//         total_milli,
//         10,
//         dateXPositionMap,
//       ),
//       grid: buildGrid(
//         inner_x_start,
//         PADDING,
//         inner_width,
//         inner_height,
//         grid_div,
//         10,
//         xPositions,
//       ),
//       yLabels: buildYAxisLabels(10, pad_height, pad_x_start, pad_x_start),
//       xLabels: buildXAxisLabels(ID, WIDTH, grid_div, pad_height, inner_x_start),
//       label: ID,
//     };

//   let max_y = getMaxY(data_group);
//   max_y = Math.ceil(max_y / 10) * 10;

//   console.log('max_y ' + max_y);
//   console.log('dateXPositionMap ' + JSON.stringify(dateXPositionMap));

//   return {
//     ID: ID,
//     exercises: buildExercisePlots(
//       ID,
//       data_group,
//       inner_x_start,
//       PADDING,
//       inner_width,
//       inner_height,
//       total_milli,
//       max_y,
//       dateXPositionMap,
//     ),
//     grid: buildGrid(
//       inner_x_start,
//       PADDING,
//       inner_width,
//       inner_height,
//       grid_div,
//       max_y,
//       xPositions,
//     ),
//     yLabels: buildYAxisLabels(max_y, pad_height, pad_x_start, pad_x_start),
//     xLabels: buildXAxisLabels(ID, WIDTH, grid_div, pad_height, inner_x_start),
//     label: ID,
//   };
// };

const orderPracticeDataArrys = (dataMap: Map<GRAPH_ID, PracticeData[]>) => {
  const ret: Array<PracticeData[]> = [];
  const w = dataMap.get('Week');
  const y = dataMap.get('Year');

  if (w !== undefined) {
    ret.push(w);
  }

  if (y !== undefined) {
    ret.push(y);
  }

  return ret;
};

// export const getGraph = (
//   width: number,
//   height: number,
//   data: Map<GRAPH_ID, PracticeData[]>,
// ): GraphData => {
//   const practiceDataArrayOfArray = orderPracticeDataArrys(data);

//   const exs: Exercises = GetAllExercises(
//     practiceDataArrayOfArray,
//     width,
//     height,
//   );

//   const tewt = 'hello';

//   const gd: GraphData = {
//     titles: ['Week', 'Year'],
//     exercises: exs,
//   };

//   // const gWeek = buildGraph(data, width, height, 'Week');
//   // // const gMonth = buildGraph(data, width, height, 'Month');
//   // const gYear = buildGraph(data, width, height, 'Year');

//   // // scales []

//   return gd;
// };

export type Labels = {
  xLabels: AxisLabelInfo[];
  yLabels: AxisLabelInfo[];
};

const GRID_DIVS = [7, 12];

export class GraphGenerator {
  WIDTH = -1;
  HEIGHT = -1;

  grid_div = -1;
  //total_milli = GRAPH_INFO[ID].total_milli;

  pad_width = -1;
  pad_height = -1;
  inner_width = -1;
  pad_x_start = -1;
  inner_x_start = -1;
  inner_height = -1;
  scale_x = -1;
  max_y = -1;

  dateXPositionMap: {[id: number]: number} = {};
  xPositions: number[] = [];

  ex: Exercises = new Map();
  grids: SkPath[] = [];
  labels: Labels[] = [];

  getGridXPositions = () => {
    for (let i = 0; i < this.grid_div; i++) {
      this.dateXPositionMap[i] = parseFloat(
        (i * this.scale_x + this.inner_x_start).toFixed(2),
      );

      this.xPositions.push(
        parseFloat((i * this.scale_x + this.inner_x_start).toFixed(2)),
      );
    }
  };

  GetAllExercises = (pd: PracticeData, index: number) => {
    console.log(`this.HEIGHT ${this.HEIGHT} this.max_y ${this.max_y}`);

    const scale_y = this.HEIGHT / this.max_y;
    for (let [exercise, count] of pd.getCounts()) {
      if (count <= 0) continue;

      if (this.ex.get(exercise) === undefined) {
        this.ex.set(exercise, []);
      }

      console.log(`exercise exercise ${exercise} count ${count}`);

      const x = getX(this.dateXPositionMap, index, pd.getDate());
      const y = getY(count, scale_y, this.HEIGHT, PADDING);

      console.log(`HERE x ${x} y ${y}`);

      const newPlot = createPlot();

      if (index == 0) {
        newPlot.line.moveTo(x, y);
      } else {
        newPlot.line.lineTo(x, y);
      }
      newPlot.dots.addCircle(x, y, 6);

      this.ex.get(exercise)?.push(newPlot);
    }
  };

  getGraph(width: number, height: number, data: Map<GRAPH_ID, PracticeData[]>) {
    this.WIDTH = width;
    this.HEIGHT = height;

    this.pad_width = this.WIDTH - PADDING;
    this.pad_height = this.HEIGHT - PADDING;
    this.inner_width = this.pad_width - GRID_RIGHT_MARGIN;
    this.pad_x_start = PADDING / 2;
    this.inner_x_start = this.pad_x_start + GRID_RIGHT_MARGIN;
    this.inner_height = this.pad_height - GRID_BOTTOM_MARGIN;

    const practiceDataArrayOfArray = orderPracticeDataArrys(data);

    //Each Grouping of data
    for (let i = 0; i < practiceDataArrayOfArray.length; i++) {
      const practiceDatas = practiceDataArrayOfArray[i];

      this.grid_div = GRID_DIVS[i];
      this.scale_x = this.inner_width / (this.grid_div - 1);

      this.getGridXPositions();
      let max_y = getMaxY(practiceDatas);
      this.max_y = Math.ceil(max_y / 10) * 10;

      this.grids.push(
        buildGrid(
          this.inner_x_start,
          PADDING,
          this.inner_width,
          this.inner_height,
          this.grid_div,
          this.max_y,
          this.xPositions,
        ),
      );

      const xL = buildXAxisLabels(
        i,
        this.WIDTH,
        this.grid_div,
        this.pad_height,
        this.inner_x_start,
      );
      const yL = buildYAxisLabels(
        10,
        this.pad_height,
        this.pad_x_start,
        this.pad_x_start,
      );

      this.labels.push({xLabels: xL, yLabels: yL});

      //Each entry in group
      for (let j = 0; j < practiceDatas.length; j++) {
        const pd = practiceDatas[j];
        this.GetAllExercises(pd, j);
      }
    }

    const gd: GraphData = {
      titles: ['Week', 'Year'],
      exercises: this.ex,
      grids: this.grids,
      labels: this.labels,
    };

    return gd;
  }
}
