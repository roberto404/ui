
import React from 'react';
import PropTypes from 'prop-types';

export const xAxisLabel = ({ value, x, y }) =>
(
  <text
    x={x}
    y={y + 5}
    alignmentBaseline="hanging"
    textAnchor="middle"
  >
    {value.x}
  </text>
);

export const yAxisLabel = ({ value, x, y }) =>
(
  <text
    x={x - 5}
    y={y}
    alignmentBaseline="middle"
    textAnchor="end"
  >
    {Math.round(value.y * 10) / 10}
  </text>
);

xAxisLabel.propTypes =
yAxisLabel.propTypes = // eslint-disable-line
{
  value: PropTypes.shape({
    x: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    y: PropTypes.number.isRequired,
  }).isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
};


/**
 * Axis component
 */
const Axis = ({
  id,
  coordToPix,
  UI,
  direction,
}) =>
{
  const {
    xAxisSteps,
    yAxisSteps,
    stepXPoints,
    stepYPoints,
    xAxisValues,
    yAxisValueMin,
  } = coordToPix(0, 0).canvas;

  const steps = direction === 'x' ? xAxisSteps : yAxisSteps;

  const labels = [];

  //[null, 100, 200, 50]

  for (let i = 0; i <= steps; i += 1)
  {
    if (
      direction === 'y' || (xAxisValues[i] !== null)
    )
    {
      labels.push(
        <UI
          key={i}
          i={i}
          value={{
            x: xAxisValues[i],
            y: yAxisValueMin + (i * stepYPoints),
          }}
          {...(direction === 'x' ? coordToPix(i * stepXPoints, 0) : coordToPix(0, i * stepYPoints))}
        />,
      );
    }
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
  id: PropTypes.string,
  direction: PropTypes.oneOf(['x', 'y']).isRequired,
  coordToPix: PropTypes.func.isRequired,
  UI: PropTypes.func.isRequired,
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
