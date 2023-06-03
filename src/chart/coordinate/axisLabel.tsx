
import React from 'react';
import clamp from '@1studio/utils/math/clamp';


/* !- Types */

import { ICanvas } from './types';

export interface LabelPropTypes
{
  i: number,
  value?: {
    x: number | string,
    y: number,
  },
  x: number,
  y: number,
  textAnchor?: 'start' | 'middle' | 'end',
  canvas: ICanvas,
}

/* !- Components */

export const xAxisLabel: React.FC<LabelPropTypes> = (
{
  value,
  x,
  y,
  canvas,
  textAnchor = 'middle',
}) =>
(
  <text
    x={x}
    y={y + 5}
    alignmentBaseline="hanging"
    textAnchor={textAnchor}
    fontSize={clamp(canvas.colWidth / 4 * 0.8, 4, 16)}
  >
    {value.x}
  </text>
);


export const yAxisLabel: React.FC<LabelPropTypes> = (
{
  value,
  x,
  y,
  textAnchor = "end",
}) =>
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



export default {
  xAxisLabel,
  yAxisLabel,
};
