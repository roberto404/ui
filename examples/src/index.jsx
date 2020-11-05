
import React from 'react';
import { render } from 'react-dom';


/* !- React Providers */

import { Provider as ReduxProvider } from 'react-redux';
import { IntlProvider } from 'react-intl';


/* !- Redux Store */

import store from '../../src/store';


/* !- Locale */

import locale from '../../src/locale';

locale('hu');


/* !- Application */

import Application from '@1studio/utils/models/application';
import Example from './app'; // eslint-disable-line


/* !- Assets */

require('../../assets/style/index.scss');


/* !- Init */

new Application({
  store: store(),
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
        render(
          <ReduxProvider store={store()}>
            <IntlProvider locale="en">
              <Example
                // config={config}
                app={App}
              />
            </IntlProvider>
          </ReduxProvider>,
          document.getElementById('Application'),
        );
      },
    ],
  },
});
