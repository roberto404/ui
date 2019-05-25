
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';


/* !- Constants */

const DEFAULT_STYLE = {
  fill: '#d9d9d9',
  color: '#000000',
  // fontSize: 12,
  fontFamily: 'sans-serif',
};


/**
 * x-Axis component
 */
const xAxis = (
{
  rowHeight,
  colWidth,
  colNum,
  calendarCoord,
  firstDayIndex,
  startDate,
  // moment,
},
) =>
{
  const labels = [];
  const momentDay = moment(startDate).subtract(firstDayIndex + 1, 'days');

  for (let i = 0; i < colNum; i += 1)
  {
    const label = momentDay.add(1, 'days').format('dd');

    labels.push(
      <text
        key={i}
        x={calendarCoord.x + ((i + 0.5) * colWidth)}
        y={calendarCoord.y - (rowHeight / 2)}
        fill={DEFAULT_STYLE.color}
        fontSize={`${colWidth * 0.4}px`}
        fontFamily={DEFAULT_STYLE.fontFamily}
        alignmentBaseline="middle"
        textAnchor="middle"
      >
        {label}
      </text>,
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
};

/**
 * defaultProps
 * @type {Object}
 */
xAxis.defaultProps =
{
};

export default xAxis;
