import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import Coordinate from "./coordinate";
import integerAxis from "./coordinate/functions/integerAxis";
import { PLOT, STATUS } from "./colors";
import { tooltip as showTooltip, flush } from "../layer/actions";

/* !- Types */

export type MatrixPoint = {
  id: string | number;
  label?: React.ReactNode;
  x: number;
  y: number;
  // bubble area is proportional to it, relative to the largest one
  size?: number;
  // default: the colour of its quadrant
  color?: string;
};

export type MatrixQuadrant = {
  label?: React.ReactNode;
  // colour of the bubbles
  color?: string;
  // colour of the label (default: `color`)
  text?: string;
  // background of the quadrant (none when not set)
  fill?: string;
};

export type MatrixQuadrants = {
  topLeft?: MatrixQuadrant;
  topRight?: MatrixQuadrant;
  bottomLeft?: MatrixQuadrant;
  bottomRight?: MatrixQuadrant;
};

export type PropTypes = {
  data: MatrixPoint[];
  // the quadrant borders (eg. x = 100 % of the target, y = 0 % result)
  xSplit?: number;
  ySplit?: number;
  // axis range; default: the data and the split, rounded to integer steps
  xDomain?: [number, number];
  yDomain?: [number, number];
  xSteps?: number;
  ySteps?: number;
  xFormat?: (value: number) => React.ReactNode;
  yFormat?: (value: number) => React.ReactNode;
  // caption under the x axis / beside the y axis
  xTitle?: React.ReactNode;
  yTitle?: React.ReactNode;
  quadrants?: MatrixQuadrants;
  // bubble radius range (svg units); without size every bubble is `minRadius`
  minRadius?: number;
  maxRadius?: number;
  // content of the ui (layer) tooltip of the hovered bubble, eg. (point) => <div>…</div>
  tooltip?: (point: MatrixPoint) => React.ReactNode;
  onClick?: (point: MatrixPoint) => void;
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  // shown instead of the chart without data
  empty?: React.ReactNode;
};

/* !- Constants */

// top right = good, top left = warning, bottom = bad (status colours of the collection)
export const DEFAULT_QUADRANTS: MatrixQuadrants = {
  topRight: { color: STATUS.good.color, text: STATUS.good.text, fill: STATUS.good.fill },
  topLeft: { color: STATUS.warning.color, text: STATUS.warning.text },
  bottomRight: { color: STATUS.bad.color, text: STATUS.bad.text },
  bottomLeft: { color: STATUS.bad.color, text: STATUS.bad.text, fill: STATUS.bad.fill },
};

const FONT_SIZE = 12;
// estimated average character width of a label (svg units / font size)
const CHAR_WIDTH = 0.58;

/* !- Helpers */

const toText = (node: React.ReactNode) =>
  typeof node === "string" || typeof node === "number" ? String(node) : "";

const quadrantOf = (point: MatrixPoint, xSplit: number, ySplit: number) =>
  `${point.y >= ySplit ? "top" : "bottom"}${point.x >= xSplit ? "Right" : "Left"}` as keyof MatrixQuadrants;

/**
 * Axis range and ticks: a given domain is kept as is (ticks inside it),
 * else the data and the split, rounded to integer steps
 */
const toAxis = (
  domain: [number, number] | undefined,
  values: number[],
  split: number,
  steps: number,
) => {
  if (!domain) {
    return integerAxis(Math.min(split, ...values), Math.max(split, ...values), steps);
  }

  const [min, max] = domain;
  const { step } = integerAxis(min, max, steps);
  const ticks: number[] = [];

  for (let tick = Math.ceil(min / step) * step; tick <= max; tick += step) {
    ticks.push(tick);
  }

  return { min, max, values: ticks };
};

type Box = { x: number; y: number; width: number; height: number };

const overlaps = (a: Box, b: Box) =>
  a.x < b.x + b.width &&
  b.x < a.x + a.width &&
  a.y < b.y + b.height &&
  b.y < a.y + a.height;

/**
 * Label positions: right, left, above, below the bubble — the first one inside the
 * canvas, not covering an earlier label or another bubble (else the right one)
 */
