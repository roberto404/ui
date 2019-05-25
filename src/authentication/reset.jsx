
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';


/* !- Redux Actions */

import * as AuthenticationActions from './actions';


/* !- React Elements */

import Form,
{
  Input,
  Submit,
} from '../form/pure/intl';


/* !- Constants */

import { LOGIN_SCHEME, LOGIN_FIELDS } from './constants';


/**
* Reset: classic password change form component.
* If login success set user via Redux.
*/
const Reset = ({ setUser, history }) =>
(
  <Form
    id="reset"
    scheme={{
      password: LOGIN_SCHEME.password,
      password2: LOGIN_SCHEME.password2,
    }}
    fields={LOGIN_FIELDS}
    onSuccess={(response) =>
    {
      setUser(response.records);
      history.replace('/');
    }}
  >
    <Input {...LOGIN_FIELDS.password} />
    <Input {...LOGIN_FIELDS.password2} />

    <Submit
      label="reset.submit"
    />
  </Form>
);


/**
 * propTypes
 * @type {Object}
 */
Reset.propTypes =
{
  setUser: PropTypes.func.isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};


export default withRouter(connect(
  null,
  {
    setUser: AuthenticationActions.setUser,
  },
)(Reset));
