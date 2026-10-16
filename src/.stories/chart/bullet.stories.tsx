import React from 'react';
import { Meta, StoryObj } from '@storybook/react';

require('../../../assets/style/index.scss');


/* !- Compontents */

import Bullet from '../../chart/bullet';



/* !- Stories */

const BulletWrapper = ({ width = 480, ...args }) =>
  <div className="p-4" style={{ width }}><Bullet {...args} /></div>


const meta = {
  title: 'Chart/Bullet',
  component: BulletWrapper,
  argTypes: {
    color: { control: 'color' },
    activeColor: { control: 'color' },
    trackColor: { control: 'color' },
    targetColor: { control: 'color' },
    dotBorder: { control: { type: 'number', min: 0, max: 8, step: 1 } },
    dotBorderColor: { control: 'color' },
    max: { control: { type: 'number', min: 1, max: 200, step: 5 } },
    axisSteps: { control: { type: 'number', min: 1, max: 10, step: 1 } },
    width: { control: { type: 'number', min: 200, max: 1200, step: 20 } },
  },
} satisfies Meta<typeof BulletWrapper>;

export default meta;


type Story = StoryObj<typeof meta>;


/* !- Basic: a design minta (kampány vs. előző vs. átlag, cél-vonal) */

export const Basic: Story = {
  args: {
    rows: [
      { label: 'Ez a kampány', value: 20, active: true },
      { label: 'Előző kampány', value: 14 },
      { label: '12 havi átlag', value: 15 },
    ],
    target: { value: 25 },
    max: 30,
    valueFormat: (value) => `${value} %`,
    responsive: true,
  },
}



/* !- Auto axis: max nélkül a tengely az integerAxis-ból jön */

export const AutoAxis: Story = {
  args: {
    rows: [
      { label: 'Beváltás', value: 342, active: true },
      { label: 'Előző hónap', value: 287 },
      { label: 'Tavaly', value: 198, color: '#d57f3d' },
    ],
    target: { value: 400, label: 'terv' },
    axisSteps: 4,
    valueFormat: (value) => `${value.toLocaleString('hu-HU')} db`,
    responsive: true,
  },
}

AutoAxis.storyName = 'Auto axis';
