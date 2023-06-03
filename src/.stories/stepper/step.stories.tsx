import React from 'react';
import { Meta, StoryObj } from '@storybook/react';


/* !- Compontents */

import Step from '../../stepper/step';

const StepWrapper = (args) =>
(
  <svg>
    <Step {...args} />
  </svg>
)


/* !- Types */


/* !- Stories */

const meta = {
  title: 'Stepper/Step',
  component: StepWrapper,
} satisfies Meta<typeof Step>;

export default meta;


type Story = StoryObj<typeof meta>;


/* !- Basic Step */

export const Step1: Story = {
  args: {
    index: 1,
    isLabel: true,
    data: [],
  }
}

Step1.storyName = 'Basic Step';