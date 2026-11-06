import React from "react";
import { Meta, StoryObj } from "@storybook/react";

require("../../../../assets/style/index.scss");

/* !- Components */

import ChartLine from "../../../chart/line";
import Layer from "../../../layer/layer";
import { AppContext } from "../../../context";
import { ChangeBadge } from "../../../chart/card/parts/statValue";
import { SERIES } from "../../../chart/colors";

/* !- Demo data (M Ft, október – szeptember) */

const MONTHS = ["Okt", "Nov", "Dec", "Jan", "Feb", "Márc", "Ápr", "Máj", "Jún", "Júl", "Aug", "Szept"];
const CURRENT = [48.2, 52.6, 61.4, 38.9, 41.3, 47.9, 51.2, 56.8, 54.1, 50.7, 46.8, 50.3];
const PREVIOUS = [45.1, 47.9, 58.3, 36.4, 38.0, 44.1, 46.3, 51.5, 49.8, 48.2, 43.9, 46.8];
const AVERAGE = CURRENT.reduce((sum, value) => sum + value, 0) / CURRENT.length;

const million = (value: number) => `${value.toLocaleString("hu-HU", { maximumFractionDigits: 1 })} M`;

const series = [
  { id: "current", values: CURRENT, xAxis: MONTHS, color: SERIES[0] },
  { id: "previous", values: PREVIOUS, color: "#aab4c2", dashed: true },
];

// a common frame of the stories: straight lines, from 0, room for the pins above
const chartProps = {
  data: series,
  responsive: true,
  width: 1000,
  height: 380,
  area: true,
  bezier: false,
  marker: false,
  yAxisValueMin: 0,
  yAxisValueMax: 80,
  yAxisSteps: 4,
  valueFormat: million,
  margin: { top: 56, right: 32, bottom: 48, left: 104 },
};

const layerContext = {
  addShortcuts: () => {},
  removeShortcuts: () => {},
};

/**
 * Pins above the event points: `toPix(index, value)` = pixel of a point
 */
const EVENTS = [1, 6, 10];

const renderPins = ({ canvas, toPix }: any) =>
  EVENTS.map((index) => {
    const point = toPix(index, CURRENT[index]);
    const pinY = canvas.margin.top - 26;
    const pinColor = SERIES[4];

    return (
      <g key={index}>
        <line
          x1={point.x}
          y1={pinY + 13}
          x2={point.x}
          y2={point.y - 6}
          stroke={pinColor}
          strokeWidth={1.5}
          strokeDasharray="2 3"
        />
        <circle cx={point.x} cy={pinY} r={13} fill={pinColor} />
        <text
          x={point.x}
          y={pinY + 0.5}
          fill="#fff"
          fontSize={13}
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="central"
        >
          %
        </text>
      </g>
    );
  });

/* !- Stories */

const meta = {
  title: "Chart/Line/Patterns",
  component: ChartLine,
  // the tooltips are rendered by the ui layer; Layer needs the app context (shortcuts)
  decorators: [
    (Story) => (
      <AppContext.Provider value={layerContext as any}>
        <div className="p-3 bg-white" style={{ maxWidth: 1000 }}>
          <Story />
        </div>
        <Layer />
      </AppContext.Provider>
    ),
  ],
} satisfies Meta<typeof ChartLine>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * 1. Event pins (e.g. campaign months, "%"): the `children` render-prop of the chart gets
 * `{ canvas, toPix }`; `toPix(index, value)` is the pixel of a point, the pin goes above
 * the plot (canvas.margin.top) with a dotted line down to the point. The ComparisonCard
 * draws its pins the same way (stacked by type).
 */
export const EventPins: Story = {
  render: () => <ChartLine {...chartProps}>{renderPins}</ChartLine>,
};

EventPins.storyName = "1. Event pins (children render-prop)";

/**
 * 2. Own y axis label at any value (`yAxisMarks`): e.g. the yearly average among the axis
 * labels, darker, in two lines; the axis labels near it are hidden, `line` draws a grid
 * style dashed line, `tooltip` explains it (ui layer).
 */
export const YAxisMark: Story = {
  args: {
    ...chartProps,
    yAxisMarks: [
      {
        value: AVERAGE,
        label: "átlag",
        line: true,
        tooltip: "Az utolsó 12 hónap átlaga",
      },
    ],
  },
};

YAxisMark.storyName = "2. Y axis mark (yAxisMarks)";

/**
 * 3. Own hover tooltip of more series (`layerTooltip`): the content of the hovered index
 * in the ui layer tooltip (like the other charts) instead of the svg box.
 * `layerTooltipAnchor`: the tooltip sits at this series' point (also when an other one is
 * higher), `layerTooltipOffset`: its distance (px), `layerTooltipStyle`: the container
 * (smaller, translucent).
 */
export const LayerTooltip: Story = {
  args: {
    ...chartProps,
    hover: true,
    layerTooltipAnchor: "current",
    layerTooltipOffset: 24,
    layerTooltipStyle: { fontSize: "80%", background: "rgba(255, 255, 255, 0.85)" },
    layerTooltip: (index: number) => {
      const change = ((CURRENT[index] - PREVIOUS[index]) / PREVIOUS[index]) * 100;

      return (
        <div className="p-1 column gap-1/2 nowrap">
          <div className="h-center gap-1 pb-1/2">
            <span className="bold text-m">{MONTHS[index]}</span>
            <ChangeBadge change={change} />
          </div>
          <div className="h-center gap-1">
            <span className="bold">{million(CURRENT[index])}</span>
            <span className="text-gray">idén</span>
          </div>
          <div className="h-center gap-1">
            <span className="bold">{million(PREVIOUS[index])}</span>
            <span className="text-gray">tavaly</span>
          </div>
        </div>
      );
    },
  },
};

LayerTooltip.storyName = "3. Layer tooltip of more series (layerTooltip)";

/**
 * 4. Highlighted x labels (`xAxisHighlights`): some months look different (rounded
 * background, bold) and tell why in a tooltip on hover. Works with an own `xAxisLabel`
 * too: the background is measured to the label.
 */
export const XAxisHighlights: Story = {
  args: {
    ...chartProps,
    xAxisHighlights: [
      { index: 4, tooltip: "Februári kiárusítás: −20 % minden kanapéra" },
      { index: 7, tooltip: "Májusi akció: kuponnal −100 e Ft 500 e Ft felett" },
      { index: 11, tooltip: "Szeptembertől új árlista" },
    ],
  },
};

XAxisHighlights.storyName = "4. X axis highlights (xAxisHighlights)";

/**
 * All together, as the sales report chart (ComparisonCard) uses them
 */
export const Together: Story = {
  render: () => (
    <ChartLine
      {...chartProps}
      hover
      layerTooltipAnchor="current"
      layerTooltipOffset={24}
      layerTooltipStyle={LayerTooltip.args?.layerTooltipStyle}
      layerTooltip={LayerTooltip.args?.layerTooltip}
      yAxisMarks={YAxisMark.args?.yAxisMarks}
      xAxisHighlights={XAxisHighlights.args?.xAxisHighlights}
    >
      {renderPins}
    </ChartLine>
  ),
};

Together.storyName = "5. Together";
