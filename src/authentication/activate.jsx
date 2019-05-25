
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';


/* !- Redux Actions */

import * as LayerActions from '../layer/actions';
import * as AuthenticationActions from './actions';


/**
* Activate Component.
* Automatically call API { method: 'activate', payload: [Url query string] },
* then set user via Redux and show api response on modal.
*/
const Activate = (
  {
    setUser,
    modal,
    history,
    intl,
  },
  {
    api,
  },
) =>
{
  const regex = /([^=?&]+)=([^&]+)/g;
  const payload = {};
  let m;

  while ((m = regex.exec(location.search)) !== null)
  {
    payload[m[1]] = m[2];
  }

  api({
    method: 'activate',
    payload,
  })
    .then((response) =>
    {
      if (response.records)
      {
        setUser(response.records);
      }

      modal(response.modal);
      history.replace('/');
    });

  return (
    <div>{intl.formatMessage({ id: 'activate.inprogress' })}</div>
  );
};


/**
 * propTypes
 * @type {Object}
 */
Activate.propTypes =
{
  /**
   * @private
   * Authentication Redux action
   */
  setUser: PropTypes.func.isRequired,
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
Activate.defaultProps =
{
  intl: {
    formatMessage: ({ id }) => id,
  },
};


/**
 * contextTypes
 * @type {Object}
 */
Activate.contextTypes = {
  api: PropTypes.func,
};


export default injectIntl(connect(
  (state, props) => ({
    intl: props.intl,
  }),
  {
    modal: LayerActions.modal,
    setUser: AuthenticationActions.setUser,
  },
)(Activate));
