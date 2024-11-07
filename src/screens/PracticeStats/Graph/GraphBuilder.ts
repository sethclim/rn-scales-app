import {SkPath, SkPoint, Skia} from '@shopify/react-native-skia';
import {ExerciseType, PracticeData} from '../../../data/Models/DataModels';

export type PathSet = {
  line: SkPath;
  dots: SkPath;
};

export type Exercises = Map<ExerciseType, PathSet[]>;
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
  exercises: Exercises;
  grids: SkPath[];
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
  return height - (count * scale_y - start);
};

const createPlot = (): PathSet => {
  return {
    line: Skia.Path.Make(),
    dots: Skia.Path.Make(),
  };
};

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

export type Labels = {
  xLabels: AxisLabelInfo[];
  yLabels: AxisLabelInfo[];
};

const GRID_DIVS = [7, 12];

export class GraphGenerator {
  WIDTH = -1;
  HEIGHT = -1;

  grid_div = -1;
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
