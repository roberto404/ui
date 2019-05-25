
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


/* !- Redux Actions */

import * as AuthenticationActions from './actions';


/* !- React Elements */

import Form, {
  Input,
  Submit,
} from '../form/pure/intl';


/* !- Constants */

import { LOGIN_SCHEME, LOGIN_FIELDS } from './constants';


/**
* Login: classic login form component: email, password input + submit.
* Use Contex Api (see: submit component)
* + if Api reponse success, then set user via Redux.
*
* @example
* // api
*
* const API = ({ method }) =>
* {
*   if (method === 'login')
*   {
*     return request
*       .post(`${API_URL}user/login`)
*       .type('form')
*       .send(payload)
*       .then(response => response.body)
*       .catch(parser);
*   }
* }
*
* <Login />
*/
const Login = ({ scheme, fields, setUser }) =>
(
  <Form
    id="login"
    class="login"
    scheme={{
      email: scheme.email,
      password: scheme.password,
    }}
    fields={fields}
    onSuccess={response => setUser(response.records)}
  >
    <Input {...fields.email} focus />
    <Input {...fields.password} />

    <Submit
      label="login.submit"
    />
  </Form>
);


/**
 * propTypes
 * @type {Object}
 */
Login.propTypes =
{
  fields: PropTypes.shape({
    email: PropTypes.object.isRequired,
    password: PropTypes.object.isRequired,
  }),
  scheme: PropTypes.shape({
    email: PropTypes.object.isRequired,
    password: PropTypes.object.isRequired,
  }),
  setUser: PropTypes.func.isRequired,
};

/**
 * defaultProps
 * @type {Object}
 */
Login.defaultProps =
{
  fields: LOGIN_FIELDS,
  scheme: LOGIN_SCHEME,
};


export default connect(
  null,
  {
    setUser: AuthenticationActions.setUser,
  },
)(Login);
