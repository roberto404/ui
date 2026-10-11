import React from 'react';
import { Meta, StoryObj } from '@storybook/react';


/* !- Compontents */

import Donut from '../../chart/donut';



/* !- Stories */

const DonutWrapper = (args) =>
  <div style={{ width: 200 }}><Donut {...args} /></div>


const meta = {
  title: 'Chart/Donut',
  component: DonutWrapper,
  argTypes: {
    color: {
      control: { type: 'color', presetColors: ['red', 'green'] },
    },
    percent: {
      control: { type: 'number', min: 0, max: 100, step: 10 },
    },
    strokeWidth: {
      control: { type: 'number', min: 1, max: 10, step: 1 },
    },
    rounded: {
      control: 'boolean',
    },
    caption: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Donut>;

export default meta;


type Story = StoryObj<typeof meta>;


/* !- Basic Donut */

export const Donut1: Story = {
  args: {
    percent: 25,
    color: '#009988',
    caption: 'hello world',
  },
}

Donut1.storyName = 'Basic';



/* !- Rounded: lekerekített ív-végek */

export const Rounded: Story = {
  args: {
    percent: 68,
    color: '#186eff',
    ringColor: '#edf0f5',
    strokeWidth: 4,
    rounded: true,
  },
}

Rounded.storyName = 'Rounded';
