import React from 'react';
import { Meta, StoryObj } from '@storybook/react';

require('../../../assets/style/index.scss');

/* !- Components */

import MinimalCard from '../../chart/card/minimal';
import ChartLine from '../../chart/line';

/* !- Reducers (generic array) */

import { last, percentChange } from '@1studio/utils/array';


/* !- Demo data */

const data = [
  { id: 'leads', values: [28, 24, 33, 30, 38, 34, 31, 36, 40, 42], color: '#e8792b' },
];

const Box = ({ children, width = 300 }: any) => (
  <div style={{ width, maxWidth: '100%', resize: 'horizontal', overflow: 'auto', padding: 4 }}>
    {children}
  </div>
);


/* !- Stories */

const meta = {
  title: 'Chart/Card/Minimal',
  component: MinimalCard,
} satisfies Meta<typeof MinimalCard>;

export default meta;

type Story = StoryObj<typeof meta>;


/**
 * Reproduces the "New Leads" mock — label + value + inline change on the left,
 * a small area sparkline on the right.
 */
export const NewLeads: Story = {
  render: () => (
    <Box>
      <MinimalCard
        id="leads"
        title="New Leads"
        data={data}
        summary={last}
        change={percentChange}
        changeFormat={(value) => `${Math.abs(Math.round(value))}%`}
      />
    </Box>
  ),
};

NewLeads.storyName = 'New Leads';


/**
 * `chart` render-prop: bind any chart instead of the default sparkline. Here a
 * straight blue line with markers (the same override the other cards use).
 */
export const CustomChart: Story = {
  render: () => (
    <Box>
      <MinimalCard
        id="leads-custom"
        title="New Leads"
        data={data}
        summary={last}
        change={percentChange}
        changeFormat={(value) => `${Math.abs(Math.round(value))}%`}
        chart={(series) => (
          <ChartLine
            data={series}
            responsive
            edgeToEdge
            width={320}
            height={140}
            bezier={false}
            marker
            area={false}
            hover={false}
            color="#186eff"
            xAxis={false}
            yAxis={false}
            xGrid={false}
            yGrid={false}
            margin={{ top: 12, right: 10, bottom: 12, left: 10 }}
          />
        )}
      />
    </Box>
  ),
};

CustomChart.storyName = 'Custom chart (render-prop)';
