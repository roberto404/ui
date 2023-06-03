
import React from 'react';
import ReactDOM from "react-dom/client";


/* !- React Providers */

import { Provider as ReduxProvider } from 'react-redux';
import { IntlProvider } from 'react-intl';


/* !- Redux Store */

import storeWrapper from '../../src/store';

const store = storeWrapper();


/* !- Locale */

import locale from '../../src/locale';

locale('hu');


/* !- Application */

import Application from '@1studio/utils/models/application';
import Example from './app'; // eslint-disable-line


/* !- Assets */

require('../../assets/style/index.scss');


// /* !- Init */

const root = ReactDOM.createRoot(document.getElementById("Application"));

new Application({
  store,
  config: {
    application: {
      id: 'example',
      password: false,
    },
  },
  actions: {
    '.*': [
      (App) =>
      {
        // const config = App.getProjectConfig();
        // 
        root.render(
          <ReduxProvider store={store}>
            <IntlProvider locale="en">
              <Example
                // config={config}
                app={App}
              />
            </IntlProvider>
          </ReduxProvider>
        );
      },
    ],
  },
});

