
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';


/* !- Redux Actions */

import * as LayerActions from '../layer/actions';
import * as AuthenticationActions from './actions';


/**
* Logout Component.
* Automatically call logout API and notice Redux. Finally redirect to home.
*/
const Logout = (
  {
    className,
    logout,
    modal,
    preload,
    close,
    history,
    intl,
  },
  {
    api,
  },
) =>
{
  api('logout')
    .then((response) =>
    {
      logout();

      if (response.modal)
      {
        modal(response.modal);
      }
      else
      {
        close();
      }

      history.replace('/');
    });

  preload();

  return (
    <div className={className}>{intl.formatMessage({ id: 'logout.inprogress' })}</div>
  );
};


/**
 * propTypes
 * @type {Object}
 */
Logout.propTypes =
{
  /**
   * @private
   * Authentication Redux action
   */
  className: PropTypes.string,
  /**
   * @private
   * Authentication Redux action
   */
  logout: PropTypes.func.isRequired,
  /**
   * @private
   * Layer Redux action
   */
  modal: PropTypes.func.isRequired,
  /**
   * @private
   * Injected React Router
   */
  history: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
  /**
   * @private
   * Injected React-intl
   */
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }),
};

/**
 * defaultProps
 * @type {Object}
 */
Logout.defaultProps =
{
  className: '',
  intl: {
    formatMessage: ({ id }) => id,
  },
};


/**
 * contextTypes
 * @type {Object}
 */
Logout.contextTypes = {
  api: PropTypes.func,
};


export default withRouter(injectIntl(connect(
  (state, props) => ({
    intl: props.intl,
  }),
  {
    modal: LayerActions.modal,
    close: LayerActions.modal,
    preload: LayerActions.preload,
    logout: AuthenticationActions.logout,
  },
)(Logout)));
