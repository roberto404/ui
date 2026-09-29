import React from "react";

/* !- Components */

import Card, { defaultProps } from "./card";
import MinimalCard from "./minimal";
import FilterCard from "./filter";

import StatValue from "./parts/statValue";
import ChartLine from "../line";
import ChartBar from "../bar";
import ChartDonut from "../donut";
import ChartBoxplot from "../boxPlot";

import { SeriesGridApi } from "./hooks/useSeriesGrid";

/* !- Reducers (generic array) */

import { last, percentChange } from "@1studio/utils/array";

/* !- Demo data */

const SEGMENTS = [
  { id: "1d", title: "1D", range: 1 },
  { id: "1w", title: "1W", range: 7 },
  { id: "1m", title: "1M", range: 30 },
  { id: "1q", title: "1Q", range: 90 },
];

const data = [
  {
    id: "seriers2026",
    values: [28, 24, 33, 40, 48, 34, 31, 36, 40, 42, 40, 42],
    color: "#e8792b",
  },
  {
    id: "seriers2025",
    values: [18, 14, 23, 30, 38, 44, 41, 46, 30, 32, 30, 32],
  },
];

const yAxisLabel = ({ value, x, y }: any) => (
  <text
    x={x - 12}
    y={y}
    textAnchor="end"
    dominantBaseline="central"
    fontSize={15}
    fill="#9aa5b1"
  >
    {value.y.toFixed(3).replace(".", ",")}
  </text>
);

const greens = ['#55b45f', '#d3ecbb', '#e8f3db'];

const isDark = (hex: string): boolean => {
  const c = hex.replace('#', '');
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return (r * 0.299) + (g * 0.587) + (b * 0.114) < 150;
};

const progressValue = ({ value, x, y, width, color }: any) => (
  <text
    x={x - (width / 2) + 18}
    y={y + 32}
    fontSize={22}
    fontWeight={700}
    fill={isDark(color) ? '#ffffff' : '#3c4a2e'}
  >
    {`${value}%`}
  </text>
);

const targetTick = ({ x, y, width }: any) => (
  <line
    x1={x - (width * 0.16)}
    y1={y}
    x2={x + (width * 0.16)}
    y2={y}
    stroke="#14161c"
    strokeWidth={4}
    strokeLinecap="round"
  />
);


/* !- Component */

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Demo-adatokkal feltöltött kártya-dashboard (Usecase 2).
 * A storybook story és a kontakt2 AI nézet is ezt rendereli.
 */
