import React from "react";

import ChartCard, { CardSlot } from "./card";
import CardTitle from "./parts/title";
import { ChangeBadge } from "./parts/statValue";
import ChartLine from "../line";
import integerAxis from "../coordinate/functions/integerAxis";
import { PLOT, SERIES } from "../colors";
import { AxisHighlightType } from "../axisMarks";
import { ChartEvent, ChartEventType, useChartEvents } from "./parts/eventPins";

/* !- Types */

export type ComparisonSeries = {
  // legend + tooltip label, e.g. "Utolsó 12 hó (2025. okt – 2026. szept)"
  label: string;
  // short label of the tooltip row, e.g. "utolsó 12 hó" (default: label)
  shortLabel?: string;
  // one value by x label, null: no data
  values: Array<number | null>;
};

// the events (pins) are the shared chart events (parts/eventPins)
export type ComparisonEvent = ChartEvent;
export type ComparisonEventType = ChartEventType;

export type ComparisonCardProps = {
  // redux grid id of the card
  id: string;
  title?: CardSlot;
  hint?: React.ReactNode;
  // x axis labels (e.g. short month names)
  xLabels: string[];
  // tooltip title of an x index (e.g. "2026. április"), default: the x label
  tooltipTitle?: (index: number) => React.ReactNode;
  // primary series: solid line with area
  current: ComparisonSeries;
  // the same period before: dashed line, the tooltip shows the change to it
  previous?: ComparisonSeries;
  // reference / trend line (e.g. 12 month moving average): light dashed, not hovered
  average?: ComparisonSeries;
  // marked x indexes (e.g. campaign months): a pin above the point
  events?: ComparisonEvent[];
  // legend label of the events (default type)
  eventLabel?: string;
  // content of the pin (default type)
  eventIcon?: React.ReactNode;
  // more kinds of events: the pins of a month are stacked
  eventTypes?: { [type: string]: ComparisonEventType };
  // tooltip values
  valueFormat?: (value: number) => string;
  // y axis labels
  axisFormat?: (value: number) => string;
  // the tooltip sits at the point of this series (default: current, also when the
  // previous is higher)
  tooltipAnchor?: "current" | "previous" | "average";
  // vertical distance of the tooltip from the point (px)
  tooltipOffset?: number;
  // style of the tooltip container (default: 80 % size, translucent background)
  tooltipStyle?: React.CSSProperties;
  // highlighted x labels (e.g. months) with a tooltip on hover: why are they different
  xAxisHighlights?: AxisHighlightType[];
  footer?: CardSlot;
  className?: string;
  ratio?: string;
  color?: string;
};

/* !- Constants */

const PREVIOUS_COLOR = "#aab4c2";

const TOOLTIP_STYLE: React.CSSProperties = {
  fontSize: "80%",
  background: "rgba(255, 255, 255, 0.85)",
};

const WIDTH = 1000;
const HEIGHT = 380;
// left: room for the y axis labels (e.g. "200 M Ft"), right: half of the last x label
const MARGIN = { top: 56, right: 32, bottom: 48, left: 104 };

// average marker among the y axis labels (darker than the axis labels)
const AVERAGE_TEXT_COLOR = "#5f6470";

/* !- Elements */

/**
 * Line swatch of the legend / tooltip (solid or dashed)
 */
const LineSwatch = ({ color, dashed = false }: { color: string; dashed?: boolean }) => (
  // em: scales with the text (legend, tooltip)
  <svg width="1.5em" height="0.5em" viewBox="0 0 24 8" className="shrink-0">
    <line
      x1="1"
      y1="4"
      x2="23"
      y2="4"
      stroke={color}
      strokeWidth={dashed ? 2 : 3}
      strokeDasharray={dashed ? "5 4" : undefined}
      strokeLinecap="round"
    />
  </svg>
);

