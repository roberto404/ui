
import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';


/* !- Redux Actions */

import { setUser } from './actions';


/* !- React Elements */

import Form,
{
  Input,
  Submit,
} from '../form/intl';


/* !- Constants */

import { LOGIN_SCHEME, LOGIN_FIELDS } from './constants';


/* !- Types */

const defaultProps =
{
  id: "reset",
}

type PropTypes = Partial<typeof defaultProps> &
{
}


/**
* Reset: classic password change form component.
* If login success set user via Redux.
*/
const Reset = ({ id }: PropTypes) =>
{
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <Form
      id={id}
      scheme={{
        password: LOGIN_SCHEME.password,
        password2: LOGIN_SCHEME.password2,
      }}
      fields={LOGIN_FIELDS}
      onSuccess={(response) =>
      {
        dispatch(setUser(response.records));
        navigate('/', { replace: true });
      }}
    >
      <Input {...LOGIN_FIELDS.password} />
      <Input {...LOGIN_FIELDS.password2} />

      <Submit
        label="reset.submit"
      />
    </Form>
  )
};

Reset.defaultProps = defaultProps;


export default Reset;
