import React from "react";
import moment from "moment";
import classNames from "classnames";
import { Meta, StoryObj } from "@storybook/react";

require("../../../assets/style/index.scss");

/* !- Components */

import ChartGithub, { GithubRecord } from "../../chart/github";
import Layer from "../../layer/layer";
import { AppContext } from "../../context";
import IconArrowUp from "../../icon/mui/navigation/arrow_forward";

const layerContext = {
  addShortcuts: () => {},
  removeShortcuts: () => {},
};

/* !- Demo data
 * kontakt2 Analitika › IncomeGithub: heti / havi nettó árbevétel az előző év
 * azonos időszakához képest, boltonként (RS2, RS6, RS8) és értékesítési
 * módonként (A = áruházi, M = megrendelés)
 */

const YEAR = 2025;
const LAST_WEEK = 43; // the year is in progress
const STORES = ["2", "6", "8"];
const SALES_METHODS = { 22: "A", 33: "M" };

// ár-változás havonta (%), a „valós” változás ezzel csökkentett
const PRICE_CHANGE = [4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 7];

// deterministic pseudo random 0..1
const random = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

type Cell = { store: string; salesMethod: string; a: number; b: number };

// weekly revenue (Ft) of one store × sales method, this year (a) and last year (b)
const weekCells = (week: number): Cell[] =>
  STORES.flatMap((store, s) =>
    Object.keys(SALES_METHODS).map((salesMethod, m) => {
      const seed = week * 10 + s * 3 + m;
      const base = (s + 2) * (m ? 9 : 6) * 1000000;
      const season = 1 + Math.sin((week / 52) * Math.PI * 2 - 1) * 0.25;

      return {
        store,
        salesMethod,
        b: Math.round(base * season * (0.85 + random(seed) * 0.3)),
        a: Math.round(base * season * (0.82 + random(seed + 500) * 0.45)),
      };
    }),
  );

const sumOf = (cells: Cell[], key: "a" | "b") =>
  cells.reduce((total, cell) => total + cell[key], 0);

const formatM = (value: number) => `${Math.round(value / 100000) / 10} M`;

/**
 * Box record like the kontakt2 report: value + color by the `changes` mode
 * percent: change in %, green if it beats the price change
 * real: change in % minus the price change
 * value: change in million Ft
 */
const toRecord = (
  cells: Cell[],
  period: { week?: number; month?: number },
  changes: string,
): GithubRecord => {
  const valueASum = sumOf(cells, "a");
  const valueBSum = sumOf(cells, "b");
  const dateStart = period.week
    ? moment().isoWeekYear(YEAR).isoWeek(period.week).startOf("isoWeek")
    : moment(`${YEAR}-${period.month}-1`, "YYYY-M-D");
  const priceChange = PRICE_CHANGE[dateStart.month()];

  let value: number | string = Math.round((valueASum / valueBSum - 1) * 1000) / 10;
  const realValue = Math.round(value - priceChange);
  let color = value < 0 ? "red" : "gray-light";

  switch (changes) {
    case "real":
      value = realValue;
      color = value < 0 ? "red" : "gray-light";
      break;

    case "value":
      value = formatM(valueASum - valueBSum);
      break;

    default:
      if (realValue > 0) {
        color = "green";
      }
  }

  return { ...period, value, color, dateStart, cells };
};

const getWeekData = (changes: string) =>
  Array.from({ length: 52 }, (_, i) =>
    i < LAST_WEEK ? toRecord(weekCells(i + 1), { week: i + 1 }, changes) : undefined,
  );

const getMonthData = (changes: string) =>
  Array.from({ length: 12 }, (_, i) => {
    const weeks = Array.from({ length: LAST_WEEK }, (__, w) => w + 1).filter(
      (week) =>
        moment().isoWeekYear(YEAR).isoWeek(week).endOf("isoWeek").month() === i,
    );

    if (!weeks.length) {
      return undefined;
    }

    // merge the weeks of the month cell by cell
    const cells = weekCells(weeks[0]).map((cell, c) => ({
      ...cell,
      a: weeks.reduce((total, week) => total + weekCells(week)[c].a, 0),
      b: weeks.reduce((total, week) => total + weekCells(week)[c].b, 0),
    }));

    return toRecord(cells, { month: i + 1 }, changes);
  });

/* !- Popover: store × sales method table (as in the kontakt2 report) */

