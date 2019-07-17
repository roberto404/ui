
import React from 'react';
import PropTypes from 'prop-types';


/* !- React Elements */

import Label from './yaxisLabel';


/* !- Constants */

import { ONE_DAY } from '../constants';




/**
 * x-Axis component: current interval days, iterate width column numbers.
 */
const yAxis = (
{
  element,
  primary,
  secondary,
},
{
  startDate,
  colWidth,
  colNum,
  calendarCoord,
}
) =>
{
  const labels = [];

  for (let i = 0; i < colNum; i += 1)
  {
    const date = new Date(startDate.getTime() + (ONE_DAY * i));

    labels.push(
      <Label {...{
        date,
        coord:
        {
          top: 0,
          left: calendarCoord.x + (colWidth * i),
          bottom: calendarCoord.y,
          right: calendarCoord.x + (colWidth * (i + 1)),
        },
        isPrimary: Math.floor(date.getTime() / ONE_DAY) === Math.floor(primary.getTime() / ONE_DAY),
        isSecondary: Math.floor(date.getTime() / ONE_DAY) === Math.floor(secondary.getTime() / ONE_DAY),
        // style,
        key: i,
      }}
      />,
    );
  }

  return (
    <g id="yaxis">
      {labels}
    </g>
  );
};

/**
 * propTypes
 * @type {Object}
 */
yAxis.propTypes =
{
  primary: PropTypes.instanceOf(Date),
  secondary: PropTypes.instanceOf(Date),
  // style: PropTypes.shape({
  //   fill: PropTypes.string,
  //   fontSize: PropTypes.number,
  //   fontFamily: PropTypes.string,
  // }),
};

/**
 * defaultProps
 * @type {Object}
 */
yAxis.defaultProps =
{
  primary: new Date(),
  secondary: new Date(0),
  // style: {},
};


yAxis.contextTypes =
{
  startDate: PropTypes.instanceOf(Date).isRequired,
  calendarCoord: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number }).isRequired,
  colNum: PropTypes.number.isRequired,
  colWidth: PropTypes.number.isRequired,
};

export default yAxis;
