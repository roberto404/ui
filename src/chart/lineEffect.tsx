import React from "react";

import ChartLine from "./line";
import integerAxis from "./coordinate/functions/integerAxis";

/* !- Types */

export type PropTypes = {
  values: number[];
  // first and last index of the effect period (campaign), inclusive
  start: number;
  end: number;
  // reference level, eg. the average before the period
  base: number;
  // x labels by index, eg. { 0: "−4. hét", 4: "1. hét" }
  xLabels?: Record<number, React.ReactNode>;
  // section titles above the chart
  labels?: {
    before?: React.ReactNode;
    during?: React.ReactNode;
    after?: React.ReactNode;
  };
  // label of the base line, eg. "2,2 db/hét"
  baseFormat?: (base: number) => React.ReactNode;
  // text of the excess over the base in the period, eg. "+14 db többlet"
  excessFormat?: (excess: number) => React.ReactNode;
  // text of the after effect (average after vs. base, -0.2 = −20 %); only with values after the period
  afterFormat?: (change: number) => React.ReactNode;
  color?: string;
  baseColor?: string;
  excessColor?: string;
  bandColor?: string;
  afterColor?: string;
  width?: number;
  height?: number;
  // shown instead of the chart when every value is 0
  empty?: React.ReactNode;
};

/* !- Constants */

export const COLORS = {
  color: "#186eff", // $blue-dark
  base: "#98a9bc", // $gray
  excess: "#a9d8f2",
  band: "#eef1f6",
  after: "#e08543", // $brown-light
};

const MUTED_COLOR = "#98a9bc"; // $gray
const TEXT_COLOR = "#252631"; // $black

/* !- Helpers */

const average = (values: number[]) =>
  values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;

/**
 * Polygons of the excess: between the line and the base where the line is above,
 * segment by segment around the period (with the crossing points)
 */
const excessPolygons = (
  values: number[],
  start: number,
  end: number,
  base: number,
  toPix: (x: number, y: number) => { x: number; y: number },
) => {
  const polygons: string[] = [];

  for (
    let i = Math.max(start - 1, 0);
    i < Math.min(end, values.length - 1);
    i += 1
  ) {
    const [v0, v1] = [values[i], values[i + 1]];

    if (v0 <= base && v1 <= base) {
      continue;
    }

    const cross = i + (base - v0) / (v1 - v0);
    const points =
      v0 >= base && v1 >= base
        ? [
            [i, base],
            [i, v0],
            [i + 1, v1],
            [i + 1, base],
          ]
        : v0 > base
          ? [
              [i, base],
              [i, v0],
              [cross, base],
            ]
          : [
              [cross, base],
              [i + 1, v1],
              [i + 1, base],
            ];

    polygons.push(
      points.map(([x, y]) => `${toPix(x, y).x},${toPix(x, y).y}`).join(" "),
    );
  }

  return polygons;
};

/* !- Components */

/**
 * Legend of the ChartLineEffect: line, dashed base, excess square
 */
export const ChartLineEffectLegend = ({
  line,
  base,
  excess,
  color = COLORS.color,
  baseColor = COLORS.base,
  excessColor = COLORS.excess,
}: {
  line: React.ReactNode;
  base: React.ReactNode;
  excess: React.ReactNode;
  color?: string;
  baseColor?: string;
  excessColor?: string;
}) => (
  <div className="flex h-center gap-2 text-s nowrap">
    <span className="flex h-center gap-1/2">
      <svg width="24" height="6">
        <line
          x1="2"
          y1="3"
          x2="22"
          y2="3"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
      {line}
    </span>
    <span className="flex h-center gap-1/2">
      <svg width="24" height="6">
        <line
          x1="2"
          y1="3"
          x2="22"
          y2="3"
          stroke={baseColor}
          strokeWidth="3"
          strokeDasharray="5 4"
        />
      </svg>
      {base}
    </span>
    <span className="flex h-center gap-1/2">
      <svg width="14" height="14">
        <rect width="14" height="14" rx="3" fill={excessColor} />
      </svg>
      {excess}
    </span>
  </div>
);

/**
 * ChartLineEffect — effect of a period (campaign) on a series: the period as a band,
 * the dashed base level, the excess over the base in the period, the peaks marked,
 * and the after effect (average after the period vs. the base).
 * The band / grid / excess / base are drawn under the line (Coordinate `underlay`),
 * the texts over it (`children`).
 */
