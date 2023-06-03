import React from 'react';
import { Meta, StoryObj } from '@storybook/react';


/* !- Compontents */

import GithubChart from '../../chart/github';


/* !- Constants */

const dataByWeeks = [
  { value: 12 }, // 1 week
  { value: 15 }, // 2 week
  { value: 6 }, // ...
  { value: 42 },
  { value: 112 },
  { value: 12 },
];

const Popover = ({ record }) => <div>{record.value}</div>;



/* !- Stories */

const DonutWrapper = (args) =>
  <div style={{ width: 200 }}><Donut {...args} /></div>


const meta = {
  title: 'Chart/GithubChart',
  component: GithubChart,
  // argTypes: {
  // },
} satisfies Meta<typeof GithubChart1>;

export default meta;


type Story = StoryObj<typeof meta>;


/* !- Basic GithubChart */

export const GithubChart1: Story = {
  args: {
    data: dataByWeeks,
    Popover,
  },
}

GithubChart1.storyName = 'Basic';
