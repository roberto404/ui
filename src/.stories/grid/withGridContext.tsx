import React from 'react';
import { Provider } from 'react-redux';
import Application from '@1studio/utils/models/application';


/* !- Context (a kijelölés a redux formban, a nyilak az App shortcutjain: a Grid useAppContext-et hív) */

import { AppContext } from '../../context';
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
 * Grid story decorator: redux store + AppContext
 */
const withGridContext = (Story: any) => (
  <Provider store={reduxStore}>
    <AppContext.Provider value={appContext as any}>
      <Story />
    </AppContext.Provider>
  </Provider>
);

export default withGridContext;
