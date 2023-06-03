
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';


/* !- Redux Actions */

import { setUser } from './actions';


/* !- React Elements */

import Form, { Input, Submit } from '../form/intl';


/* !- Constants */

import { LOGIN_SCHEME, LOGIN_FIELDS } from './constants';


/* !- Types */

const defaultProps =
{
  fields: LOGIN_FIELDS,
  scheme: LOGIN_SCHEME,
};

type PropTypes = Partial<typeof defaultProps> &
{
  fields: {
    email: {},
    password: {},
  },
  scheme: {
    email: {},
    password: {},
  },
  onSuccess: (response) => boolean,
}


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
const Login = ({
  scheme,
  fields,
  onSuccess,
}: PropTypes) =>
{
  const dispatch = useDispatch();

  return (
    <Form
      id="login"
      className="login"
      scheme={{
        email: scheme.email,
        password: scheme.password,
      }}
      fields={fields}
      onSuccess={(response) =>
      {
        if (typeof onSuccess === 'function')
        {
          if (onSuccess(response) === true)
          {
            return;
          }
        }
        dispatch(setUser(response.records));
      }}
    >
      <Input {...fields.email} focus />
      <Input {...fields.password} />
  
      <Submit
        label="login.submit"
      />
    </Form>
  );
}

Login.defaultProps = defaultProps;

export default Login;
