import React from 'react';
import { Meta, StoryObj } from '@storybook/react';

require('../../../assets/style/index.scss');


/* !- Compontents */

import Gauge from '../../chart/gauge';



/* !- Stories */

const GaugeWrapper = ({ width = 520, ...args }) =>
  <div className="p-4" style={{ width, background: args.background }}>
    <Gauge {...args} />
  </div>


const meta = {
  title: 'Chart/Gauge',
  component: GaugeWrapper,
  argTypes: {
    value: { control: { type: 'range', min: -150, max: 150, step: 1 } },
    background: { control: 'color' },
    origin: { control: { type: 'number', step: 10 } },
    ticks: { control: { type: 'number', min: 11, max: 101, step: 2 } },
    color: { control: 'color' },
    needleColor: { control: 'color' },
    trackColor: { control: 'color' },
    targetColor: { control: 'color' },
    width: { control: { type: 'number', min: 200, max: 1200, step: 20 } },
  },
} satisfies Meta<typeof GaugeWrapper>;

export default meta;


type Story = StoryObj<typeof meta>;


/* !- Basic: a design minta (idei átlag, múlt hó, cél) */

export const Basic: Story = {
  args: {
    value: 34,
    markers: [
      { label: 'Idei átlag', value: 12 },
      { label: 'Múlt hó', value: 21 },
    ],
    target: { label: 'Cél', value: 50 },
    caption: '16 ponttal a cél alatt',
    responsive: true,
  },
}


/* !- Negative: a mutató az origótól balra */

export const Negative: Story = {
  args: {
    value: -42,
    markers: [
      { label: 'Idei átlag', value: 12 },
      { label: 'Múlt hó', value: -8 },
    ],
    caption: '34 ponttal a múlt hó alatt',
    responsive: true,
  },
}


/* !- Dark: sötét háttér (a színek a háttérből számolódnak), kompakt (érték nélküli) jelölők */

export const Dark: Story = {
  args: {
    background: '#121418',
    value: 34,
    markers: [
      { label: 'Átlag', value: 12 },
      { label: 'Múlt hó', value: 21 },
    ],
    target: { label: 'Cél', value: 50 },
    markerValues: false,
    caption: '16 ponttal a cél alatt',
    responsive: true,
  },
}


/* !- Percent: 0 – 100 skála, az origó a skála eleje */

export const Percent: Story = {
  args: {
    value: 72,
    min: 0,
    max: 100,
    origin: 0,
    ticks: 41,
    markers: [{ label: 'Átlag', value: 58 }],
    target: { label: 'Cél', value: 80 },
    valueFormat: (value) => `${Math.round(value)}%`,
    responsive: true,
  },
}
