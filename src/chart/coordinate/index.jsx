
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import moment from 'moment';
import max from 'lodash/max';
import min from 'lodash/min';
import flatten from 'lodash/flatten';
import clamp from '@1studio/utils/math/clamp';
import produceNumericArray from '@1studio/utils/array/produceNumericArray';
// import gcd from '@1studio/utils/math/gcd';
import gcd from '/Users/roberto/Sites/utils/src/math/gcd';


/* !- React Elements */

import Axis, { xAxisLabel, yAxisLabel } from './axis';
import Grid from './grid';
import Points, { Point } from './point';


export const coordToPix = canvas => (x, y) =>
({
  x: canvas.x + (canvas.colWidth * x),
  y: canvas.svgHeight - canvas.margin.bottom - (canvas.rowHeight * y),
  canvas,
  coord: { x, y },
});

/**
 * Coordinate component
 */
const Coordinate = ({
  id,
  data,
  width,
  height,
  xAxisSteps,
  xAxisLabel,
  yAxisSteps,
  yAxisLabel,
  yAxisValueMax,
  yAxisValueMin,
  xAxisValueMax,
  xAxisValueMin,
  xAxisValues,
  xGrid,
  yGrid,
  xAxis,
  yAxis,
  margin,
  point,
  children,
  className,
}) =>
{
  /**
   * Collect all data series value to one array.
   * You can determine max value
   *
   * @example
   * data1: [{ x:1, y:2 }, { x:0, y: 3 }],
   * data2: [{ x:1, y:5 }, { x:0, y: 3 }],
   *
   * //=> [2,3,5]
   */
  const dataYValues = flatten(Object.keys(data).map(key => data[key]
    .filter(({ y }) => y !== null)
    .map(({ y }) => y),
  ));

  const dataXValues = flatten(Object.keys(data).map(key => data[key]
    .filter(({ x }) => x !== null)
    .map(({ x }) => x),
  ));

  const canvas = {
    x: margin.left,
    y: margin.top,
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom,
    margin,
    svgHeight: height,
    svgWidth: width,

    xAxisValueMin,
    xAxisValueMax: xAxisValueMax || max(dataXValues),
    yAxisValueMax: yAxisValueMax || max(dataYValues),
    yAxisValueMin: typeof yAxisValueMin === 'undefined' ? min(dataYValues) : yAxisValueMin,
  };

  canvas.xAxisValueDiff = canvas.xAxisValueMax - canvas.xAxisValueMin;
  canvas.yAxisValueDiff = canvas.yAxisValueMax - canvas.yAxisValueMin;

  /**
   * Steps determine scale of axis from origo
   * @example
   * xAxisSteps = 2
   * // 0----1----2
   *
   * Dynamic calculation: All data maximum 'x' value => xAxisValueMax - xAxisValueMin
   */
  canvas.xAxisSteps = xAxisSteps || canvas.xAxisValueDiff;
  canvas.yAxisSteps = yAxisSteps ||
    clamp(canvas.yAxisValueDiff / gcd(dataYValues), 0, Math.round(canvas.height / 33.3));

  /**
   * Points determine absolute grid of the coordination, based on x, y min and max values
   *
   * @example
   * maximum y value 1000
   * // => y Axis contains 1000 coordination points
   *
   * Step = points between two step
   * Axis = total points on the axis
   */
  canvas.xAxisPoints = canvas.xAxisValueMax - canvas.xAxisValueMin;
  canvas.yAxisPoints = canvas.yAxisValueMax - canvas.yAxisValueMin;
  canvas.stepXPoints = canvas.xAxisPoints / canvas.xAxisSteps;
  canvas.stepYPoints = canvas.yAxisPoints / canvas.yAxisSteps;

  /**
   * X, Y step in pixel
   */
  canvas.colWidth = canvas.width / canvas.xAxisPoints;
  canvas.rowHeight = canvas.height / canvas.yAxisPoints;

  /**
   * Create xAxis Step value
   *
   * @example
   * data = [100, 200, 300];
   * //=> [0, 1, 2]
   *
   * @example
   * data = [100, 200, 300];
   * xAxisValueMin = -1;
   * xAxisValueMax = 3;
   * // => [-1, 0, 1, 2, 3]
   *
   * @example
   * // hide record with props
   * xAxisValues={[null, '#1', '#2'}
   * //=> data[0] not visible
   */
  canvas.xAxisValues = xAxisValues || produceNumericArray(
    0,
    canvas.xAxisSteps,
    i => canvas.xAxisValueMin + ((canvas.xAxisValueDiff / canvas.xAxisSteps) * i),
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
        steps={canvas.xAxisRange}
        direction="x"
        coordToPix={coordToPix(canvas)}
        UI={xAxisLabel}
      />
      }
      { yAxis &&
      <Axis
        id={`${id}-yaxis`}
        steps={canvas.yAxisRange}
        direction="y"
        coordToPix={coordToPix(canvas)}
        UI={yAxisLabel}
      />
      }
      { data.length !== 0 &&
      <Points
        coordToPix={coordToPix(canvas)}
        data={data}
        UI={point}
      />
      }
      {children}
    </svg>
  );
};

Coordinate.defaultProps =
{
  id: 'coordinate',
  className: 'coordinate',
  data: [],
  width: 200,
  height: 200,
  xAxisSteps: 0,
  xAxisLabel,
  yAxisSteps: 0,
  yAxisLabel,
  xGrid: true,
  yGrid: true,
  xAxis: true,
  yAxis: true,
  point: Point,
  margin: {
    top: 10,
    bottom: 30,
    left: 30,
    right: 0,
  },
  yAxisValueMax: 0,
  // xAxisValues, !important no default value, need undefined
  // yAxisValueMin: 0, !important no default value, need undefined
  xAxisValueMax: 0,
  xAxisValueMin: 0,
};

export default Coordinate;
