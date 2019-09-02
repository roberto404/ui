
import React from 'react';
import PropTypes from 'prop-types';


export const xAxisLabel = ({ i, x, y }) =>
(
  <text
    x={x - 3}
    y={y}
    alignmentBaseline="middle"
    textAnchor="end"
  >
    {i}
  </text>
);

export const yAxisLabel = ({ i, x, y }) =>
(
  <text
    x={x}
    y={y + 3}
    alignmentBaseline="hanging"
    textAnchor="middle"
  >
    {i}
  </text>
);

yAxisLabel.propTypes =
xAxisLabel.propTypes =
{
  i: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
};


/**
 * Axis component
 */
const Axis = ({
  id,
  coordToPix,
  steps,
  UI,
  direction,
}) =>
{
  const labels = [];

  for (let i = 0; i <= steps; i += 1)
  {
    labels.push(
      <UI
        i={i}
        key={i}
        {...(direction === 'x' ? coordToPix(i, 0) : coordToPix(0, i))}
      />,
    );
  }

  return (
    <g id={id}>
      { labels }
    </g>
  );
};

/**
 * propTypes
 * @type {Object}
 */
Axis.propTypes =
{
};

/**
 * defaultProps
 * @type {Object}
 */
Axis.defaultProps =
{
  id: 'axis',
  direction: 'x',
};

export default Axis;
