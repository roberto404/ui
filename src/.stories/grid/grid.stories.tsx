import { Meta, StoryObj } from '@storybook/react';

require('../../../assets/style/index.scss');


/* !- Compontents */

import Grid from '../../grid/grid';
import GridRow from '../../.examples/grid/row';


/* !- Constants */

import { DATA, SETTINGS } from '../../.examples/grid/constants';


/* !- Stories */

const meta = {
  title: 'Grid/Grid',
  component: Grid,
} satisfies Meta<typeof Grid>;

export default meta;


type Story = StoryObj<typeof meta>;


/* !- Basic Grid */

export const Grid1: Story = {
  args: {
    data: DATA,
    hook: SETTINGS.hook,
    helper: SETTINGS.helper,
    className: "card grid column",
  },
}

Grid1.storyName = 'Basic';


/* !- Grid with custom Row compontent */

export const Grid2: Story = {
  args: {
    data: DATA,
    showHeader: false,
    rowElement: GridRow,
  },
}

Grid2.storyName = 'Custom Row';
