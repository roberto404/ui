import React from 'react';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import Application from '@1studio/utils/models/application';


/* !- Context (a kijelölés a redux formban, a nyilak az App shortcutjain: a Grid useAppContext-et hív) */

import { AppContext } from '../../context';
import Layer from '../../layer/layer';
import store from '../../store';

export const reduxStore = store();
const App = new Application();

const appContext = {
  store: reduxStore,
  register: App.register,
  addListener: App.addListener,
  removeListener: App.removeListener,
  addShortcuts: App.addShortcuts,
  removeShortcuts: App.removeShortcuts,
};

/**
 * Story-szótár: a NestedList / History / GridSearch injectIntl-t használ,
 * a `parameters.messages` kiegészíti (pl. `order.product.status.6`)
 */
const MESSAGES = {
  'field.status': 'Státusz',
  'field.variant': 'Változat',
  'field.preparedDateTime': 'Átadható időpont',
  'global.prev': 'Előző',
  'global.next': 'Következő',
};

/**
 * A hiányzó fordítás nem hiba (a kulcs maga jelenik meg)
 */
const onIntlError = (error: any) => {
  if (error?.code !== 'MISSING_TRANSLATION') {
    console.error(error);
  }
};

/**
 * Grid story decorator: redux store + AppContext + intl + Layer (dialog, menü, preload)
 */
const withGridContext = (Story: any, { parameters }: any = {}) => (
  <Provider store={reduxStore}>
    <AppContext.Provider value={appContext as any}>
      <IntlProvider
        locale="hu"
        messages={{ ...MESSAGES, ...(parameters?.messages || {}) }}
        onError={onIntlError}
      >
        <Story />
        <Layer />
      </IntlProvider>
    </AppContext.Provider>
  </Provider>
);

export default withGridContext;
