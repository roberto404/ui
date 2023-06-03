
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useAppContext } from '../context';


/* !- Redux Actions */

import { setValues} from '../form/actions';


/* !- React Elements */

import Form,
{
  Input,
  Submit,
} from '../form/intl';


/* !- Constants */

import { LOGIN_SCHEME, LOGIN_FIELDS } from './constants';
const ID = 'reminder';


/**
* Reminder: classic password reminder form component.
* If the user set login email, this form inherit that.
*/
const Reminder = () =>
{
  const dispatch = useDispatch();
  const { store } = useAppContext();

  const form = store.getState().form || {};

  // componentDidMount
  useEffect(
    () =>
    {
      // componentDidMount
      if (
        typeof form[ID]?.email === 'undefined'
        && form.login?.email
      )
      {
        dispatch(setValues(
          {
            email: form.login.email,
          },
          ID,
        ));
      }
    },
    [],
  );

  return (
    <Form
      id={ID}
      scheme={{
        email: LOGIN_SCHEME.email,
      }}
      fields={LOGIN_FIELDS}
    >
      <Input {...LOGIN_FIELDS.email} />

      <Submit
        label="reminder.submit"
      />
    </Form>
  );
}

export default Reminder;
