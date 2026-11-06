import React from "react";
import { Meta, StoryObj } from "@storybook/react";

require("../../../assets/style/index.scss");

/* !- Components */

import MultiLineCard from "../../chart/card/multiLine";
import Layer from "../../layer/layer";
import { AppContext } from "../../context";

/* !- Demo data (havi árváltozás %, október – szeptember) */

const MONTHS = ["Okt", "Nov", "Dec", "Jan", "Feb", "Márc", "Ápr", "Máj", "Jún", "Júl", "Aug", "Szept"];
const MONTH_NAMES = [
  "2025. október", "2025. november", "2025. december", "2026. január", "2026. február", "2026. március",
  "2026. április", "2026. május", "2026. június", "2026. július", "2026. augusztus", "2026. szeptember",
];

const SALE = [0.6, 0.8, 0.4, 1.2, 0.9, 0.5, 0.3, 0.4, 0.6, 0.7, 0.5, 0.4];
// no purchase price before January: the line starts later
const PURCHASE = [null, null, null, 1.5, 0.4, 0.2, 0.6, 0.3, -0.2, 0.5, 0.4, 0.6];

const percent = (value: number) =>
  `${value > 0 ? "+" : ""}${value.toLocaleString("hu-HU", { minimumFractionDigits: 1 })}%`;

const layerContext = {
  addShortcuts: () => {},
  removeShortcuts: () => {},
};

/* !- Stories */

const meta = {
  title: "Chart/Card/MultiLine",
  component: MultiLineCard,
  // the tooltip is rendered by the ui layer; Layer needs the app context (shortcuts)
  decorators: [
    (Story) => (
      <AppContext.Provider value={layerContext as any}>
        <div className="p-3" style={{ maxWidth: 1100 }}>
          <Story />
        </div>
        <Layer />
      </AppContext.Provider>
    ),
  ],
} satisfies Meta<typeof MultiLineCard>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Price change month by month: two lines, a gap (null) at the start of the purchase,
 * negative values, summary on the right (aside)
 */
export const PriceChange: Story = {
  args: {
    id: "story-multi-line",
    className: "bg-white-light rounded-xl shadow-outer-10",
    title: "Árváltozás hónapról hónapra – beszerzési és eladási ár",
    hint: "Havi változás az előző hónaphoz képest · mintaadat",
    xLabels: MONTHS,
    tooltipTitle: (index: number) => MONTH_NAMES[index],
    series: [
      { id: "sale", label: "Eladási ár", shortLabel: "eladási ár", values: SALE },
      { id: "purchase", label: "Beszerzési ár", shortLabel: "beszerzési ár", values: PURCHASE },
    ],
    valueFormat: percent,
    axisFormat: (value: number) => `${value.toLocaleString("hu-HU", { minimumFractionDigits: 1 })}%`,
    axisUnit: 0.5,
    aside: (
      <div className="column gap-2 pt-2">
        <span className="bold text-s">Utolsó 12 hónap, összesített változás</span>
        <span className="zoom-2 bold">+7,5%</span>
        <span className="text-xs text-gray-dark">havi átlag +0,6% · mintaadat</span>
      </div>
    ),
  },
};