const Change = ({ a, b }: { a: number; b: number }) => {
  if (!a) {
    return <div />;
  }

  const percent = Math.round((a / b - 1) * 100);
  const positive = percent >= 0;

  return (
    <div>
      <div className="bold text-s">{`${Math.round(a / 10000) / 100} mFt`}</div>
      <div className="pt-1/2 h-center v-center">
        <div
          className={classNames("circle fill-white", {
            "bg-green rotate-270": positive,
            "bg-red rotate-90": !positive,
          })}
          style={{ height: "1.2rem", width: "1.2rem" }}
        >
          <IconArrowUp />
        </div>
        <div
          className={classNames("pl-1/2 text-xs bold", {
            "text-green": positive,
            "text-red": !positive,
          })}
        >
          {`${percent}%`}
        </div>
      </div>
    </div>
  );
};

const Popover = ({ record }: { record: GithubRecord }) => {
  const { week, month, dateStart, cells } = record;
  const dateEnd = dateStart.clone().endOf("isoWeek");
  const date = `${dateStart.format("MMM D")} - ${dateEnd.format(
    dateStart.month() === dateEnd.month() ? "D" : "MMM D",
  )}`;

  const total = (filter: (cell: Cell) => boolean) => {
    const filtered = cells.filter(filter);
    return <Change a={sumOf(filtered, "a")} b={sumOf(filtered, "b")} />;
  };

  const rows = [
    [<span />, ...STORES.map((store) => <span>{`RS${store}`}</span>), <span>Σ</span>],
    ...Object.keys(SALES_METHODS).map((salesMethod) => [
      <span>{SALES_METHODS[salesMethod]}</span>,
      ...STORES.map((store) =>
        total((cell) => cell.store === store && cell.salesMethod === salesMethod),
      ),
      total((cell) => cell.salesMethod === salesMethod),
    ]),
    [
      <span>Σ</span>,
      ...STORES.map((store) => total((cell) => cell.store === store)),
      total(() => true),
    ],
  ];

  return (
    <div className="text-center p-2" style={{ width: 500 }}>
      {week !== undefined && (
        <div className="text-gray mb-1 text-xs light">{date}</div>
      )}
      <div className="mb-2 text-m bold">
        {week !== undefined ? `${week}. hét` : dateStart.format("MMMM")}
      </div>
      <div className="grid">
        {rows.flat().map((element, i) => (
          <div key={i} className="col-1-5 border-bottom p-1">
            {element}
          </div>
        ))}
      </div>
    </div>
  );
};

/* !- Stories */

const GithubWrapper = ({ changes = "percent", ...args }: any) => (
  <div className="p-4">
    <ChartGithub
      data={getWeekData(changes)}
      sumData={getMonthData(changes)}
      {...args}
    />
  </div>
);

const meta = {
  title: "Chart/GithubChart",
  component: GithubWrapper,
  // the popover is rendered by the ui layer; Layer needs the app context (shortcuts)
  decorators: [
    (Story) => (
      <AppContext.Provider value={layerContext as any}>
        <Story />
        <Layer />
      </AppContext.Provider>
    ),
  ],
  argTypes: {
    changes: {
      control: { type: "inline-radio" },
      options: ["percent", "real", "value"],
    },
    width: { control: { type: "number", min: 400, max: 1400, step: 20 } },
    height: { control: { type: "number", min: 200, max: 900, step: 20 } },
  },
} satisfies Meta<typeof GithubWrapper>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Árbevétel-változás az előző évhez képest (kontakt2 Analitika › IncomeGithub):
 * felül hetek hónaponként, a vonal alatt a havi összesítő. Piros = csökkenés,
 * zöld = az árváltozásnál nagyobb növekedés; kattintásra boltonkénti bontás
 */
export const Income: Story = {
  args: {
    year: YEAR,
    changes: "percent",
    Popover,
  },
};

Income.storyName = "Árbevétel-változás";

/** Az ár-változással csökkentett („valós”) változás */
export const Real: Story = {
  args: { ...Income.args, changes: "real" },
};

Real.storyName = "Valós változás";

/** Változás millió Ft-ban */
export const Value: Story = {
  args: { ...Income.args, changes: "value" },
};

Value.storyName = "Változás (M Ft)";

/** A chart colour collection status színei (`github-good|warning|bad|neutral`) */
export const Status: Story = {
  render: (args) => (
    <div className="p-4">
      <ChartGithub
        {...args}
        data={Array.from({ length: 52 }, (_, i) => ({
          value: i + 1,
          color: ["good", "warning", "bad", "neutral"][Math.floor(random(i) * 4)],
        }))}
        sumData={Array.from({ length: 12 }, (_, i) => ({
          value: moment().month(i).format("MMM"),
          color: "neutral",
        }))}
      />
    </div>
  ),
  args: { year: YEAR },
};

Status.storyName = "Status színek";
