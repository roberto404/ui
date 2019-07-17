
import React from 'react';
import PropTypes from 'prop-types';


/* !- Constants */

const DEFAULT_STYLE = {
  width: '1',
  color: '#e8e7e8',
};


/**
 * y-Grid component
 */
const yGrid = (
  props,
  {
    calendarCoord,
    rowHeight,
    calendarWidth,
    rowNum,
  },
) =>
{
  const lines = [];

  for (let i = 0; i <= rowNum; i += 1)
  {
    lines.push(
      <line
        key={i}
        x1={calendarCoord.x}
        y1={calendarCoord.y + (i * rowHeight)}
        x2={calendarCoord.x + calendarWidth}
        y2={calendarCoord.y + (i * rowHeight)}
        stroke={DEFAULT_STYLE.color}
        strokeWidth={DEFAULT_STYLE.width}
      />,
    );
  }

  return <g id="ygrid">{lines}</g>;
};


yGrid.contextTypes =
{
  rowHeight: PropTypes.number,
  calendarCoord: PropTypes.object.isRequired,
  calendarWidth: PropTypes.number.isRequired,
  rowNum: PropTypes.number,
};


export default yGrid;
