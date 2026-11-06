import React from "react";

import ChartCard, { CardSlot } from "./card";
import CardTitle from "./parts/title";
import ChartLine from "../line";
import integerAxis from "../coordinate/functions/integerAxis";
import { PLOT, SERIES } from "../colors";
import { ChartEventsOptions, useChartEvents } from "./parts/eventPins";

/* !- Types */

export type MultiLineSeries = {
  id: string;
  // legend label, e.g. "Eladási ár"
  label: string;
  // label of the tooltip row (default: label), e.g. "eladási ár"
  shortLabel?: string;
  // one value by x label, null: no data (the line breaks)
  values: Array<number | null>;
  // default: the SERIES palette by index
  color?: string;
};

export type MultiLineCardProps = {
  // redux grid id
  id: string;
  title?: CardSlot;
  hint?: React.ReactNode;
  xLabels: string[];
  series: MultiLineSeries[];
  // title of the tooltip of an x (default: the x label), e.g. "2026. január"
  tooltipTitle?: (index: number) => React.ReactNode;
  // tooltip value, e.g. +1,5%
  valueFormat?: (value: number) => string;
  // y axis labels (default: valueFormat)
  axisFormat?: (value: number) => string;
  // the axis steps in this unit (e.g. 0.5 for percents; default 1)
  axisUnit?: number;
  // right side of the chart (e.g. the summary of the period)
  aside?: React.ReactNode;
  // width of the aside (default 28%)
  asideWidth?: string;
  footer?: CardSlot;
  className?: string;
  ratio?: string;
  // empty state instead of the chart
  empty?: React.ReactNode;
  // dots on the points (default true; off for long, dense series)
  marker?: boolean;
  // the y axis starts at 0 (default true); false: from the smallest value (e.g. prices)
  zero?: boolean;
} & ChartEventsOptions;

/* !- Constants */

const WIDTH = 700;
const HEIGHT = 330;
const MARGIN = { top: 20, right: 24, bottom: 44, left: 64 };

const TOOLTIP_STYLE: React.CSSProperties = {
  fontSize: "80%",
  background: "rgba(255, 255, 255, 0.85)",
};

/* !- Elements */

const LineSwatch = ({ color }: { color: string }) => (
  <svg width="22" height="10" className="shrink-0" aria-hidden>
    <line x1="1" y1="5" x2="21" y2="5" stroke={color} strokeWidth="3" strokeLinecap="round" />
  </svg>
);

/**
 * Several lines of the same scale (e.g. price changes), dots on the points, a shared
 * hover with the ui layer tooltip, the legend at the top right, an optional aside
 * (summary) on the right. The y axis can be negative (from the minimum).
 *
 * @example
 * <MultiLineCard
 *   id="prices"
 *   title="Árváltozás hónapról hónapra"
 *   xLabels={["Okt", "Nov", …]}
 *   series={[
 *     { id: "sale", label: "Eladási ár", values: [0.6, 0.8, …] },
 *     { id: "purchase", label: "Beszerzési ár", values: [null, 0.5, …] },
 *   ]}
 *   valueFormat={(value) => `${value}%`}
 *   axisUnit={0.5}
 *   aside={<Summary />}
 *   // "%" pin above the month, its title in the tooltip
 *   events={[{ index: 3, title: "Kupon: Őszi akció" }]}
 *   eventLabel="Kupon"
 * />
 */
