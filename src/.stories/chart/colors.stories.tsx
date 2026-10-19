import React from "react";
import { Meta, StoryObj } from "@storybook/react";

require("../../../assets/style/index.scss");

/* !- Components */

import Pie from "../../chart/pie";
import ChartBar from "../../chart/bar";
import { SERIES, STATUS, PLOT, StatusType } from "../../chart/colors";

/* !- Types */

type ArgsType = {
  series1: string;
  series2: string;
  series3: string;
  series4: string;
  series5: string;
  series6: string;
  // random distribution of the donut
  seed: number;
} & Record<`${StatusType}${"Color" | "Fill" | "Text"}`, string>;

/* !- Constants */

const TONES: { id: StatusType; title: string }[] = [
  { id: "good", title: "Jó" },
  { id: "warning", title: "Közepes" },
  { id: "bad", title: "Rossz" },
  { id: "neutral", title: "Semleges" },
];

/* !- Helpers */

/** repeatable random numbers (mulberry32) */
const random = (seed: number) => () => {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/** n random shares, total 100 %, none below 5 % */
const toShares = (count: number, seed: number) => {
  const next = random(seed);
  const weights = Array.from({ length: count }, () => 0.25 + next());
  const total = weights.reduce((a, b) => a + b, 0);

  return weights.map((weight) => Math.round((weight / total) * 1000) / 10);
};

const toSeries = (args: ArgsType) => [
  args.series1,
  args.series2,
  args.series3,
  args.series4,
  args.series5,
  args.series6,
];

const toStatus = (args: ArgsType, tone: StatusType) => ({
  color: args[`${tone}Color`],
  fill: args[`${tone}Fill`],
  text: args[`${tone}Text`],
});

/* !- Components */

const Swatch = ({ color, title, caption }: { color: string; title: React.ReactNode; caption?: string }) => (
  <div className="column gap-1/2" style={{ width: 96 }}>
    <div className="rounded-m" style={{ height: 48, background: color, border: `1px solid ${PLOT.grid}` }} />
    <div className="text-xs bold">{title}</div>
    <div className="text-xs text-gray-dark">{caption || color}</div>
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="column gap-1">
    <div className="text-s text-gray-dark uppercase bold">{title}</div>
    {children}
  </div>
);

/**
 * Palette: series in order, status (mark / fill / text + a sample pill), plot parts
 */
const Palette = ({ args }: { args: ArgsType }) => (
  <div className="column gap-3">
    <Section title="Sorozatok (ebben a sorrendben)">
      <div className="flex wrap gap-2">
        {toSeries(args).map((color, index) => (
          <Swatch key={index} color={color} title={`${index + 1}.`} />
        ))}
      </div>
    </Section>

    <Section title="Állapot">
      <div className="column gap-1">
        {TONES.map(({ id, title }) => {
          const tone = toStatus(args, id);

          return (
            <div key={id} className="flex h-center gap-2">
              <div className="text-s bold" style={{ width: 80 }}>
                {title}
              </div>
              <Swatch color={tone.color} title="jel" caption={tone.color} />
              <Swatch color={tone.fill} title="háttér" caption={tone.fill} />
              <Swatch color={tone.text} title="szöveg" caption={tone.text} />
              <span
                className="text-xs bold nowrap"
                style={{ background: tone.fill, color: tone.text, borderRadius: 999, padding: "4px 12px" }}
              >
                {title} címke
              </span>
            </div>
          );
        })}
      </div>
    </Section>

    <Section title="Rajzolat">
      <div className="flex wrap gap-2">
        {(Object.keys(PLOT) as (keyof typeof PLOT)[]).map((key) => (
          <Swatch key={key} color={PLOT[key]} title={key} />
        ))}
      </div>
    </Section>
  </div>
);

/**
 * Donut: as many segments as series colours, random shares (`seed`)
 */
const Donut = ({ args }: { args: ArgsType }) => {
  const series = toSeries(args);
  const shares = toShares(series.length, args.seed);

  return (
    <div className="column gap-2">
      <div style={{ width: 220, height: 220 }}>
        <Pie
          data={series.map((color, index) => ({ id: `s${index}`, percent: shares[index], color }))}
          thickness={0.32}
          gap={1}
        >
          <div className="column v-center h-center">
            <span className="text-xl bold">{series.length}</span>
            <span className="text-xs text-gray-dark">szín</span>
          </div>
        </Pie>
      </div>
      <div className="column gap-1/2">
        {series.map((color, index) => (
          <div key={index} className="flex h-center gap-1 text-xs">
            <span style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
            <span>{index + 1}. sorozat</span>
            <span className="text-gray-dark">{shares[index].toLocaleString("hu-HU")} %</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Waterfall: start (series 1) → increase (good) → decrease (bad) → increase (good) → result (series 1)
 */
const STEPS = [
  { title: "Nyitó", value: 100, from: null, change: 0 },
  { title: "Bővülés", value: 140, from: 100, change: 40 },
  { title: "Csökkenés", value: 115, from: 140, change: -25 },
  { title: "Bővülés", value: 135, from: 115, change: 20 },
  { title: "Záró", value: 135, from: null, change: 0 },
];

const Waterfall = ({ args }: { args: ArgsType }) => {
  const series = toSeries(args);
  const good = toStatus(args, "good");
  const bad = toStatus(args, "bad");
  const colors = STEPS.map(({ change }) =>
    change > 0 ? good.color : change < 0 ? bad.color : series[0],
  );

  return (
    <div style={{ width: 420 }}>
      <ChartBar
        data={[
          {
            id: "waterfall",
            values: STEPS.map(({ value }) => value),
            from: STEPS.map(({ from }) => from),
            xAxis: STEPS.map(({ title }) => title),
          },
        ]}
        color={(_value: number, i: number) => colors[i]}
        radius={8}
        gap={0.3}
        showValue="always"
        // the change above the bar (in the status text colour), the start / result as is
        tooltip={({ index: i, x, y }: { index: number; x: number; y: number }) => {
          const { change, value } = STEPS[i];

          return (
            <text
              x={x}
              y={y - 10}
              textAnchor="middle"
              fontSize={14}
              fontWeight={700}
              style={{ fill: change > 0 ? good.text : change < 0 ? bad.text : PLOT.text }}
            >
              {change ? `${change > 0 ? "+" : "−"}${Math.abs(change)}` : value}
            </text>
          );
        }}
        connector
        connectorColor={PLOT.axis}
        barLabels
        labelColor={PLOT.muted}
        xAxis={false}
        yAxis={false}
        xGrid={false}
        yAxisValueMin={0}
        yAxisValueMax={150}
        width={420}
        height={260}
        margin={{ top: 40, right: 10, bottom: 40, left: 10 }}
        responsive
        preserveAspectRatio="xMidYMid meet"
        underlay={({ canvas }: any) => (
          <line
            x1={canvas.x}
            x2={canvas.x + canvas.width}
            y1={canvas.y + canvas.height}
            y2={canvas.y + canvas.height}
            stroke={PLOT.grid}
            strokeWidth={2}
          />
        )}
      />
    </div>
  );
};

const ColorsStory = (args: ArgsType) => (
  <div className="p-4 column gap-4" style={{ maxWidth: 1000 }}>
    <Palette args={args} />

    <div className="flex wrap gap-4">
      <Section title="Donut · sorozatszínek">
        <Donut args={args} />
      </Section>
      <Section title="Waterfall · állapotszínek">
        <Waterfall args={args} />
      </Section>
    </div>
  </div>
);

/* !- Stories */

const colorControl = { control: "color" };

const meta = {
  title: "Chart/Colors",
  component: ColorsStory,
  argTypes: {
    ...Object.fromEntries(SERIES.map((_, index) => [`series${index + 1}`, colorControl])),
    ...Object.fromEntries(
      TONES.flatMap(({ id }) => ["Color", "Fill", "Text"].map((part) => [`${id}${part}`, colorControl])),
    ),
    seed: { control: { type: "number", min: 1, max: 999, step: 1 } },
  },
} satisfies Meta<typeof ColorsStory>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * A chart színkollekció (`chart/colors.ts`): a vezérlőkben átírt színekkel a paletta,
 * a donut (sorozatok, `seed` szerinti véletlen elosztás) és a waterfall (állapotok) is változik
 */
export const Palette$: Story = {
  args: {
    ...(Object.fromEntries(SERIES.map((color, index) => [`series${index + 1}`, color])) as any),
    ...(Object.fromEntries(
      TONES.flatMap(({ id }) => [
        [`${id}Color`, STATUS[id].color],
        [`${id}Fill`, STATUS[id].fill],
        [`${id}Text`, STATUS[id].text],
      ]),
    ) as any),
    seed: 7,
  },
};

Palette$.storyName = "Színpaletta";
