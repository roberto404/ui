import React from 'react';
import { Meta, StoryObj } from '@storybook/react';

require('../../../assets/style/index.scss');




/* !- Compontents */

import Layer from '../../layer/layer';
import ExampleLayerActions from '../../.examples/layer/actions';


/* !- Stories */


const meta = {
  title: 'Layer/Dialog',
  component: View,
  argTypes: {
    lazyload: {
      control: 'boolean',
    },
    className: {
      control: 'text',
    },
  },
} satisfies Meta<typeof View>;

export default meta;


type Story = StoryObj<typeof meta>;


/* !- Basic View */

export const View1: Story = () =>
(
  <View settings={{
    active: 'group1',
    groups: {
      'group1': [
        { id: 'box1', pos: 1, status: 1 },
        { id: 'box2', pos: 0, status: 1 },
      ],
      'group2': [
        { id: 'box3', pos: 1, status: 1 },
      ]
    }
  }}>
    <div
      data-view="box1"
      className="w-content bg-gray-light border p-2 m-2"
    >
      Box #1
    </div>
    <div
      data-view="box2"
      className="w-content bg-gray-light border p-2 m-2"
    >
      Box #2
    </div>
    <div
      data-view="box2"
      className="w-content bg-gray-light border p-2 m-2"
    >
      Box #3
    </div>
  </View>
);

View1.storyName = 'Basic';



/* !- View demo width actions */


export const View2 = () =>
(
  <ExampleLayerActions />
);

View2.storyName = 'Actions';