const placeLabels = (
  bubbles: { point: MatrixPoint; cx: number; cy: number; r: number }[],
  canvas: Box,
) => {
  const placed: Box[] = [];
  const circles = bubbles.map(({ cx, cy, r }) => ({
    x: cx - r,
    y: cy - r,
    width: r * 2,
    height: r * 2,
  }));

  return bubbles.map(({ point, cx, cy, r }, index) => {
    const width = toText(point.label).length * FONT_SIZE * CHAR_WIDTH;
    const height = FONT_SIZE * 1.2;
    const gap = 6;

    const candidates = [
      { x: cx + r + gap, y: cy - height / 2, anchor: "start" },
      { x: cx - r - gap - width, y: cy - height / 2, anchor: "end" },
      { x: cx - width / 2, y: cy - r - gap - height, anchor: "middle" },
      { x: cx - width / 2, y: cy + r + gap, anchor: "middle" },
    ] as const;

    const isFree = (box: Box) =>
      box.x >= canvas.x &&
      box.x + box.width <= canvas.x + canvas.width &&
      box.y >= canvas.y &&
      box.y + box.height <= canvas.y + canvas.height &&
      placed.every((other) => !overlaps(box, other)) &&
      circles.every((circle, i) => i === index || !overlaps(box, circle));

    const candidate =
      candidates.find((c) => isFree({ x: c.x, y: c.y, width, height })) ||
      candidates[0];

    placed.push({ x: candidate.x, y: candidate.y, width, height });

    return {
      x:
        candidate.anchor === "start"
          ? candidate.x
          : candidate.anchor === "end"
            ? candidate.x + width
            : candidate.x + width / 2,
      // text baseline
      y: candidate.y + FONT_SIZE,
      anchor: candidate.anchor,
    };
  });
};

/* !- Components */

/**
 * ChartMatrix — quadrant (bubble) chart: the plane is split at `xSplit` / `ySplit`
 * into four labelled quadrants, the points are bubbles (area ∝ `size`, relative to
 * the largest), coloured by their quadrant. Hover highlights a bubble (the others
 * fade) and shows the `tooltip`. Built on Coordinate: the quadrants, grid and axes
 * are the `underlay`, the bubbles and the labels the `children`.
 */
