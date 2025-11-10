import React from 'react';
import sum from 'lodash/sum';
import Coordinate from './coordinate';
import simplify from '@1studio/utils/math/simplify';


/* !- Constants */

const simplifyArgs = [1000, ['', 'E', 'M', 'Mrd']];


/* !- Types */

export interface IData {
  id?: string,
  percent: number,
  color?: string,
  // title?: string, // @todo
}

export interface PropTypes {
  min: number,
  max: number,
  Q1: number,
  Q2: number,
  Q3: number,
  qMax: number,
  qMin: number,
  mode?: number[],
}




export const Line = (direction = 1) => ({ x, y, canvas, coord, id, index, length, value, data }) => {

  const { x: x2 } = data[index + direction];

  const markerSize = canvas.height / 4;

  const fontSize = canvas.margin.bottom / 1.75;
  const gap = fontSize / 1.25;

  return (
    <g>
      <defs>
        <marker id="arrow" markerWidth={markerSize} markerHeight={markerSize} refX="0" refY={markerSize / 2} orient="auto">
          <line x1={0} y1={0} x2={0} y2={markerSize} />
        </marker>
      </defs>
      <line
        x1={x}
        y1={y}
        x2={x2}
        y2={y}
        markerStart="url(#arrow)"
      />
      <text
        x={x}
        y={canvas.height + canvas.margin.top + gap}
        alignmentBaseline="hanging"
        textAnchor="middle"
        fontSize={fontSize}

      >
        {simplify(value.x, ...simplifyArgs)}
      </text>
    </g>
  );
};


export const Median = ({ x, y, canvas, value }) => {

  const fontSize = canvas.margin.bottom / 1.75;
  const gap = fontSize / 1.25;

  return (
    <g id="median">
      {/* <text
        x={x}
        y={canvas.margin.bottom - gap}
        alignmentBaseline="baseline"
        textAnchor="middle"
        fontSize={fontSize}

      >
        2
      </text> */}
      <text
        x={x}
        y={canvas.height + canvas.margin.top + gap}
        alignmentBaseline="hanging"
        textAnchor="middle"
        fontSize={fontSize}

      >
        {simplify(value.x, ...simplifyArgs)}
      </text>
      <line
        x1={x}
        y1={y}
        x2={x}
        y2={canvas.margin.top}
      />
    </g>
  );
};

export const Mode = ({ x, y, canvas, value }) => {

  const size = canvas.margin.bottom / 4;

  return (
    <g id="mode">
      <rect x={x - size / 2} y={y - size / 2} width={size} height={size} />
    </g>
  );
};


export const Iqr = ({ x, y, canvas, coord, id, index, length, value, data }) => {

  const end = data[index + 2];

  const fontSize = canvas.margin.bottom / 1.75;
  const gap = fontSize / 1.25;


  return (
    <g>
      {/* <text
        x={x}
        y={canvas.margin.top - gap}
        alignmentBaseline="baseline"
        textAnchor="middle"
        fontSize={fontSize}

      >
        1
      </text> */}
      <text
        x={x}
        y={canvas.height + canvas.margin.top + gap}
        alignmentBaseline="hanging"
        textAnchor="middle"
        fontSize={fontSize}

      >
        {simplify(value.x, ...simplifyArgs)}
      </text>
      {/* <text
        x={end.x}
        y={canvas.margin.top - gap}
        alignmentBaseline="baseline"
        textAnchor="middle"
        fontSize={fontSize}

      >
        3
      </text> */}
      <text
        x={end.x}
        y={canvas.height + canvas.margin.top + gap}
        alignmentBaseline="hanging"
        textAnchor="middle"
        fontSize={fontSize}

      >
        {simplify(end.value.x, ...simplifyArgs)}
      </text>
      <rect
        x={x}
        y={y}
        width={end.x - x}
        height={end.y - y}
      />
    </g>
  );
};

/**
 * BoxPlot Chart
 */
const BoxPlot: React.FC<PropTypes> = (props) => {

  const {
    min = 0,
    max = 0,
    Q1 = 0,
    Q2 = 0,
    Q3 = 0,
    qMax = 0,
    qMin = 0,
    mode = [],
  } = props;

  const data = [
    { y: 1, x: Math.max(min, qMin), element: Line(1) },
    { y: 2, x: Q1, element: Iqr },
    { y: 0, x: Q2, element: Median },
    { y: 0, x: Q3, element: () => <></> },
    { y: 1, x: Math.min(max, qMax), element: Line(-1) },
  ];

  if (mode.length) {
    data.push(
      ...mode.map(x => ({ y: 1, x, element: Mode }))
    );
  }

  return (
    <Coordinate
      {...props}
      className="chart boxPlot"
      data={{ data }}
      xAxisSteps={data.length}
      margin={{
        top: 1,
        right: 20,
        bottom: 20,
        left: 20,
      }}
      xGrid={false}
      yGrid={false}
      xAxis={false}
      yAxis={false}
      xAxisValueMin={data[0].x}
    />
  );
}

export default BoxPlot;