// the average line looks like a grid line
const GridSwatch = () => (
  <svg width="1.5em" height="0.5em" viewBox="0 0 24 8" className="shrink-0">
    <line x1="0" y1="4" x2="24" y2="4" stroke={PLOT.grid} strokeWidth={1.5} strokeDasharray="6 6" />
  </svg>
);

const LegendItem = ({ swatch, label }: { swatch: React.ReactNode; label: React.ReactNode }) => (
  <div className="h-center gap-1/2 nowrap">
    {swatch}
    <span>{label}</span>
  </div>
);

const signedPercent = (value: number) =>
  `${value > 0 ? "+" : ""}${(Math.round(value * 10) / 10).toLocaleString("hu-HU")}%`;

/**
 * Comparison card (year over year): the current period (solid line + area) against the
 * same period before (dashed) with an optional trend line and marked points (events).
 * Hover: the ui layer tooltip of the month with the change to the previous period.
 *
 * @example
 * <ComparisonCard
 *   id="sales"
 *   title="Havi bontás – utolsó 12 hónap az előző 12 hónaphoz képest"
 *   xLabels={["Okt", "Nov", …]}
 *   current={{ label: "Utolsó 12 hó", values: […] }}
 *   previous={{ label: "Előző 12 hó", values: […] }}
 *   average={{ label: "12 havi mozgóátlag", values: […] }}
 *   events={[{ index: 1 }]}
 *   eventLabel="Akciós hónap"
 * />
 */
