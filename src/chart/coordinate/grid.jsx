
import React from 'react';
import PropTypes from 'prop-types';


/**
 * Grid component
 */
const Grid = ({
  id,
  direction,
  coordToPix,
}) =>
{
  const {
    xAxisSteps,
    yAxisSteps,
    stepXPoints,
    stepYPoints,
  } = coordToPix(0, 0).canvas;

  const steps = direction === 'x' ? yAxisSteps : xAxisSteps;

  const lines = [];

  for (let i = 0; i <= steps; i += 1)
  {
    const coords1 = direction === 'x' ? coordToPix(0, i * stepYPoints) : coordToPix(i * stepXPoints, 0);
    const coords2 = direction === 'x' ?
      coordToPix(xAxisSteps * stepXPoints, i * stepYPoints)
      : coordToPix(i * stepXPoints, yAxisSteps * stepYPoints);

    lines.push(
      <line
        key={i}
        x1={coords1.x}
        y1={coords1.y}
        x2={coords2.x}
        y2={coords2.y}
        stroke="#000"
      />,
    );
  }

  return (
    <g id={id}>
      { lines }
    </g>
  );
};

/**
 * propTypes
 * @type {Object}
 */
Grid.propTypes =
{
  id: PropTypes.string,
  direction: PropTypes.oneOf(['x', 'y']).isRequired,
  coordToPix: PropTypes.func.isRequired,
};

/**
 * defaultProps
 * @type {Object}
 */
Grid.defaultProps =
{
  id: 'grid',
  direction: 'x',
};

export default Grid;
