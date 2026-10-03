import {
  GraphGenerator,
  GraphData,
  PathSet,
  layoutXLabels,
} from '../GraphBuilder';
import {GRAPH_FIXTURES} from '../fixtures';
import {
  ExerciseType,
  IAllPracticeData,
  IPracticeData,
} from '../../../../data/Models/DataModels';

// Swap Skia's path for a recorder so we can assert on exactly what gets drawn
jest.mock('@shopify/react-native-skia', () => {
  class RecordingPath {
    ops: {op: string; x: number; y: number}[] = [];
    moveTo(x: number, y: number) {
      this.ops.push({op: 'moveTo', x, y});
      return this;
    }
    lineTo(x: number, y: number) {
      this.ops.push({op: 'lineTo', x, y});
      return this;
    }
    addCircle(x: number, y: number) {
      this.ops.push({op: 'circle', x, y});
      return this;
    }
  }
  return {Skia: {Path: {Make: () => new RecordingPath()}}};
});

type Op = {op: string; x: number; y: number};
const opsOf = (path: unknown): Op[] => (path as {ops: Op[]}).ops;

const WIDTH = 400;
const HEIGHT = 300;
// Misalignment smaller than this isn't visible on screen
const PX_TOLERANCE = 2;
const WEEK = 0;
const YEAR = 1;
const EXERCISES: ExerciseType[] = [
  'scale',
  'octave',
  'arpeggio',
  'solidChord',
  'brokenChord',
];

const entry = (
  date: Date,
  counts: Partial<Record<ExerciseType, number>> = {},
): IPracticeData => ({
  // Matches what the DB layer hands to the graph (Date#toString)
  date: date.toString(),
  scale: 0,
  octave: 0,
  arpeggio: 0,
  solidChord: 0,
  brokenChord: 0,
  ...counts,
});

const build = (data: Partial<IAllPracticeData>): GraphData =>
  new GraphGenerator().getGraph(WIDTH, HEIGHT, {
    Year: [],
    Month: [],
    Week: [],
    Day: [],
    ...data,
  });

// Grid path = vertical column lines followed by horizontal row lines
const gridColumns = (graph: GraphData, index: number) => {
  const ops = opsOf(graph.grids[index]);
  const xs: number[] = [];
  for (let i = 0; i < ops.length; i += 2) {
    if (ops[i].x === ops[i + 1].x) xs.push(ops[i].x);
  }
  return xs;
};

const gridRows = (graph: GraphData, index: number) => {
  const ops = opsOf(graph.grids[index]);
  const ys: number[] = [];
  for (let i = 0; i < ops.length; i += 2) {
    if (ops[i].y === ops[i + 1].y) ys.push(ops[i].y);
  }
  return ys;
};

const gridBounds = (graph: GraphData, index: number) => {
  const cols = gridColumns(graph, index);
  const rows = gridRows(graph, index);
  return {
    left: Math.min(...cols),
    right: Math.max(...cols),
    top: Math.min(...rows),
    bottom: Math.max(...rows),
  };
};

const allPlotOps = (graph: GraphData, index: number) =>
  EXERCISES.flatMap(ex => {
    const set: PathSet = graph.exercises[index][ex];
    return [...opsOf(set.line), ...opsOf(set.dots)];
  });

const dotsFor = (graph: GraphData, index: number, ex: ExerciseType) =>
  opsOf(graph.exercises[index][ex].dots);

