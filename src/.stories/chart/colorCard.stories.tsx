import React from "react";
import { Meta, StoryObj } from "@storybook/react";

require("../../../assets/style/index.scss");

/* !- Components */

import ChartCard from "../../chart/card/card";
import ChartLine from "../../chart/line";
import StatValue from "../../chart/card/parts/statValue";

/* !- Demo data */

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const week = [
  { id: "week", values: [600, 662, 618, 590, 727, 648, 690], xAxis: DAYS },
];

/* !- Custom pill tooltip (see the Line "Custom tooltip" story) */

const pillTooltip = ({ value, y, top, bottom, colWidth }) => {
  // sizes derived from the data-point width, so the tooltip scales with the chart
  const w = colWidth * 0.8;
  const boxH = colWidth * 0.8;
  const boxW = colWidth * 1.5;
  const fontSize = boxH * 0.5;

  return (
    <g>
      <defs>
        <linearGradient id="card-pill-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.06" />
          <stop offset="55%" stopColor="#fff" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.06" />
        </linearGradient>
        <filter
          id="card-pill-shadow"
          x="-60%"
          y="-60%"
          width="220%"
          height="220%"
        >
          <feDropShadow
            dx="0"
            dy="3"
            stdDeviation="5"
            floodColor="#000"
            floodOpacity="0.2"
          />
        </filter>
      </defs>

      <rect
        x={-w / 2}
        y={top}
        width={w}
        height={bottom - top}
        rx={w / 2}
        ry={w / 2}
        fill="url(#card-pill-fill)"
      />
      <circle cx={0} cy={y} r={colWidth * 0.12} fill="#fff" />

      <g transform={`translate(${-boxW / 2}, ${top - boxH - 2})`}>
        <rect
          width={boxW}
          height={boxH}
          rx={boxH / 2}
          ry={boxH / 2}
          fill="#fff"
          filter="url(#card-pill-shadow)"
        />
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

const huf = (n: number) =>
  `$${n.toLocaleString("hu-HU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/* !- Stories */

const meta = {
  title: "Chart/Card/Colour",
  component: ChartCard,
  argTypes: {
    color: {
      control: "color",
    },
  },
} satisfies Meta<typeof ChartCard>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * "Statistics" card (kép 2). The `color` prop themes the whole card — background,
 * the title / value text (white + a light tint) and, via `api.theme`, the chart
 * itself: a white line + a custom rounded, shadowed pill tooltip, with light day
 * labels. Change `color` in the controls to re-theme everything at once.
 */
export const Statistics: Story = {
  render: (args) => (
    <div style={{ width: 380 }}>
      <ChartCard
        id="stats-color"
        color={args.color as string}
        ratio="1 / 1"
        data={week}
        title={(api) => (
          <div className="column gap-2">
            <span className="text-gray-dark text-s">Statistics</span>
            <StatValue value={184.44} format={huf} size="l" align="left" />
          </div>
        )}
        header={
          <div
            className="h-center v-center"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.18)",
              color: "#fff",
            }}
          >
            ↗
          </div>
        }
        chart={(api) => (
          <ChartLine
            data={api.series}
            responsive
            width={360}
            height={240}
            hover
            tooltip={pillTooltip}
            marker={false}
            color={api.theme.fg}
            xAxisFormat={(v, i) => DAYS[i]}
            xAxisLabel={({ value, x, y }: any) => (
              <text
                x={x}
                y={y + 8}
                textAnchor="middle"
                alignmentBaseline="hanging"
                fontSize={13}
                style={{ fill: api.theme.fgMuted }}
              >
                {value.x}
              </text>
            )}
            yAxis={false}
            xGrid={false}
            margin={{ top: 54, right: 20, bottom: 34, left: 20 }}
          />
        )}
      />
    </div>
  ),
  args: {
    color: "#f4511e",
  },
};

Statistics.storyName = "Statistics (colour + chart cascade + pill tooltip)";
