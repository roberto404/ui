import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { FormContext } from '../context';
import { useAppContext } from '../../context';
import isEmpty from 'lodash/isEmpty';
import reduce from 'lodash/reduce';


/* !- React Actions */

import { flush as formFlush } from '../actions';
import { close, preload } from '../../layer/actions';
import { removeRecord, setData } from '../../grid/actions';


/* !- Constants */

import { FORM_ERRORS_KEY } from '../constants';

/* !- Types */

const defaultProps =
{
  label: 'global.submit',
  className: 'primary',
  buttonClassName: 'primary',
  intl: {
    formatMessage: ({ id }) => id,
  },
};

type PropTypes = Partial<typeof defaultProps> &
{
  id: string,
  api: void,
  intl: {},
  label: string | JSX.Element,
  className: string,
  buttonClassName: string,
  /**
   * Api method name, default: id
   */
  method: string,
  children: JSX.Element,
}



/**
* Submit From Component.
* - call Api (via context or props) with this object { method: formId, payload: ReduxFrom }
* - execute Form context handlers
*   - onStart (before the process),
*   - onError (form scheme validation error),
*   - onFinish (when api return width response)
*
* You can overwrite or extend this method with onClick
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
const Submit = (props: PropTypes) =>
{
  const formContext = useContext(FormContext);
  const context = useAppContext();
  const dispatch  = useDispatch();

  const id = props.id || formContext.form;
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

    const onStart = props.onStart || formContext.onStart;
    const onFinish = props.onFinish || formContext.onFinish;
    const onError = props.onError || formContext.onError;

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

  const onDeleteHandler = (event) =>
  {
    event.preventDefault();
    
    dispatch(preload());

    const state = context.store.getState().form[id];

    api({
      method: 'delete',
      payload: state,
    })
      .then((response) =>
      {
        if (Array.isArray(response.records))
        {
          dispatch(setData(response.records, undefined, id));
        }
        else
        {
          dispatch(removeRecord(response.records, id));
        }
        dispatch(formFlush(id));
        dispatch(close());
      });    
  }

  if (props.children)
  {
    return React.cloneElement(
      props.children,
      {
        onSave: onClickButtonHandler,
        onDelete: onDeleteHandler,
      },
    );
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

Submit.defaultProps = defaultProps;

export default Submit;