const MultiLineCard = ({
  id,
  title,
  hint,
  xLabels,
  series,
  tooltipTitle,
  valueFormat = (value) => value.toLocaleString("hu-HU"),
  axisFormat = valueFormat,
  axisUnit = 1,
  aside,
  asideWidth = "28%",
  footer,
  className,
  ratio = "auto",
  empty,
  marker = true,
  zero = true,
  events,
  eventLabel,
  eventIcon,
  eventTypes,
}: MultiLineCardProps) => {
  const colored = series.map((item, index) => ({ ...item, color: item.color || SERIES[index % SERIES.length] }));

  const values = colored.flatMap(({ values: list }) => list.filter((value) => value !== null) as number[]);

  // nice axis in axisUnit steps, from the minimum (negative too) or 0
  const axis = integerAxis(
    (zero ? Math.min(0, ...values) : Math.min(...values)) / axisUnit,
    Math.max(axisUnit, ...values) / axisUnit,
    5,
  );
  const axisValues = axis.values.map((value) => value * axisUnit);

  // marked x indexes (e.g. coupon months): "%" pin above the highest point, names in the tooltip
  const pins = useChartEvents({ events, eventLabel, eventIcon, eventTypes });
  const margin = { ...MARGIN, top: pins.marginTop(MARGIN.top) };

  const topValue = (index: number) => {
    const list = colored
      .map((item) => item.values[index])
      .filter((value) => value !== null && value !== undefined) as number[];

    return list.length ? Math.max(...list) : null;
  };

  const renderTooltip = (index: number) => (
    <div className="p-1 column gap-1/2 nowrap">
      <span className="bold text-m pb-1/2">{tooltipTitle ? tooltipTitle(index) : xLabels[index]}</span>
      {colored.map((item) => (
        <div key={item.id} className="h-center gap-1">
          <LineSwatch color={item.color} />
          <span className="bold">
            {item.values[index] === null || item.values[index] === undefined
              ? "–"
              : valueFormat(item.values[index] as number)}
          </span>
          <span className="text-gray">{item.shortLabel || item.label}</span>
        </div>
      ))}
      {pins.tooltipRows(index)}
    </div>
  );

  // y labels + dashed horizontal grid (the 0 line solid)
  const renderGrid = ({ canvas, toPix }: any) =>
    axisValues.map((value) => {
      const { y } = toPix(0, value);

      return (
        <g key={value}>
          <line
            x1={canvas.x}
            y1={y}
            x2={canvas.x + canvas.width}
            y2={y}
            stroke={PLOT.grid}
            strokeWidth={1.5}
            strokeDasharray={value ? "6 6" : undefined}
          />
          <text
            x={canvas.x - 12}
            y={y}
            textAnchor="end"
            dominantBaseline="central"
            fontSize={15}
            fill={PLOT.muted}
          >
            {axisFormat(value)}
          </text>
        </g>
      );
    });

  const xAxisLabel = ({ value, x, y }: any) => (
    <text x={x} y={y + 12} textAnchor="middle" dominantBaseline="hanging" fontSize={15} fill={PLOT.muted}>
      {value.x}
    </text>
  );

  const legend = (
    <div className="h-center wrap gap-2 text-xs text-gray-dark">
      {colored.map((item) => (
        <div key={item.id} className="h-center gap-1/2 nowrap">
          <LineSwatch color={item.color} />
          <span>{item.label}</span>
        </div>
      ))}
      {pins.legend.map(({ type, swatch, label }) => (
        <div key={`event-${type}`} className="h-center gap-1/2 nowrap">
          {swatch}
          <span>{label}</span>
        </div>
      ))}
    </div>
  );

  return (
    <ChartCard
      id={id}
      className={className}
      ratio={ratio}
      title={title ? <CardTitle title={title} hint={hint} className="bold" /> : undefined}
      header={legend}
      footer={footer}
      empty={empty}
      chart={() => (
        <div className="flex gap-4">
          <div className="grow" style={{ minWidth: 0 }}>
            <ChartLine
              data={colored.map((item, index) => ({
                id: item.id,
                values: item.values,
                color: item.color,
                ...(index === 0 ? { xAxis: xLabels } : {}),
              }))}
              responsive
              edgeToEdge
              width={WIDTH}
              height={HEIGHT}
              hover
              bezier={false}
              marker={marker}
              layerTooltip={renderTooltip}
              layerTooltipOffset={24}
              layerTooltipStyle={TOOLTIP_STYLE}
              yAxisValueMin={axis.min * axisUnit}
              yAxisValueMax={axis.max * axisUnit}
              yAxisSteps={axis.steps}
              xGrid={false}
              yGrid={false}
              yAxis={false}
              underlay={renderGrid}
              xAxisLabel={xAxisLabel}
              margin={margin}
            >
              {pins.render(topValue, margin.top)}
            </ChartLine>
          </div>
          {aside && (
            <div className="shrink-0" style={{ width: asideWidth }}>
              {aside}
            </div>
          )}
        </div>
      )}
    />
  );
};

export default MultiLineCard;
