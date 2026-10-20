import React from "react";
import { Meta, StoryObj } from "@storybook/react";

require("../../../assets/style/index.scss");

/* !- Components */

import ChartCard from "../../chart/card/card";
import Gauge from "../../chart/gauge";

/* !- Demo data */

const MARKERS = [
  { label: "Idei átlag", value: 12 },
  { label: "Múlt hó", value: 21 },
];

const TARGET = { label: "Cél", value: 50 };

const DARK = "#121418";

/* !- Stories */

const meta = {
  title: "Chart/Card/Usecase-Gauges",
  component: ChartCard,
} satisfies Meta<typeof ChartCard>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Potméter – világos: ChartCard + responsive Gauge (svg, a kártya szélességére skálázódik),
 * idei átlag, múlt hó és cél jelölővel
 */
export const Light: Story = {
  render: () => (
    <div style={{ width: 640 }}>
      <ChartCard
        id="UsecaseGauges/light"
        ratio="auto"
        title={
          <div className="column gap-1/2">
            <span className="text-xl bold text-black">Kampány-eredményesség</span>
            <span className="text-m text-gray-dark">Összesített index · 2026. október</span>
          </div>
        }
        chart={() => (
          <div className="px-4 pt-2">
            <Gauge
              value={34}
              markers={MARKERS}
              target={TARGET}
              caption="16 ponttal a cél alatt"
              responsive
            />
          </div>
        )}
      />
    </div>
  ),
};

Light.storyName = "Potméter – világos";

/**
 * Potméter – sötét csempe: ChartCard `color` téma + ugyanaz a Gauge `background` (a színek abból számolódnak), kompakt jelölők
 * (érték nélkül)
 */
export const Dark: Story = {
  render: () => (
    <div style={{ width: 380 }}>
      <ChartCard
        id="UsecaseGauges/dark"
        ratio="auto"
        color={DARK}
        title={<span className="text-l bold text-white">Kampány-eredményesség</span>}
        chart={() => (
          <div className="px-2">
            <Gauge
              background={DARK}
              value={34}
              markers={[
                { label: "Átlag", value: 12 },
                { label: "Múlt hó", value: 21 },
              ]}
              target={TARGET}
              markerValues={false}
              caption="16 ponttal a cél alatt"
              responsive
            />
          </div>
        )}
      />
    </div>
  ),
};

Dark.storyName = "Potméter – sötét csempe";
