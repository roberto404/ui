
import React from 'react';
import { render } from 'react-dom';


/* !- React Providers */

import { Provider as ReduxProvider } from 'react-redux';
import { IntlProvider } from 'react-intl';


/* !- Redux Store */

import store from '/Users/roberto/Sites/ui/src/store';


/* !- Locale */

import locale from '/Users/roberto/Sites/ui/src/locale';

locale('hu');


/* !- Application */

import App from './app'; // eslint-disable-line


/* !- Assets */

require('../../assets/style/index.scss');


render(
  <ReduxProvider store={store()}>
    <IntlProvider locale="en">
      <App />
    </IntlProvider>
  </ReduxProvider>,
  document.getElementById('Application'),
);
