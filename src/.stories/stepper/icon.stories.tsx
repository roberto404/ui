import React from 'react';
import { Meta, StoryObj } from '@storybook/react';


/* !- Compontents */

import Icon from '../../stepper/icon';

const IconSVGWrapper = (args) =>
(
  <svg>
    <Icon {...args} />
  </svg>
)


/* !- Types */

import { IconTypes } from '../../stepper/icon';


/* !- Constants */

import {
  ICON_WIDTH,
} from '../../stepper/const';



/* !- Stories */

const meta = {
  title: 'Stepper/Icon',
  component: IconSVGWrapper,
  argTypes: {
    status: {
      control: 'radio',
      options: Object.values(IconTypes),
    },
    iconWidth: {
      control: { type: 'number', min: ICON_WIDTH / 4, max: ICON_WIDTH * 4, step: ICON_WIDTH },
    },
  }
} satisfies Meta<typeof Icon>;

export default meta;


type Story = StoryObj<typeof meta>;


/* !- Basic Step */

export const Icon1: Story = {
  args: {
    status: IconTypes.ERROR
  }
}

Icon1.storyName = 'Basic Step';