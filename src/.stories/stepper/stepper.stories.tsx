import { Meta, StoryObj } from '@storybook/react';


/* !- Compontents */

import Stepper from '../../stepper/stepper';
import Step from '../../stepper/step';
import IconExample from './icon';


/* !- Types */

import { IconTypes } from '../../stepper/icon';
import { StepTypes } from '../../stepper/const';


/* !- Stories */

const meta = {
  title: 'Stepper/Stepper',
  component: Stepper,
  argTypes: {
    type: {
      control: 'inline-radio',
      options: ['default', 'numeric', 'timeline'],
    },
    // step
    width: {
      control: { type: 'number', min: 100, max: 500, step: 100 },
    },
    height: {
      control: { type: 'number', min: 10, max: 100, step: 10 },
    },
    className: {
      control: 'text',
      defaultValue: 'no-select',
    },
    classNameText: {
      control: 'text',
      defaultValue: 'text-s text-gray',
    },
    canvasPaddingX: {
      control: { type: 'number', min: 10, max: 100, step: 10 },
    },
    onClick: {
      action: 'clicked',
    }
  },
} satisfies Meta<typeof Stepper>;

export default meta;


type Story = StoryObj<typeof meta>;


/* !- Basic Stepper */

export const Stepper1: Story = {
  args: {
    data: [
      {
        label: '1',
      },
      {
        label: '2',
      },
      {
        label: '3',
      }
    ],
  },
}

Stepper1.storyName = 'Basic Stepper';


/* !- Stepper with status */

export const Stepper2: Story = {
  args: {
    data: [
      {
        label: IconTypes.START,
        status: IconTypes.START,
      },
      {
        label: IconTypes.END,
        status: IconTypes.END,
      },
      {
        label: IconTypes.COMPLETE,
        status: IconTypes.COMPLETE,
      },
      {
        label: IconTypes.WARNING,
        status: IconTypes.WARNING,
      },
      {
        label: IconTypes.ERROR,
        status: IconTypes.ERROR,
      },
    ],
    width: 400,
  },
}

Stepper2.storyName = 'Stepper with status';


/* !- Numeric Stepper with events */

export const Stepper3: Story = {
  args: {
    data: [
      {
        label: 'event',
        onClick: () => console.log(1),
      },
      {
        label: 'noEvent',
      },
    ],
    type: StepTypes.NUMERIC,
    width: 200,
    onClick: () => 1,
  },
}

Stepper3.storyName = 'Numeric stepper with events';


/* !- Stepper with custom icon */

export const Stepper4: Story = {
  args: {
    data: [
      {
        label: '1',
        status: IconTypes.END,
      },
      {
        label: '2',
        icon: IconExample,
      },
      {
        label: '3',
        status: IconTypes.ERROR,
        classNameText: 'fill-red',
      },
    ],
  },
}

Stepper4.storyName = 'Stepper with custom icon';


/* !- Stepper with tooltip */

/* !- Custom stepper with dynamic size */