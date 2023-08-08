
import React, { Component } from 'react';
import { AppContext } from './context';
import { ReactReduxContext } from 'react-redux';
import getParam from '@1studio/utils/location/getParam';



/* !- React Elements */

import Layer from './layer';



/* !- Redux Actions */

import { setValues } from './form/actions';



/**
 * Application
 * Layout and route components.
 */
class Application extends Component
{
  getContext()
  {
    return {
      // api: this.injectedApi,
      // media: this.props.app.getMedia(),
      // register: this.props.app.register,
      // addListener: this.props.app.addListener,
      // removeListener: this.props.app.removeListener,
      // addShortcuts: this.props.app.addShortcuts,
      // activateListeners: this.props.app.activateListeners,
      // inactivateListeners: this.props.app.inactivateListeners,
      // removeShortcuts: this.props.app.removeShortcuts,
      store: this.context.store,
    };
  }

  componentDidMount()
  {
    this.transferGetPropsToFormRedux();

    // this.props.app.addShortcuts(
    //   [{
    //     keyCode: 'ALT+META+ENTER',
    //     handler: () =>
    //     {
    //       window._STORE = this.context.store;
    //       console.log(window._STORE.getState());
    //     },
    //   }],
    //   'globalStore2',
    // );
  }

  /**
   * Invoke every route changes
   */
  componentDidUpdate()
  {
    this.transferGetPropsToFormRedux();
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
        router: this.props.router,
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
      this.context.store.dispatch(setValues(
        get,
        location.pathname.replace(new RegExp('^/'), ''),
      ));
    }
  }

  render()
  {

    return (
      <AppContext.Provider value={this.getContext()}>
        <div className="application" style={{ minWidth: 1440 }}>

          {this.props.children}

          <Layer />
        </div>
      </AppContext.Provider>
    );
  }
}


Application.contextType = ReactReduxContext;

export default Application;