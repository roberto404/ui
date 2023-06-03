
import React from 'react';
import max from 'lodash/max';
import min from 'lodash/min';
import isEmpty from 'lodash/isEmpty';
import clamp from '@1studio/utils/math/clamp';
import produceNumericArray from '@1studio/utils/array/produceNumericArray';
import gcd from '@1studio/utils/math/gcd';
import { coordToPix, flattenDataCoord } from './functions';


/* !- React Elements */

import Axis from './axis';
import AxisLabel from './axisLabel'
import Grid from './grid';
import Points, { Point } from './point';


/* !- Types */

import {
  ICanvas,
  IData,
  IMargin
} from './types';

import { LabelPropTypes } from './axisLabel';
import { PointType } from './point';

export interface PropTypes
{
  id?: string,
  data: { [key: string]: IData[] },
  width?: number,
  height?: number,
  xAxisSteps?: number,
  xAxisLabel?: React.FC<LabelPropTypes>,
  yAxisSteps?: number,
  yAxisLabel?: React.FC<LabelPropTypes>,
  yAxisValueMax?: number,
  yAxisValueMin?: number,
  yAxisValues?: Array<number | string>,
  xAxisValueMax?: number,
  xAxisValueMin?: number,
  xAxisValues?: Array<number | string>,
  xGrid?: boolean,
  yGrid?: boolean,
  xAxis?: boolean,
  yAxis?: boolean,
  y2Axis?: boolean, // ???
  reverseAxis?: [], // ???
  margin?: IMargin,
  point?: React.FC<PointType>,
  children?: JSX.Element, 
  className?: string,
}


/**
 * Coordinate component
 */
const Coordinate: React.FC<PropTypes> = (
{
  id = 'coordinate',
  data,
  width = 200,
  height = 200,
  xAxisSteps = 0,
  xAxisLabel = AxisLabel.xAxisLabel,
  yAxisSteps = 0,
  yAxisLabel = AxisLabel.yAxisLabel,
  yAxisValueMax,
  yAxisValueMin, // !important no default value, need undefined
  yAxisValues,
  xAxisValueMax,
  xAxisValueMin = 0,
  xAxisValues, // !important no default value, need undefined
  xGrid = true,
  yGrid = true,
  xAxis = true,
  yAxis = true,
  y2Axis,
  reverseAxis = [],
  margin = {
    top: 10,
    bottom: 30,
    left: 30,
    right: 0,
  },
  point = Point,
  children,
  className = 'coordinate',
}) =>
{
  const dataYValues = flattenDataCoord(data, 'y');
  const dataXValues = flattenDataCoord(data, 'x');

  const canvas: ICanvas = {
    x: margin.left,
    y: margin.top,
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom,
    margin,
    svgHeight: height,
    svgWidth: width,

    xAxisValueMin: xAxisValueMin || 0,
    xAxisValueMax: xAxisValueMax || max(dataXValues) || 1,
    yAxisValueMax: yAxisValueMax || max(dataYValues) || 0,
    yAxisValueMin: (typeof yAxisValueMin === 'undefined' ? min(dataYValues) : yAxisValueMin) || 0,

    xAxisValueDiff: 0,
    yAxisValueDiff: 0,
    xAxisSteps: 0,
    yAxisSteps: 0,
    xAxisPoints: 0,
    yAxisPoints: 0,
    stepXPoints: 0,
    stepYPoints: 0,
    colWidth: 0,
    rowHeight: 0,
    xAxisValues: [],
    yAxisValues: [],
  };

  canvas.xAxisValueDiff = canvas.xAxisValueMax - canvas.xAxisValueMin;
  canvas.yAxisValueDiff = canvas.yAxisValueMax - canvas.yAxisValueMin;
  
  canvas.xAxisSteps = xAxisSteps || canvas.xAxisValueDiff;
  canvas.yAxisSteps = yAxisSteps ||
    clamp(canvas.yAxisValueDiff / Math.abs(gcd(dataYValues) || 0), 0, Math.round(canvas.height / 33.3));

  canvas.xAxisPoints = canvas.xAxisValueMax - canvas.xAxisValueMin;
  canvas.yAxisPoints = canvas.yAxisValueMax - canvas.yAxisValueMin;
  canvas.stepXPoints = canvas.xAxisPoints / canvas.xAxisSteps;
  canvas.stepYPoints = canvas.yAxisPoints / canvas.yAxisSteps;

  canvas.colWidth = canvas.width / canvas.xAxisPoints;
  canvas.rowHeight = canvas.height / canvas.yAxisPoints;

  canvas.xAxisValues = xAxisValues || produceNumericArray(
    0,
    canvas.xAxisSteps,
    i => canvas.xAxisValueMin + ((canvas.xAxisValueDiff / canvas.xAxisSteps) * i),
  );

  canvas.yAxisValues = yAxisValues || produceNumericArray(
    0,
    canvas.yAxisSteps,
    i => canvas.yAxisValueMin + ((canvas.yAxisValueDiff / canvas.yAxisSteps) * i),
  );

  return (
    <svg
      id={id}
      width={width}
      height={height}
      className={className}
    >
      <rect
        id={`${id}-bg`}
        x={canvas.x}
        y={canvas.y}
        width={canvas.width}
        height={canvas.height}
        fill="white"
      />

      { xGrid &&
      <Grid
        id={`${id}-xgrid`}
        direction="x"
        coordToPix={coordToPix(canvas)}
      />
      }

      { yGrid &&
      <Grid
        id={`${id}-ygrid`}
        direction="y"
        coordToPix={coordToPix(canvas)}
      />
      }

      { xAxis &&
      <Axis
        id={`${id}-xaxis`}
        direction="x"
        coordToPix={coordToPix(canvas)}
        UI={xAxisLabel}
      />
      }

      { yAxis &&
      <Axis
        id={`${id}-yaxis`}
        direction="y"
        coordToPix={coordToPix(canvas)}
        UI={yAxisLabel}
      />
      }

      { y2Axis &&
      <Axis
        id={`${id}-y2axis`}
        direction="y"
        coordToPix={coordToPix(canvas)}
        UI={yAxisLabel}
        top
      />
      }

      { isEmpty(data) === false &&
      <Points
        coordToPix={coordToPix(canvas)}
        data={data}
        UI={point}
        reverseAxis={reverseAxis}
      />
      }

      {children}
    </svg>
  );
};

export default Coordinate;
