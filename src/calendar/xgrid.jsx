
import React from 'react';
import PropTypes from 'prop-types';


/* !- Constants */

const DEFAULT_STYLE = {
  width: '1',
  color: '#eaeaea',
};


/**
 * x-Grid component
 */
const xGrid = (
  props,
  {
    calendarCoord,
    colWidth,
    calendarHeight,
    colNum,
  },
) =>
{
  const lines = [];

  for (let i = 0; i <= colNum; i += 1)
  {
    lines.push(
      <line
        key={i}
        x1={calendarCoord.x + (i * colWidth)}
        y1={0/*calendarCoord.y*/}
        x2={calendarCoord.x + (i * colWidth)}
        y2={calendarCoord.y + calendarHeight}
        stroke={DEFAULT_STYLE.color}
        strokeWidth={DEFAULT_STYLE.width}
      />,
    );
  }

  return <g id="xgrid">{lines}</g>;
};

/**
 * propTypes
 * @type {Object}
 */
xGrid.propTypes =
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
xGrid.defaultProps =
{
  // style: {},
};

xGrid.contextTypes =
{
  colWidth: PropTypes.number,
  calendarCoord: PropTypes.object.isRequired,
  calendarHeight: PropTypes.number.isRequired,
  colNum: PropTypes.number,
};


export default xGrid;
