import React from "react";
import { Meta, StoryObj } from "@storybook/react";

require("../../../assets/style/index.scss");

/* !- Components */

import ChartCard from "../../chart/card/card";
import NumberedTitle from "../../chart/card/parts/numberedTitle";
import Pie from "../../chart/pie";
import PieLegend from "../../chart/pieLegend";

/* !- Demo data */

const families = [
  { label: "Fióna", percent: 45, color: "#186eff", caption: "4,5 M Ft · 9 db" },
  { label: "Flat", percent: 33, color: "#e08543", caption: "3,3 M Ft · 7 db" },
  { label: "Tina", percent: 22, color: "#2ce5f6", caption: "2,2 M Ft · 4 db" },
];

/* !- Helpers */

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

/* !- Stories */

const meta = {
  title: "Chart/Card/Usecase-Pies",
  component: ChartCard,
} satisfies Meta<typeof ChartCard>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Bútorcsaládok: ChartCard + Pie gyűrű mód (`thickness`, `gap`, középső darabszám)
 * és mellette a PieLegend
 */
export const Families: Story = {
  render: () => (
    <Wrapper>
      <ChartCard
        id="UsecasePies/families"
        title={<NumberedTitle index={3} title="Bútorcsaládok" />}
        ratio="auto"
        chart={() => (
          <div className="flex h-center">
            <div className="col-1-2 p-3">
              <Pie data={families} thickness={0.32} gap={1}>
                <span className="text-xxl bold">20</span>
                <span className="text-s text-gray-dark">db bútor</span>
              </Pie>
            </div>
            <PieLegend items={families} />
          </div>
        )}
      />
    </Wrapper>
  ),
};

Families.storyName = "Bútorcsaládok";

/**
 * Üres állapot: a ChartCard `empty` szövege a chart helyén
 */
export const Empty: Story = {
  render: () => (
    <Wrapper>
      <ChartCard
        id="UsecasePies/empty"
        title={<NumberedTitle index={3} title="Bútorcsaládok" />}
        ratio="auto"
        chart={() => null}
        empty="Nincs beváltás"
      />
    </Wrapper>
  ),
};
