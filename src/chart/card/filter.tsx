import React from "react";

import ChartCard from "./card";
import ChartLine from "../line";
import SegmentedFilter, { Segment } from "./parts/segmentedFilter";
import StatValue from "./parts/statValue";
import {
  Series,
  SeriesGridApi,
  FilterRegistration,
} from "./hooks/useSeriesGrid";
import { dateInterselection } from "../../grid/filters";

/* !- Constants */

const DAY_MS = 24 * 60 * 60 * 1000;

/* !- Types */

export type FilterSegment = {
  id: string;
  title: React.ReactNode;
  // number of days back from the latest point (date-window filter)
  range?: number;
  // custom record predicate (activated as a toggle); ignored when `range` is set
  filter?: (record: Record<string, any>) => boolean;
};

export type FilterCardProps = {
  // redux grid id — one per card
  id: string;
  title?: React.ReactNode;
  data: Series[];
  // segmented pills; each activates a pre-registered grid filter
  filter: FilterSegment[];
  // several pills active at once vs. single-select (default)
  multiple?: boolean;
  // id of the pill active on load
  defaultFilter?: string;
  // headline value from the visible (filtered) primary values, e.g. array `last`
  summary?: (values: number[]) => React.ReactNode;
  // signed % change from the visible primary values, e.g. array `percentChange`
  change?: (values: number[]) => number;
  // format the headline value / the change label
  format?: (value: number) => React.ReactNode;
  changeFormat?: (change: number) => React.ReactNode;
  // override the chart; defaults to an area + hover line of the filtered series
  chart?: (series: Series[], api: SeriesGridApi) => React.ReactNode;
  className?: string;
  ratio?: string;
};

/* !- Helpers */

/**
 * Latest timestamp across the primary series' x-axis (the "now" the date windows
 * are measured back from).
 */
const latestDate = (data: Series[]): number => {
  const axis = data[0]?.xAxis || [];
  const times = axis
    .map((value) => new Date(value).getTime())
    .filter((time) => !isNaN(time));

  return times.length ? Math.max(...times) : 0;
};

/**
 * FilterCard (kép 1) — a single-series card with a segmented time filter.
 *
 * A headline value + change sit top-right, the segmented pills under the title,
 * and an area + hover line chart below. Everything reads the same filtered rows
 * from the grid, so switching a pill updates the value, the change and the chart
 * together.
 */
const FilterCard = ({
  id,
  title,
  data,
  filter,
  multiple = false,
  defaultFilter,
  summary,
  change,
  format,
  changeFormat,
  chart,
  className,
  ratio,
}: FilterCardProps) => {
  const max = latestDate(data);
  const rangeValue = (days: number) => `${max - days * DAY_MS}|${max}`;

  // the argument handed to the grid filter when a segment is activated
  const segmentValue = (segment: FilterSegment) =>
    segment.range != null ? rangeValue(segment.range) : true;

  const registrations: FilterRegistration[] = filter.map((segment) => ({
    id: segment.id,
    handler:
      segment.range != null
        ? dateInterselection
        : (record: Record<string, any>) =>
            segment.filter ? segment.filter(record) : true,
    initialValue:
      segment.id === defaultFilter ? segmentValue(segment) : undefined,
  }));

  const segments: Segment[] = filter.map((segment) => ({
    id: segment.id,
    title: segment.title,
    value: segmentValue(segment),
  }));

  const renderChart = (api: SeriesGridApi) =>
    chart ? (
      chart(api.series, api)
    ) : (
      <ChartLine
        data={api.series}
        responsive
        edgeToEdge
        width={800}
        height={360}
        area
        hover
        marker={false}
        yAxis={false}
        xGrid={false}
        yGrid={false}
        margin={{ top: 40, right: 24, bottom: 32, left: 24 }}
      />
    );

  return (
    <ChartCard
      id={id}
      data={data}
      filters={registrations}
      className={className}
      ratio={ratio}
      headerAlign="flex-start"
      title={(api) => (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}
        >
          {title && <div className="medium">{title}</div>}
          <SegmentedFilter api={api} segments={segments} multiple={multiple} />
        </div>
      )}
      header={(api) => {
        if (!summary && !change) {
          return null;
        }

        // the current (filtered) primary-series values
        const values = api.series[0]?.values || [];

        return (
          <StatValue
            value={summary ? summary(values) : undefined}
            change={change ? change(values) : undefined}
            format={format}
            changeFormat={changeFormat}
            size="xl"
            align="right"
            changePosition="below"
          />
        );
      }}
      chart={renderChart}
    />
  );
};

export default FilterCard;
