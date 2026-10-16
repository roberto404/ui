import React from "react";

import ChartCard, { CardApi } from "./card";
import StatValue from "./parts/statValue";
import CardTitle from "./parts/title";
import { Series } from "./hooks/useSeriesGrid";

/* !- Types */

export type CenteredCardProps = {
  // redux grid id — one per card
  id: string;
  title?: React.ReactNode;
  // description after the title: (i) icon with a tooltip
  hint?: React.ReactNode;
  data: Series[];
  // headline value from the primary values, e.g. array `last` / `sum`
  summary?: (values: number[]) => React.ReactNode;
  // signed % change, e.g. array `percentChange`
  change?: (values: number[]) => number;
  format?: (value: number) => React.ReactNode;
  changeFormat?: (change: number) => React.ReactNode;
  // top element at its natural size: icon, donut, small chart …
  chart: (api: CardApi) => React.ReactNode;
  className?: string;
};

/**
 * CenteredCard — everything in one centered column: the chart slot on top
 * (an icon, a donut …), the title, the big value and the change pill below.
 * Same redux-grid backing as the other cards.
 */
const CenteredCard = ({
  id,
  title,
  hint,
  data,
  summary,
  change,
  format,
  changeFormat,
  chart,
  className,
}: CenteredCardProps) => (
  <ChartCard
    id={id}
    data={data}
    className={className}
    layout="centered"
    reverse
    title={(api) => {
      const values = api.series[0]?.values || [];

      return (
        <div className="column h-center gap-1">
          {title && (
            <CardTitle
              title={
                <span className="text-m text-gray-dark light">{title}</span>
              }
              hint={hint}
            />
          )}
          <StatValue
            value={summary ? summary(values) : undefined}
            change={change ? change(values) : undefined}
            format={format}
            changeFormat={changeFormat}
            size="xl"
            align="center"
            changePosition="below"
            changePill
          />
        </div>
      );
    }}
    chart={chart}
  />
);

export default CenteredCard;
