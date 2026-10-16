import React from "react";
import sum from "lodash/sum";

import ChartLine from "./line";

/* !- Types */

export type PropTypes = {
  values: number[];
  // highlighted point without hover (default: the largest value)
  highlight?: number;
  // text of the box above the highlighted / hovered point
  boxFormat?: (value: number, index: number) => React.ReactNode;
  // value label of the points
  valueFormat?: (value: number) => React.ReactNode;
  // label of the average line; false: no average line
  averageFormat?: ((average: number) => React.ReactNode) | false;
  color?: string;
  averageColor?: string;
  // drawing size, scales to the wrapper keeping the ratio
  width?: number;
  height?: number;
  boxWidth?: number;
  // shown instead of the chart when every value is 0
  empty?: React.ReactNode;
};

type HighlightProps = {
  x: number;
  y: number;
  value: number;
  index: number;
};

/**
 * ChartLineHighlight — straight line + area with value labels (above / below the
 * average), a dashed average line (under the points) and one highlighted point: a ring and a box above
 * it. The largest value is highlighted by default; on hover the box jumps to the
 * nearest point.
 */
const ChartLineHighlight = ({
  values,
  highlight,
  boxFormat = (value) => value,
  valueFormat = (value) => value,
  averageFormat = (average) => `Átlag ${Math.round(average * 10) / 10}`,
  color = "#186eff", // $blue-dark
  averageColor = "#98a9bc", // $gray
  width = 1100,
  height = 240,
  boxWidth = 200,
  empty = "–",
}: PropTypes) => {
  const max = Math.max(0, ...values);
  const active = highlight ?? values.indexOf(max);
  const average = values.length ? sum(values) / values.length : 0;

  if (!max) {
    return <div className="py-2 text-center text-gray">{empty}</div>;
  }

  /**
   * Ring + box, relative to the point's x (x = 0); the box stays within the chart
   */
  const Highlight = ({ x, y, value, index }: HighlightProps) => {
    const boxX = Math.min(Math.max(x - boxWidth / 2, 0), width - boxWidth) - x;

    return (
      <g>
        <circle
          cx={0}
          cy={y}
          r="9"
          fill="#fff"
          stroke={color}
          strokeWidth="3"
        />
        <foreignObject x={boxX} y={y - 64} width={boxWidth} height="44">
          <div className="h-full flex h-center v-center">
            <span className="bg-white-light rounded-xl shadow-outer px-2 py-1/2 nowrap">
              {boxFormat(value, index)}
            </span>
          </div>
        </foreignObject>
      </g>
    );
  };

  const marker = ({ x, y, value, index }: HighlightProps) => {
    if (index === active) {
      return (
        <g transform={`translate(${x}, 0)`} className="line-highlight">
          <Highlight x={x} y={y} value={value} index={index} />
        </g>
      );
    }

    return (
      <text
        x={x}
        y={value >= average ? y - 14 : y + 24}
        textAnchor="middle"
        fill={averageColor}
        fontSize="14"
      >
        {valueFormat(value)}
      </text>
    );
  };

  return (
    <ChartLine
      data={[{ id: "values", values }]}
      // the average under the points: the dashed line never covers a marker
      underlay={({ toPix }) =>
        averageFormat === false ? null : (
          <g className="line-average">
            <line
              x1={toPix(0, average).x}
              y1={toPix(0, average).y}
              x2={toPix(values.length - 1, average).x}
              y2={toPix(0, average).y}
              stroke={averageColor}
              strokeWidth={2}
              strokeDasharray="6 6"
            />
            <text
              x={toPix(values.length - 1, average).x - 8}
              y={toPix(0, average).y - 10}
              textAnchor="end"
              fill={averageColor}
              fontSize="13"
              className="uppercase"
            >
              {averageFormat(average)}
            </text>
          </g>
        )
      }
      responsive
      preserveAspectRatio="xMidYMid meet"
      width={width}
      height={height}
      edgeToEdge
      area
      bezier={false}
      color={color}
      marker={marker}
      hover
      tooltip={(props: HighlightProps) => <Highlight {...props} />}
      yAxisValueMin={0}
      yAxisValueMax={max * 1.25}
      xAxis={false}
      yAxis={false}
      xGrid={false}
      yGrid={false}
      margin={{ top: 70, right: 24, bottom: 32, left: 24 }}
    />
  );
};

export default ChartLineHighlight;
