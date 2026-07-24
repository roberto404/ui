import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import moment from 'moment';

require('../../../assets/style/index.scss');

/* !- Components */

import DateFilterCard from '../../chart/card/dateFilter';
import ChartLine from '../../chart/line';

/* !- Reducers (generic array) */

import { avg, percentChange } from '@1studio/utils/array';


/* !- Demo data — ~9 months of weekly income / expense samples */

const WEEKS = 40;
const anchor = moment('2025-01-06');

const wave = (base: number, amp: number, phase: number) =>
  Array.from({ length: WEEKS }, (_, i) => {
    const t = i / (WEEKS - 1);
    return Math.round(base + (amp * Math.sin((t * Math.PI * 3) + phase)) + (amp * 0.4 * t));
  });

const xAxis = Array.from({ length: WEEKS }, (_, i) => anchor.clone().add(i, 'weeks').format('YYYY-MM-DD'));

const data = [
  { id: 'income', values: wave(12000, 1400, 0.4), xAxis, color: '#186eff' },
  { id: 'expense', values: wave(8000, 900, 1.6), xAxis, color: '#e8792b' },
];


/* !- Chart matching the mock (month x-axis, shared hover tooltip) */

const statChart = (series: any[]) => {
  const length = series[0]?.values.length || 0;
  const step = Math.max(1, Math.ceil(length / 9));

  return (
    <ChartLine
      data={series}
      responsive
      edgeToEdge
      width={1000}
      height={360}
      hover
      marker={false}
      yAxis={false}
      xGrid={false}
      yGrid={false}
      xAxisFormat={(value: string, index: number) => (index % step === 0 ? moment(value).format('MMM') : null)}
      valueFormat={(value: number) => `$${value.toLocaleString()}`}
      margin={{ top: 70, right: 24, bottom: 36, left: 24 }}
    />
  );
};

const money = (value: number) => `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

const Resizable = ({ children, width = 760 }: any) => (
  <div style={{ width, maxWidth: '100%', resize: 'horizontal', overflow: 'auto', padding: 4 }}>
    {children}
  </div>
);


/* !- Stories */

const meta = {
  title: 'Chart/Card/DateFilter',
  component: DateFilterCard,
} satisfies Meta<typeof DateFilterCard>;

export default meta;

type Story = StoryObj<typeof meta>;


/**
 * Reproduces the "Statistics" mock: two series, a dynamic period selector
 * top-right (months here — the span is ~9 months), and a summary per series.
 */
export const Statistics: Story = {
  render: () => (
    <Resizable>
      <DateFilterCard
        id="stats"
        title="Statistics"
        data={data}
        period
        chart={statChart}
        format={money}
        summaries={[
          { seriesId: 'income', label: 'Average Income', value: avg, change: percentChange },
          { seriesId: 'expense', label: 'Average Expenses', value: avg, change: percentChange },
        ]}
      />
    </Resizable>
  ),
};

Statistics.storyName = 'Statistics (two series)';


/**
 * A single (primary) summary instead of one per series.
 */
export const PrimaryOnly: Story = {
  render: () => (
    <Resizable>
      <DateFilterCard
        id="stats-primary"
        title="Revenue"
        data={[data[0]]}
        period
        chart={statChart}
        format={money}
        summaries={[{ label: 'Average Revenue', value: avg, change: percentChange }]}
      />
    </Resizable>
  ),
};

PrimaryOnly.storyName = 'Primary summary only';
