import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Provider, useSelector } from 'react-redux';

require('../../../assets/style/index.scss');


/* !- Components */

import LinkedInput from '../../form/components/linkedInput';
import { factor, percentOf } from '../../form/linkedTransform';


/* !- Context (a form-mező a redux store-hoz + AppContext-hez kötődik) */

import { AppContext } from '../../context';
import store from '../../store';

const reduxStore = store();

const withContexts = (Story: any) => (
  <Provider store={reduxStore}>
    <AppContext.Provider value={{ store: reduxStore }}>
      <div style={{ padding: 24, maxWidth: 480 }}>
        <Story />
      </div>
    </AppContext.Provider>
  </Provider>
);


/* !- Redux store tartalma a mező alatt (mi kerül ténylegesen tárolásra) */

const StoreValue = ({ id }: { id: string }) => {
  const value = useSelector(({ form }: any) => form[id]);

  return (
    <div className="text-s text-gray">
      {`redux form.${id} = ${JSON.stringify(value ?? null)}`}
    </div>
  );
};

const render = (args: any) => (
  <div>
    <LinkedInput {...args} />
    <StoreValue id={args.id} />
  </div>
);


/* !- Stories */

const meta = {
  title: 'Form/LinkedInput',
  component: LinkedInput,
  decorators: [withContexts],
  render,
  argTypes: {
    store: { control: 'inline-radio', options: ['left', 'right'] },
  },
} satisfies Meta<typeof LinkedInput>;

export default meta;


type Story = StoryObj<typeof meta>;


/* !- Kedvezmény: forint ⇄ százalék egy alapárhoz (12 990 Ft) viszonyítva, a Ft kerül a store-ba */

export const Discount: Story = {
  args: {
    id: 'linked-discount',
    label: 'Kedvezmény (bruttó Ft)',
    value: 1000,
    left: { postfix: 'Ft', decimals: 0, placeholder: '0' },
    right: { postfix: '%', decimals: 1, placeholder: '0' },
    transform: percentOf(12990),
    store: 'left',
  },
};


/* !- Mértékegység: cm ⇄ col (1 col = 2,54 cm), a store-ba kerülő oldal állítható; a cm oldal szélesebb */

export const Unit: Story = {
  args: {
    id: 'linked-unit',
    label: 'Szélesség',
    value: 180,
    left: { prefix: 'cm', decimals: 1 },
    right: { prefix: 'col', decimals: 2 },
    transform: factor(1 / 2.54),
    store: 'left',
    ratio: [2, 1],
  },
};


/* !- Disabled: nem szerkeszthető, csak megjelenít */

export const Disabled: Story = {
  args: {
    ...Discount.args,
    id: 'linked-disabled',
    disabled: true,
  },
};
