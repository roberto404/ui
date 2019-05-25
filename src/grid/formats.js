import round from 'lodash/round';
import mean from 'lodash/mean';


const CACHE_AVG = 'cache_avg';

const cache = {};


const validation = ({ state, value }) =>
{
  if (typeof value === 'undefined' || parseFloat(value) === 0)
  {
    return false;
  }

  if (typeof state.grid === 'undefined' || state.grid.model === 'undefined')
  {
    return false;
  }

  return true;
};

/**
 * Determine the dataModel results average value,
 * how many percent of the current value is.
 *
 * @param  {string} column current record key
 * @param  {bool} last   current record is the last
 * @param  {number|string} value  current record key value
 * @return {function}        return calulated percent
 */
export const averageDeviation = ({ column, last, value }) =>
  (state) =>
  {
    if (!validation({ state, value }))
    {
      return 0;
    }

    const dataModel = state.grid.model;

    if (cache[CACHE_AVG] === undefined)
    {
      cache[CACHE_AVG] = dataModel.getPivotTable(mean);
    }

    const percent = (parseFloat(value) / cache[CACHE_AVG][column]) - 1;

    if (last)
    {
      cache[CACHE_AVG] = undefined;
    }

    return round(percent, 2);
  };
