import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import moment from "moment";
import formatHuf from "@1studio/shared/utils/formatHuf";
import sum from "lodash/sum";
import { SeriesGridApi } from "../../chart/card/hooks/useSeriesGrid";

require("../../../assets/style/index.scss");

/* !- Components */

import Card from "../../chart/card/card";
import MinimalCard from "../../chart/card/minimal";
import FilterCard from "../../chart/card/filter";
import DateFilterCard from "../../chart/card/dateFilter";

import StatValue from "../../chart/card/parts/statValue";
import ChartLine from "../../chart/line";

/* !- Reducers (generic array) */

import { last, percentChange, avg } from "@1studio/utils/array";

/* !- Demo data */

const data = [
  {
    id: "seriers2026",
    values: [28, 24, 33, 40, 48, 34, 31, 36, 40, 42, 40, 42],
    color: "#e8792b",
  },
  {
    id: "seriers2025",
    values: [18, 14, 23, 30, 38, 44, 41, 46, 30, 32, 30, 32],
    // color: "#e8792b",
  },
];

const SEGMENTS = [
  { id: "1d", title: "1D", range: 1 },
  { id: "1w", title: "1W", range: 7 },
  { id: "1m", title: "1M", range: 30 },
  { id: "1q", title: "1Q", range: 90 },
];

const money = (value: number) =>
  `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

const yAxisLabel = ({ value, x, y }: any) => (
  <text
    x={x - 12}
    y={y}
    textAnchor="end"
    dominantBaseline="central"
    fontSize={15}
    fill="#9aa5b1"
  >
    {value.y.toFixed(3).replace(".", ",")}
  </text>
);

const stockChart = (series: any[]) => {
  const length = series[0]?.values.length || 0;
  const step = Math.max(1, Math.ceil(length / 6));

  return (
    <ChartLine
      data={series}
      responsive
      edgeToEdge
      width={900}
      height={380}
      area
      hover
      marker={false}
      yGrid={false}
      xAxisFormat={(value: string, index: number) =>
        index % step === 0 ? moment(value).format("MMM D") : null
      }
      valueFormat={(value: number) => value.toFixed(4)}
      yAxisLabel={yAxisLabel}
      margin={{ top: 48, right: 24, bottom: 30, left: 64 }}
    />
  );
};

const statChart = (series: any[]) => {
  const length = series[0]?.values.length || 0;
  const step = Math.max(1, Math.ceil(length / 9));

  return (
    <ChartLine
      data={series}
      responsive
      edgeToEdge
      width={1000}
      height={360}
      hover
      marker={false}
      yAxis={false}
      xGrid={false}
      yGrid={false}
      xAxisFormat={(value: string, index: number) =>
        index % step === 0 ? moment(value).format("MMM") : null
      }
      valueFormat={(value: number) => `$${value.toLocaleString()}`}
      margin={{ top: 70, right: 24, bottom: 36, left: 24 }}
    />
  );
};

const minimalChart = (series: any[]) => (
  <ChartLine
    data={series}
    responsive
    edgeToEdge
    width={320}
    height={140}
    area
    marker
    hover={false}
    color="#e8792b"
    xAxis={false}
    yAxis={false}
    xGrid={false}
    yGrid={false}
    margin={{ top: 12, right: 8, bottom: 12, left: 8 }}
  />
);

const Wrapper = ({ children }: any) => (
  <div
    style={{
      width: 325,
      gap: 20,
      display: "flex",
      flexDirection: "column",
    }}
  >
    {children}
  </div>
);

/* !- Stories */

const meta = {
  title: "Chart/Card/Usecase",
  component: MinimalCard,
} satisfies Meta<typeof MinimalCard>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 */
export const Usecase: Story = {
  render: () => (
    <Wrapper>
      <Card
        id="Card"
        title="Weekly revenue"
        layout="horizontal"
        ratio=""
        data={data}
        chart={() => (
          <div className="text-s">
            <div className="w-content bg-green-dark rounded-l p-1 text-s text-white">
              +12%
            </div>
          </div>
        )}
        header={(api: SeriesGridApi) => (
          <StatValue
            value={sum(api.series[0].values)}
            format={formatHuf}
            size="l"
          />
        )}
      />

      <MinimalCard
        id="MinimalCard"
        title="Purchases"
        data={data}
        summary={last}
        change={percentChange}
        changeFormat={(value) => `${Math.abs(Math.round(value))}%`}
        // chart={minimalChart}
      />
      <FilterCard
        id="FilterCard"
        title="Trends"
        data={data}
        multiple
        filter={SEGMENTS}
        defaultFilter="1q"
        summary={last}
        change={percentChange}
        format={(value) => value.toFixed(4)}
        chart={stockChart}
      />
      <DateFilterCard
        id="DateFilterCard"
        title="Trends in the number of purchases"
        data={data}
        period
        chart={statChart}
        format={money}
        summaries={[
          {
            seriesId: "income",
            label: "Average Income",
            value: avg,
            change: percentChange,
          },
          {
            seriesId: "expense",
            label: "Average Expenses",
            value: avg,
            change: percentChange,
          },
        ]}
      />
    </Wrapper>
  ),
};

Usecase.storyName = "Usecase";