// Mon 28 Sep 2026 -> Sun 4 Oct 2026, built in local time
const WEEKDAYS = [
  ['Mon', new Date(2026, 8, 28)],
  ['Tues', new Date(2026, 8, 29)],
  ['Wed', new Date(2026, 8, 30)],
  ['Thurs', new Date(2026, 9, 1)],
  ['Fri', new Date(2026, 9, 2)],
  ['Sat', new Date(2026, 9, 3)],
  ['Sun', new Date(2026, 9, 4)],
] as const;

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('GraphGenerator structure', () => {
  it('builds a Week and a Year graph', () => {
    const graph = build({});

    expect(graph.titles).toEqual(['Week', 'Year']);
    expect(graph.grids).toHaveLength(2);
    expect(graph.exercises).toHaveLength(2);
    expect(graph.labels).toHaveLength(2);
    expect(gridColumns(graph, WEEK)).toHaveLength(7);
    expect(gridColumns(graph, YEAR)).toHaveLength(12);
  });

  it('labels the x axis with weekdays and months', () => {
    const graph = build({});

    expect(graph.labels[WEEK].xLabels.map(l => l.text)).toEqual(
      WEEKDAYS.map(([label]) => label),
    );
    expect(graph.labels[YEAR].xLabels.map(l => l.text)).toEqual([
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec',
    ]);
  });
});

describe('GraphGenerator edge-case data', () => {
  it('draws nothing (and does not crash) with no practice data', () => {
    const graph = build({Week: [], Year: []});

    expect(allPlotOps(graph, WEEK)).toEqual([]);
    expect(allPlotOps(graph, YEAR)).toEqual([]);
    expect(graph.labels[WEEK].yLabels.map(l => l.text)[0]).toBe('10');
  });

  it('plots a day where nothing was practiced on the bottom line, not NaN', () => {
    const graph = build({Week: [entry(new Date(2026, 8, 30))]});
    const {bottom} = gridBounds(graph, WEEK);

    for (const op of allPlotOps(graph, WEEK)) {
      expect(Number.isFinite(op.x)).toBe(true);
      expect(op.y).toBe(bottom);
    }
    for (const label of graph.labels[WEEK].yLabels) {
      expect(label.text).not.toBe('NaN');
    }
  });

  it('draws a single entry as a dot with no line segments', () => {
    const graph = build({Week: [entry(new Date(2026, 8, 30), {scale: 5})]});
    const line = opsOf(graph.exercises[WEEK].scale.line);

    expect(line.map(o => o.op)).toEqual(['moveTo']);
    expect(dotsFor(graph, WEEK, 'scale')).toHaveLength(1);
  });

  it('joins consecutive days into one line', () => {
    const graph = build({
      Week: [
        entry(new Date(2026, 8, 28), {scale: 1}),
        entry(new Date(2026, 8, 29), {scale: 4}),
        entry(new Date(2026, 8, 30), {scale: 2}),
      ],
    });
    const line = opsOf(graph.exercises[WEEK].scale.line);

    expect(line.map(o => o.op)).toEqual(['moveTo', 'lineTo', 'lineTo']);
    expect(line[0].x).toBeLessThan(line[1].x);
    expect(line[1].x).toBeLessThan(line[2].x);
  });

  it('puts the biggest count on the top grid line and zero on the bottom', () => {
    const graph = build({
      Week: [entry(new Date(2026, 8, 30), {scale: 20, octave: 0})],
    });
    const {top, bottom} = gridBounds(graph, WEEK);

    expect(dotsFor(graph, WEEK, 'scale')[0].y).toBe(top);
    expect(dotsFor(graph, WEEK, 'octave')[0].y).toBe(bottom);
  });

  it.each([
    [1, '10'],
    [9, '10'],
    [10, '10'],
    [11, '20'],
    [95, '100'],
    [1000, '1000'],
  ])('rounds a max of %d up to a y-axis top of %s', (max, expected) => {
    const graph = build({
      Week: [entry(new Date(2026, 8, 30), {arpeggio: max})],
    });
    const yLabels = graph.labels[WEEK].yLabels.map(l => l.text);

    expect(yLabels[0]).toBe(expected);
    expect(yLabels[yLabels.length - 1]).toBe('0');
  });

  it('keeps every point inside the grid, for week and year', () => {
    const graph = build({
      Week: WEEKDAYS.map(([, d], i) =>
        entry(d, {scale: i * 13, octave: 1, brokenChord: 999}),
      ),
      Year: Array.from({length: 12}, (_, m) =>
        entry(new Date(2026, m, 1), {solidChord: m * 37, arpeggio: 3}),
      ),
    });

    for (const index of [WEEK, YEAR]) {
      const {left, right, top, bottom} = gridBounds(graph, index);
      for (const op of allPlotOps(graph, index)) {
        expect(op.x).toBeGreaterThanOrEqual(left);
        expect(op.x).toBeLessThanOrEqual(right);
        expect(op.y).toBeGreaterThanOrEqual(top);
        expect(op.y).toBeLessThanOrEqual(bottom);
      }
    }
  });
});

