
// 21 Kbyte
import React, { Component } from 'react';

// 127 Kbyte
import { render } from 'react-dom';

// 0 - index.jsx - app included
import PropTypes from 'prop-types';

// 19 Kbyte
import { connect, Provider as ReduxProvider } from 'react-redux';

// 67 Kbyte
import {
  withRouter,
  Switch,
  BrowserRouter as Router,
} from 'react-router-dom';

import { historyShape } from 'react-router-props';


// 47 Kbyte
import { IntlProvider, injectIntl, addLocaleData, intlShape } from 'react-intl';
import hu from 'react-intl/locale-data/hu';
import locale from '@1studio/ui/locale';

// 262 Kbyte
// import moment from 'moment';

import getParam from '@1studio/utils/location/getParam';


/* !- Redux Actions */

import { setUser } from '@1studio/ui/authentication/actions';
import { setValues } from '@1studio/ui/form/actions';


/* !- React Elements */

import Layer from '@1studio/ui/layer';
import Header from './layout/header';
import Footer from './layout/footer';


/* !- App Services */

import api from './api';
import routes from './routes';


/* !- App Compontents */

// import Header from './layout/header';
// import Login from './views/login';


/* !- Locale */

addLocaleData([...hu]);
// moment.locale('hu');
locale('hu'); // @1studio/ui moment locale


/**
 * Application
 * Layout and route components.
 */
class Application extends Component
{
  getChildContext()
  {
    return {
      api: this.injectedApi,
      media: this.props.app.getMedia(),
      register: this.props.app.register,
      config: this.props.app.getProjectConfig(),
      // addListener: this.props.app.addListener,
      // removeListener: this.props.app.removeListener,
      // addShortcuts: this.props.app.addShortcuts,
      // removeShortcuts: this.props.app.removeShortcuts,
    };
  }

  componentDidMount()
  {
    this.transferGetPropsToFormRedux();
  }

  /**
   * Invoke every route changes
   */
  componentDidUpdate()
  {
    this.transferGetPropsToFormRedux();
    this.props.setUser();
    window.scrollTo(0, 0);
  }


  /**
   * Provide Redux-Intl and Router-History to the static API
   */
  injectedApi = options =>
    this.props.api(
      options,
      {
        intl: this.props.intl,
        history: this.props.history,
      },
    );


  /**
   * Push Redux-From GET params. The url will be the Id of Form.
   * @return {[type]} [description]
   */
  transferGetPropsToFormRedux()
  {
    const get = getParam();

    if (Object.keys(get).length)
    {
      this.props.setValues(
        get,
        location.pathname.replace(new RegExp('^/'), ''),
      );
    }
  }

  render()
  {
    const {
      isLogged,
      app,
    } = this.props;

    return (
      <div className="application">

        <Header />

        { isLogged === false &&

          <Switch>
            { routes(app, this.context.store.getState().user.permission) }
          </Switch>
        }

        <Footer />

        <Layer />
      </div>
    );
  }
}

Application.propTypes = {
  isLogged: PropTypes.bool,
  app: PropTypes.object, // eslint-disable-line
  api: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  history: historyShape.isRequired,
  setValues: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired,
};

Application.defaultProps = {
  isLogged: false,
  permission: {},
};

Application.contextTypes = {
  store: PropTypes.object,
};

/**
 * childContextTypes
 * @type {Object}
 */
Application.childContextTypes = {
  api: PropTypes.func,
  media: PropTypes.string,
  register: PropTypes.object,
  config: PropTypes.object,
  // addListener: PropTypes.func,
  // removeListener: PropTypes.func,
  // addShortcuts: PropTypes.func,
  // removeShortcuts: PropTypes.func,
};


const ConnectedApplication = injectIntl(withRouter(connect(
  ({ user }) => ({
    isLogged: user.isLogged,
  }),
  {
    setUser,
    setValues,
  },
)(Application)));


/**
 * Default Application Providers: intl, redux, router
 */
export default (App) =>
{
  const config = App.getProjectConfig();

  render(
    <IntlProvider locale="hu-HU" messages={config.dictionary}>
      <ReduxProvider store={App.store}>
        <Router>
          <ConnectedApplication
            api={api}
            config={config}
            app={App}
          />
        </Router>
      </ReduxProvider>
    </IntlProvider>,
    document.getElementById('Application'),
  );
};
