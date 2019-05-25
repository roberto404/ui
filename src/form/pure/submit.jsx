import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import reduce from 'lodash/reduce';


/* !- Constants */

import { FORM_ERRORS_KEY } from '../../form/constants';


/**
* Submit From Component.
* - call Api (via context or props) with this object { method: formId, payload: ReduxFrom }
* - you can overwrite this method with onClick
* - or you can subscribe Api method (default use <Form> methods):
*   - onStart (before the process),
*   - onError (form scheme validation error),
*   - onFinish (when api return width response)
*
* @example
* <Form id="user">
*   <Submit />
* </Form>
* // -> global.submit
*
* // unique click handler
* <Submit label="submit" onClick={} />
*
* // width react-intl
* <Submit label="button.submit" />
*
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
        payload: reduce(
          form[id],
          (results, item, index) => index.indexOf('_') === 0 ? results : { ...results, [index]: item },
          {},
        ),
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

  return (
    <div className={`field button-field ${props.className}`}>
      <button
        className={`button ${props.buttonClassName}`}
        onClick={onClickButtonHandler}
      >
        {props.icon}
        {label}
      </button>
    </div>
  );
}


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
  className: PropTypes.string,
  buttonClassName: PropTypes.string,
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
  className: 'primary',
  buttonClassName: 'primary',
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
