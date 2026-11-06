import React from "react";
import { Meta, StoryObj } from "@storybook/react";

require("../../../assets/style/index.scss");

/* !- Components */

import ComparisonCard from "../../chart/card/comparison";
import Layer from "../../layer/layer";
import { AppContext } from "../../context";

/* !- Demo data (M Ft, október – szeptember) */

const MONTHS = ["Okt", "Nov", "Dec", "Jan", "Feb", "Márc", "Ápr", "Máj", "Jún", "Júl", "Aug", "Szept"];
const MONTH_NAMES = [
  "2025. október", "2025. november", "2025. december", "2026. január", "2026. február", "2026. március",
  "2026. április", "2026. május", "2026. június", "2026. július", "2026. augusztus", "2026. szeptember",
];

const CURRENT = [48.2, 52.6, 61.4, 38.9, 41.3, 47.9, 51.2, 56.8, 54.1, 50.7, 46.8, 50.3];
const PREVIOUS = [45.1, 47.9, 58.3, 36.4, 38.0, 44.1, 46.3, 51.5, 49.8, 48.2, 43.9, 46.8];
const AVERAGE = [46.3, 46.7, 46.9, 47.1, 47.3, 47.6, 48.1, 48.5, 48.9, 49.1, 49.3, 49.6];

const million = (value: number) => `${value.toLocaleString("hu-HU", { maximumFractionDigits: 1 })} M Ft`;

const layerContext = {
  addShortcuts: () => {},
  removeShortcuts: () => {},
};

/* !- Stories */

const meta = {
  title: "Chart/Card/Comparison",
  component: ComparisonCard,
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
} satisfies Meta<typeof ComparisonCard>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Last 12 months against the 12 months before, 12 month moving average, campaign months
 */
export const YearOverYear: Story = {
  args: {
    id: "story-comparison",
    title: "Havi bontás – utolsó 12 hónap az előző 12 hónaphoz képest",
    xLabels: MONTHS,
    tooltipTitle: (index: number) => MONTH_NAMES[index],
    current: { label: "Utolsó 12 hó (2025. okt – 2026. szept)", shortLabel: "utolsó 12 hó", values: CURRENT },
    previous: { label: "Előző 12 hó (2024. okt – 2025. szept)", shortLabel: "előző 12 hó", values: PREVIOUS },
    average: { label: "12 havi mozgóátlag", shortLabel: "12 havi átlag", values: AVERAGE },
    events: [
      { index: 1, title: "Black Friday" },
      { index: 6, title: "Tavaszi szezonnyitó" },
      { index: 10, title: "Nyári kiárusítás" },
    ],
    eventLabel: "Akciós hónap",
    xAxisHighlights: [
      { index: 4, tooltip: "Februári kiárusítás: −20 % minden kanapéra" },
      { index: 7, tooltip: "Májusi akció: kuponnal −100 e Ft 500 e Ft felett" },
      { index: 11, tooltip: "Szeptembertől új árlista" },
    ],
    valueFormat: million,
    axisFormat: (value: number) => `${value} M`,
    footer: (
      <div className="text-xs text-gray pt-1">
        M Ft · rámutatáskor a hónap értékei a buborékban · akciós hónapok: nov, ápr, aug – mintaadat
      </div>
    ),
  },
};

YearOverYear.storyName = "Year over year";

/**
 * Without the previous period and the average: only the current line
 */
export const Single: Story = {
  args: {
    id: "story-comparison-single",
    title: "Havi forgalom",
    xLabels: MONTHS,
    current: { label: "Utolsó 12 hó", values: CURRENT },
    valueFormat: million,
    axisFormat: (value: number) => `${value} M`,
  },
};
