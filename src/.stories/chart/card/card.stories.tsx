import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import formatHuf from "@1studio/shared/utils/formatHuf";
import sum from "lodash/sum";
import { SeriesGridApi } from "../../../chart/card/hooks/useSeriesGrid";

require("../../../assets/style/index.scss");

/* !- Components */

import ChartCard from "../../../chart/card/card";
import StatValue from "../../../chart/card/parts/statValue";

/* !- Constants */

const data = [
  {
    id: "s1",
    label: "store1",
    values: [100, 200, 50],
    xAxis: ["Lorem", "ipsum", "dolor"],
  },
  {
    id: "s2",
    label: "store2",
    values: [20, 30, 10],
    xAxis: ["RS1", "RS2", "RS3"],
  },
];

/* !- Stories */

const meta = {
  title: "Chart/Card/Card",
  component: ChartCard,
} satisfies Meta<typeof ChartCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Stucture: Story = {
  args: {
    id: "foo",
    data: data,
    chart: () => <div>chart</div>,
    title: "Title of the Card",
    header: "header",
    footer: "footer",
    ratio: "",
  },
};

Stucture.storyName = "Stucture";

export const StatSummary: Story = {
  args: {
    id: "foo",
    title: "Weekly revenue",
    data: data,
    chart: () => (
      <div className="text-s">
        <div className="w-content bg-green-dark rounded-l p-1 text-s text-white">
          +12%
        </div>
      </div>
    ),
    header: (api: SeriesGridApi) => (
      <StatValue
        value={sum(api.series[0].values)}
        format={formatHuf}
        size="l"
      />
    ),
    layout: "horizontal",
    footer: (api: SeriesGridApi) => {
      return (
        <div className="text-xs mt-1 text-gray-dark">{`Last week: ${formatHuf(sum(api.series[1].values))}`}</div>
      );
    },
    ratio: "",
  },
  decorators: [
    (Story) => (
      <div style={{ width: 420 }}>
        <Story />
      </div>
    ),
  ],
};

StatSummary.storyName = "Sample: Stat summary";

export const DebitCard: Story = {
  render: (args) => (
    <div style={{ width: 420 }}>
      <ChartCard
        id="debit-color"
        color={args.color as string}
        ratio="16 / 4"
        data={data}
        title={
          <div className="column gap-2">
            <div
              className="text-white"
              style={{
                fontWeight: 800,
                fontStyle: "italic",
                fontSize: "1.4em",
                letterSpacing: 1,
              }}
            >
              VISA
            </div>
            <span className="text-gray-dark text-s">Debit Card</span>
            <div style={{ marginTop: "0.5em" }}>
              <StatValue
                value={22428.26}
                format={formatHuf}
                size="xl"
                align="left"
              />
            </div>
          </div>
        }
        chart={() => null}
        footer={
          <div
            className="h-bottom v-justify text-white"
            style={{
              display: "flex",
              justifyContent: "space-between",
              letterSpacing: 2,
            }}
          >
            <span>**** 9090</span>
            <span className="text-gray-dark">04 / 24</span>
          </div>
        }
      />
    </div>
  ),
  args: {
    color: "#1B76FF",
  },
};

DebitCard.storyName = "Sample: Colour card";
