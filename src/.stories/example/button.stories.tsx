import React from 'react';
import { Meta, StoryObj } from '@storybook/react';


require('../../../assets/style/index.scss');


/* !- Compontents */

import Button from './button';


/* !- Stories */

const meta = {
  title: 'Example/Button',
  component: Button,
  argTypes: {
    title: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;


type Story = StoryObj<typeof meta>;


/* !- Basic Donut */

export const Button1: Story = {
  args: {
    title: 'hello',
  },
  parameters: {
    docs: {
      // story: { inline: true }, // render the story in an iframe
      // canvas: { sourceState: 'shown' }, // start with the source open
      source: { type: 'code' }, // forces the raw source code (rather than the rendered JSX).
    },
  },
}

// const buttonTSTest = <Button />

Button1.storyName = 'Basic';