
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


/* !- Redux Actions */

import * as FormActions from '../form/actions';


/* !- React Elements */

import Form,
{
  Input,
  Submit,
} from '../form/pure/intl';


/* !- Constants */

import { LOGIN_SCHEME, LOGIN_FIELDS } from './constants';


/**
* Reminder: classic password reminder form component.
* If the user set login email, this form inherit that.
*/
class Reminder extends Component
{
  componentDidMount()
  {
    const form = this.context.store.getState().form;

    if (
      (!form.reminder || !form.reminder.email) &&
      (form.login && form.login.email)
    )
    {
      this.props.setValues(
        {
          email: form.login.email,
        },
        'reminder',
      );
    }
  }

  render()
  {
    return (
      <Form
        id="reminder"
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
}


/**
 * propTypes
 * @type {Object}
 */
Reminder.propTypes =
{
  setValues: PropTypes.func.isRequired,
};

/**
 * contextTypes
 * @type {Object}
 */
Reminder.contextTypes = {
  store: PropTypes.object,
};


export default connect(
  null,
  {
    setValues: FormActions.setValues,
  },
)(Reminder);
