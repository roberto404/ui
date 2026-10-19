import React from "react";
import { Meta, StoryObj } from "@storybook/react";

require("../../../assets/style/index.scss");

/* !- Components */

import ChartMatrix, { DEFAULT_QUADRANTS, MatrixPoint } from "../../chart/matrix";
import Layer from "../../layer/layer";
import { AppContext } from "../../context";

const layerContext = {
  addShortcuts: () => {},
  removeShortcuts: () => {},
};

/* !- Demo data: kampányok — x = beváltás a cél %-ában, y = eredmény %, size = regisztrálók */

const CAMPAIGNS: MatrixPoint[] = [
  { id: 1, label: "Fióna −20%", x: 111, y: -42, size: 640 },
  { id: 2, label: "Mosogatók −15%", x: 21, y: -30, size: 180 },
  { id: 3, label: "Tina konyha", x: 32, y: 8, size: 95 },
  { id: 4, label: "Őszi lakberendezés", x: 121, y: 25, size: 910 },
  { id: 5, label: "Kanapé hét", x: 145, y: 12, size: 320 },
  { id: 6, label: "Étkező szett", x: 102, y: 18, size: 240 },
  { id: 7, label: "Gardrób", x: 170, y: 6, size: 120 },
];

const QUADRANTS = {
  topRight: { ...DEFAULT_QUADRANTS.topRight, label: "Működik" },
  topLeft: { ...DEFAULT_QUADRANTS.topLeft, label: "Kevesen használják" },
  bottomRight: { ...DEFAULT_QUADRANTS.bottomRight, label: "Kannibalizál" },
  bottomLeft: { ...DEFAULT_QUADRANTS.bottomLeft, label: "Nem működik" },
};

const signed = (value: number) => `${value > 0 ? "+" : value < 0 ? "−" : ""}${Math.abs(value)} %`;

/* !- Stories */

const MatrixWrapper = ({ width = 520, ...args }: any) => (
  <div className="p-4" style={{ width }}>
    <ChartMatrix {...args} />
  </div>
);

const meta = {
  title: "Chart/Matrix",
  component: MatrixWrapper,
  // the tooltip is rendered by the ui layer; Layer needs the app context (shortcuts)
  decorators: [
    (Story) => (
      <AppContext.Provider value={layerContext as any}>
        <Story />
        <Layer />
      </AppContext.Provider>
    ),
  ],
  argTypes: {
    xSplit: { control: { type: "number", step: 10 } },
    ySplit: { control: { type: "number", step: 10 } },
    minRadius: { control: { type: "number", min: 2, max: 20, step: 1 } },
    maxRadius: { control: { type: "number", min: 4, max: 60, step: 1 } },
    width: { control: { type: "number", min: 280, max: 1200, step: 20 } },
  },
} satisfies Meta<typeof MatrixWrapper>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Kampány-mátrix: a negyedek határa x = 100 % (cél), y = 0 % (kampány nélküli alap);
 * a buborék területe a regisztrálók számával arányos
 */
export const Basic: Story = {
  args: {
    data: CAMPAIGNS,
    xSplit: 100,
    ySplit: 0,
    xDomain: [0, 200],
    yDomain: [-60, 60],
    xFormat: (value: number) => (value === 100 ? "cél" : `${value} %`),
    yFormat: signed,
    xTitle: "beváltási arány a célhoz képest →",
    quadrants: QUADRANTS,
  },
};

/**
 * Hover: a buborék kiemelve (a többi halvány), a `tooltip` render-prop a ui (layer) tooltipben;
 * kattintás: `onClick(point)`
 */
export const Tooltip: Story = {
  args: {
    ...Basic.args,
    onClick: (point: MatrixPoint) => alert(`Kiválasztva: ${point.label}`),
    tooltip: (point: MatrixPoint) => (
      <div className="p-1 text-s">
        <div className="bold">{point.label}</div>
        <div>beváltás a cél {point.x} %-a</div>
        <div>eredmény {signed(point.y)}</div>
        <div>{point.size} regisztráló</div>
      </div>
    ),
  },
};

/**
 * Méret nélkül minden buborék `minRadius`; tartomány nélkül az adatokból
 * (egész lépésekre kerekítve), alapértelmezett negyed-színek, felirat nélkül
 */
export const Auto: Story = {
  args: {
    data: CAMPAIGNS.map(({ size, ...point }) => point),
    xSplit: 100,
    minRadius: 7,
    yTitle: "eredmény",
  },
};

Auto.storyName = "Automatikus tengely";

export const Empty: Story = {
  args: {
    data: [],
    empty: "Nincs aktív kampány",
  },
};

Empty.storyName = "Üres";
