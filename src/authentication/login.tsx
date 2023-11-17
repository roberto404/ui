
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';


/* !- Redux Actions */

import { setUser } from './actions';


/* !- React Elements */

import Form, { Input, Submit } from '../form/intl';


/* !- Constants */

import { LOGIN_SCHEME, LOGIN_FIELDS } from './constants';


/* !- Types */



type PropTypes =
{
  fields: {
    email: {},
    password: {},
  },
  scheme: {
    email: {},
    password: {},
  },
  onSuccess?: (response) => boolean,
  onError?: (response) => boolean,
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
  scheme = LOGIN_SCHEME,
  fields = LOGIN_FIELDS,
  onSuccess,
  onError,
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
      onFailed={(response) =>
      {
        if (typeof onError === 'function')
        {
          onError(response);
        } 
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

export default Login;
