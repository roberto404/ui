import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setData, applyFilter, detachFilter, changeOrder } from '../../../grid/actions';


/* !- Constants */

// stable empty reference for selectors
const EMPTY: any[] = [];


/* !- Types */

export type Series = {
  id: string,
  values: number[],
  xAxis?: Array<string | number>,
  color?: string,
  [key: string]: any,
};

export type FilterRegistration = {
  id: string,
  // record predicate; receives (record, ...arguments) — same contract as Data model filters
  handler: (record: any, ...args: any[]) => boolean,
  // when set, the filter starts active with this argument (avoids a mount-time apply race)
  initialValue?: any,
};

export type SeriesGridApi = {
  // series rebuilt from the current filtered / ordered rows (feeds the chart render-prop)
  series: Series[],
  // primary-series points with `.y` (+ `.date`, and every series value by id) — feeds summary / change
  points: Array<Record<string, any>>,
  // the untouched input series (full range) — for axis bounds or "all time" totals
  raw: Series[],
  applyFilterValue: (filterId: string, value: any) => void,
  detachFilterId: (filterId: string) => void,
  setOrder: (order: any) => void,
  isFilterActive: (filterId: string) => boolean,
};


/* !- Helpers */

/**
 * Flatten the series into wide-format grid rows so date filtering / ordering
 * keeps every series aligned on one shared x-axis:
 *   { id, x, date, __label, [seriesId]: value, ... }
 *
 * The primary (first) series' `xAxis` is the shared axis; `date` is what the
 * grid's date filters read (`dateInterselection` etc.).
 */
export const seriesToRows = (data: Series[]) => {
  const primary = data[0];
  const axis = primary?.xAxis || primary?.values || [];

  return axis.map((_, i) => {
    const label = primary?.xAxis ? primary.xAxis[i] : i;

    const row: Record<string, any> = {
      id: i,
      x: i,
      date: primary?.xAxis ? primary.xAxis[i] : undefined,
      __label: label,
    };

    data.forEach((series) => { row[series.id] = series.values[i]; });

    return row;
  });
};


/**
 * Bind a set of chart series to a Redux grid keyed by `id`.
 *
 * The grid is the single source of truth: filtering / ordering happen there, and
 * the chart, summary and change all read the same processed rows — so a filter
 * change updates every part of the card at once.
 *
 * @param id       redux grid id (one per card)
 * @param data     chart series
 * @param filters  filter handlers to register up front (activated later by id)
 */
export const useSeriesGrid = (
  id: string,
  data: Series[],
  filters: FilterRegistration[] = [],
): SeriesGridApi => {
  const dispatch = useDispatch();

  const rows = useMemo(() => seriesToRows(data), [data]);

  // stable signatures so the load effect only re-runs on real data / filter changes
  const signature = useMemo(
    () => JSON.stringify(data.map((series) => [series.id, series.values, series.xAxis])),
    [data],
  );
  const filterIds = filters.map((filter) => filter.id).join(',');

  useEffect(() => {
    dispatch(setData(
      rows,
      {
        paginate: { limit: 0, page: 1 }, // limit 0 => every row lands in results
        filters: filters.map((filter) => ({
          id: filter.id,
          handler: filter.handler,
          arguments: filter.initialValue !== undefined ? [filter.initialValue] : [],
          status: filter.initialValue !== undefined,
        })),
      },
      id,
    ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, signature, filterIds]);

  // The Data model mutates its `_filters` array in place, so an object/deep-equal
  // selector can miss a status flip. Select the processed results by *reference*
  // (handle() makes a fresh array on every change) and the active-filter set as a
  // *primitive string* (compared by value) — both react reliably.
  const results = useSelector((state: any) => state.grid[id]?.results);

  const activeKey = useSelector((state: any) => (state.grid[id]?.filters || EMPTY)
    .filter((filter: any) => filter.status && filter.arguments && filter.arguments.length)
    .map((filter: any) => filter.id)
    .join('|'));

  const primaryId = data[0]?.id;

  const series = useMemo(
    () => {
      // before the grid is populated, show the input series as-is
      if (!results) {
        return data;
      }

      return data.map((item) => ({
        ...item,
        values: results.map((row: any) => row[item.id]),
        xAxis: results.map((row: any) => row.__label),
      }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [signature, results],
  );

  const points = useMemo(
    () => (results || rows).map((row: any) => ({ ...row, y: row[primaryId] })),
    [results, rows, primaryId],
  );

  return {
    series,
    points,
    raw: data,
    applyFilterValue: (filterId, value) => dispatch(applyFilter(filterId, value, id)),
    detachFilterId: (filterId) => dispatch(detachFilter(filterId, undefined, id)),
    setOrder: (order) => dispatch(changeOrder(order, id)),
    isFilterActive: (filterId) => activeKey.split('|').indexOf(filterId) !== -1,
  };
};

export default useSeriesGrid;
