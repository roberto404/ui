import React from 'react';
import { Meta, StoryObj } from '@storybook/react';


/* !- Compontents */

import Pie from '../../chart/pie';



/* !- Stories */

const PieWrapper = (args) =>
  <div style={{ width: 200 }}><Pie {...args} /></div>


const meta = {
  title: 'Chart/Pie',
  component: PieWrapper,
  argTypes: {
    strokeColor: {
      control: 'inline-radio',
      options: ['lightslategray', 'aquamarine', 'teal'],
    },
    strokeWidth: {
      control: { type: 'number', min: 0, max: 10, step: 0.5 },
    },
  },
} satisfies Meta<typeof Pie>;

export default meta;


type Story = StoryObj<typeof meta>;


/* !- Basic Pie */

export const Pie1: Story = {
  args: {
    data: [
      {
        id: '1',
        percent: 25,
        color: 'lightslategray',
      },
    ],
    strokeWidth: 0.5,
    strokeColor: 'lightslategray'
  },
}

Pie1.storyName = 'Basic';


/* !- Full Pie */

export const Pie2: Story = {
  args: {
    data: [
      {
        id: 'a',
        percent: 20,
        color: 'red',
        // title: 'todo', // @todo
      },
      {
        id: 'b',
        percent: 80,
        color: 'blue',
        // title: 'bar',
      },
    ],
  },
}

Pie2.storyName = 'Full pie';


/* !- Minimal Pie */

export const Pie3: Story = {
  args: {
    data: [
      { percent: 20 }, { percent: 10 }, { percent: 40 }, { percent: 10 }
    ],
  },
}

Pie3.storyName = 'Minimal data';

