
import React from 'react';
import moment from 'moment';
import capitalizeFirstLetter from '@1studio/utils/string/capitalizeFirstLetter';


/* !- React Elements */

import Resize from '../../../src/resize';
import Coordinate from '../../../src/chart/coordinate';


/* !- Constants */

/**
 * @example
 * typeof Array
 */
// const data = [
//   { x: 0, y: 0 },
//   { x: 3, y: 6 },
//   { x: 8, y: 2 },
//   {
//     x: 5,
//     y: 5,
//     element: ({ x, y, canvas }) => (
//       <rect
//         id="bg"
//         x={x}
//         y={y}
//         width={canvas.colWidth * 2}
//         height={canvas.rowHeight * 4}
//         fill="blue"
//         fillOpacity="0.5"
//       />
//     ),
//   },
// ];

/**
 * Green Point for second data group
 */
const element = ({ x, y }) => <circle cx={x} cy={y} r="8" fill="green" />;

const data = {
  first: [
    { x: 0, y: 0 },
    { x: 3, y: 6 },
    { x: 8, y: 2 },
  ],
  second: [
    { x: 0, y: 5, element },
    { x: 5, y: 5, element },
    { x: 7, y: 5, element },
  ],
};


/**
 * GridView + Filters + Connect + Paginate
 */
const Example = () =>
(
  <div>
    <h1>Coordinate</h1>

    <h2>Static coordinate system</h2>
    <div className="col-1-5" style={{ height: '400px' }}>
      <Resize>
        <Coordinate
          data={data}
          xAxisSteps={8}
          yAxisSteps={6}
          yAxisLabel={({ i, x, y }) =>
          (
            <text
              x={x}
              y={y}
              alignmentBaseline="middle"
              textAnchor="end"
            >
              {i} -
            </text>
          )}
          margin={{
            top: 70,
            right: 50,
            bottom: 25,
            left: 50,
          }}
        />
      </Resize>
    </div>

    <h2>Coordinate to Week Calendar</h2>
    <div className="">
      <Coordinate
        id="week"
        className="calendar week"
        width={800}
        height={500}
        data={{
          weekend: [{ x: 5, y: 11, element: ({ x, y, canvas }) => <rect x={x} y={y} width={canvas.colWidth * 2} height={canvas.height} /> }],
          events: [{
            x: 0,
            y: 9,
            element: ({ x, y, canvas }) => (
              <g>
                <rect x={x} y={y} width={canvas.colWidth} height={canvas.rowHeight} />
                <text x={x + 5} y={y + 5} alignmentBaseline="hanging" textAnchor="start">J. Cushman</text>
              </g>
            )
          }],
        }}
        xAxisSteps={7}
        yAxisSteps={11}
        yAxisLabel={({ i, x, y }) =>
        (
          <text
            x={x - 40}
            y={y}
            alignmentBaseline="middle"
            textAnchor="middle"
          >
            {20-i}:00
          </text>
        )}
        xAxisLabel={({ i, x, y, canvas }) =>
        (
          <g>
            <line
              key={i}
              x1={x}
              y1={y}
              x2={x}
              y2={y - canvas.margin.top - canvas.height}
              stroke="#e8e7e8"
            />
            <text
              x={x}
              y={y - canvas.height}
              alignmentBaseline="baseline"
              textAnchor="start"
            >
              <tspan dx="1em" dy="-0.75em">
                {capitalizeFirstLetter(moment().startOf('weeek').add(i, 'days').format('MMM. D.'))}
              </tspan>
              <tspan x={x} dx="1em" dy="-1.5em">
                {capitalizeFirstLetter(moment().startOf('weeek').add(i, 'days').format('dd'))}
              </tspan>
            </text>
          </g>
        )}
        margin={{
          top: 50,
          right: 2,
          bottom: 10,
          left: 80,
        }}
      >
        <use href="#week-xgrid" />
        <use href="#week-ygrid" />
      </Coordinate>
    </div>

  </div>
);

export default Example;
