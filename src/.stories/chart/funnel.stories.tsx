import React from 'react';
import { Meta, StoryObj } from '@storybook/react';

require('../../../assets/style/index.scss');


/* !- Compontents */

import ChartFunnel, { IFunnelStep } from '../../chart/funnel';


/* !- Constants */

const numberFormat = new Intl.NumberFormat('hu-HU');


/* !- Stories */

const meta = {
  title: 'Chart/Funnel',
  component: ChartFunnel,
  argTypes: {
    connectorColor: { control: 'color' },
    connectorGap: { control: { type: 'number', min: 0, max: 20, step: 1 } },
  },
} satisfies Meta<typeof ChartFunnel>;

export default meta;


type Story = StoryObj<typeof meta>;


/* !- Coupon: registered -> redeemed
   ------------------------------------------------------------------
   Bar width is proportional to the value; the wide bar prints its label and
   value inside, the narrow one beside it. The connector shows the drop-off. */

export const Coupon: Story = {
  args: {
    data: [
      { label: 'Regisztrált', value: 100, color: '#2f5ca8' },
      { label: 'beváltott', value: 20, color: '#d4803c' },
    ],
    valueFormat: (value: number) => numberFormat.format(value),
    dropFormat: (prev: IFunnelStep, next: IFunnelStep) =>
      `−${numberFormat.format(prev.value - next.value)} fő lemorzsolódás`,
  },
};

Coupon.storyName = 'Coupon (registered → redeemed)';


/* !- Multi-step */

export const MultiStep: Story = {
  args: {
    data: [
      { label: 'Látogató', value: 1200 },
      { label: 'Regisztrált', value: 640 },
      { label: 'Kosárba tett', value: 310 },
      { label: 'Vásárolt', value: 85 },
    ],
    valueFormat: (value: number) => numberFormat.format(value),
    dropFormat: (prev: IFunnelStep, next: IFunnelStep) =>
      `−${Math.round((1 - (next.value / prev.value)) * 100)}%`,
    barHeight: 56,
    height: 520,
  },
};

MultiStep.storyName = 'Multi-step';
