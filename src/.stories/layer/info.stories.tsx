import React from "react";
import { Meta, StoryObj } from "@storybook/react";

require("../../../assets/style/index.scss");

/* !- Components */

import Info from "../../layer/info";
import Layer from "../../layer/layer";
import { AppContext } from "../../context";

const layerContext = {
  addShortcuts: () => {},
  removeShortcuts: () => {},
};

/* !- Stories */

const meta = {
  title: "Layer/Info",
  component: Info,
  // the tooltip is rendered by the ui layer; Layer needs the app context (shortcuts)
  decorators: [
    (Story) => (
      <AppContext.Provider value={layerContext as any}>
        <div className="p-4">
          <Story />
        </div>
        <Layer />
      </AppContext.Provider>
    ),
  ],
  argTypes: {
    title: {
      control: "text",
    },
    small: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Info>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Az ikon önmagában, hoverre tooltip
 */
export const Basic: Story = {
  args: {
    title: "Rövid leírás a tooltipben.",
    small: false,
  },
};

/**
 * Felirat után, ahogy a termékűrlapon és a chart kártya `hint`-jénél
 */
export const WithLabel: Story = {
  args: {
    title:
      "Az itt megadott jellemzők jelennek meg az értékesítő számára, hogy gyártásra előkészítsen egy rendelést.",
  },
  render: (args) => (
    <div className="column gap-2">
      <div className="text-gray h-center">
        <span>Egyedi gyártási jellemzők</span>
        <Info {...args} />
      </div>
      <div className="h-center medium">
        <span>Konyha</span>
        <Info title="Konyha tervezés az elmúlt 30 napban, napi bontásban." />
      </div>
      <div className="h-center text-s">
        <span>Kicsi változat</span>
        <Info title="small = true" small />
      </div>
    </div>
  ),
};