const ComparisonCard = ({
  id,
  title,
  hint,
  xLabels,
  tooltipTitle,
  current,
  previous,
  average,
  events = [],
  eventLabel,
  eventIcon = "%",
  eventTypes = {},
  valueFormat = (value) => value.toLocaleString("hu-HU"),
  axisFormat = valueFormat,
  tooltipAnchor = "current",
  tooltipOffset = 24,
  tooltipStyle = TOOLTIP_STYLE,
  xAxisHighlights,
  footer,
  className,
  ratio = "5 / 2",
  color = SERIES[0],
}: ComparisonCardProps) => {
  const toValues = (series?: ComparisonSeries) =>
    (series?.values || []).map((value) => value ?? 0);

  const values = toValues(current);
  const previousValues = toValues(previous);
  const averageValues = toValues(average);

  // nice y axis from 0 (integer steps)
  const axis = integerAxis(
    0,
    Math.max(1, ...values, ...previousValues, ...averageValues),
    4,
  );

  const series = [
    { id: "current", values, xAxis: xLabels, color },
    ...(previous
      ? [{ id: "previous", values: previousValues, color: PREVIOUS_COLOR, dashed: true }]
      : []),
  ];

  const pins = useChartEvents({ events, eventLabel, eventIcon, eventTypes });
  const margin = { ...MARGIN, top: pins.marginTop(MARGIN.top) };

  const renderTooltip = (index: number) => {
    const value = current.values[index];
    const before = previous?.values[index];
    const change =
      value !== null && value !== undefined && before ? ((value - before) / Math.abs(before)) * 100 : null;

    // the average is a marker on the y axis, not a row
    const rows = [
      { series: current, swatch: <LineSwatch color={color} /> },
      ...(previous ? [{ series: previous, swatch: <LineSwatch color={PREVIOUS_COLOR} dashed /> }] : []),
    ];

    return (
      <div className="p-1 column gap-1/2 nowrap">
        <div className="h-center gap-1 pb-1/2">
          <span className="bold text-m">{tooltipTitle ? tooltipTitle(index) : xLabels[index]}</span>
          {change !== null && <ChangeBadge change={change} format={signedPercent} />}
        </div>
        {rows.map(({ series: row, swatch }) => (
          <div key={row.label} className="h-center gap-1">
            {swatch}
            <span className="bold">
              {row.values[index] === null || row.values[index] === undefined
                ? "–"
                : valueFormat(row.values[index] as number)}
            </span>
            <span className="text-gray">{row.shortLabel || row.label}</span>
          </div>
        ))}
        {pins.tooltipRows(index)}
      </div>
    );
  };

  // average marker: the last value of the average line, among the y axis labels
  const averageValue = [...(average?.values || [])]
    .reverse()
    .find((value) => value !== null && value !== undefined) as number | undefined;

  // y axis labels + horizontal dashed grid (the coordinate grid / axis are solid black);
  // the labels near the average marker are hidden
  const renderGrid = ({ canvas, toPix }: any) => {
    const averageY = averageValue !== undefined ? toPix(0, averageValue).y : null;

    // the average line: the same style as the grid lines (drawn under the series)
    const averagePath = average
      ? average.values
          .map((value, index) => (value === null ? null : toPix(index, value)))
          .filter(Boolean)
          .map((point: any, index) => `${index ? "L" : "M"}${point.x},${point.y}`)
          .join(" ")
      : "";

    return [
      averagePath && (
        <path
          key="average-line"
          className="comparison-average-line"
          d={averagePath}
          fill="none"
          stroke={PLOT.grid}
          strokeWidth={1.5}
          strokeDasharray="6 6"
        />
      ),
      ...axis.values.map((value) => {
      const { y } = toPix(0, value);
      const hidden = averageY !== null && Math.abs(averageY - y) < 24;

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
          {!hidden && (
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
          )}
        </g>
      );
      }),
      averageY !== null && (
        <text
          key="average"
          className="comparison-average"
          x={canvas.x - 12}
          y={averageY}
          textAnchor="end"
          fill={AVERAGE_TEXT_COLOR}
          fontWeight="bold"
        >
          <tspan x={canvas.x - 12} dy="-0.35em" fontSize={12}>átlag</tspan>
          <tspan x={canvas.x - 12} dy="1.15em" fontSize={15}>{axisFormat(averageValue as number)}</tspan>
        </text>
      ),
    ];
  };

  // x labels centered under the points (the coordinate axis anchors them to the end)
  const xAxisLabel = ({ value, x, y }: any) => (
    <text x={x} y={y + 12} textAnchor="middle" dominantBaseline="hanging" fontSize={15} fill={PLOT.muted}>
      {value.x}
    </text>
  );

  // pins above the marked points (stacked by index), a dotted line down to the point
  const renderEvents = pins.render((index) => values[index], margin.top);

  // legend: one item by event type that occurs
  const eventLegend = pins.legend.map(({ type, swatch, label }) => (
    <LegendItem key={type} swatch={swatch} label={label} />
  ));

  const legend = (
    <div className="h-center wrap gap-1 text-xs text-gray-dark pt-1/2">
      {previous && <LegendItem swatch={<LineSwatch color={PREVIOUS_COLOR} dashed />} label={previous.label} />}
      <LegendItem swatch={<LineSwatch color={color} />} label={current.label} />
      {eventLegend}
      {average && <LegendItem swatch={<GridSwatch />} label={average.label} />}
    </div>
  );

  return (
    <ChartCard
      id={id}
      className={className}
      ratio={ratio}
      title={
        <div className="column">
          {title && <CardTitle title={title} hint={hint} className="bold" />}
          {legend}
        </div>
      }
      footer={footer}
      chart={() => (
        <ChartLine
          data={series}
          responsive
          edgeToEdge
          width={WIDTH}
          height={HEIGHT}
          area
          hover
          bezier={false}
          marker={false}
          layerTooltip={renderTooltip}
          layerTooltipAnchor={tooltipAnchor}
          layerTooltipOffset={tooltipOffset}
          layerTooltipStyle={tooltipStyle}
          yAxisValueMin={0}
          yAxisValueMax={axis.max}
          yAxisSteps={axis.steps}
          xGrid={false}
          yGrid={false}
          yAxis={false}
          underlay={renderGrid}
          xAxisLabel={xAxisLabel}
          xAxisHighlights={xAxisHighlights}
          margin={margin}
        >
          {renderEvents}
        </ChartLine>
      )}
    />
  );
};

export default ComparisonCard;
