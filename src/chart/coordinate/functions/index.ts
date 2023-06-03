import coordToPix from "./coordToPix";


/* !- Types */

import { PropTypes } from "../index";



/**
 * 
 */
const findMinimumValueInSeries = data =>
  Math.min(...data.map(({ values }) => Math.min(...values)));





/**
 * Collect all data series value to one array.
 * You can determine max value
 *
 * @example
 * data1: [{ x:1, y:2 }, { x:0, y: 3 }],
 * data2: [{ x:1, y:5 }, { x:0, y: 3 }],
 *
 * //=> [2,3,5]
 */
const flattenDataCoord = (data: PropTypes['data'], axis: 'x' | 'y'): number[] =>
  Object.keys(data)
    .map(key =>
      data[key]
        .filter(coord => coord[axis] !== null)
        .map(coord => coord[axis]),
    )
    .flat();

    
export {
  findMinimumValueInSeries,
  flattenDataCoord,
  coordToPix,
};