
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

const now = new Date().getTime();
import { ONE_DAY } from '../../../src/calendar/constants';

const gantData = [
  {
    start: now - (ONE_DAY * 10),
    end: now + (ONE_DAY * 10),
    title: 'task #1',
  },
  {
    start: now + (ONE_DAY * 3),
    end: now + (ONE_DAY * 15),
    title: 'task #2',
  },
  {
    start: now,
    end: now + (ONE_DAY * 7),
    title: 'task #3',
  },
]


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
        yAxisValueMin={0}
        xAxisValueMax={7}
        yAxisLabel={({ i, x, y }) =>
        (
          <text
            x={x - 40}
            y={y}
            alignmentBaseline="middle"
            textAnchor="middle"
          >
            {20 - i}:00
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


    <h2>Gant like coordinate</h2>
    <div style={{ height: 250, width: 800 }} >
      <Resize>
        <Coordinate
          className="gant"
          data={{
            defs: [
              {
                x: 0,
                y: 0,
                element: () => (
                  <defs>
                    <pattern
                      id="pattern" 
                      x="0" y="0"
                      width="10" height="10"
                      patternUnits="userSpaceOnUse"
                    >
                      <line x1={10} y1={0} x2={0} y2={10}  />
                    </pattern>
                  </defs>
                ),
              },
            ],
            orders: 
              gantData.reverse().map((order, n) =>
              {
                const x1 = Math.max(0, Math.ceil((order.start - now) / ONE_DAY));
                const x2 = Math.min(7*3, Math.ceil((order.end - now) / ONE_DAY));

                const xDiff = x2 - x1;

                const r = 20;

                return ({
                  x: x1,
                  y: n + 1,
                  element: ({ x, y, canvas }) => (
                    <g className={order.className}>
                      <path
                        d={`M${x},${y + canvas.rowHeight * 0.1}
                          h${canvas.colWidth * xDiff - r}
                          q${r},0 ${r},${r}
                          v${canvas.rowHeight * 0.8 - (2 * r)}
                          q0,${r} -${r},${r}
                          h-${canvas.colWidth * xDiff - r}
                          z
                        `}
                        fill="#4EDFA5"
                      />
                      {/* <rect x={x} y={y + canvas.rowHeight * 0.1} width={canvas.colWidth * xDiff} height={canvas.rowHeight * 0.8}  /> */}
                      {/* <text x={x + 5} y={y + 5} alignmentBaseline="hanging" textAnchor="start">J. Cushman</text> */}
                    </g>
                  )
                })
              }),
            weekend: [
              { x: 5, y: gantData.length, element: ({ x, y, canvas }) => <rect x={x} y={y} width={canvas.colWidth * 2} height={canvas.height} style={{ fill: 'url(#pattern)' }} />
              },
              { x: 5 + 7, y: gantData.length, element: ({ x, y, canvas }) => <rect x={x} y={y} width={canvas.colWidth * 2} height={canvas.height} style={{ fill: 'url(#pattern)' }}  /> },
              { x: 5 + 7 + 7, y: gantData.length, element: ({ x, y, canvas }) => <rect x={x} y={y} width={canvas.colWidth * 2} height={canvas.height} style={{ fill: 'url(#pattern)' }}  /> },
            ],
            today: [
              {
                x: 3,
                y: gantData.length,
                element: ({ x, y, canvas }) =>
                (
                  <g>
                  <line x1={x} y1={y} x2={x} y2={canvas.height + y} />
                  <circle cx={x} cy={y} r="3" />
                  <rect x={x} y={y} width={canvas.width - x + canvas.margin.left} height={canvas.height} />
                </g>
                ),
              },
            ],
          }}
          xAxisSteps={7*3}
          xAxisValueMax={7*3}
          yAxisSteps={gantData.length}
          yAxisValueMin={0}
          yAxisValueMax={gantData.length}
          yAxisLabel={({ i, x, y, canvas }) =>
          (
            <text
              x={x - 10}
              y={y - (canvas.rowHeight / 2)}
              alignmentBaseline="middle"
              textAnchor="end"
            >
              {(gantData[i] || {}).title}
            </text>
          )}

          xAxisLabel={({ i, x, y, canvas }) =>
          (
            <g>
              { i % 7 === 0 &&
                <line
                  key={i}
                  x1={x}
                  y1={y}
                  x2={x}
                  y2={y - canvas.margin.top - canvas.height}
                  stroke="#e8e7e8"
                />
              }
              { i && i % 7 === 0 &&
                <text
                  x={x - canvas.colWidth * 7 / 2}
                  y={y - canvas.height - 25}
                  alignmentBaseline="baseline"
                  textAnchor="middle"
                >
                  {moment().startOf('weeek').add(i, 'days').format('MMMM')}
                </text>
              }
              { i < 7 * 3 &&
              <text x={x + canvas.colWidth / 2} y={y - canvas.height - 5} textAnchor="middle">
                <tspan>{capitalizeFirstLetter(moment().startOf('weeek').add(i, 'days').format('ddd'))[0]}</tspan>
                <tspan dx="2">
                {capitalizeFirstLetter(moment().startOf('weeek').add(i, 'days').format('DD'))}
                </tspan>
              </text>
              }
            </g>
          )}

          margin={{
            top: 40,
            right: 50,
            bottom: 25,
            left: 100,
          }}
        />
      </Resize>
    </div>



  </div>
);

export default Example;
