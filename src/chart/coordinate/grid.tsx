
import React from 'react';


/* !- Types */

import { coordToPixFuncType } from './functions/coordToPix';


interface PropTypes
{
  id?: string,
  direction?: 'x' | 'y',
  coordToPix: coordToPixFuncType,
}


/**
 * Grid component
 */
const Grid: React.FC<PropTypes> = (
{
  id = 'grid',
  direction = 'x',
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

  const lines: JSX.Element[] = [];

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

export default Grid;
