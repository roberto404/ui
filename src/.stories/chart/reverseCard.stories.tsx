import React from "react";
import { Meta, StoryObj } from "@storybook/react";

require("../../../assets/style/index.scss");

/* !- Components */

import ChartCard from "../../chart/card/card";
import ChartLine from "../../chart/line";
import Donut from "../../chart/donut";
import StatValue from "../../chart/card/parts/statValue";

/* !- Demo data */

const DAYS = ["H", "K", "Sze", "Cs", "P", "Szo", "V"];

const week = [{ id: "week", values: [600, 662, 618, 590, 727, 648, 690], xAxis: DAYS }];

const fulfillment = [{ id: "fulfillment", values: [17, 25] }];

/* !- Parts */

const FulfillmentTitle = () => (
  <div className="column gap-1/2">
    <span className="text-gray-dark text-s uppercase bold">Teljesítés ma</span>
    <span className="text-s">17 / 25 rendelés kiszállítva vagy átvéve</span>
  </div>
);

const FulfillmentDonut = () => (
  <div style={{ width: 100 }}>
    <Donut percent={68} color="#186eff" ringColor="#edf0f5" strokeWidth={4} rounded />
  </div>
);

const WeekTitle = () => (
  <div className="column gap-1">
    <span className="text-gray-dark text-s uppercase bold">Forgalom</span>
    <StatValue value={4535} size="m" align="left" />
  </div>
);

const WeekChart = () => (
  <ChartLine
    data={week}
    responsive
    width={360}
    height={200}
    marker={false}
    yAxis={false}
    xGrid={false}
    margin={{ top: 20, right: 20, bottom: 34, left: 20 }}
  />
);

/* !- Stories */

const meta = {
  title: "Chart/Card/Reverse",
  component: ChartCard,
  parameters: {
    docs: {
      description: {
        component:
          "`reverse`: a chart-area kerül előre, a fejléc (title + header) utána. " +
          '`layout="horizontal"` mellett a chart balra, a fejléc közvetlenül mellette, függőlegesen középre ' +
          "(a cím ilyenkor tördelhető); függőlegesen a chart felülre.",
      },
    },
  },
} satisfies Meta<typeof ChartCard>;

export default meta;

type Story = StoryObj<typeof meta>;

/* !- Vízszintes: alap sorrend (fejléc balra, chart jobbra) */

export const Horizontal: Story = {
  render: () => (
    <div style={{ width: 380 }}>
      <ChartCard
        id="reverse-horizontal"
        layout="horizontal"
        ratio="1 / 1"
        data={fulfillment}
        title={<FulfillmentTitle />}
        chart={() => <FulfillmentDonut />}
      />
    </div>
  ),
};

Horizontal.storyName = "Vízszintes (alap)";

/* !- Vízszintes, fordítva: chart balra (dashboard „Teljesítés ma”) */

export const HorizontalReverse: Story = {
  render: () => (
    <div style={{ width: 380 }}>
      <ChartCard
        id="reverse-horizontal-reverse"
        layout="horizontal"
        reverse
        ratio="1 / 1"
        data={fulfillment}
        title={<FulfillmentTitle />}
        chart={() => <FulfillmentDonut />}
      />
    </div>
  ),
};

HorizontalReverse.storyName = "Vízszintes, reverse (chart balra)";

/* !- Függőleges: alap sorrend (fejléc felül) */

export const Vertical: Story = {
  render: () => (
    <div style={{ width: 380 }}>
      <ChartCard
        id="reverse-vertical"
        ratio="16 / 9"
        data={week}
        title={<WeekTitle />}
        header={<span className="text-xs text-gray-dark">Ft / nap</span>}
        chart={() => <WeekChart />}
      />
    </div>
  ),
};

Vertical.storyName = "Függőleges (alap)";

/* !- Függőleges, fordítva: chart felül */

export const VerticalReverse: Story = {
  render: () => (
    <div style={{ width: 380 }}>
      <ChartCard
        id="reverse-vertical-reverse"
        reverse
        ratio="16 / 9"
        data={week}
        title={<WeekTitle />}
        header={<span className="text-xs text-gray-dark">Ft / nap</span>}
        chart={() => <WeekChart />}
      />
    </div>
  ),
};

VerticalReverse.storyName = "Függőleges, reverse (chart felül)";
