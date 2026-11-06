import React from "react";

import { SERIES } from "../../colors";

/* !- Types */

export type ChartEvent = {
  // x index of the event
  index: number;
  // extra row of the tooltip of the x, e.g. "Kedvezmény: 12 %" or the coupon names
  title?: React.ReactNode;
  // key of the event types (default: "default" = eventIcon / eventLabel)
  type?: string;
  // false: only the tooltip row, no pin (e.g. the next months of a long coupon: the pins
  // of the neighbouring months would overlap)
  pin?: boolean;
};

export type ChartEventType = {
  // content of the pin, e.g. "%", "K"
  icon: React.ReactNode;
  // legend label
  label?: string;
  // pin colour / icon colour
  color?: string;
  textColor?: string;
};

export type ChartEventsOptions = {
  events?: ChartEvent[];
  // legend label of the default type
  eventLabel?: string;
  // pin content of the default type
  eventIcon?: React.ReactNode;
  // more kinds of events: the pins of an index are stacked
  eventTypes?: { [type: string]: ChartEventType };
};

/* !- Constants */

export const EVENT_COLOR = SERIES[4]; // rust

// pins of an index stacked upwards
export const PIN_STEP = 30;

// distance of the first pin above the top of the plot
const PIN_TOP = 26;

// plot top margin needed by the pins (one pin)
export const EVENTS_MARGIN_TOP = 56;

/* !- Elements */

/**
 * Event pin of the legend / tooltip
 */
export const EventSwatch = ({ icon, color = EVENT_COLOR, textColor = "#fff" }: ChartEventType) => (
  <svg width="1.15em" height="1.15em" viewBox="0 0 18 18" className="shrink-0">
    <circle cx="9" cy="9" r="9" fill={color} />
    <text x="9" y="9.5" fill={textColor} fontSize="10" fontWeight="bold" textAnchor="middle" dominantBaseline="central">
      {icon}
    </text>
  </svg>
);

/**
 * Marked x indexes (events) of a line chart: pins above the point with a dotted line down to it,
 * a tooltip row and a legend item by type. Used by ComparisonCard and MultiLineCard.
 *
 * @example
 * const pins = useChartEvents({ events: [{ index: 3, title: "Kupon: Őszi akció" }], eventLabel: "Kupon" });
 * const top = pins.marginTop(MARGIN.top);
 * <ChartLine margin={{ ...MARGIN, top }}>
 *   {pins.render((index) => values[index], top)}
 * </ChartLine>
 */
export const useChartEvents = ({
  events = [],
  eventLabel,
  eventIcon = "%",
  eventTypes = {},
}: ChartEventsOptions) => {
  const types: { [type: string]: ChartEventType } = {
    default: { icon: eventIcon, label: eventLabel },
    ...eventTypes,
  };

  const typeOf = (event: ChartEvent) => types[event.type || "default"] || types.default;

  // events by x index (the pins of an index are stacked in this order)
  const byIndex: { [index: number]: ChartEvent[] } = {};
  // only the events with a pin
  const pinsByIndex: { [index: number]: ChartEvent[] } = {};

  events.forEach((event) => {
    byIndex[event.index] = [...(byIndex[event.index] || []), event];

    if (event.pin !== false) {
      pinsByIndex[event.index] = [...(pinsByIndex[event.index] || []), event];
    }
  });

  const maxStack = Math.max(1, ...Object.values(pinsByIndex).map((list) => list.length));

  /**
   * Top margin of the plot: room for the pins (no events: the default)
   */
  const marginTop = (top: number) =>
    Object.keys(pinsByIndex).length ? Math.max(top, EVENTS_MARGIN_TOP) + (maxStack - 1) * PIN_STEP : top;

  /**
   * Chart children render-prop: `anchor(index)` = the value the dotted line goes down to,
   * `top` = the top margin of the plot (marginTop)
   */
  const render =
    (anchor: (index: number) => number | null | undefined, top: number) =>
    ({ toPix }: any) =>
      Object.entries(pinsByIndex).map(([index, list]) => {
        const point = toPix(Number(index), anchor(Number(index)) ?? 0);
        const firstY = top - PIN_TOP;
        const lineColor = typeOf(list[0]).color || EVENT_COLOR;

        return (
          <g key={index} className="comparison-event">
            <line
              x1={point.x}
              y1={firstY + 13}
              x2={point.x}
              y2={point.y - 6}
              stroke={lineColor}
              strokeWidth={1.5}
              strokeDasharray="2 3"
            />
            {list.map((event, n) => {
              const { icon, color: pinColor = EVENT_COLOR, textColor = "#fff" } = typeOf(event);
              const pinY = firstY - n * PIN_STEP;

              return (
                <g key={n}>
                  <circle cx={point.x} cy={pinY} r={13} fill={pinColor} />
                  <text
                    x={point.x}
                    y={pinY + 0.5}
                    fill={textColor}
                    fontSize={13}
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {icon}
                  </text>
                </g>
              );
            })}
          </g>
        );
      });

  /**
   * Tooltip rows of an index (the events with a title)
   */
  const tooltipRows = (index: number) =>
    (byIndex[index] || [])
      .filter((event) => event.title)
      .map((event, n) => (
        <div key={`event-${n}`} className="h-center gap-1" style={{ alignItems: "flex-start" }}>
          <EventSwatch {...typeOf(event)} />
          <span className="wrap">{event.title}</span>
        </div>
      ));

  /**
   * Legend: one item by event type that occurs (and has a label)
   */
  const legend = Object.keys(types)
    .filter((type) => events.some((event) => (event.type || "default") === type) && types[type].label)
    .map((type) => ({ type, swatch: <EventSwatch {...types[type]} />, label: types[type].label as string }));

  return { byIndex, typeOf, maxStack, marginTop, render, tooltipRows, legend };
};
