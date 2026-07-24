import React from 'react';

import ChartCard from './card';
import ChartLine from '../line';
import PeriodCarousel from './parts/periodCarousel';
import Summary, { SummaryItem } from './parts/summary';
import { Series, SeriesGridApi } from './hooks/useSeriesGrid';
import { dateInterselection } from '../../grid/filters';


/* !- Types */

export type SummarySpec = {
  // which series to summarise (defaults to the primary/first)
  seriesId?: string,
  label: React.ReactNode,
  // reduce that series' visible values to a headline, e.g. array `avg`
  value: (values: number[]) => React.ReactNode,
  // signed % change, e.g. array `percentChange`
  change?: (values: number[]) => number,
};

export type DateFilterCardProps = {
  // redux grid id — one per card
  id: string,
  title?: React.ReactNode,
  data: Series[],
  // show the dynamic period selector (CalendarCarousel) top-right
  period?: boolean,
  // one summary block per entry (kép 2 = income + expenses); a single entry = primary only
  summaries?: SummarySpec[],
  format?: (value: number) => React.ReactNode,
  // override the chart; defaults to a multi-line + multi-hover chart of the series
  chart?: (series: Series[], api: SeriesGridApi) => React.ReactNode,
  className?: string,
  ratio?: string,
};


/**
 * DateFilterCard (kép 2) — a multi-series card with a date-period selector.
 *
 * Title + dynamic period carousel top-right, a multi-line chart with a shared
 * hover tooltip, and one summary per series at the bottom. The period selector
 * only filters the already-loaded data (dynamic granularity from its span).
 */
const DateFilterCard = ({
  id,
  title,
  data,
  period = true,
  summaries,
  format,
  chart,
  className,
  ratio,
}: DateFilterCardProps) => {

  const renderChart = (api: SeriesGridApi) => (
    chart
      ? chart(api.series, api)
      : (
        <ChartLine
          data={api.series}
          responsive
          edgeToEdge
          width={900}
          height={340}
          hover
          marker={false}
          yAxis={false}
          xGrid={false}
          yGrid={false}
          margin={{ top: 70, right: 24, bottom: 36, left: 24 }}
        />
      )
  );

  return (
    <ChartCard
      id={id}
      data={data}
      title={title}
      className={className}
      ratio={ratio}
      headerAlign="center"
      filters={period ? [{ id: 'period', handler: dateInterselection }] : []}
      header={period ? (api) => <PeriodCarousel api={api} filterId="period" /> : undefined}
      chart={renderChart}
      footer={summaries ? (api) => {
        const items: SummaryItem[] = summaries.map((spec) => {
          const series = api.series.find((item) => item.id === spec.seriesId) || api.series[0];
          const values = series?.values || [];

          return {
            label: spec.label,
            value: spec.value(values),
            change: spec.change ? spec.change(values) : undefined,
            color: series?.color,
          };
        });

        return <Summary items={items} format={format} />;
      } : undefined}
    />
  );
};

export default DateFilterCard;
