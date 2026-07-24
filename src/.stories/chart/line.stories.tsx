import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import moment from "moment";

require("../../../assets/style/index.scss");

import decimalToRoman from "@1studio/utils/string/decimalToRoman";

/* !- Compontents */

import Line from "../../chart/line";
import Resize from "../../resize";

/* !- Stories */

const meta = {
  title: "Chart/Line",
  component: Line,
  argTypes: {
    color: {
      control: "color",
    },
  },
} satisfies Meta<typeof Line>;

export default meta;

type Story = StoryObj<typeof meta>;

/* !- Basic Line */

export const Line1: Story = {
  args: {
    data: [
      {
        id: "alpha",
        values: [100, 110, 130, 110, 130, 130],
        xAxis: ["1", "2", "3", "4", "5", "6"],
      },
    ],
    xAxisFormat: (value) => decimalToRoman(value),
    width: 800,
    height: 300,
  },
};

Line1.storyName = "Basic";

/* !- Minimal Line */

export const Line2: Story = {
  args: {
    data: [
      {
        id: "alpha",
        values: [20, 10, 40, 10],
      },
    ],
    width: 800,
    height: 300,
  },
};

Line2.storyName = "Minimal data";

/* !- Stock chart (area fill + hover tooltip + x-axis formatter) */

/**
 * Deterministic exchange-rate like series (~10 weeks of daily samples).
 */
const DAYS = 70;
const anchor = moment("2025-06-05");

const values = Array.from({ length: DAYS }, (_, i) => {
  const t = i / (DAYS - 1);

  const rate =
    0.7448 -
    0.0022 * Math.exp(-((t - 0.12) ** 2) / 0.004) + // early dip
    0.003 * (1 / (1 + Math.exp(-(t - 0.42) * 18))) - // mid rise
    0.0008 * Math.max(0, t - 0.7) + // late soft decline
    0.0004 * Math.sin(t * Math.PI * 22) + // noise
    0.0003 * Math.sin(t * Math.PI * 7);

  return Math.round(rate * 10000) / 10000;
});

const stockData = [
  {
    id: "huf",
    values,
    xAxis: Array.from({ length: DAYS }, (_, i) =>
      anchor.clone().add(i, "days").format("YYYY-MM-DD"),
    ),
  },
];

/**
 * x-axis: only label roughly every second week, formatted as "MMM D".
 */
const xAxisFormat = (value, index) =>
  index % 10 === 0 ? moment(value).format("MMM D") : null;

/**
 * value shown in the hover box, 4 decimals.
 */
const valueFormat = (value) => value.toFixed(4);

/**
 * y-axis labels formatted to 3 decimals, Hungarian decimal comma
 * (uses the existing `yAxisLabel` prop of Coordinate).
 */
const yAxisLabel = ({ value, x, y }) => (
  <text
    x={x - 10}
    y={y}
    textAnchor="end"
    dominantBaseline="central"
    fontSize={15}
  >
    {value.y.toFixed(3).replace(".", ",")}
  </text>
);

export const Line3: Story = {
  args: {
    data: stockData,
    area: true,
    hover: true,
    marker: false,
    xAxisFormat,
    valueFormat,
    yAxisLabel,
    width: 900,
    height: 380,
    margin: {
      top: 52,
      right: 24,
      bottom: 28,
      left: 64,
    },
  },
};

Line3.storyName = "Stock (area + hover tooltip)";

/* !- Area only (pick the colour in the args) */

/**
 * A clean line + area fill (no hover, no axes / grid). Change `color` in the
 * controls: both the line and the gradient area follow it.
 */
export const Area1: Story = {
  args: {
    data: [
      {
        id: "orange",
        values: [20, 80, 48, 58, 42, 70, 38, 55, 90],
      },
    ],
    area: true,
    color: "#e8792b",
    xAxis: false,
    yAxis: false,
    xGrid: false,
    yAxisValueMin: 0,
    marker: false,
    width: 560,
    height: 260,
    margin: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20,
    },
  },
};

Area1.storyName = "Area only (pick colour)";

/* !- Area with a second (trend) line */

/**
 * Multiple series: the area always fills under the primary (first) series; the
 * second series is drawn as a plain line — here a black dashed trend line
 * (`color` + `dashed` set per-series on the data).
 */
