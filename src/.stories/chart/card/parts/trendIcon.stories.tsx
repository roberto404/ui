import React from "react";
import { Meta, StoryObj } from "@storybook/react";

require("../../../../../assets/style/index.scss");

import TrendIcon from "../../../../chart/card/parts/trendIcon";

/* !- Stories */

const meta = {
  title: "Chart/Card/Parts/TrendIcon",
  component: TrendIcon,
  args: {
    change: 20,
  },
  argTypes: {
    change: { control: { type: "number", step: 1 } },
  },
} satisfies Meta<typeof TrendIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Interactive — the sign of `change` picks the colour and the arrow direction.
 */
export const Playground: Story = {};

/**
 * Green up / red down / grey flat.
 */
export const Directions: Story = {
  render: () => (
    <div className="flex gap-2 p-2">
      <TrendIcon change={20} />
      <TrendIcon change={-12} />
      <TrendIcon change={0} />
    </div>
  ),
};
