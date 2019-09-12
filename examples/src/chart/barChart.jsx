
import React from 'react';


/* !- React Elements */

import Coordinate from '../../../src/chart/coordinate';


/* !- Elements */

const bar = ({ value, x, y, canvas, coord, id }) =>
{
  // const gap = 0.25;
  const gap = 0.5;
  const barX = x - ((canvas.colWidth * (1 - gap)) / 2);
  const barW = canvas.colWidth * (1 - gap);
  const barH = canvas.rowHeight * coord.y;

  const textIsInside = canvas.height + canvas.margin.top - barW > y;
  const textY = textIsInside ? y + (barW / 2) : y - (barW / 2);

  return (
    <g>
      <defs>
        <clipPath id={id}>
          <rect
            x={barX}
            y={y}
            width={barW}
            height={barH + (barW / 2)}
            rx={barW / 2}
            ry={barW / 2}
          />
        </clipPath>
      </defs>
      <rect clipPath={`url(#${id})`} x={barX} y={y} width={barW} height={barH} />
      <text
        className={textIsInside ? 'inside' : 'outside'}
        x={x}
        y={textY}
        fontSize={barW / 4}
        alignmentBaseline="hanging"
        textAnchor="middle"
      >
        {coord.y}
      </text>
    </g>
  );
};


/**
 * GridView + Filters + Connect + Paginate
 */
const Example = () =>
{
  const data = [
    {
      id: 's1',
      label: 'store1',
      values: [100, 200, 50],
    },
    {
      id: 's1',
      label: 'store1',
      values: [150, 150, 100],
      xAxis: ['RS1', 'RS2', 'RS3'],
    },
  ];

  return (
    <div>
      <Coordinate
        id="bar"
        className="chart bar"
        width={800}
        height={250}
        data={{
          data1: data[0].values.map((v, i) => ({ x: i, y: v, element: bar })),
        }}
        // data={{
        //   data1: [
        //     { x: 0, y: 100 },
        //     { x: 1, y: 200 },
        //     { x: 2, y: 50 },
        //   ],
        // }}
        xAxisValueMin={-1}
        xAxisValueMax={3}

        xAxisValues={[null, '#1', '#2', '#3', null]}
        yAxisValueMin={0}
        yGrid={false}

        margin={{
          top: 40,
          right: 100,
          bottom: 20,
          left: 100,
        }}
      />
    </div>
  );
};

export default Example;
