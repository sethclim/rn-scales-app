import {SkPath, SkPoint, Skia} from '@shopify/react-native-skia';
import {ExerciseType, PracticeData} from '../../../data/Models/DataModels';

export type plot = {
  line: SkPath;
  dots: SkPath;
};

export type exercises = {
  scale: plot;
  octave: plot;
  arpeggio: plot;
  'solid-chord': plot;
  'broken-chord': plot;
};

export type GRAPH_ID = 'Day' | 'Week' | 'Month' | 'Year';

type AxisLabelInfo = {
  text: string;
  pos: SkPoint;
};

export type Graph = {
  ID: GRAPH_ID;
  exercises: exercises;
  grid: SkPath;
  yLabels: AxisLabelInfo[];
  xLabels: AxisLabelInfo[];
  label: string;
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

const getX = (date: number, scale_X: number, start: number) => {
  return date * scale_X + start;
};

const getY = (
  count: number,
  scale_y: number,
  height: number,
  start: number,
) => {
  return height - (count * scale_y - start);
};

const createPlot = (): plot => {
  return {
    line: Skia.Path.Make(),
    dots: Skia.Path.Make(),
  };
};

const buildExercisePlots = (
  data: PracticeData[],
  start_x: number,
  start_y: number,
  WIDTH: number,
  HEIGHT: number,
  max_x: number,
  max_y: number,
) => {
  const ex: Record<ExerciseType, plot> = {
    scale: createPlot(),
    octave: createPlot(),
    arpeggio: createPlot(),
    'solid-chord': createPlot(),
    'broken-chord': createPlot(),
  };

  const scale_X = WIDTH / max_x;
  const scale_y = HEIGHT / max_y;

  if (data.length <= 0) {
    return ex;
  }

  const start_time = new Date(
    data[0].getDate().getFullYear(),
    0,
    1,
    0,
    0,
    0,
    0,
  );

  //Move To
  for (let [exercise, count] of data[0].getCounts()) {
    const x = getX(
      data[0].getDate().valueOf() - start_time.valueOf(),
      scale_X,
      start_x,
    );
    const y = getY(count, scale_y, HEIGHT, start_y);

    ex[exercise].line.moveTo(x, y);
    ex[exercise].dots.addCircle(x, y, 6);
  }

  //Line To
  for (let i = 1; i < data.length; i++) {
    for (let [exercise, count] of data[i].getCounts()) {
      const x = getX(
        data[i].getDate().valueOf() - start_time.valueOf(),
        scale_X,
        start_x,
      );
      const y = getY(count, scale_y, HEIGHT, start_y);

      ex[exercise].line.lineTo(x, y);
      ex[exercise].dots.addCircle(x, y, 6);
    }
  }

  return ex;
};

const YlineCount = 10;

const buildGrid = (
  start_x: number,
  start_y: number,
  width: number,
  height: number,
  max_x: number,
  max_y: number,
) => {
  //top to bottow div by 7 space

  //const divX = 7
  const scale_x = width / (max_x - 1);

  const gridLines: SkPath = Skia.Path.Make();

  for (let i = 0; i <= max_x; i++) {
    gridLines.moveTo(i * scale_x + start_x, start_y);
    gridLines.lineTo(i * scale_x + start_x, height + start_y);
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
  ID: GRAPH_ID,
  width: number,
  max_x: number,
  labelY: number,
  startX: number,
) => {
  const labels = {
    Day: [0, 4, 8, 12, 16, 20, 24],
    Week: ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'],
    Month: [1, 2, 3],
    Year: [
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
  };

  const res: AxisLabelInfo[] = [];

  const scale_x = width / (max_x + 0.6);

  for (let i = 0; i < max_x; i++) {
    res.push({
      text: labels[ID][i] != null ? labels[ID][i]!.toString() : 'Hi',
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

// const filterData = (ID: GRAPH_ID, data: PracticeData[]) => {
//   const endDate = new Date();

//   if (ID == 'Year') {
//     return data;
//   } else if (ID == 'Month') {
//     const startDate = new Date();
//     startDate.setDate(1);
//     return data.filter(a => {
//       return a.getDate() >= startDate && a.getDate() <= endDate;
//     });
//   } else if (ID == 'Week') {
//     const startDate = new Date();
//     startDate.setDate(endDate.getDay() - 7);
//     return data.filter(a => {
//       return a.getDate() >= startDate && a.getDate() <= endDate;
//     });
//   } else {
//     const startDate = new Date();
//     startDate.setHours(0, 0, 0, 0);
//     endDate.setHours(24, 60, 60, 10000);

//     return data.filter(a => {
//       return a.getDate() >= startDate && a.getDate() <= endDate;
//     });
//   }
// };

// const getStartEndDateForGroupData = (ID: GRAPH_ID, date: Date) => {
//   let time_stamp = date.valueOf();
//   console.log(ID + ' time_stamp ' + time_stamp);
//   let startDate = null;
//   let endDate = new Date();

//   //Get Next Month
//   if (ID == 'Year') {
//     startDate = new Date(`${date.getFullYear()}-01-01T00:00:00`);
//     endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
//   } else if (ID == 'Month') {
//     startDate = new Date(
//       `${date.getFullYear()}-${date.getMonth()}-01T00:00:00`,
//     );

//     endDate = new Date(date.getFullYear(), date.getMonth());

//     // startDate.setHours(0, 0, 0, 0);
//     // time_stamp + GRAPH_INFO['Week'].total_milli;
//   } else {
//     const dayOfMonth = parseInt(date.toISOString().split('T')[0].split('-')[2]);
//     console.log(dayOfMonth);

//     startDate = new Date(
//       `${date.getFullYear()}-${date.getMonth()}-${
//         dayOfMonth - date.getDay()
//       }T00:00:00`,
//     );

//     endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
//   }
//   //  else {
//   //   startDate.setHours(startDate.getHours(), 0, 0, 0);
//   //   time_stamp + 3600000;
//   // }

//   // console.log(ID + ' time_stamp ' + time_stamp);

//   // const end_date = new Date(time_stamp);

//   console.log(ID + ' startDate ' + startDate + ' end_date ' + endDate);

//   return [startDate, endDate];
// };

// const groupData = (ID: GRAPH_ID, data: PracticeData[]) => {
//   if (data.length <= 0) return [];

//   const grouped_data: PracticeData[] = [];
//   const [startDate, endDate] = getStartEndDateForGroupData(
//     ID,
//     data[0].getDate(),
//   );

//   let groupedPD: PracticeData = new PracticeData(startDate);

//   data.map(pd => {
//     if (pd.getDate() > currentEnd) {
//       grouped_data.push(groupedPD);

//       const [startDate, endDate] = getStartEndDateForGroupData(
//         ID,
//         pd.getDate(),
//       );
//       groupedPD = new PracticeData(startDate);
//       currentEnd = endDate;
//     }

//     pd.getCounts().forEach((value, key) => {
//       const val = groupedPD.getCounts().get(key);

//       if (val != undefined) groupedPD.updateValues(key, val + value);
//     });
//   });

//   return grouped_data;
// };

const buildGraph = (
  data: Map<GRAPH_ID, PracticeData[]>,
  WIDTH: number,
  HEIGHT: number,
  ID: GRAPH_ID,
): Graph => {
  const grid_div = GRAPH_INFO[ID].grid_div;
  const total_milli = GRAPH_INFO[ID].total_milli;

  const pad_width = WIDTH - PADDING;
  const pad_height = HEIGHT - PADDING;
  const inner_width = pad_width - GRID_RIGHT_MARGIN;
  const pad_x_start = PADDING / 2;
  const inner_x_start = pad_x_start + GRID_RIGHT_MARGIN;
  const inner_height = pad_height - GRID_BOTTOM_MARGIN;

  const data_group = data.get(ID);

  console.log('data_group YOOOOOO' + JSON.stringify(data_group));

  if (data_group == undefined)
    return {
      ID: ID,
      exercises: buildExercisePlots(
        [],
        inner_x_start,
        PADDING,
        inner_width,
        inner_height,
        total_milli,
        10,
      ),
      grid: buildGrid(
        inner_x_start,
        PADDING,
        inner_width,
        inner_height,
        grid_div,
        10,
      ),
      yLabels: buildYAxisLabels(10, pad_height, pad_x_start, pad_x_start),
      xLabels: buildXAxisLabels(ID, WIDTH, grid_div, pad_height, inner_x_start),
      label: ID,
    };

  // console.log('data_group ' + JSON.stringify(data_group));

  // const filtered_data = filterData(ID, data_group);

  // console.log('filtered_data ' + JSON.stringify(filtered_data));
  // const group_data = groupData(ID, filtered_data);

  // console.log('group_data ' + JSON.stringify(group_data));

  let max_y = getMaxY(data_group);
  max_y = Math.ceil(max_y / 10) * 10;

  return {
    ID: ID,
    exercises: buildExercisePlots(
      data_group,
      inner_x_start,
      PADDING,
      inner_width,
      inner_height,
      total_milli,
      max_y,
    ),
    grid: buildGrid(
      inner_x_start,
      PADDING,
      inner_width,
      inner_height,
      grid_div,
      max_y,
    ),
    yLabels: buildYAxisLabels(max_y, pad_height, pad_x_start, pad_x_start),
    xLabels: buildXAxisLabels(ID, WIDTH, grid_div, pad_height, inner_x_start),
    label: ID,
  };
};

export const getGraph = (
  width: number,
  height: number,
  data: Map<GRAPH_ID, PracticeData[]>,
): Graph[] => {
  const graphs = [];

  // const gWeek = buildGraph(data, width, height, 'Week');
  // const gMonth = buildGraph(data, width, height, 'Month');
  const gYear = buildGraph(data, width, height, 'Year');

  return [gYear];
};
