
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';


/* !- React Elements */

import Axis, { xAxisLabel, yAxisLabel } from './axis';
import Grid from './grid';
import Points, { Point } from './point';


export const coordToPix = canvas => (x, y) =>
({
  x: canvas.x + (canvas.colWidth * x),
  y: canvas.svgHeight - canvas.margin.bottom - (canvas.rowHeight * y),
  canvas,
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
  margin,
  point,
  children,
  className,
}) =>
{
  const canvas =
  {
    x: margin.left,
    y: margin.top,
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom,
    margin,
    svgHeight: height,
    svgWidth: width,
    xAxisSteps,
    yAxisSteps,
  };

  canvas.colWidth = canvas.width / xAxisSteps;
  canvas.rowHeight = canvas.height / yAxisSteps;


  const test = coordToPix(canvas)(5, 5);

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
      <Grid
        id={`${id}-xgrid`}
        direction="x"
        coordToPix={coordToPix(canvas)}
      />
      <Grid
        id={`${id}-ygrid`}
        direction="y"
        coordToPix={coordToPix(canvas)}
      />
      <Axis
        id={`${id}-xaxis`}
        steps={xAxisSteps}
        direction="x"
        coordToPix={coordToPix(canvas)}
        UI={yAxisLabel}
      />
      <Axis
        id={`${id}-yaxis`}
        steps={yAxisSteps}
        direction="y"
        coordToPix={coordToPix(canvas)}
        UI={xAxisLabel}
      />
      { data.length !== 0 &&
      <Points
        coordToPix={coordToPix(canvas)}
        data={data}
        UI={point}
      />
      }
      {children}
    </svg>
  )
}

Coordinate.defaultProps =
{
  id: 'coordinate',
  className: 'coordinate',
  data: [],
  width: 200,
  height: 200,
  xAxisSteps: 10,
  xAxisLabel,
  yAxisSteps: 10,
  yAxisLabel,
  point: Point,
  margin: {
    top: 10,
    bottom: 30,
    left: 30,
    right: 0,
  },
};

export default Coordinate;
