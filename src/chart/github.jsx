import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';
import { produceNumericArray } from '@1studio/utils/array';


/* !- React Actions */

import { popover, flush } from '../layer/actions';


/* !- React Elements */

import Coordinate from './coordinate';



/* !- Constants */

const BOX_PADDING = 2;
const WEEKS_OF_THE_MONTH = 5;
const MONTHS_OF_THE_YEAR = 12;
const WEEKS_OF_THE_YEAR = WEEKS_OF_THE_MONTH * MONTHS_OF_THE_YEAR;

const yAxisValueMax = WEEKS_OF_THE_MONTH + 2;




/* !- Elements */

const xAxisLabel = ({ i, x, y, canvas }) =>
(
  <text
    x={x + (canvas.colWidth / 2)}
    y={y - canvas.height - (canvas.margin.top / 2)}
    alignmentBaseline="middle"
    textAnchor="middle"
  >
    {moment().startOf('year').add(i, 'months').format('MMM')}
  </text>
);

const WHITE_TEXT = ['red'];

const box = (record, { store, Popover }) => ({ x, y, canvas }) =>
{
  if (!record || !record.value)
  {
    return <g />;
  }


  const onClickHandler = event =>
    store.dispatch(popover(<Popover record={record} />, event));

  return (
    <g>
      <rect
        className={classNames({
          pointer: true,
          [`fill-${record.color}`]: true,
        })}
        x={x + BOX_PADDING}
        y={y + BOX_PADDING}
        width={canvas.colWidth - BOX_PADDING * 2}
        height={canvas.rowHeight - BOX_PADDING * 2}
        rx="8"
        ry="8"
        onClick={onClickHandler}
      />
      <text
        className='no-events'
        x={x + canvas.colWidth / 2}
        y={y + canvas.rowHeight / 2}
        alignmentBaseline="middle"
        textAnchor="middle"
        fill={classNames({
          'white': WHITE_TEXT.indexOf(record.color) !== -1,
        })}
      >
        { record.value }
      </text>
    </g>
  );
}

const separator = ({ x, y, canvas }) => (
  <line
    x1={x}
    y1={y + canvas.rowHeight / 2}
    x2={x + canvas.width}
    y2={y + canvas.rowHeight / 2}
    stroke="#000"
  />
);


  /**
   * Iterate row by row:
   * jan week first, feb week first...
   */
   const getWeek = i =>
   {
     const col = (i - 1) % MONTHS_OF_THE_YEAR + 1;
     const row = Math.floor((i - 1) / MONTHS_OF_THE_YEAR);
    
     const date = moment(`2022-${col}-1`).add(row, 'weeks');
 
     const week = date.isoWeek();
     const month = date.month() + 1;
 
     if (week === 52 && month == 1)
     {
       return false; // week start of prev year
     }
 
     if (month !== col)
     {
       return false; // @Example feb 1. add 5 weeks first day start marc.
     }
 
     return week - 1;
   }


const ChartGithub = ({ data, sumData, width, height, Popover }, { store }) => (
  <Coordinate
    id="github"
    className="chart github no-select"
    width={width}
    height={height}
    data={{
      weeks: produceNumericArray(1, WEEKS_OF_THE_YEAR).map(i => ({
        x: (i - 1) % MONTHS_OF_THE_YEAR,
        y: yAxisValueMax - Math.floor((i - 1) / MONTHS_OF_THE_YEAR),
        element: box(data[getWeek(i)], { Popover, store }),
      })),
      separator: [{
        x: 0,
        y: 2,
        element: separator,
      }],
      months: produceNumericArray(1, MONTHS_OF_THE_YEAR).map(i => ({
        x: i - 1,
        y: 1,
        element: box(sumData[i - 1], { Popover, store })
      }))
    }}
    xAxisSteps={MONTHS_OF_THE_YEAR}
    yAxisSteps={7}
    xAxisValueMin={0}
    xAxisValueMax={MONTHS_OF_THE_YEAR}
    xGrid={false}
    yAxisValueMax={yAxisValueMax}
    yAxisValueMin={0}
    xAxisLabel={xAxisLabel}
    yAxis={false}
    yGrid={false}
    margin={{
      top: 40,
      right: 0,
      bottom: 10,
      left: 0,
    }}
  />
);

ChartGithub.defaultProps =
{
  data: [],
  sumData: [],
  width: 800,
  height: 500,
}

ChartGithub.contextTypes = 
{
  store: PropTypes.object,
}

export default ChartGithub;