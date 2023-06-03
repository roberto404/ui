
import React from 'react';
// import moment from 'moment';
// import capitalizeFirstLetter from '@1studio/utils/string/capitalizeFirstLetter';


/* !- React Elements */

import Coordinate from '../../../src/chart/coordinate';


/* !- Elements */

const yAxisLabel = ({ i, x, y }) =>
(
  <text
    x={x - 40}
    y={y}
    alignmentBaseline="middle"
    textAnchor="middle"
  >
    {20-i}:00
  </text>
);

const xAxisLabel = ({ i, x, y, canvas }) =>
(
  <text
    x={x + (canvas.colWidth / 2)}
    y={y - canvas.height - (canvas.margin.top / 2)}
    alignmentBaseline="middle"
    textAnchor="middle"
  >
    {`#${i}`}
  </text>
);

const event = ({ x, y, canvas }) => (
  <g>
    <rect x={x} y={y} width={canvas.colWidth} height={canvas.rowHeight} />
    <text x={x + 5} y={y + 5} alignmentBaseline="hanging" textAnchor="start">Budaörs</text>
  </g>
);

const period = ({ x, y, canvas }) => (
  <line
    x1={x}
    y1={y}
    x2={x + canvas.width}
    y2={y}
    stroke="#000"
  />
);


/**
 * GridView + Filters + Connect + Paginate
 */
const Example = () =>
(
  <div>
    <Coordinate
      id="week"
      className="calendar week"
      width={800}
      height={500}
      data={{
        events: [{
          x: 0,
          y: 9,
          element: event,
        }],
        periods: [{
          x: 0,
          y: 5,
          element: period,
        },
        {
          x: 0,
          y: 7,
          element: period,
        }]
      }}
      xAxisSteps={7}
      yAxisSteps={11}
      xAxisLabel={xAxisLabel}
      yAxisLabel={yAxisLabel}
      margin={{
        top: 40,
        right: 2,
        bottom: 10,
        left: 80,
      }}
    />
  </div>
);

export default Example;
