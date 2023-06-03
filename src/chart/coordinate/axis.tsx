
import React from 'react';


/* !- Types */

import { LabelPropTypes } from './axisLabel';
import { coordToPixFuncType } from './functions/coordToPix';

interface PropTypes
{
  id?: string,
  direction: 'x' | 'y',
  coordToPix: coordToPixFuncType,
  top?: boolean,
  UI: React.FC<LabelPropTypes>,
}


/* !- Components */

/**
 * Axis component
 */
const Axis: React.FC<PropTypes> = (
{
  id = 'axis',
  coordToPix,
  UI,
  direction = 'x',
  top = false,
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

  const labels: JSX.Element[] = [];
  

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

export default Axis;