const ChartLineEffect = ({
  values,
  start,
  end,
  base,
  xLabels = {},
  labels = {},
  baseFormat = (value) => value,
  excessFormat = (value) => `+${Math.round(value)}`,
  afterFormat = (change) =>
    `${change < 0 ? "−" : "+"}${Math.abs(Math.round(change * 100))} %`,
  color = COLORS.color,
  baseColor = COLORS.base,
  excessColor = COLORS.excess,
  bandColor = COLORS.band,
  afterColor = COLORS.after,
  width = 820,
  height = 300,
  empty = "–",
}: PropTypes) => {
  const peak = Math.max(0, ...values);

  if (!peak) {
    return <div className="py-2 text-center text-gray">{empty}</div>;
  }

  const yAxis = integerAxis(0, Math.max(peak, base), 3);
  const excess = values
    .slice(start, end + 1)
    .reduce((total, value) => total + Math.max(value - base, 0), 0);
  const after = values.slice(end + 1);
  const afterChange =
    after.length && base ? (average(after) - base) / base : null;
  const last = values.length - 1;

  return (
    <ChartLine
      data={[{ id: "values", values }]}
      width={width}
      height={height}
      margin={{ top: 40, right: 10, bottom: 40, left: 40 }}
      responsive
      preserveAspectRatio="xMidYMid meet"
      edgeToEdge
      bezier={false}
      color={color}
      yAxisValueMin={0}
      yAxisValueMax={yAxis.max}
      xAxis={false}
      yAxis={false}
      xGrid={false}
      yGrid={false}
      marker={({ x, y, value }: { x: number; y: number; value: number }) =>
        value === peak ? (
          <circle
            cx={x}
            cy={y}
            r="8"
            fill={color}
            stroke="#fff"
            strokeWidth="3"
          />
        ) : null
      }
      underlay={({ canvas, toPix }) => (
        <>
          {/* period band */}
          <rect
            x={toPix(start - 0.5, 0).x}
            y={canvas.y - 8}
            width={toPix(end + 0.5, 0).x - toPix(start - 0.5, 0).x}
            height={canvas.height + 8}
            rx={12}
            fill={bandColor}
          />

          {/* grid + y labels */}
          {yAxis.values.map((tick) => (
            <g key={tick}>
              <line
                x1={canvas.x}
                x2={canvas.x + canvas.width}
                y1={toPix(0, tick).y}
                y2={toPix(0, tick).y}
                stroke="#eef0f3"
                strokeWidth={tick ? 1 : 2}
              />
              <text
                x={canvas.x - 16}
                y={toPix(0, tick).y + 4}
                textAnchor="end"
                fontSize={13}
                fill={MUTED_COLOR}
              >
                {tick}
              </text>
            </g>
          ))}

          {/* excess over the base */}
          {excessPolygons(values, start, end, base, toPix).map(
            (points, index) => (
              <polygon key={index} points={points} fill={excessColor} />
            ),
          )}

          {/* base */}
          <line
            x1={canvas.x}
            x2={canvas.x + canvas.width}
            y1={toPix(0, base).y}
            y2={toPix(0, base).y}
            stroke={baseColor}
            strokeWidth={2}
            strokeDasharray="6 6"
          />
        </>
      )}
    >
      {({ canvas, toPix }) => (
        <>
          {/* sections; a one-week section is aligned to the edge, so the text stays inside */}
          {start > 0 && labels.before && (
            <text
              x={start > 1 ? toPix((start - 1) / 2, 0).x : canvas.x}
              y={canvas.y - 18}
              textAnchor={start > 1 ? "middle" : "start"}
              fontSize={13}
              fill={MUTED_COLOR}
            >
              {labels.before}
            </text>
          )}
          {labels.during && (
            <text
              x={toPix((start + end) / 2, 0).x}
              y={canvas.y - 18}
              textAnchor="middle"
              fontSize={13}
              fontWeight={700}
              fill={color}
            >
              {labels.during}
            </text>
          )}
          {end < last && labels.after && (
            <text
              x={last - end > 1 ? toPix((end + 1 + last) / 2, 0).x : canvas.x + canvas.width}
              y={canvas.y - 18}
              textAnchor={last - end > 1 ? "middle" : "end"}
              fontSize={13}
              fill={MUTED_COLOR}
            >
              {labels.after}
            </text>
          )}

          {/* base label */}
          <text
            x={canvas.x + canvas.width}
            y={toPix(0, base).y - 8}
            textAnchor="end"
            fontSize={13}
            fill="#5f6470"
          >
            {baseFormat(base)}
          </text>

          {/* excess, after effect */}
          {excess > 0 && (
            <text
              x={toPix((start + end) / 2, 0).x}
              y={toPix(0, base).y - 16}
              textAnchor="middle"
              fontSize={15}
              fontWeight={700}
              fill={TEXT_COLOR}
            >
              {excessFormat(excess)}
            </text>
          )}
          {afterChange !== null && (
            <text
              x={last - end > 1 ? toPix((end + 1 + last) / 2, 0).x : canvas.x + canvas.width}
              y={toPix(0, yAxis.max * 0.08).y}
              textAnchor={last - end > 1 ? "middle" : "end"}
              fontSize={15}
              fontWeight={700}
              fill={afterColor}
            >
              {afterFormat(afterChange)}
            </text>
          )}

          {/* x labels */}
          {Object.keys(xLabels).map((key) => {
            const index = Number(key);

            return (
              <text
                key={key}
                x={toPix(index, 0).x}
                y={canvas.y + canvas.height + 26}
                textAnchor={
                  index === 0 ? "start" : index === last ? "end" : "middle"
                }
                fontSize={13}
                fill={MUTED_COLOR}
              >
                {xLabels[index]}
              </text>
            );
          })}
        </>
      )}
    </ChartLine>
  );
};

export default ChartLineEffect;
