
import React from 'react';
import { render } from 'react-dom';


/* !- React Providers */

import { Provider as ReduxProvider } from 'react-redux';
import { IntlProvider } from 'react-intl';


/* !- React Elements */

import Layer from '@1studio/ui/layer';


/* !- Redux Store */

import store from '@1studio/ui/store';


/* !- Example: Grid */

import Example from './grid/static';
// import Example from './grid/connect';
// import Example from './grid/dynamic';
// import Example from './grid/filters';
// import Example from './grid/extra';
// import Example from './grid/complex';


/* !- Assets */

require('@1studio/ui/assets/style/index.scss');


render(
  <ReduxProvider store={store()}>
    <IntlProvider locale="en">
      <div>
        <Example />
        <Layer />
      </div>
    </IntlProvider>
  </ReduxProvider>,
  document.getElementById('Application'),
);
