
import React from 'react';
import PropTypes from 'prop-types';

/* !- React Elements */

import Label from './xaxisLabel';


/**
 * x-Axis component
 */
const xAxis = (
props,
{
  rowHeight,
  rowNum,
  calendarCoord,
},
) =>
{
  const labels = [];

  for (let i = 0; i <= rowNum; i += 1)
  {
    labels.push(
      <Label {...{
        hour: i,
        coord:
        {
          top: calendarCoord.y + (rowHeight * i),
          left: 0,
          bottom: calendarCoord.y + (rowHeight * (i + 1)),
          right: calendarCoord.x,
        },
        // style,
        key: i,
      }}
      />,
    );
  }

  return (
    <g id="xaxis">
      { labels }
    </g>
  );
};

/**
 * propTypes
 * @type {Object}
 */
xAxis.propTypes =
{
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
xAxis.defaultProps =
{
  // style: {},
};

xAxis.contextTypes =
{
  calendarCoord: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number }).isRequired,
  rowNum: PropTypes.number.isRequired,
  rowHeight: PropTypes.number.isRequired,
};


export default xAxis;
