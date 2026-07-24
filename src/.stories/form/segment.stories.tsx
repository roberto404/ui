import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';

require('../../../assets/style/index.scss');


/* !- Components */

import Segment from '../../form/components/segment';


/* !- Context (a form-mező a redux store-hoz + AppContext-hez kötődik) */

import { AppContext } from '../../context';
import store from '../../store';

const reduxStore = store();

const withContexts = (Story: any) => (
  <Provider store={reduxStore}>
    <AppContext.Provider value={{ store: reduxStore }}>
      <div style={{ padding: 24 }}>
        <Story />
      </div>
    </AppContext.Provider>
  </Provider>
);


/* !- Stories */

const meta = {
  title: 'Form/Segment',
  component: Segment,
  decorators: [withContexts],
} satisfies Meta<typeof Segment>;

export default meta;


type Story = StoryObj<typeof meta>;


/* !- Chart | CSV (alap; az első az alapértelmezett) */

export const ChartCsv: Story = {
  args: {
    id: 'segment-output',
    dataTranslate: false,
    data: [
      { id: 'chart', title: 'Chart' },
      { id: 'csv', title: 'CSV' },
    ],
  },
};

ChartCsv.storyName = 'Chart | CSV';


/* !- Három opció */

export const Three: Story = {
  args: {
    id: 'segment-size',
    dataTranslate: false,
    data: [
      { id: 's', title: 'Kicsi' },
      { id: 'm', title: 'Közepes' },
      { id: 'l', title: 'Nagy' },
    ],
  },
};

Three.storyName = 'Három opció';