describe('GraphGenerator x placement', () => {
  it.each(WEEKDAYS)('plots a %s entry in its labelled column', (label, date) => {
    const graph = build({Week: [entry(date, {scale: 3})]});
    const column = graph.labels[WEEK].xLabels.findIndex(l => l.text === label);

    expect(dotsFor(graph, WEEK, 'scale')[0].x).toBe(
      gridColumns(graph, WEEK)[column],
    );
  });

  it('plots each month in its own column', () => {
    const graph = build({
      Year: Array.from({length: 12}, (_, m) =>
        entry(new Date(2026, m, 15), {scale: 1}),
      ),
    });

    expect(dotsFor(graph, YEAR, 'scale').map(d => d.x)).toEqual(
      gridColumns(graph, YEAR),
    );
  });
});

describe('GraphGenerator axis labels', () => {
  it.each([
    ['Week', WEEK],
    ['Year', YEAR],
  ])('%s x labels sit on their grid columns', (_, index) => {
    const graph = build({});
    const cols = gridColumns(graph, index);

    graph.labels[index].xLabels.forEach((label, i) => {
      expect(Math.abs(label.pos.x - cols[i])).toBeLessThanOrEqual(PX_TOLERANCE);
    });
  });

  it.each([300, 600, 900])(
    'y labels stay evenly aligned with grid rows at height %d',
    height => {
      const graph = new GraphGenerator().getGraph(WIDTH, height, {
        Year: [],
        Month: [],
        Week: [],
        Day: [],
      });
      const rows = gridRows(graph, WEEK);
      const offsets = graph.labels[WEEK].yLabels.map((l, i) => l.pos.y - rows[i]);

      // Text baseline may sit a fixed distance off the line, but must not drift
      for (const offset of offsets) {
        expect(Math.abs(offset - offsets[0])).toBeLessThanOrEqual(PX_TOLERANCE);
      }
    },
  );
});

describe('Graph Playground fixtures', () => {
  it.each(Object.entries(GRAPH_FIXTURES))(
    '"%s" builds with every point finite and inside the grid',
    (_, data) => {
      const graph = new GraphGenerator().getGraph(WIDTH, HEIGHT, data);

      for (const index of [WEEK, YEAR]) {
        const {left, right, top, bottom} = gridBounds(graph, index);
        for (const op of allPlotOps(graph, index)) {
          expect(op.x).toBeGreaterThanOrEqual(left);
          expect(op.x).toBeLessThanOrEqual(right);
          expect(op.y).toBeGreaterThanOrEqual(top);
          expect(op.y).toBeLessThanOrEqual(bottom);
        }
      }
    },
  );
});

describe('layoutXLabels', () => {
  // Roughly SF Mono at 12px
  const monoMeasure = (text: string) => text.length * 7.2;

  it.each([
    ['Week', WEEK],
    ['Year', YEAR],
  ])('anchors each %s label at its column, below the grid', (_, index) => {
    const graph = build({});
    const cols = gridColumns(graph, index);
    const {bottom} = gridBounds(graph, index);
    const placed = layoutXLabels(graph.labels[index].xLabels, monoMeasure);

    expect(placed).toHaveLength(cols.length);
    placed.forEach((label, i) => {
      expect(label.x).toBe(cols[i]);
      expect(label.y).toBeGreaterThan(bottom);
      expect(label.y).toBeLessThan(HEIGHT);
      expect(label.width).toBe(monoMeasure(label.text));
    });
  });

  it('handles no labels', () => {
    expect(layoutXLabels([], monoMeasure)).toEqual([]);
  });
});
