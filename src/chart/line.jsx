import React from 'react';

import Coordinate from './coordinate';
import { findMinimumValueInSeries } from './coordinate/func';


export const Line = ({ x, y, canvas, coord, id, index, length, value, data, foo }) =>
{
  const gap = 0.5;
  let barX = x - ((canvas.colWidth * (1 - gap)) / 2);
  let barW = canvas.colWidth * (1 - gap);
  const barH = canvas.rowHeight * coord.y;

  if (length > 1)
  {
    barW /= length;
    barX += (barW * index);
  }

  const textIsInside = canvas.height + canvas.margin.top - (barW * length) > y;
  const textY = textIsInside ? y + (barW / 2) : y - (barW / 2);
  const textX = barX + (barW / 2);

  return (
    <g>
      { index === data[0].index &&
        <path d={data.map(({ x, y }, i) => `${i ? 'L' : 'M'}${x},${y}`).join(' ')} stroke="black" fill="none" />
      }
      <circle cx={x} cy={y} r="5" />
      <text
        className={textIsInside ? 'inside' : 'outside'}
        x={textX}
        y={textY}
        fontSize={barW / 4}
        alignmentBaseline="hanging"
        textAnchor="middle"
      >
        {value}
      </text>
    </g>
  );
};


const ChartLine = (props) => (
  <Coordinate
    id="line"

    xAxisValueMin={-1}
    xAxisValueMax={props.data[0].values.length}

    xAxisValues={[null, ...(props.data[0].xAxis || props.data[0].values ), null]}
    yAxisValueMin={findMinimumValueInSeries(props.data)}
   
    yGrid={false}

    margin={{
      top: 40,
      right: 100,
      bottom: 40,
      left: 100,
    }}

    { ...props }

    className={props.className || "chart line rounded"}
    data={
      props.data.reduce(
        (result, { id, values }) => ({ ...result, [id]: values.map((v, i) => ({ x: i, y: v, element: Line })) }),
        {},
      )
    }
  />
);

export default ChartLine;