import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import moment from 'moment';

require('../../../assets/style/index.scss');

/* !- Components */

import FilterCard from '../../chart/card/filter';
import ChartLine from '../../chart/line';

/* !- Series helpers (generic array reducers) */

import { last, percentChange } from '@1studio/utils/array';


/* !- Demo data — ~10 weeks of deterministic daily exchange-rate samples */

const DAYS = 70;
const anchor = moment('2025-06-05');

const values = Array.from({ length: DAYS }, (_, i) => {
  const t = i / (DAYS - 1);

  const rate =
    0.7448 -
    0.0022 * Math.exp(-((t - 0.12) ** 2) / 0.004) +
    0.003 * (1 / (1 + Math.exp(-(t - 0.42) * 18))) -
    0.0008 * Math.max(0, t - 0.7) +
    0.0004 * Math.sin(t * Math.PI * 22) +
    0.0003 * Math.sin(t * Math.PI * 7);

  return Math.round(rate * 10000) / 10000;
});

const data = [
  {
    id: 'sgd',
    values,
    xAxis: Array.from({ length: DAYS }, (_, i) => anchor.clone().add(i, 'days').format('YYYY-MM-DD')),
  },
];


/* !- Chart matching the mock (y-axis labels, dated x-axis, area + hover) */

const yAxisLabel = ({ value, x, y }: any) => (
  <text x={x - 12} y={y} textAnchor="end" dominantBaseline="central" fontSize={15} fill="#9aa5b1">
    {value.y.toFixed(3).replace('.', ',')}
  </text>
);

const stockChart = (series: any[]) => {
  const length = series[0]?.values.length || 0;
  const step = Math.max(1, Math.ceil(length / 6));

  return (
    <ChartLine
      data={series}
      responsive
      width={900}
      height={380}
      area
      hover
      marker={false}
      yGrid={false}
      xAxisFormat={(value: string, index: number) => (index % step === 0 ? moment(value).format('MMM D') : null)}
      valueFormat={(value: number) => value.toFixed(4)}
      yAxisLabel={yAxisLabel}
      margin={{ top: 48, right: 24, bottom: 30, left: 64 }}
    />
  );
};


/* !- Resizable wrapper to show the card is fluid (drag the bottom-right corner) */

const Resizable = ({ children, width = 560 }: any) => (
  <div style={{ width, maxWidth: '100%', resize: 'horizontal', overflow: 'auto', padding: 4 }}>
    {children}
  </div>
);


/* !- Stories */

const meta = {
  title: 'Chart/Card/Filter',
  component: FilterCard,
} satisfies Meta<typeof FilterCard>;

export default meta;

type Story = StoryObj<typeof meta>;

const SEGMENTS = [
  { id: '1d', title: '1D', range: 1 },
  { id: '1w', title: '1W', range: 7 },
  { id: '1m', title: '1M', range: 30 },
  { id: '1q', title: '1Q', range: 90 },
];


/**
 * Reproduces the "Singapore dollar" mock. Drag the bottom-right corner of the
 * frame — the whole card (and its chart) scales to the wrapper.
 */
export const Basic: Story = {
  render: () => (
    <Resizable>
      <FilterCard
        id="sgd"
        title="Singapore dollar"
        data={data}
        filter={SEGMENTS}
        defaultFilter="1w"
        summary={last}
        change={percentChange}
        format={(value) => value.toFixed(4)}
        chart={stockChart}
      />
    </Resizable>
  ),
};

Basic.storyName = 'Singapore dollar';


/**
 * The default chart (no custom render-prop) — area + hover, minimal axes.
 */
export const DefaultChart: Story = {
  render: () => (
    <Resizable width={480}>
      <FilterCard
        id="sgd-default"
        title="Singapore dollar"
        data={data}
        filter={SEGMENTS}
        defaultFilter="1m"
        summary={last}
        change={percentChange}
        format={(value) => value.toFixed(4)}
      />
    </Resizable>
  ),
};

DefaultChart.storyName = 'Default chart';


/**
 * `multiple` lets several pills combine (AND) instead of single-select.
 */
export const Multiple: Story = {
  render: () => (
    <Resizable>
      <FilterCard
        id="sgd-multi"
        title="Singapore dollar"
        data={data}
        multiple
        filter={SEGMENTS}
        defaultFilter="1q"
        summary={last}
        change={percentChange}
        format={(value) => value.toFixed(4)}
        chart={stockChart}
      />
    </Resizable>
  ),
};

Multiple.storyName = 'Multiple select';
