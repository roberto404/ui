import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Provider, useSelector } from 'react-redux';
import Application from '@1studio/utils/models/application';
import { parseTemplate, stringifyTemplate } from '@1studio/utils/string/templateTokens';

require('../../../assets/style/index.scss');


/* !- Components */

import Autocomplete from '../../form/components/autocomplete';
import Layer from '../../layer/layer';


/* !- Context (a mező a redux store-hoz, a menü a layerhez, a billentyűk az App shortcutjaihoz kötődnek) */

import { AppContext } from '../../context';
import store from '../../store';
import { setValues } from '../../form/actions';

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

const FORM = 'story-autocomplete-multiple';

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
      <div className="p-3" style={{ maxWidth: 640 }}>
        <Story />
        <StoreValue id={args.id} />
      </div>
      <Layer />
    </AppContext.Provider>
  </Provider>
);


/* !- Demo data */

const COLORS = [
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

// kategória-sablon változók (views/category: template_title / template_subtitle)
const TEMPLATE_VARIABLES = [
  { id: '{features/1}', title: 'Alapanyag' },
  { id: '{features/10}', title: 'Szín' },
  { id: '{features/54}', title: 'Belső szerkezet' },
  { id: '{dimension/w}', title: 'Szélesség' },
  { id: '{dimension/d}', title: 'Mélység' },
  { id: '{category}', title: 'Kategória' },
];


/* !- Stories */

const meta = {
  title: 'Form/Autocomplete multiple',
  component: Autocomplete,
  decorators: [withContexts],
  args: {
    form: FORM,
    multiple: true,
    placeholder: 'Kezdj el gépelni…',
  },
} satisfies Meta<typeof Autocomplete>;

export default meta;


type Story = StoryObj<typeof meta>;


/* !- Több tag: ajánlatból választva, vagy gépelve + Enter / ';' */

export const Default: Story = {
  args: {
    id: 'colors',
    label: 'Színek',
    data: COLORS,
  },
};

Default.storyName = 'Tagek';


/* !- Előre kitöltött tagek */

export const WithValue: Story = {
  args: {
    id: 'colors-value',
    label: 'Színek',
    data: COLORS,
    value: [{ id: 4, title: 'Fekete' }, { id: 9, title: 'Szürke' }, ''],
  },
};

WithValue.storyName = 'Kitöltve';


/* !- Szabad szöveg a tagek között; a store-ban sablon-string */

// a sablon-string a store-ba kerül (mint egy betöltött rekordnál), nem `value` propba:
// freeText + stateFormat mellett a `value` propos kezdőérték megduplázódik a store-ban
reduxStore.dispatch(
  setValues({ template_subtitle: '{features/1}, {features/54}, {dimension/w} cm' }, FORM)
);

export const FreeTextTemplate: Story = {
  args: {
    id: 'template_subtitle',
    label: 'Alcím sablon',
    data: TEMPLATE_VARIABLES,
    freeText: true,
    stateFormat: (value: string) => parseTemplate(value, TEMPLATE_VARIABLES),
    format: stringifyTemplate,
  },
};

FreeTextTemplate.storyName = 'Szabad szöveg (sablon)';
