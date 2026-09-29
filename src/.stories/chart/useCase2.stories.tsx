import React from "react";
import { Meta, StoryObj } from "@storybook/react";

require("../../../assets/style/index.scss");

/* !- Components */

import Usecase2Dashboard from "../../chart/card/usecase2";

/* !- Stories */

const meta = {
  title: "Chart/Card/Usecase2",
  component: Usecase2Dashboard,
} satisfies Meta<typeof Usecase2Dashboard>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 */
export const Usecase2: Story = {
  render: () => <Usecase2Dashboard />,
};

Usecase2.storyName = "Usecase 2";
