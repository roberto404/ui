import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';

require('../../../assets/style/index.scss');

/* !- Components */

import Calculator from '../../calculator';
import useCalculator from '../../calculator/useCalculator';
import Layer from '../../layer';

/* !- Context */

import { AppContext } from '../../context';
import store from '../../store';

const reduxStore = store();

// a Layer az app billentyűparancsait használja (Esc a bezáráshoz)
const appContext = {
  store: reduxStore,
  addShortcuts: () => {},
  removeShortcuts: () => {},
};

const withContexts = (Story: any) => (
  <Provider store={reduxStore}>
    <AppContext.Provider value={appContext as any}>
      <div style={{ padding: 24 }}>
        <Story />
      </div>
      <Layer />
    </AppContext.Provider>
  </Provider>
);

const Badge = () => (
  <span className="flex h-center v-center w-2 h-2 circle bg-blue-dark text-white text-xs bold">K</span>
);

/* !- Stories */

const meta = {
  title: 'Form/Calculator',
  component: Calculator,
  decorators: [withContexts],
  args: {
    value: 1000,
    unit: 'mm',
    title: 'Kék méret',
    onSubmit: (value: number) => console.log('Calculator', value),
  },
} satisfies Meta<typeof Calculator>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Alapműveletek (× ÷ elsőbbséggel), előjel, tizedesvessző. A kezdőérték
 * kijelölve: gépelve vagy számgombbal felülíródik; Enter / pipa kiértékel.
 */
export const Default: Story = {
  args: {
    badge: <Badge />,
  },
};

/**
 * A méret a szülő betűméretét követi (em): itt 80%.
 */
export const Small: Story = {
  args: {
    badge: <Badge />,
  },
  render: (args) => (
    <div style={{ fontSize: '80%' }}>
      <Calculator {...args} />
    </div>
  ),
};

export const WithoutTitle: Story = {
  args: {
    title: undefined,
  },
};

/**
 * `useCalculator()`: a ui layer popoverében nyílik a kattintott elem mellett.
 * A `className` opció a rétegre kerül (pl. kisebb betűméret).
 */
export const Popover: Story = {
  render: (args) => {
    const openCalculator = useCalculator();
    const [value, setValue] = useState(args.value || 0);

    return (
      <div className="flex h-center gap-1" style={{ paddingTop: 480 }}>
        <span>Szélesség:</span>
        <button
          type="button"
          className="button outline"
          onClick={(event) =>
            openCalculator(event, { ...args, badge: <Badge />, value, onSubmit: setValue })
          }
        >
          {`${value} mm`}
        </button>
      </div>
    );
  },
};
