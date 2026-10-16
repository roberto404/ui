import React from "react";
import { Meta, StoryObj } from "@storybook/react";

require("../../../../assets/style/index.scss");

/* !- Components */

import ChartLineHighlight from "../../../chart/lineHighlight";

/* !- Demo data: heti beváltások, 44 nap */

const WEEKS = [2, 4, 3, 5, 2, 3, 1];

/* !- Stories */

const meta = {
  title: "Chart/Line/Usecase 1",
  component: ChartLineHighlight,
  args: {
    values: WEEKS,
    boxFormat: (value: number, index: number) => (
      <>
        <span className="bold">{index + 1}. hét</span>
        <span className="text-gray"> · {value} beváltás</span>
      </>
    ),
    averageFormat: (average: number) =>
      `Átlag ${average.toLocaleString("hu-HU", { maximumFractionDigits: 1 })}`,
    empty: "Nincs beváltás az időszakban",
  },
} satisfies Meta<typeof ChartLineHighlight>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Heti beváltások: vonal + terület, értékcímkék az átlag fölött / alatt, a csúcs
 * gyűrűvel és dobozzal, szaggatott átlag; hoverre a doboz a legközelebbi hétre ugrik.
 */
export const WeeklyRedemptions: Story = {
  render: (args) => (
    <div className="column gap-1">
      <div className="flex v-justify text-s text-gray">
        <span>2020.01.01</span>
        <span>Heti beváltások · 44 nap · csúcs a 4. héten</span>
        <span>2020.02.13</span>
      </div>
      <ChartLineHighlight {...args} />
    </div>
  ),
};

WeeklyRedemptions.storyName = "Heti beváltások";

/**
 * Nem a legnagyobb, hanem egy megadott pont kiemelve (`highlight`)
 */
export const CustomHighlight: Story = {
  args: { highlight: 1 },
};

/**
 * Csupa nulla: a chart helyett az `empty` szöveg
 */
export const Empty: Story = {
  args: { values: [0, 0, 0, 0] },
};
