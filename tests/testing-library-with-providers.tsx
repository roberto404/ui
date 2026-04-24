
import { render as rtlRender } from '@testing-library/react';


/* !- React Providers */

import { ReactReduxContext, Provider as ReduxProvider } from 'react-redux';
import { IntlProvider } from 'react-intl';


/* !- Redux Store */

import storeWrapper from '@1studio/ui/store';
const store = storeWrapper();

/* !- Application */

import Application from '@1studio/utils/models/application';
import { useContext } from 'react';
import AppContext from '../src/context';
import Layer from '../src/layer';



const App = ({ children }) =>
{
  const { store } = useContext(ReactReduxContext);

  const app = new Application({
    store,
    config: {
      application: {
        id: 'example',
        password: false,
      },
    },
  });
  

  const context = {
    register: app.register,
    config: app.getProjectConfig(),
    addListener: app.addListener,
    removeListener: app.removeListener,
    addShortcuts: app.addShortcuts,
    removeShortcuts: app.removeShortcuts,
    store,
  };

  return (
    <div className="application">
      <AppContext.Provider value={context}>
        { children }
        <Layer />
      </AppContext.Provider>
    </div>
  );
};


function render(ui, { ...renderOptions } = {}) {
  function Wrapper({ children }) {
    return (
      <ReduxProvider store={store}>
        <IntlProvider locale="en">
          <App>{children}</App>
        </IntlProvider>
      </ReduxProvider>
    );
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// re-export everything
export * from '@testing-library/react';

// override render method
export { render, store };
