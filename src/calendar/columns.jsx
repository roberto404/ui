
import React from 'react';
import PropTypes from 'prop-types';


/* !- Constants */

const DEFAULT_STYLE = {
  colorWeekday: '#f5f5f5',
  colorWeekend: 'white',
};

import { ONE_DAY } from './constants';

/**
 * Columns component
 */
const Columns = (
  props,
  {
    startDate,
    calendarCoord,
    colWidth,
    calendarHeight,
    colNum,
    moment,
  },
) =>
{
  const days = [];

  for (let i = 0; i < colNum; i += 1)
  {
    const dayOfWeek = moment(startDate.getTime() + (ONE_DAY * i)).format('E');
    let fill = dayOfWeek >= 6 ? DEFAULT_STYLE.colorWeekend : DEFAULT_STYLE.colorWeekday

    days.push(
      <rect
        key={i}
        x={calendarCoord.x + (i * colWidth)}
        y={calendarCoord.y}
        width={colWidth}
        height={calendarHeight}
        fill={fill}
        data-weekend={dayOfWeek >= 6}
      />,
    );
  }

  return <g id="columns">{days}</g>;
};

Columns.contextTypes =
{
  startDate: PropTypes.instanceOf(Date).isRequired,
  colWidth: PropTypes.number,
  calendarCoord: PropTypes.object.isRequired,
  calendarHeight: PropTypes.number.isRequired,
  colNum: PropTypes.number,
  moment: PropTypes.func,
};


export default Columns;
