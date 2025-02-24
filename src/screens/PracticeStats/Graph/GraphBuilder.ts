import {SkPath, SkPoint, Skia} from '@shopify/react-native-skia';
import {
  ExerciseType,
  IAllPracticeData,
  IPracticeData,
} from '../../../data/Models/DataModels';

export type PathSet = {
  line: SkPath;
  dots: SkPath;
};

export type ExercisesPathSetMap = Map<ExerciseType, PathSet[]>;
export type GRAPH_ID = 'Day' | 'Week' | 'Month' | 'Year';

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
  exercises: ExercisesPathSetMap;
  grids: SkPath[];
  titles: string[];
  labels: Labels[];
};

const getCounts = (pd: IPracticeData): Map<ExerciseType, number> => {
  return new Map([
    ['scale', pd.scale],
    ['octave', pd.octave],
    ['arpeggio', pd.arpeggio],
    ['solidChord', pd.solidChord],
    ['brokenChord', pd.brokenChord],
  ]);
};

const getMaxY = (data: IPracticeData[]) => {
  if (data.length <= 0) return 10;

  let max_y = 0;
  data.map(practiceData => {
    getCounts(practiceData).forEach(count => {
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
    return dateXPositionMap[(date.getDay() - 1) % 7];
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

const PADDING = 20;
const GRID_RIGHT_MARGIN = 30;
const GRID_BOTTOM_MARGIN = 50;

const orderPracticeDataArrys = (dataMap: IAllPracticeData) => {
  const ret: Array<IPracticeData[]> = [];
  const w = dataMap.Week;
  const y = dataMap.Year;

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

  YlineCount = 10;

  dateXPositionMap: {[id: number]: number} = {};
  xPositions: number[] = [];

  ex: ExercisesPathSetMap = new Map();
  grids: SkPath[] = [];
  labels: Labels[] = [];

  getGridXPositions = () => {
    //reset this for next iteration of the loop
    this.dateXPositionMap = {};
    this.xPositions = [];

    for (let i = 0; i < this.grid_div; i++) {
      this.dateXPositionMap[i] = parseFloat(
        (i * this.scale_x + this.inner_x_start).toFixed(2),
      );

      this.xPositions.push(
        parseFloat((i * this.scale_x + this.inner_x_start).toFixed(2)),
      );
    }
  };

  buildYAxisLabels = () => {
    const scale_y = (this.pad_height / this.YlineCount) * 0.87;

    const labels: AxisLabelInfo[] = [];

    for (let i = 0; i <= this.YlineCount; i++) {
      labels.push({
        text: (this.max_y - (this.max_y / this.YlineCount) * i).toString(),
        pos: {x: this.pad_x_start, y: i * scale_y + this.pad_x_start + 28},
      });
    }

    return labels;
  };

  buildXAxisLabels = (index: number) => {
    const res: AxisLabelInfo[] = [];

    const scale_x = this.WIDTH / (this.grid_div + 0.6);

    for (let i = 0; i < this.grid_div; i++) {
      res.push({
        text: LABELS[index][i] != null ? LABELS[index][i]!.toString() : 'Hi',
        pos: {x: i * scale_x + this.inner_x_start, y: this.pad_height},
      });
    }

    return res;
  };

  buildGrid = () => {
    const gridLines: SkPath = Skia.Path.Make();

    for (let i = 0; i < this.xPositions.length; i++) {
      gridLines.moveTo(this.xPositions[i], PADDING);
      gridLines.lineTo(this.xPositions[i], this.inner_height + PADDING);
    }

    //const div_y = 5
    const scale_y = this.inner_height / this.YlineCount;

    for (let i = 0; i <= this.YlineCount; i++) {
      gridLines.moveTo(this.inner_x_start, i * scale_y + PADDING);
      gridLines.lineTo(
        this.inner_width + this.inner_x_start,
        i * scale_y + PADDING,
      );
    }

    return gridLines;
  };

  GetAllExercises = (pd: IPracticeData, index: number, jIndex: number) => {
    const scale_y = this.HEIGHT / this.max_y;
    for (let [exercise, count] of getCounts(pd)) {
      // if (count <= 0) continue;

      //could early return here
      if (this.ex.get(exercise) === undefined) {
        this.ex.set(exercise, []);
      }

      const x = getX(this.dateXPositionMap, index, new Date(pd.date));
      const y = getY(count, scale_y, this.HEIGHT, PADDING);

      const newPlot = createPlot();

      if (jIndex == 0) {
        newPlot.line.moveTo(x, y);
      } else {
        newPlot.line.lineTo(x, y);
      }
      newPlot.dots.addCircle(x, y, 6);

      this.ex.get(exercise)?.push(newPlot);
    }
  };

  getGraph(width: number, height: number, data: IAllPracticeData) {
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

      this.grids.push(this.buildGrid());

      const xL = this.buildXAxisLabels(i);
      const yL = this.buildYAxisLabels();

      this.labels.push({xLabels: xL, yLabels: yL});

      //Each entry in group
      for (let j = 0; j < practiceDatas.length; j++) {
        const pd = practiceDatas[j];
        this.GetAllExercises(pd, i, j);
      }
    }

    // console.log('this.ex ' + JSON.stringify([...this.ex.entries()], null, 2));

    return {
      titles: ['Week', 'Year'],
      exercises: this.ex,
      grids: this.grids,
      labels: this.labels,
    };
  }
}
