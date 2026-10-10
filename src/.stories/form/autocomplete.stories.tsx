import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Provider, useSelector } from 'react-redux';
import Application from '@1studio/utils/models/application';

require('../../../assets/style/index.scss');


/* !- Components */

import Autocomplete from '../../form/components/autocomplete';
import Layer from '../../layer/layer';


/* !- Context (a mező a redux store-hoz, a menü a layerhez, a billentyűk az App shortcutjaihoz kötődnek) */

import { AppContext } from '../../context';
import store from '../../store';

const reduxStore = store();
const App = new Application();

const appContext = {
  store: reduxStore,
  register: App.register,
  addListener: App.addListener,
  removeListener: App.removeListener,
  addShortcuts: App.addShortcuts,
  removeShortcuts: App.removeShortcuts,
};

const FORM = 'story-autocomplete';

/**
 * A mező store-beli értéke a mező alatt
 */
const StoreValue = ({ id }: { id: string }) => {
  const value = useSelector(({ form }: any) => (form[FORM] || {})[id]);

  return (
    <pre className="mt-2 p-1 text-xs bg-white-dark rounded">
      {`form.${FORM}.${id} = ${JSON.stringify(value, null, 2)}`}
    </pre>
  );
};

const withContexts = (Story: any, { args }: any) => (
  <Provider store={reduxStore}>
    <AppContext.Provider value={appContext as any}>
      <div className="p-3" style={{ maxWidth: 480 }}>
        <Story />
        <StoreValue id={args.id} />
      </div>
      <Layer />
    </AppContext.Provider>
  </Provider>
);


/* !- Demo data */

export const COLORS = [
  { id: 1, title: 'Antracit' },
  { id: 2, title: 'Bézs' },
  { id: 3, title: 'Fehér' },
  { id: 4, title: 'Fekete' },
  { id: 5, title: 'Homok' },
  { id: 6, title: 'Kék' },
  { id: 7, title: 'Mustár' },
  { id: 8, title: 'Piros' },
  { id: 9, title: 'Szürke' },
  { id: 10, title: 'Zöld' },
];


/* !- Stories */

const meta = {
  title: 'Form/Autocomplete',
  component: Autocomplete,
  decorators: [withContexts],
  args: {
    form: FORM,
    label: 'Szín',
    placeholder: 'Kezdj el gépelni…',
    data: COLORS,
  },
} satisfies Meta<typeof Autocomplete>;

export default meta;


type Story = StoryObj<typeof meta>;


/* !- Alap: egy érték, ajánlatból vagy szabadon gépelve */

export const Default: Story = {
  args: {
    id: 'color',
  },
};

Default.storyName = 'Alap';


/* !- Előre kitöltött érték */

export const WithValue: Story = {
  args: {
    id: 'color-value',
    value: 'Szürke',
  },
};

WithValue.storyName = 'Kitöltve';


/* !- Ajánlat nélkül: sima szöveges mező, nincs lenyíló nyíl */

export const NoData: Story = {
  args: {
    id: 'color-nodata',
    data: [],
  },
};

NoData.storyName = 'Ajánlat nélkül';


/* !- Halvány javaslat a mezőben, menü nélkül */

export const InlineSuggestion: Story = {
  args: {
    id: 'color-inline',
    inlineSuggestion: true,
    suggestionMenu: false,
    autoFocus: true,
  },
};

InlineSuggestion.storyName = 'Halvány javaslat (menü nélkül)';


/* !- Halvány javaslat + menü */

export const InlineSuggestionWithMenu: Story = {
  args: {
    id: 'color-inline-menu',
    inlineSuggestion: true,
  },
};

InlineSuggestionWithMenu.storyName = 'Halvány javaslat + menü';


/* !- Nagy, keret nélküli kereső (dashboard) */

export const InlineSuggestionLarge: Story = {
  args: {
    id: 'color-inline-large',
    label: undefined,
    className: 'border-none transparent text-xl',
    inlineSuggestion: true,
    suggestionMenu: false,
  },
};

InlineSuggestionLarge.storyName = 'Halvány javaslat (nagy kereső)';