const ChartMatrix = ({
  data,
  xSplit = 0,
  ySplit = 0,
  xDomain,
  yDomain,
  xSteps = 4,
  ySteps = 4,
  xFormat = (value) => value,
  yFormat = (value) => value,
  xTitle,
  yTitle,
  quadrants = DEFAULT_QUADRANTS,
  minRadius = 6,
  maxRadius = 26,
  tooltip,
  onClick,
  width = 520,
  height = 380,
  margin = { top: 12, right: 24, bottom: 48, left: 52 },
  empty = "–",
}: PropTypes) => {
  const dispatch = useDispatch();
  const [hovered, setHovered] = useState<MatrixPoint["id"] | null>(null);

  // the ui (layer) tooltip is positioned to the hovered bubble
  const onEnter = (point: MatrixPoint) => (event: React.MouseEvent) => {
    setHovered(point.id);

    if (tooltip) {
      dispatch(showTooltip(tooltip(point), event));
    }
  };

  const onLeave = () => {
    setHovered(null);

    if (tooltip) {
      dispatch(flush());
    }
  };

  // no tooltip left open after unmount
  useEffect(() => () => {
    if (tooltip) {
      dispatch(flush());
    }
  }, []);

  if (!data.length) {
    return <div className="py-2 text-center text-gray">{empty}</div>;
  }

  const xAxis = toAxis(xDomain, data.map((p) => p.x), xSplit, xSteps);
  const yAxis = toAxis(yDomain, data.map((p) => p.y), ySplit, ySteps);

  const maxSize = Math.max(0, ...data.map((p) => p.size || 0));
  const radius = (size = 0) =>
    maxSize
      ? minRadius + (maxRadius - minRadius) * Math.sqrt(Math.max(size, 0) / maxSize)
      : minRadius;

  const quadrant = (point: MatrixPoint) =>
    quadrants[quadrantOf(point, xSplit, ySplit)] || {};

  // larger bubbles first, so the small ones stay on top
  const sorted = [...data].sort((a, b) => (b.size || 0) - (a.size || 0));

  return (
    <Coordinate
      data={{}}
      width={width}
      height={height}
      // room for the rotated y title beside the tick labels
      margin={yTitle ? { ...margin, left: margin.left + 16 } : margin}
      responsive
      preserveAspectRatio="xMidYMid meet"
      className="chart matrix"
      xAxisValueMin={xAxis.min}
      xAxisValueMax={xAxis.max}
      yAxisValueMin={yAxis.min}
      yAxisValueMax={yAxis.max}
      xAxisSteps={1}
      yAxisSteps={1}
      xGrid={false}
      yGrid={false}
      xAxis={false}
      yAxis={false}
      underlay={({ canvas, toPix }) => {
        const split = toPix(xSplit, ySplit);
        const [left, right] = [canvas.x, canvas.x + canvas.width];
        const [top, bottom] = [canvas.y, canvas.y + canvas.height];
        const areas = {
          topLeft: { x: left, y: top, width: split.x - left, height: split.y - top },
          topRight: { x: split.x, y: top, width: right - split.x, height: split.y - top },
          bottomLeft: { x: left, y: split.y, width: split.x - left, height: bottom - split.y },
          bottomRight: { x: split.x, y: split.y, width: right - split.x, height: bottom - split.y },
        };

        return (
          <>
            {/* quadrant backgrounds */}
            {(Object.keys(areas) as (keyof MatrixQuadrants)[]).map((key) =>
              quadrants[key]?.fill ? (
                <rect key={key} {...areas[key]} fill={quadrants[key]?.fill} />
              ) : null,
            )}

            {/* grid + labels */}
            {yAxis.values.map((tick) => (
              <g key={`y${tick}`}>
                <line
                  x1={left}
                  x2={right}
                  y1={toPix(xAxis.min, tick).y}
                  y2={toPix(xAxis.min, tick).y}
                  stroke={PLOT.grid}
                />
                <text
                  x={left - 10}
                  y={toPix(xAxis.min, tick).y + 4}
                  textAnchor="end"
                  fontSize={11}
                  fill={PLOT.muted}
                >
                  {yFormat(tick)}
                </text>
              </g>
            ))}
            {xAxis.values.map((tick) => (
              <g key={`x${tick}`}>
                <line
                  x1={toPix(tick, yAxis.min).x}
                  x2={toPix(tick, yAxis.min).x}
                  y1={top}
                  y2={bottom}
                  stroke={PLOT.grid}
                />
                <text
                  x={toPix(tick, yAxis.min).x}
                  y={bottom + 18}
                  textAnchor="middle"
                  fontSize={11}
                  fill={PLOT.muted}
                >
                  {xFormat(tick)}
                </text>
              </g>
            ))}

            {/* quadrant borders */}
            <line x1={left} x2={right} y1={split.y} y2={split.y} stroke={PLOT.axis} />
            <line
              x1={split.x}
              x2={split.x}
              y1={top}
              y2={bottom}
              stroke={PLOT.axis}
              strokeDasharray="4 3"
            />

            {/* quadrant labels in the outer corners */}
            {[
              { key: "topLeft", x: left + 10, y: top + 20, anchor: "start" },
              { key: "topRight", x: right - 10, y: top + 20, anchor: "end" },
              { key: "bottomLeft", x: left + 10, y: bottom - 10, anchor: "start" },
              { key: "bottomRight", x: right - 10, y: bottom - 10, anchor: "end" },
            ].map(({ key, x, y, anchor }) => {
              const { label, color = PLOT.text, text = color } =
                quadrants[key as keyof MatrixQuadrants] || {};

              return label ? (
                <text
                  key={key}
                  x={x}
                  y={y}
                  textAnchor={anchor}
                  fontSize={11}
                  fontWeight={700}
                  letterSpacing={0.5}
                  fill={text}
                  style={{ textTransform: "uppercase" }}
                >
                  {label}
                </text>
              ) : null;
            })}

            {/* axis titles */}
            {xTitle && (
              <text
                x={(left + right) / 2}
                y={bottom + 40}
                textAnchor="middle"
                fontSize={12}
                fill={PLOT.muted}
              >
                {xTitle}
              </text>
            )}
            {yTitle && (
              <text
                transform={`translate(${12}, ${(top + bottom) / 2}) rotate(-90)`}
                textAnchor="middle"
                fontSize={12}
                fill={PLOT.muted}
              >
                {yTitle}
              </text>
            )}
          </>
        );
      }}
    >
      {({ canvas, toPix }) => {
        const bubbles = sorted.map((point) => ({
          point,
          ...toPix(point.x, point.y),
          r: radius(point.size),
        })).map(({ point, x, y, r }) => ({ point, cx: x, cy: y, r }));

        const labels = placeLabels(bubbles, canvas);
        const active = bubbles.find(({ point }) => point.id === hovered);

        return (
          <>
            {bubbles.map(({ point, cx, cy, r }) => (
              <circle
                key={point.id}
                cx={cx}
                cy={cy}
                r={r}
                fill={point.color || quadrant(point).color || PLOT.text}
                fillOpacity={hovered === null || hovered === point.id ? 0.85 : 0.25}
                stroke="#fff"
                strokeWidth={2}
                className={onClick ? "pointer" : undefined}
                style={{ transition: "fill-opacity .15s" }}
                onMouseEnter={onEnter(point)}
                onMouseLeave={onLeave}
                onClick={onClick ? () => onClick(point) : undefined}
              />
            ))}

            {/* labels over every bubble */}
            {bubbles.map(({ point }, index) =>
              point.label ? (
                <text
                  key={point.id}
                  x={labels[index].x}
                  y={labels[index].y}
                  textAnchor={labels[index].anchor}
                  fontSize={FONT_SIZE}
                  fontWeight={hovered === point.id ? 700 : 500}
                  fill={PLOT.text}
                  opacity={hovered === null || hovered === point.id ? 1 : 0.35}
                  style={{ pointerEvents: "none" }}
                >
                  {point.label}
                </text>
              ) : null,
            )}

            {/* hover ring */}
            {active && (
              <circle
                cx={active.cx}
                cy={active.cy}
                r={active.r + 4}
                fill="none"
                stroke={active.point.color || quadrant(active.point).color || PLOT.text}
                strokeWidth={2}
                style={{ pointerEvents: "none" }}
              />
            )}
          </>
        );
      }}
    </Coordinate>
  );
};

export default ChartMatrix;
