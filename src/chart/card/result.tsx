import React from "react";

import CenteredCard from "./centered";
import TrendIcon from "./parts/trendIcon";

/* !- Types */

export type ResultCardProps = {
  // redux grid id — one per card
  id: string;
  title: React.ReactNode;
  value: number;
  // signed % change: green up / red down / grey flat
  change: number;
  hint?: React.ReactNode;
  format?: (value: number) => React.ReactNode;
  changeFormat?: (change: number) => React.ReactNode;
  className?: string;
};

/**
 * ResultCard — a single result: trend icon, title, value and its change,
 * coloured by the sign of the change. A CenteredCard with a TrendIcon chart.
 */
const ResultCard = ({
  id,
  title,
  value,
  change,
  hint,
  format,
  changeFormat = (value) => `${Math.abs(value)} %`,
  className,
}: ResultCardProps) => (
  <CenteredCard
    id={id}
    title={title}
    hint={hint}
    data={[{ id: "value", values: [value] }]}
    summary={(values) => values[values.length - 1]}
    change={() => change}
    format={format}
    changeFormat={changeFormat}
    chart={() => <TrendIcon change={change} />}
    className={className}
  />
);

export default ResultCard;
