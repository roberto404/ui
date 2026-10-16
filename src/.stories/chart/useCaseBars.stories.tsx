import React from "react";
import { Meta, StoryObj } from "@storybook/react";

require("../../../assets/style/index.scss");

/* !- Components */

import ChartCard from "../../chart/card/card";
import NumberedTitle from "../../chart/card/parts/numberedTitle";
import ChartBar from "../../chart/bar";

/* !- Demo data: árbevétel → kedvezmény → nyereség */

const REVENUE = 1250;
const DISCOUNT = 250;
const PROFIT = REVENUE - DISCOUNT;

const COLORS = ["#e3e6eb", "#e08543", "#186eff"]; // $gray-light-ish, $brown-light, $blue-dark
const LABELS = [REVENUE, -DISCOUNT, PROFIT];

const SIZE = {
  width: 420,
  height: 260,
  margin: { top: 40, right: 10, bottom: 40, left: 10 },
};

/* !- Helpers */

const numberFormat = new Intl.NumberFormat("hu-HU", {
  useGrouping: "always",
} as any);

const Wrapper = ({ children }: any) => (
  <div
    style={{
      width: 460,
      gap: 20,
      display: "flex",
      flexDirection: "column",
    }}
  >
    {children}
  </div>
);

// value above the bar: the change (−250 in the discount colour), not the bar height
const BarValue = ({ index, x, y, color }: any) => (
  <text
    x={x}
    y={y - 12}
    textAnchor="middle"
    fontSize={16}
    fontWeight={700}
    fill={index === 1 ? color : "#252631"}
  >
    {LABELS[index] < 0
      ? `−${numberFormat.format(-LABELS[index])}`
      : numberFormat.format(LABELS[index])}
  </text>
);

const Stat = ({ value, label }: { value: React.ReactNode; label: React.ReactNode }) => (
  <div>
    <div className="text-xl bold">{value}</div>
    <div className="text-s text-gray-dark">{label}</div>
  </div>
);

/* !- Stories */

const meta = {
  title: "Chart/Card/Usecase-Bars",
  component: ChartCard,
} satisfies Meta<typeof ChartCard>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Pénzügyi mérleg: ChartCard + waterfall ChartBar (a kedvezmény `from`-mal lebeg,
 * szaggatott `connector`), alatta a fajlagos mutatók a footerben
 */
export const Balance: Story = {
  render: () => (
    <Wrapper>
      <ChartCard
        id="UsecaseBars/balance"
        title={<NumberedTitle index={5} title="Pénzügyi mérleg" />}
        ratio="auto"
        chart={() => (
          <ChartBar
            data={[
              {
                id: "balance",
                values: [REVENUE, PROFIT, PROFIT],
                from: [null, REVENUE, null],
                xAxis: ["Árbevétel", "Kedvezmény", "Nyereség"],
              },
            ]}
            color={(_value: number, index: number) => COLORS[index]}
            radius={12}
            gap={0.3}
            showValue="always"
            tooltip={BarValue}
            connector
            connectorColor="#c4c8d0"
            barLabels
            labelColor="#778ca2"
            xAxis={false}
            yAxis={false}
            xGrid={false}
            yAxisValueMin={0}
            yAxisValueMax={REVENUE}
            {...SIZE}
            responsive
            preserveAspectRatio="xMidYMid meet"
            // baseline under the bars
            underlay={({ canvas }) => (
              <line
                x1={canvas.x}
                x2={canvas.x + canvas.width}
                y1={canvas.y + canvas.height}
                y2={canvas.y + canvas.height}
                stroke="#dfe3e8"
                strokeWidth={2}
              />
            )}
          />
        )}
        footer={
          <div className="flex gap-3 mt-1">
            <Stat value="10 Ft" label="/ regisztráló" />
            <Stat value="12,5 Ft" label="kedv. / beváltás" />
          </div>
        }
      />
    </Wrapper>
  ),
};

Balance.storyName = "Pénzügyi mérleg";
