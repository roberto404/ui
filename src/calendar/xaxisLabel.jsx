
import React from 'react';
import PropTypes from 'prop-types';


/* !- Constants */

const DEFAULT_STYLE = {
  fill: '#d9d9d9',
  fontSize: 12,
  fontFamily: 'sans-serif',
  marginRight: 5,
};


/**
 * x-Axis component
 */
const xAxisLabel = (
{
  hour,
  coord,
},
) =>
{
  const width = coord.right - coord.left;
  const height = coord.bottom - coord.top;

  const center = {
    x: coord.left + (width / 2),
    y: coord.top + (height / 2),
  };

  return (
    <text
      x={center.x}
      y={coord.top}
      fill={DEFAULT_STYLE.fill}
      fontSize={`${DEFAULT_STYLE.fontSize}px`}
      fontFamily={DEFAULT_STYLE.fontFamily}
      alignmentBaseline="middle"
      textAnchor="middle"
    >
      {`${hour}:00`}
    </text>
  );
};

/**
 * propTypes
 * @type {Object}
 */
xAxisLabel.propTypes =
{
  hour: PropTypes.number.isRequired,
  coord: PropTypes.shape({
    top: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    bottom: PropTypes.number.isRequired,
    right: PropTypes.number.isRequired,
  }).isRequired,
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
xAxisLabel.defaultProps =
{
  // style: {},
};

export default xAxisLabel;
