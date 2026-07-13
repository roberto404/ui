import React from 'react';
import { Meta, StoryObj } from '@storybook/react';

require('../../../../../assets/style/index.scss');

import StatValue from '../../../../chart/card/parts/statValue';


/* !- Helpers */

// StatValue is wrapper-relative: whatever font-size the wrapper sets becomes the base
const Wrapper = ({ children, fontSize = 16 }: any) => (
  <div style={{ fontSize, padding: 16 }}>{children}</div>
);


/* !- Stories */

const meta = {
  title: 'Chart/Card/Parts/StatValue',
  component: StatValue,
  argTypes: {
    change: { control: { type: 'number', step: 0.1 } },
    size: { control: 'inline-radio', options: ['xl', 'l', 'm', 's'] },
    align: { control: 'inline-radio', options: ['left', 'right'] },
    changePosition: { control: 'inline-radio', options: ['below', 'inline'] },
  },
} satisfies Meta<typeof StatValue>;

export default meta;

type Story = StoryObj<typeof meta>;


/**
 * Interactive — tweak value / change / size in the controls.
 */
export const Playground: Story = {
  args: {
    value: 0.7413,
    change: 0.44,
    size: 'xl',
    align: 'left',
    changePosition: 'below',
    format: (value) => value.toFixed(4),
  },
  render: (args) => <Wrapper><StatValue {...args} /></Wrapper>,
};


/**
 * The change badge: trending-up (green) when positive, the same icon flipped down
 * (red) when negative, grey with no arrow at zero.
 */
export const ChangeDirection: Story = {
  render: () => (
    <Wrapper>
      <div style={{ display: 'flex', gap: 48 }}>
        <StatValue value={12325} change={14} align="left" />
        <StatValue value={8146} change={-8} align="left" />
        <StatValue value={5000} change={0} align="left" />
      </div>
    </Wrapper>
  ),
};

ChangeDirection.storyName = 'Change direction (up / down / flat)';


/**
 * Change below the value (cards' header) vs. inline next to it (minimal card).
 */
export const Positions: Story = {
  render: () => (
    <Wrapper>
      <div style={{ display: 'flex', gap: 64 }}>
        <StatValue value={42} change={12} align="left" changePosition="below" />
        <StatValue value={42} change={12} align="left" changePosition="inline" size="l" />
      </div>
    </Wrapper>
  ),
};


/**
 * Sizes are wrapper-relative classes (zoom / text). Same markup, four sizes.
 */
export const Sizes: Story = {
  render: () => (
    <Wrapper>
      <div style={{ display: 'flex', gap: 48, alignItems: 'flex-end' }}>
        {(['xl', 'l', 'm', 's'] as const).map((size) => (
          <StatValue key={size} value={42} change={12} size={size} align="left" />
        ))}
      </div>
    </Wrapper>
  ),
};


/**
 * "The wrapper gives the size": the exact same StatValue at three wrapper
 * font-sizes — everything (value + badge + icon) scales together.
 */
export const WrapperDrivenSize: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 48, alignItems: 'flex-end' }}>
      {[16, 24, 34].map((fontSize) => (
        <Wrapper key={fontSize} fontSize={fontSize}>
          <StatValue value={0.7413} change={0.44} align="left" format={(v) => v.toFixed(4)} />
        </Wrapper>
      ))}
    </div>
  ),
};

WrapperDrivenSize.storyName = 'Wrapper-driven size';
