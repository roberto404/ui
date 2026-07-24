import React from 'react';
import { Meta, StoryObj } from '@storybook/react';

require('../../../assets/style/index.scss');


/* !- Compontents */

import BoxPlot from '../../chart/boxPlot';



/* !- Stories */

const meta = {
  title: 'Chart/BoxPlot',
  component: BoxPlot,
  argTypes: {
    min: { control: { type: 'number' } },
    qMin: { control: { type: 'number' } },
    Q1: { control: { type: 'number' } },
    Q2: { control: { type: 'number' } },
    Q3: { control: { type: 'number' } },
    qMax: { control: { type: 'number' } },
    max: { control: { type: 'number' } },
  },
} satisfies Meta<typeof BoxPlot>;

export default meta;


type Story = StoryObj<typeof meta>;


/* !- Basic BoxPlot */

export const BoxPlot1: Story = {
  args: {
    min: 40000,
    qMin: 10000,
    Q1: 50000,
    Q2: 110000,
    Q3: 230000,
    qMax: 500000,
    max: 800000,
    mode: [100500, 190000],
    height: 80,
    width: 500,
  },
}

BoxPlot1.storyName = 'Basic';