export const Area2: Story = {
  args: {
    data: [
      {
        id: "sales",
        values: [20, 80, 48, 58, 42, 70, 38, 55, 90],
      },
      {
        id: "trend",
        values: [34, 40, 46, 51, 57, 62, 68, 73, 79],
        color: "#000000",
        dashed: true,
      },
    ],
    area: true,
    color: "#e8792b",
    xAxis: false,
    yAxis: false,
    xGrid: false,
    yAxisValueMin: 0,
    marker: false,
    width: 720,
    height: 300,
    margin: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20,
    },
  },
};

Area2.storyName = "Area with trend line";

/* !- Multiple lines with per-series bezier + markers */

/**
 * Three series, each configured on its own:
 *   - "sales"  straight line + round marker
 *   - "target" bezier line   + diamond marker
 *   - "base"   straight line, no marker
 * The chart-level `marker` render function branches on the series `id` to draw a
 * different marker per line (same idea as `yAxisLabel`).
 */
const marker = ({ id, x, y, color }) =>
  id === "target" ? (
    <rect
      x={x - 5}
      y={y - 5}
      width={10}
      height={10}
      transform={`rotate(45 ${x} ${y})`}
      fill={color}
      stroke="#fff"
      strokeWidth={2}
    />
  ) : (
    <circle cx={x} cy={y} r={5} fill={color} stroke="#fff" strokeWidth={2} />
  );

export const Markers1: Story = {
  args: {
    data: [
      {
        id: "sales",
        values: [40, 55, 48, 66, 58, 74],
        color: "#186eff",
        bezier: false,
      },
      {
        id: "target",
        values: [56, 16, 61, 72, 67, 80],
        color: "#e8792b",
        bezier: true,
      },
      {
        id: "base",
        values: [22, 30, 26, 38, 32, 44],
        color: "#6dd230",
        bezier: false,
        marker: false,
      },
    ],
    marker,
    xAxis: false,
    yAxis: false,
    xGrid: false,
    yAxisValueMin: 0,
    width: 760,
    height: 340,
    margin: {
      top: 24,
      right: 24,
      bottom: 24,
      left: 24,
    },
  },
};

Markers1.storyName = "Multiple lines (bezier + markers per series)";

/* !- Hover with multiple lines */

/**
 * Hover on a multi-line chart: a shared vertical guide at the hovered x, a dot on
 * every line at that x, and a tooltip listing all series values (colour coded).
 * The whole marker slides smoothly as the cursor moves.
 */
export const Hover2: Story = {
  args: {
    data: [
      {
        id: "A",
        values: [42, 55, 48, 60, 52, 66, 58, 70, 64, 76, 68, 80],
        color: "#186eff",
      },
      {
        id: "B",
        values: [30, 38, 34, 44, 40, 50, 46, 54, 50, 60, 56, 64],
        color: "#e8792b",
      },
      {
        id: "C",
        values: [20, 24, 22, 30, 26, 34, 30, 38, 34, 42, 38, 46],
        color: "#6dd230",
      },
    ],
    hover: true,
    marker: false,
    xAxis: false,
    yAxis: false,
    xGrid: false,
    yAxisValueMin: 0,
    width: 820,
    height: 360,
    margin: {
      top: 80,
      right: 24,
      bottom: 24,
      left: 24,
    },
  },
};

Hover2.storyName = "Hover with multiple lines";

/* !- Responsive (Resize wrapper) with axes + hover tooltip */

const respMonths = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// fixed-size axis labels — readable at any (real pixel) chart size
const respXAxisLabel = ({ value, x, y }) => (
  <text
    x={x}
    y={y + 6}
    textAnchor="middle"
    alignmentBaseline="hanging"
    fontSize={12}
    fill="#778ca2"
  >
    {value.x}
  </text>
);

const respYAxisLabel = ({ value, x, y }) => (
  <text
    x={x - 8}
    y={y}
    textAnchor="end"
    dominantBaseline="central"
    fontSize={12}
    fill="#98a9bc"
  >
    {`${Math.round(value.y)}k`}
  </text>
);

/**
 * Responsive chart via the `Resize` wrapper: it measures the container (live,
 * ResizeObserver) and renders the chart at the real pixel size — so the axis
 * values, the marker and the hover tooltip stay crisp / readable at any size
 * (unlike viewBox scaling, which shrinks everything).
 *
 * Drag the bottom-right corner of the box to resize.
 */
