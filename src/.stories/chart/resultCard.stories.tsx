import React from 'react';
import { Meta, StoryObj } from '@storybook/react';

require('../../../assets/style/index.scss');

/* !- Components */

import ResultCard from '../../chart/card/result';


/* !- Helpers */

// 12 000 000 → 12M
const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });

const Box = ({ children, width = 320 }: any) => (
  <div style={{ width, maxWidth: '100%', resize: 'horizontal', overflow: 'auto', padding: 4 }}>
    {children}
  </div>
);


/* !- Stories */

const meta = {
  title: 'Chart/Card/Result',
  component: ResultCard,
  args: {
    id: 'result',
    title: 'Eredmény',
    value: 12_000_000,
    change: 20,
    format: (value: number) => compact.format(value),
  },
  argTypes: {
    change: { control: { type: 'number', step: 1 } },
  },
  render: (args) => (
    <Box>
      <ResultCard {...args} />
    </Box>
  ),
} satisfies Meta<typeof ResultCard>;

export default meta;

type Story = StoryObj<typeof meta>;


/**
 * Positive change: green icon and pill.
 */
export const Positive: Story = {};

/**
 * Negative change: red, the arrow flipped down.
 */
export const Negative: Story = {
  args: { id: 'result/negative', value: 4_300_000, change: -12 },
};

/**
 * No change: grey, no arrow in the pill.
 */
export const Flat: Story = {
  args: { id: 'result/flat', value: 850_000, change: 0 },
};