const Usecase2 = ({ className, style }: Props) => (
  <div
    className={className}
    style={{
      height: 600,
      columnWidth: 325,
      columnGap: 40,
      columnFill: "auto",
      ...style,
    }}
  >
    <Card
      className={`${defaultProps.className} mb-2`}
      id="Card"
      title="7 nap eredménye"
      layout="horizontal"
      ratio=""
      data={data}
      chart={() => (
        <div className="text-s">
          <div className="w-content bg-green-dark rounded-l p-1 text-s text-white">
            {`+${Math.round((125047293 / 104406908 - 1) * 100)}%`}
          </div>
        </div>
      )}
      header={(api: SeriesGridApi) => (
        <StatValue
          value={Math.round(125047293 / 1000000)}
          format={(v) => `${v}M`}
          size="l"
        />
      )}
    />

    <MinimalCard
      id="MinimalCard"
      className={`${defaultProps.className} mb-2`}
      title="Napi vásárlások száma"
      data={[
        {
          id: "30daysQuantity",
          values: [85, 70, 66, 75, 86, 113, 89, 95, 132, 102, 108, 92, 126, 79, 119, 104, 113, 145, 127, 91, 106, 87, 125, 95, 85, 126],
          color: "#e8792b",
        },
      ]}
      summary={last}
      change={percentChange}
      changeFormat={(value) => `${Math.abs(Math.round(value))}%`}
    />

    <FilterCard
      id="DayOfWeek"
      className={`${defaultProps.className} mb-2`}
      title="Hét napjai"
      data={[
        {
          id: "dayOfWeek",
          xAxis: ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"],
          values: [93, 83, 90, 84, 90, 119, 98],
          color: "#e8792b",
        },
      ]}
      chart={(series: any[]) => (
        <ChartBar
          data={series}
          color="#eceef1"
          activeColor="#186eff"
          highlight="max"
          hover={true}
          showValue={"active"}
          roundBottom={true}
          barLabels={true}
          xAxis={false}
          yAxis={false}
          xGrid={false}
          yAxisValueMin={0}
          responsive
          width={900}
          height={380}
          margin={{ top: 48, right: 0, bottom: 30, left: 0 }}
        />
      )}
    />

    <FilterCard
      id="FilterCard"
      className={`${defaultProps.className} mb-2`}
      title="Havi eladások"
      data={[
        {
          id: "seriers2026",
          values: [319, 500, 577, 548, 491, 579, 580, 501],
          color: "#e8792b",
        },
      ]}
      multiple
      filter={SEGMENTS}
      summary={last}
      change={percentChange}
      format={(v) => `${v}M`}
      chart={(series: any[]) => (
        <ChartLine
          data={series}
          responsive
          edgeToEdge
          width={900}
          height={380}
          area
          hover
          marker={false}
          yGrid={false}
          xAxisFormat={(value: string, index: number) => index + 1}
          yAxisSteps={2}
          yAxisValueMin={0}
          valueFormat={(value: number) => value.toFixed(4)}
          yAxisLabel={yAxisLabel}
          margin={{ top: 48, right: 24, bottom: 30, left: 64 }}
        />
      )}
    />

    <MinimalCard
      id="MinimalCard2"
      className={`${defaultProps.className} mb-2`}
      title="Online vásárlás"
      data={[
        {
          id: "30daysQuantity",
          values: [45.3, 54.3],
          color: "#e8792b",
        },
      ]}
      summary={last}
      format={(v) => `${v}M`}
      change={percentChange}
      changeFormat={(value) => `${Math.abs(Math.round(value))}%`}
      chart={(series: any[]) => (
        <div style={{ maxWidth: 100 }}>
        <ChartDonut
          percent={13}
          color={"#009988"}
        />
        </div>
      )}
    />


    <FilterCard
      id="RSStores"
      className={`${defaultProps.className} mb-2`}
      title="RS Áruház"
      data={[
        {
          id: 'progress',
          values: [62.2, 26.3, 11.5],
          xAxis: ['Rs2', 'Rs6', 'Rs8'],
        },
      ]}
      chart={(series: any[]) => (
        <ChartBar
          data={series}
          color={(_value: number, index: number) => greens[index]}
          track="hatch"
          trackColor="#e6eaef"
          radius={18}
          roundBottom={true}
          gap={0.3}
          showValue={'always'}
          tooltip={progressValue}
          marker={targetTick}
          barLabels={true}
          valueFormat={(v: number) => `${v}%`}
          xAxis={false}
          yAxis={false}
          xGrid={false}
          yAxisValueMin={0}
          yAxisValueMax={100}
          width={560}
          height={340}

          responsive
          // edgeToEdge
          margin={{
            top: 24,
            right: 16,
            bottom: 44,
            left: 16,
          }}
        />
      )}
    />


    <FilterCard
      id="Boxplot"
      className={`${defaultProps.className} mb-2`}
      title="Augusztus számlaérték"
      data={[
        {
          id: "boxplot",
          xAxis: ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"],
          values: [93, 83, 90, 84, 90, 119, 98],
          color: "#e8792b",
        },
      ]}
      ratio="3 / 1"
      chart={(series: any[]) => (
        <ChartBoxplot
          min={40000}
          qMin={10000}
          Q1={50000}
          Q2={110000}
          Q3={230000}
          qMax={500000}
          max={800000}
          mode={[100500, 190000]}
          width={300}
          height={100}
          // margin={{ top: 48, right: 0, bottom: 30, left: 0 }}
        />
      )}
    />



  </div>
);

export default Usecase2;