export const Responsive1: Story = {
  render: (args) => (
    <div>
      <p style={{ font: "13px sans-serif", color: "#778ca2", margin: "0 0 8px" }}>
        Drag the bottom-right corner to resize — axis values, marker and tooltip stay readable.
      </p>
      <div
        style={{
          width: 720,
          height: 380,
          resize: "both",
          overflow: "hidden",
          border: "1px dashed #98a9bc",
          padding: 12,
          boxSizing: "border-box",
        }}
      >
        <Resize>
          <Line {...args} />
        </Resize>
      </div>
    </div>
  ),
  args: {
    data: [
      {
        id: "revenue",
        values: [120, 135, 128, 152, 168, 160, 185, 178, 195, 210, 205, 230],
        xAxis: respMonths,
      },
    ],
    hover: true,
    marker: false,
    xAxisLabel: respXAxisLabel,
    yAxisLabel: respYAxisLabel,
    valueFormat: (v) => `${Math.round(v)}k`,
    yAxisValueMin: 100,
    margin: {
      top: 44,
      right: 24,
      bottom: 32,
      left: 52,
    },
  },
};

Responsive1.storyName = "Responsive (Resize) with axes + tooltip";

/* !- Custom hover tooltip (pill + value box, replaces the dashed guide) */

// light x-axis labels for a coloured background
const dayAxisLabel = ({ value, x, y }) => (
  <text
    x={x}
    y={y + 8}
    textAnchor="middle"
    alignmentBaseline="hanging"
    fontSize={13}
    fill="rgba(255,255,255,0.85)"
  >
    {value.x}
  </text>
);

/**
 * Custom `tooltip` render-prop. It receives the hovered point's position + the
 * plot bounds (`x`, `y`, `top`, `bottom`, `value`, `canvas`, `color`) and is drawn
 * at the point's x (so it slides), with y in absolute plot coordinates — here a
 * rounded, shadowed highlight pill + a white value box, replacing the guide line.
 */
const pillTooltip = ({ value, y, top, bottom, colWidth }) => {
  // sizes derived from the data-point width, so the tooltip scales with the chart
  const w = colWidth * 0.8;
  const boxH = colWidth * 0.8;
  const boxW = colWidth * 1.5;
  const fontSize = boxH * 0.5;

  return (
    <g>
      <defs>
        <linearGradient id="pill-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.06" />
          <stop offset="55%" stopColor="#fff" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.06" />
        </linearGradient>
        <filter id="pill-shadow" x="-60%" y="-60%" width="220%" height="220%">
          <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#000" floodOpacity="0.2" />
        </filter>
      </defs>

      {/* highlight pill: plot top -> axis */}
      <rect x={-w / 2} y={top} width={w} height={bottom - top} rx={w / 2} ry={w / 2} fill="url(#pill-fill)" />

      {/* dot on the line */}
      <circle cx={0} cy={y} r={colWidth * 0.12} fill="#fff" />

      {/* value box on top of the pill */}
      <g transform={`translate(${-boxW / 2}, ${top - boxH - 2})`}>
        <rect width={boxW} height={boxH} rx={boxH / 2} ry={boxH / 2} fill="#fff" filter="url(#pill-shadow)" />
        <text
          x={boxW / 2}
          y={boxH / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={fontSize}
          fontWeight={700}
          fill="#333"
        >
          {value}
        </text>
      </g>
    </g>
  );
};

export const CustomTooltip: Story = {
  render: (args) => (
    <div style={{ background: "#f4511e", borderRadius: 24, padding: 24, width: 560 }}>
      <Line {...args} />
    </div>
  ),
  args: {
    data: [
      {
        id: "week",
        values: [600, 662, 618, 590, 727, 648, 690],
        xAxis: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
    ],
    hover: true,
    tooltip: pillTooltip,
    marker: false,
    color: "#fff",
    xAxisLabel: dayAxisLabel,
    yAxis: false,
    xGrid: false,
    width: 560,
    height: 300,
    margin: {
      top: 52,
      right: 30,
      bottom: 34,
      left: 30,
    },
  },
};

CustomTooltip.storyName = "Custom tooltip (pill + box)";
