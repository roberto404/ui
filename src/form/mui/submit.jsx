import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';


/* !- Constants */

import { FORM_ERRORS_KEY } from '../../form/constants';


/* !- React Elements */

import MuiRaisedButton from 'material-ui/RaisedButton';
import MuiIconButton from 'material-ui/IconButton';


/**
* Submit Component
*
* @example
*/
const Submit = (props, context) =>
{
  const id = props.id || context.form;
  const api = props.api || context.api;

  if (!id && !props.onClick)
  {
    throw new Error('Id not defined');
  }

  if (!api && !props.onClick)
  {
    throw new Error('Api not defined.');
  }

  const onClickButtonHandler = (event) =>
  {
    event.preventDefault();

    const onClick = props.onClick || context.onClick;

    if (onClick)
    {
      const stopEvent = onClick(event);

      if (stopEvent)
      {
        return;
      }
    }

    const onStart = props.onStart || context.onStart;
    const onFinish = props.onFinish || context.onFinish;
    const onError = props.onError || context.onError;

    // start
    //
    onStart();

    const form = context.store.getState().form || {};
    let errors = {};

    if (form[id] && form[id][FORM_ERRORS_KEY])
    {
      errors = form[id][FORM_ERRORS_KEY];
    }

    if (isEmpty(errors))
    {
      api({
        method: props.method || id,
        payload: form[id],
      })
        .then((response) =>
        {
          onFinish(response);
        });
    }
    else
    {
      onError(errors);
    }
  }

  const label = (typeof props.label === 'string') ?
    props.intl.formatMessage({ id: props.label }) : props.label;

  if (props.iconButton)
  {
    return (
      <MuiIconButton
        label={label}
        onClick={onClickButtonHandler}
      >
        {props.icon}
      </MuiIconButton>
    )
  }

  return (
    <MuiRaisedButton
      label={label}
      onClick={onClickButtonHandler}
      primary
    />
  );
};


/**
 * propTypes
 * @override
 * @type {Object}
 */
Submit.propTypes =
{
  id: PropTypes.string,
  api: PropTypes.func,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }),
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  classes: PropTypes.string,
  /**
   * Api method name, default: id
   */
  method: PropTypes.string,
};

/**
 * defaultProps
 * @override
 * @type {Object}
 */
Submit.defaultProps =
{
  label: 'global.submit',
  classes: 'primary',
  intl: {
    formatMessage: ({ id }) => id,
  },
};

/**
 * contextTypes
 * @type {Object}
 */
Submit.contextTypes = {
  api: PropTypes.func,
  form: PropTypes.string,
  store: PropTypes.object,
  onStart: PropTypes.func,
  onFinish: PropTypes.func,
  onError: PropTypes.func,
};

export default Submit;
