import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';

require('../../../assets/style/index.scss');


/* !- Components */

import Toggle from '../../form/components/toggle';


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
  title: 'Form/Toggle',
  component: Toggle,
  decorators: [withContexts],
} satisfies Meta<typeof Toggle>;

export default meta;


type Story = StoryObj<typeof meta>;


/* !- Alap: kattintásra vált */

export const Default: Story = {
  args: {
    id: 'toggle-default',
    label: 'Weben megjelenik',
    value: 1,
  },
};


/* !- Disabled: nem kattintható (pl. jogosultság nélkül), halványan látszik az értéke */

export const Disabled: Story = {
  args: {
    id: 'toggle-disabled',
    label: 'VIP',
    value: 1,
    disabled: true,
  },
};
