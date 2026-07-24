import gridReducer from '@1studio/ui/grid/reducers';
import { setData, applyFilter, detachFilter } from '@1studio/ui/grid/actions';
import { dateInterselection } from '@1studio/ui/grid/filters';
import { seriesToRows } from '@1studio/ui/chart/card/hooks/useSeriesGrid';


/* !- Fixtures */

const DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;
const anchor = new Date('2025-06-01').getTime();

const data = [
  {
    id: 'rate',
    values: Array.from({ length: DAYS }, (_, i) => 100 + i),
    xAxis: Array.from({ length: DAYS }, (_, i) => new Date(anchor + (i * DAY_MS)).toISOString().slice(0, 10)),
  },
];

const rows = seriesToRows(data);
const max = Math.max(...data[0].xAxis.map((d) => new Date(d).getTime()));
const window = (days: number) => `${max - (days * DAY_MS)}|${max}`;

/**
 * Reduce a sequence of grid actions the way the store would, mirroring exactly
 * what useSeriesGrid dispatches (load with a registered date filter, then toggle).
 */
const run = (actions: any[]) =>
  actions.reduce((state, action) => ({ grid: gridReducer(state.grid, action) }), { grid: {} } as any);


/* !- Tests */

describe('seriesToRows', () => {
  it('flattens series into wide, date-carrying rows', () => {
    expect(rows).toHaveLength(DAYS);
    expect(rows[0]).toMatchObject({ id: 0, x: 0, rate: 100, __label: '2025-06-01', date: '2025-06-01' });
    expect(rows[DAYS - 1].rate).toBe(129);
  });
});

describe('FilterCard grid pipeline (Data + dateInterselection)', () => {
  it('the default 1W window keeps the last 8 days', () => {
    const state = run([
      setData(rows, {
        paginate: { limit: 0, page: 1 },
        filters: [
          { id: '1w', handler: dateInterselection, arguments: [window(7)], status: true },
          { id: '1m', handler: dateInterselection, arguments: [], status: false },
        ],
      }, 't'),
    ]);

    // 06-23 .. 06-30 inclusive
    expect(state.grid.t.results).toHaveLength(8);
    expect(state.grid.t.rawData).toHaveLength(DAYS);
  });

  it('switching 1W -> 1M widens the result to the whole series', () => {
    const state = run([
      setData(rows, {
        paginate: { limit: 0, page: 1 },
        filters: [
          { id: '1w', handler: dateInterselection, arguments: [window(7)], status: true },
          { id: '1m', handler: dateInterselection, arguments: [], status: false },
        ],
      }, 't'),
      applyFilter('1m', window(30), 't'),
      detachFilter('1w', undefined, 't'),
    ]);

    expect(state.grid.t.results).toHaveLength(DAYS);
  });

  it('reconstructs the primary points (with .y) from the filtered rows', () => {
    const state = run([
      setData(rows, {
        paginate: { limit: 0, page: 1 },
        filters: [{ id: '1w', handler: dateInterselection, arguments: [window(7)], status: true }],
      }, 't'),
    ]);

    const results = state.grid.t.results;
    const points = results.map((row: any) => ({ ...row, y: row.rate }));

    expect(points[0].y).toBe(122); // day 23 => value 100 + 22
    expect(points[points.length - 1].y).toBe(129);
  });
});

describe('DateFilterCard grid pipeline (multi-series + period filter)', () => {
  const DAYS_90 = 90;
  const multiXAxis = Array.from({ length: DAYS_90 }, (_, i) => new Date(anchor + (i * DAY_MS)).toISOString().slice(0, 10));
  const multiData = [
    { id: 'income', values: Array.from({ length: DAYS_90 }, (_, i) => 100 + i), xAxis: multiXAxis },
    { id: 'expense', values: Array.from({ length: DAYS_90 }, (_, i) => 50 + i), xAxis: multiXAxis },
  ];
  const multiRows = seriesToRows(multiData);

  const june = `${new Date('2025-06-01').getTime()}|${new Date('2025-07-01').getTime() - 1}`;

  it('selecting a period keeps only that month, aligned across series', () => {
    const state = run([
      setData(multiRows, {
        paginate: { limit: 0, page: 1 },
        filters: [{ id: 'period', handler: dateInterselection, arguments: [], status: false }],
      }, 'd'),
      applyFilter('period', june, 'd'),
    ]);

    const results = state.grid.d.results;

    expect(results).toHaveLength(30); // June 1..30
    // both series stay aligned on the same filtered rows
    expect(results.map((row: any) => row.income)).toHaveLength(30);
    expect(results[0]).toMatchObject({ income: 100, expense: 50 });
    expect(results[29]).toMatchObject({ income: 129, expense: 79 });
  });

  it('clearing the period restores the full range', () => {
    const state = run([
      setData(multiRows, {
        paginate: { limit: 0, page: 1 },
        filters: [{ id: 'period', handler: dateInterselection, arguments: [june], status: true }],
      }, 'd'),
      detachFilter('period', undefined, 'd'),
    ]);

    expect(state.grid.d.results).toHaveLength(DAYS_90);
  });
});
