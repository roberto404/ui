
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
  const { canvas } = coordToPix(0, 0);
  const steps = direction === 'x' ? canvas.yAxisSteps : canvas.xAxisSteps;
  const lines = [];

  for (let i = 0; i <= steps; i += 1)
  {
    const coords1 = direction === 'x' ? coordToPix(0, i) : coordToPix(i, 0);
    const coords2 = direction === 'x' ? coordToPix(canvas.xAxisSteps, i) : coordToPix(i, canvas.yAxisSteps);

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
