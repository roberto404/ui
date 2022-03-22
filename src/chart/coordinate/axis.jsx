
import React from 'react';
import PropTypes from 'prop-types';
import clamp from '@1studio/utils/math/clamp';

export const xAxisLabel = ({ value, x, y, canvas }) =>
(
  <text
    x={x}
    y={y + 5}
    alignmentBaseline="hanging"
    textAnchor="middle"
    fontSize={clamp(canvas.colWidth / 4 * 0.8, 4, 16)}
  >
    {value.x}
  </text>
);


export const yAxisLabel = ({ value, x, y, textAnchor }) =>
(
  <text
    x={x + (5 * (textAnchor === 'start' ? 1 : -1))}
    y={y}
    alignmentBaseline="middle"
    textAnchor={textAnchor}
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

yAxisLabel.defaultProps = // eslint-disable-line
{
  textAnchor: "end",
};


/**
 * Axis component
 */
const Axis = ({
  id,
  coordToPix,
  UI,
  direction,
  top,
}) =>
{
  const {
    xAxisSteps,
    yAxisSteps,
    stepXPoints,
    stepYPoints,
    xAxisValues,
    yAxisValueMin,
    width,
  } = coordToPix(0, 0).canvas;

  const steps = direction === 'x' ? xAxisSteps : yAxisSteps;

  const labels = [];

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
          {
            ...(direction === 'x' ? coordToPix(i * stepXPoints, +top * yAxisSteps) : coordToPix(+top * xAxisSteps, i * stepYPoints))
          }
          textAnchor={top ? 'start' : 'end'}
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
  top: false,
};

export default Axis;
