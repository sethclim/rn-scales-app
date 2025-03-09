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

export type ExerciseSet = {
  scale: PathSet;
  octave: PathSet;
  arpeggio: PathSet;
  solidChord: PathSet;
  brokenChord: PathSet;
};

// export type ExercisesPathSetMap = ExerciseSet[];
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
  exercises: ExerciseSet[];
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
    return dateXPositionMap[date.getDay() % 7];
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
    console.log('w ' + JSON.stringify(w));
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

  exercises: ExerciseSet[] = [];
  grids: SkPath[] = [];
  labels: Labels[] = [];

  constructor() {
    this.grids = [];
    this.labels = [];
  }

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
    this.grids.push(gridLines);
  };

  GetAllExercises = (index: number, practiceDataArr: IPracticeData[]) => {
    console.log(`GetAllExercises index ${index}`);
    const scalar_y = this.inner_height / this.max_y;

    const ex: ExerciseSet = {
      scale: createPlot(),
      octave: createPlot(),
      arpeggio: createPlot(),
      solidChord: createPlot(),
      brokenChord: createPlot(),
    };

    for (let i = 0; i < practiceDataArr.length; i++) {
      const pd = practiceDataArr[i];

      const x = getX(this.dateXPositionMap, index, new Date(pd.date));

      const y_scale = getY(pd.scale, scalar_y, this.inner_height, PADDING);
      const y_octave = getY(pd.octave, scalar_y, this.inner_height, PADDING);
      const y_arpeggio = getY(
        pd.arpeggio,
        scalar_y,
        this.inner_height,
        PADDING,
      );
      const y_solidChord = getY(
        pd.solidChord,
        scalar_y,
        this.inner_height,
        PADDING,
      );
      const y_brokenChord = getY(
        pd.brokenChord,
        scalar_y,
        this.HEIGHT,
        PADDING,
      );

      if (i == 0) {
        ex.scale.line.moveTo(x, y_scale);
        ex.octave.line.moveTo(x, y_octave);
        ex.arpeggio.line.moveTo(x, y_arpeggio);
        ex.solidChord.line.moveTo(x, y_solidChord);
        ex.brokenChord.line.moveTo(x, y_brokenChord);
      } else {
        ex.scale.line.lineTo(x, y_scale);
        ex.octave.line.lineTo(x, y_octave);
        ex.arpeggio.line.lineTo(x, y_arpeggio);
        ex.solidChord.line.lineTo(x, y_solidChord);
        ex.brokenChord.line.lineTo(x, y_brokenChord);
      }

      ex.scale.dots.addCircle(x, y_scale, 6);
      ex.octave.dots.addCircle(x, y_octave, 6);
      ex.arpeggio.dots.addCircle(x, y_arpeggio, 6);
      ex.solidChord.dots.addCircle(x, y_solidChord, 6);
      ex.brokenChord.dots.addCircle(x, y_brokenChord, 6);

      // for (let [exercise, count] of getCounts(practiceDataArr[i])) {
      //   // if (count <= 0) continue;

      //   // //could early return here
      //   // if (this.ex.get(exercise) === undefined) {
      //   //   this.ex.set(exercise, []);
      //   // }

      //   const x = getX(this.dateXPositionMap, index, new Date(pd.date));
      //   const y = getY(count, scalar_y, this.HEIGHT, PADDING);

      //   const newPlot = createPlot();

      //   if (jIndex == 0) {
      //     newPlot.line.moveTo(x, y);
      //   } else {
      //     newPlot.line.lineTo(x, y);
      //   }
      //   newPlot.dots.addCircle(x, y, 6);

      //   ex.get(exercise)?.push(newPlot);
      // }
    }
    console.log('Adding to exercies' + this.exercises.length);
    this.exercises.push(ex);
  };

  getGraph(width: number, height: number, data: IAllPracticeData): GraphData {
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

      this.buildGrid();

      const xL = this.buildXAxisLabels(i);
      const yL = this.buildYAxisLabels();

      this.labels.push({xLabels: xL, yLabels: yL});

      this.GetAllExercises(i, practiceDatas);

      // //Each entry in group
      // for (let j = 0; j < practiceDatas.length; j++) {
      //   const pd = practiceDatas[j];
      // }
    }

    // console.log('this.ex ' + JSON.stringify([...this.ex.entries()], null, 2));

    console.log('HERE HERE IS THE LENGTH ' + this.exercises.length);

    return {
      titles: ['Week', 'Year'],
      exercises: this.exercises,
      grids: this.grids,
      labels: this.labels,
    };
  }
}
