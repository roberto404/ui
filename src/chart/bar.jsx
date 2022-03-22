import React from 'react';

import Coordinate from './coordinate';
import { findMinimumValueInSeries } from './coordinate/func';

export const Bar = ({ x, y, canvas, coord, id, seriesIndex, seriesLength, point }) =>
{
  const gap = 0.5;
  let barX = x - ((canvas.colWidth * (1 - gap)) / 2);
  let barW = canvas.colWidth * (1 - gap);
  const barH = canvas.rowHeight * coord.y;

  if (seriesLength > 1)
  {
    barW /= seriesLength;
    barX += (barW * seriesIndex);
  }

  const textIsInside = canvas.height + canvas.margin.top - (barW * seriesLength) > y;
  const textY = textIsInside ? y + (barW / 2) : y - (barW / 2);
  const textX = barX + (barW / 2); 

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
        x={textX}
        y={textY}
        fontSize={barW / 4}
        alignmentBaseline="hanging"
        textAnchor="middle"
      >
        {point.y}
      </text>
    </g>
  );
};



const ChartBar = ({ data, width, height, className, yAxisValueMin }) => (
  <Coordinate
    id="bar"
    className={className || "chart bar rounded"}
    width={width}
    height={height}
    data={
      data.reduce(
        (result, { id, values }) => ({ ...result, [id]: values.map((v, i) => ({ x: i, y: v, element: Bar })) }),
        {},
      )
    }
    xAxisValueMin={-1}
    xAxisValueMax={data[0].values.length}

    xAxisValues={[null, ...(data[0].xAxis || data[0].values ), null]}
    yAxisValueMin={yAxisValueMin === undefined ? findMinimumValueInSeries(data) : yAxisValueMin}
    yGrid={false}

    margin={{
      top: 40,
      right: 100,
      bottom: 40,
      left: 100,
    }}
  />
);

export default ChartBar;