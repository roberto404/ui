import React from "react";
import { Meta, StoryObj } from "@storybook/react";

require("../../../../../assets/style/index.scss");

import NumberedTitle from "../../../../chart/card/parts/numberedTitle";

/* !- Stories */

const meta = {
  title: "Chart/Card/Parts/NumberedTitle",
  component: NumberedTitle,
  args: { index: 2, title: "Konverzió" },
} satisfies Meta<typeof NumberedTitle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/**
 * A node title is drawn as-is, without the default bold styling
 */
export const NodeTitle: Story = {
  args: {
    index: 6,
    title: <span className="text-l light text-blue-dark">Kampányhatás</span>,
  },
};
