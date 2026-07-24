import React from 'react';
import { Meta, StoryObj } from '@storybook/react';

require('../../../assets/style/index.scss');


/* !- Compontents */

import ChartBar from '../../chart/bar';
import ChartGroup from '../../chart/group';
import ChartLine from '../../chart/line';


/* !- Constants */

const data = [
  {
    id: 's1',
    label: 'store1',
    values: [100, 200, 50],
    xAxis: ['Lorem', 'ipsum', 'dolor'],
  },
  {
    id: 's2',
    label: 'store2',
    values: [20, 30, 10],
    xAxis: ['RS1', 'RS2', 'RS3'],
  },
];



/* !- Stories */

const meta = {
  title: 'Chart/Bar',
  component: ChartBar,
} satisfies Meta<typeof ChartBar>;

export default meta;


type Story = StoryObj<typeof meta>;


/* !- Basic Bar */

export const Bar1: Story = {
  args: {
    data: [data[0]],
    width: 800,
    height: 250,
  },
}

Bar1.storyName = 'Basic';


/* !- Negative Bar */

export const Bar2: Story = {
  args: {
    data: [
      {
        id: 'negative',
        label: 'Negative',
        values: [10, -30, 25, -5],
      },
    ],
    width: 800,
    height: 250,
  },
}

Bar2.storyName = 'Negative';


/* !- Double Bar */

export const Bar3: Story = {
  args: {
    data,
    width: 800,
    height: 250,
    className: 'chart bar yellow',
  },
}

Bar3.storyName = 'Double bar';


/* !- Bar + Line to compare */

export const Bar4: Story = {
  render: () => (
    <ChartGroup
      width={800}
      height={250}
      data={data}
    >
      <ChartBar />
      <ChartLine
        xGrid={false}
        xAxis={false}
        yAxis={false}
        y2Axis={true}
      />
    </ChartGroup>
  ),
}

Bar4.storyName = 'Bar + Line to compare';
