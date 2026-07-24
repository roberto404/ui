import React from "react";

import ChartCard from "./card";
import ChartLine from "../line";
import StatValue from "./parts/statValue";
import { Series, SeriesGridApi } from "./hooks/useSeriesGrid";

/* !- Types */

export type MinimalCardProps = {
  // redux grid id — one per card
  id: string;
  title?: React.ReactNode;
  data: Series[];
  // headline value from the primary values, e.g. array `last` / `sum`
  summary?: (values: number[]) => React.ReactNode;
  // signed % change, e.g. array `percentChange`
  change?: (values: number[]) => number;
  format?: (value: number) => React.ReactNode;
  changeFormat?: (change: number) => React.ReactNode;
  // sparkline colour
  color?: string;
  // override the chart; defaults to a tiny area sparkline (no axes)
  chart?: (series: Series[], api: SeriesGridApi) => React.ReactNode;
  className?: string;
  ratio?: string;
};

/**
 * MinimalCard (kép 3) — a compact metric with a sparkline.
 *
 * Label + big value + inline change on the left, a small area sparkline (no axes,
 * no grid) on the right. Same redux-grid backing as the other cards.
 */
const MinimalCard = ({
  id,
  title,
  data,
  summary,
  change,
  format,
  changeFormat,
  color = "#e8792b",
  chart,
  className,
  ratio = "2 / 1",
}: MinimalCardProps) => {
  const renderChart = (api: SeriesGridApi) =>
    chart ? (
      chart(api.series, api)
    ) : (
      <div className1="w-1/2">
        <ChartLine
          data={api.series}
          responsive
          edgeToEdge
          width={320}
          height={140}
          area
          hover={false}
          marker={false}
          color={color}
          xAxis={false}
          yAxis={false}
          xGrid={false}
          yGrid={false}
          margin={{ top: 0, right: 0, bottom: -10, left: 0 }}
        />
      </div>
    );

  return (
    <ChartCard
      id={id}
      data={data}
      className={className}
      ratio={ratio}
      layout="horizontal"
      title={(api) => {
        const values = api.series[0]?.values || [];

        return (
          <div className="v-top column gap-1">
            {title && <div className="medium">{title}</div>}
            <StatValue
              value={summary ? summary(values) : undefined}
              change={change ? change(values) : undefined}
              format={format}
              changeFormat={changeFormat}
              size="l"
              align="left"
              changePosition="inline"
            />
          </div>
        );
      }}
      chart={renderChart}
    />
  );
};

export default MinimalCard;
