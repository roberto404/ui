import React from 'react';
import { Meta, StoryObj } from '@storybook/react';

require('../../../assets/style/index.scss');

/* !- Components */

import CenteredCard from '../../chart/card/centered';
import TrendIcon from '../../chart/card/parts/trendIcon';
import Donut from '../../chart/donut';

/* !- Reducers (generic array) */

import { last, percentChange } from '@1studio/utils/array';


/* !- Demo data */

const data = [{ id: 'orders', values: [28, 24, 33, 30, 38, 34, 31, 36, 40, 42] }];

const Box = ({ children, width = 320 }: any) => (
  <div style={{ width, maxWidth: '100%', resize: 'horizontal', overflow: 'auto', padding: 4 }}>
    {children}
  </div>
);


/* !- Stories */

const meta = {
  title: 'Chart/Card/Centered',
  component: CenteredCard,
} satisfies Meta<typeof CenteredCard>;

export default meta;

type Story = StoryObj<typeof meta>;


/**
 * Centered layout: the `chart` slot on top at its natural size (here a trend icon),
 * title, big value (`summary`) and the change pill (`change`) below.
 */
export const Icon: Story = {
  render: () => (
    <Box>
      <CenteredCard
        id="centered/icon"
        title="Rendelések"
        data={data}
        summary={last}
        change={percentChange}
        changeFormat={(value) => `${Math.abs(Math.round(value))} %`}
        chart={(api) => <TrendIcon change={percentChange(api.series[0].values)} />}
      />
    </Box>
  ),
};


/**
 * Any element fits the chart slot, e.g. a donut.
 */
export const DonutChart: Story = {
  render: () => (
    <Box>
      <CenteredCard
        id="centered/donut"
        title="Teljesítés"
        hint="Az utolsó érték a célhoz képest"
        data={data}
        summary={last}
        change={percentChange}
        changeFormat={(value) => `${Math.abs(Math.round(value))} %`}
        chart={(api) => (
          <div className="w-8">
            <Donut percent={last(api.series[0].values)} color="#186eff" rounded />
          </div>
        )}
      />
    </Box>
  ),
};

DonutChart.storyName = 'Donut';
