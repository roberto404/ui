import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import sum from "lodash/sum";

require("../../../assets/style/index.scss");

/* !- Components */

import ChartCard, { defaultProps } from "../../chart/card/card";
import StatValue from "../../chart/card/parts/statValue";
import ChartTimeline, { ITimelineItem } from "../../chart/timeline";
import Layer from "../../layer/layer";
import { AppContext } from "../../context";

import { SeriesGridApi } from "../../chart/card/hooks/useSeriesGrid";

/* !- Demo data */

const data: ITimelineItem[] = [
  {
    title: "Sample 1",
    duration: 15000,
    startDateTime: "2026-09-26 20:50:01",
    color: "#55b45f",
  },
  {
    title: "Sample 2",
    duration: 10000,
    startDateTime: "2026-09-26 20:51:05",
    color: "#e8792b",
  },
  {
    title: "Sample 3",
    duration: 120000,
    startDateTime: "2026-09-26 20:52:10",
    color: "#55b45f",
  },
];

const layerContext = {
  addShortcuts: () => {},
  removeShortcuts: () => {},
};

/* !- Stories */

const meta = {
  title: "Chart/Card/Usecase3-CustomChart",
  component: ChartTimeline,
  // the tooltip is rendered by the ui layer; Layer needs the app context (shortcuts)
  decorators: [
    (Story) => (
      <AppContext.Provider value={layerContext as any}>
        <Story />
        <Layer />
      </AppContext.Provider>
    ),
  ],
} satisfies Meta<typeof ChartTimeline>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Timeline chart alone: x-axis in minutes (from / to / step), tooltip on hover.
 */
export const Timeline: Story = {
  args: {
    data,
    xAxisFrom: 0,
    xAxisTo: 15,
    xAxisStep: 5,
    width: 500,
    height: 110,
    tooltipFormat: ({ title, duration }: ITimelineItem) =>
      `${title} • ${Math.round(duration / 1000)} mp`,
  },
};

Timeline.storyName = "Timeline";

/**
 * Timeline inside a horizontal chart card: headline = total duration.
 */
export const Usecase3: Story = {
  args: { data },
  render: () => (
    <div style={{ maxWidth: 460 }}>
      <ChartCard
        id="Usecase3"
        className={defaultProps.className}
        title={(api: SeriesGridApi) => (
          <div className="v-top column gap-1">
            <div className="medium">10 Minutes</div>
            <StatValue
              value={Math.round(sum(api.series[0]?.values || []) / 60000)}
              format={(v) => `${v}m`}
              size="l"
              align="left"
            />
          </div>
        )}
        layout="horizontal"
        ratio="6 / 1"
        data={[{ id: "duration", values: data.map(({ duration }) => duration) }]}
        chart={() => (
          <ChartTimeline
            data={data}
            xAxisFrom={0}
            xAxisTo={15}
            xAxisStep={5}
            tooltipFormat={({ title, duration }) =>
              `${title} • ${Math.round(duration / 1000)} mp`
            }
            responsive
            width={300}
            height={50}
            barHeight={20}
            margin={{ top: 0, right: 16, bottom: 26, left: 16 }}
          />
        )}
      />
    </div>
  ),
};

Usecase3.storyName = "Usecase 3";
