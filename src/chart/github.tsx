import React from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { produceNumericArray } from '@1studio/utils/array';


/* !- React Actions */

import { popover } from '../layer/actions';


/* !- React Elements */

import Coordinate from './coordinate';


/* !- Types */

import { IDataElement } from './coordinate/types';
import { LabelPropTypes } from './coordinate/axisLabel';

/**
 * One box (week or month). `color` picks the box class (`github-<color>`, see
 * chart.scss): red | green | gray-light | good | warning | bad | neutral
 */
export type GithubRecord = {
  value?: React.ReactNode;
  color?: string;
  [key: string]: any;
};


/* !- Constants */

const BOX_PADDING = 2;
const WEEKS_OF_THE_MONTH = 5;
const MONTHS_OF_THE_YEAR = 12;
const WEEKS_OF_THE_YEAR = WEEKS_OF_THE_MONTH * MONTHS_OF_THE_YEAR;

const yAxisValueMax = WEEKS_OF_THE_MONTH + 2;


/* !- Elements */

const xAxisLabel = ({ i, x, y, canvas }: LabelPropTypes) =>
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


const box = (record: GithubRecord | undefined, { onClick }) => ({ x, y, canvas }) =>
{
  if (!record || record.value === undefined || record.value === null || record.value === '')
  {
    return <g />;
  }

  return (
    <g
      className={classNames('github-box', `github-${record.color || 'gray-light'}`, {
        pointer: !!onClick,
      })}
      onClick={onClick ? event => onClick(record, event) : undefined}
    >
      <rect
        x={x + BOX_PADDING}
        y={y + BOX_PADDING}
        width={canvas.colWidth - BOX_PADDING * 2}
        height={canvas.rowHeight - BOX_PADDING * 2}
        rx="8"
        ry="8"
      />
      <text
        className="no-events"
        x={x + canvas.colWidth / 2}
        y={y + canvas.rowHeight / 2}
        alignmentBaseline="middle"
        textAnchor="middle"
      >
        {record.value}
      </text>
    </g>
  );
};

const separator = ({ x, y, canvas }: IDataElement) => (
  <line
    x1={x}
    y1={y + canvas.rowHeight / 2}
    x2={x + canvas.width}
    y2={y + canvas.rowHeight / 2}
  />
);


/**
 * Iterate row by row (jan 1st week, feb 1st week ...) and return the 0-based
 * iso week index of the cell, or false if the cell is empty. A week belongs to
 * the month of its sunday.
 */
const getWeek = (i: number, year: number): number | false =>
{
  const col = (i - 1) % MONTHS_OF_THE_YEAR + 1;
  const row = Math.floor((i - 1) / MONTHS_OF_THE_YEAR);

  const date = moment(`${year}-${col}-1`, 'YYYY-M-D').startOf('isoWeek').add(row, 'weeks').endOf('isoWeek');

  if (date.isoWeekYear() !== year)
  {
    return false; // last week of the prev year
  }

  if (date.month() + 1 !== col)
  {
    return false; // @Example feb 1. add 5 weeks first day start marc.
  }

  return date.isoWeek() - 1;
};


type PropTypes = {
  // weekly boxes, index = iso week - 1
  data?: Array<GithubRecord | undefined>;
  // monthly boxes (bottom row), index = month - 1
  sumData?: Array<GithubRecord | undefined>;
  // weeks are laid out by the calendar of this year
  year?: number;
  width?: number;
  height?: number;
  // popover content of the clicked box
  Popover?: React.ComponentType<{ record: GithubRecord }>;
  // instead of the popover
  onClick?: (record: GithubRecord, event: React.MouseEvent) => void;
  // @deprecated: the redux store comes from the Provider
  store?: { dispatch?: Function };
};


/**
 * Github-like yearly calendar: 12 month columns, up to 5 weeks each, and a
 * monthly summary row under the separator
 */
const ChartGithub = (
{
  data = [],
  sumData = [],
  year = moment().year(),
  width = 800,
  height = 500,
  Popover,
  onClick,
  store,
}: PropTypes) =>
{
  const reduxDispatch = useDispatch();
  const dispatch = store?.dispatch || reduxDispatch;

  const onClickBox = onClick
    || (Popover
      ? (record, event) => dispatch(popover(<Popover record={record} />, event))
      : undefined);

  return (
    <Coordinate
      id="github"
      className="chart github no-select"
      width={width}
      height={height}
      data={{
        weeks: produceNumericArray(1, WEEKS_OF_THE_YEAR).map((i) =>
        {
          const week = getWeek(i, year);

          return {
            x: (i - 1) % MONTHS_OF_THE_YEAR,
            y: yAxisValueMax - Math.floor((i - 1) / MONTHS_OF_THE_YEAR),
            element: box(week === false ? undefined : data[week], { onClick: onClickBox }),
          };
        }),
        separator: [{
          x: 0,
          y: 2,
          element: separator,
        }],
        months: produceNumericArray(1, MONTHS_OF_THE_YEAR).map(i => ({
          x: i - 1,
          y: 1,
          element: box(sumData[i - 1], { onClick: onClickBox }),
        })),
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
};

export default ChartGithub;
