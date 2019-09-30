
import React from 'react';

/* !- React Elements */

import Resize from '@1studio/ui/resize';
import Coordinate from '@1studio/ui/chart/coordinate';
import simplify from '@1studio/utils/math/simplify';


/* !- Constants */

import { SIMPLIFY_ROOT, SIMPLIFY_UNITS, SIMPLIFY_FORMAT } from './const';


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
        {simplify(coord.y, SIMPLIFY_ROOT, SIMPLIFY_UNITS, SIMPLIFY_FORMAT)}
      </text>
    </g>
  );
};


/**
 * GridView + Filters + Connect + Paginate
 */
const AnalyticsChart = ({ data }) =>
{
  return (
    <Resize>
      <Coordinate
        id="bar"
        className="chart bar"
        data={{
          sum: data.map(({ sum }, i) => ({ x: i, y: sum, element: bar })),
        }}
        xAxisValueMin={-1}
        xAxisValueMax={data.length}

        xAxisValues={[null, ...data.map(({ id }) => parseInt(id.substring(8))), null]}
        yAxisValueMin={0}
        yGrid={false}

        margin={{
          top: 40,
          right: 0,
          bottom: 20,
          left: 20,
        }}
      />
    </Resize>
  );
};

AnalyticsChart.defaultProps =
{
  data: [],
};


export default AnalyticsChart;
