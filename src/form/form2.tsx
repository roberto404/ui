"use client";

import { FormContext } from './context';

import { useComponentDidMount } from "../hooks";
import { useDispatch, useSelector, useStore } from 'react-redux';
import { setValues } from "./actions";
import { useAppContext } from '../context';
import { useComponentWillUnmount, useComponentWillMount } from '../hooks';
import { useIntl } from 'react-intl';
import classNames from 'classnames';

/* !- Redux Actions */

import * as FormActions from './actions';
import * as LayerActions from '../layer/actions';
import * as GridActions from '../grid/actions';
import { useCallback, useEffect, useState } from 'react';
import isEmpty from 'lodash/isEmpty';


const Foo = () =>
{
  const dispatch = useDispatch();

  return (
    <div onClick={() => dispatch(FormActions.setValues({ id: 'email', value: 'foo'}, 'subscribe'))}>click</div>
  )  
}

const Form = (props) =>
{
  const {
    /**
     * Redux store container.
     * @example
     *    // with id
     *    store = {
     *      form: {
     *        [id]: { },
     *      }
     *    }
     *    // without id
     *    store = {
     *      form: { }
     *    }
     */
    id = Math.floor(Math.random() * 1000000),
    /**
     * Form onError case use this field
     * @example
     * {
     *   ip: {
     *     id: 'ip',
     *     label: 'IP Address',
     *     placeholder: 'please fill it',
     *     regexp: '[0-9.]+$',
     *   }
     * }
     *
     * // auto field props
     * <Input id="id" />
     *
     * // use predefined fields
     *
     * import { getFields, DEFAULT_FIELDS } from 'form/constants';
     *
     * const fields = {
     *  ...getFields(['title', 'status']),
     *  catalog: DEFAULT_FIELDS.category,
     * }
     *
     * // use predefined formats
     * import { formatPhone, formatTaxcode } from 'form/constants';
     *
     * phone: {
     *   id: 'phone',
     *   label: 'field.phone',
     *   placeholder: 'placeholder.phone',
     *   regexp: '^[0-9 ]*$',
     *   prefix: 'prefix.phone',
     *   length: '11',
     *   format: formatPhone,
     *   type: 'tel',
     * },
     */
    fields = {},
    /**
     * Value of form fields validator. Api call if the validate successfull
     *
     * ValidateJs contrain
     * - https://validatejs.org
     *
     * @example
     * {
     *    field_name: {
     *      presence: {
     *        message: '^validator.presence',
     *      },
     *      equality: {
     *        attribute: 'password',
     *        comparator: (v1, v2) => v1 === v2,
     *        message: '^validator.password2',
     *      },
     *      length: {
     *        minimum: 5,
     *        message: '^validator.format',
     *      },
     *      format: {
     *        pattern: /^[0-9]{8}-[1-5]{1}-[0-9]{2}$/,
     *        message: '^validator.format',
     *      },
     *      custom: {
     *        validator: (fieldValue, scheme, fieldId, formData) => fieldValue || !formData.password,
     *        message: '^validator.presence',
     *      },
     *      numericality: {
     *        onlyInteger: true,
     *        greaterThan: -1,
     *        message: '^validator.format',
     *      },
     *    },
     * }
     *
     * // use predefined scheme
     *
     * import { getScheme, DEFAULT_SCHEME }from 'form/constants';
     *
     * const scheme = {
     *  ...getScheme(['title', 'status']),
     *  catalog: DEFAULT_SCHEME.category,
     * }
     */
    scheme = {},
    /**
     * Set Plain every field
     */
    readOnly = false,
    /**
     * Api call or Api hook
     * Returned results will Redux set in formId
     * @param {string} formId
     * @return {Promise}
     * @example
     * // api hook
     * const onLoad = (respond) => respond.records
     * (form) => api(form).then(this.onLoad)
     */
    onLoad,
    /**
     * Subscribe to form field redux store changes
     * @param {object} next New form items value
     * @param {object} prev values before changed
     * @param {string} formId
     * @example
     * (next, prev, formId) => null
     */
    onChange,
    /**
     * API response.status = "SUCCESS" call this method
     * @param {object} response
     * @example
     * (response) => null
     */
    onSuccess,
    /**
     * API response.status not "SUCCESS" call this method
     * @param {object} response
     * @example
     * (response) => null
     */
    onFailed,
    /**
     * Modal's title when default OnError handler execute
     */
    onErrorTitle = 'global.error_form',
    /**
     * Disable auto redux form flush when submit is successfull
     */
    flush = false,
    /**
     * Default classnames: form, [formId], active<br>
     * You can define extra classnames
     */
    className = '',
    children,
  } = props

  const [active, setActive] = useState(false);
  const dispatch = useDispatch();
  const appContext = useAppContext();
  const store = useStore();
  const intl = useIntl();

  /* !- React lifecycle */

  useComponentWillMount(() => {

    if (!isEmpty(scheme))
    {
      dispatch(FormActions.setScheme(scheme, id));
    }

    if (typeof onLoad === 'function')
    {
      dispatch(FormActions.fetchValues(onLoad, id));
    }
  });

  useComponentWillUnmount(() => {

    if (flush)
    {
      dispatch(FormActions.flush(id));
    }
  });

  /**
   * Clear Redux form, but keep the scheme
   */
  const clear = () =>
  {
    if (flush)
    {
      dispatch(FormActions.flush(id));
      dispatch(FormActions.setScheme(scheme, id));
    }

    setActive(false);
  }


  /* !- Listeners */

  /**
   * Invoke every form redux change, if props.onChange defined.
   * => onChange(formReduxItems, formPrevReduxItems, formReduxId);
   */
  if (onChange)
  {
    useSelector(
      ({ form }) => form[id],
      (prev, next) =>
      {
        onChange(next, prev, id);
        return true;
      },
    )
  }

  /* !- Handlers */

  /**
   * Dispatch setValue Form Action
   * @param  {Object} relay { id, value, form }
   */
  const onChangeHandler = ({ id, value, form }: {id: string, value: any, form?: string}): void =>
  {
    if (value === undefined)
    {
      dispatch(FormActions.unsetValues({ id }, form || props.id))
    }
    else
    {
      dispatch(FormActions.setValues(
        { [id]: value },
        form || props.id,
      ));
    }
  }

  /**
   * Start preload, change form status => class
   */
  const onStart = () =>
  {
    setActive(true);
    dispatch(LayerActions.preload());
  }

  /**
   * Show API response on modal, and clear form fields.
   * You can subscribe onSuccess or onFailed, before form clear and modal show
   * @param  {Object} response API response
   */
  const onFinish = (response) =>
  {
    const layer = store.getState().layer;
    
    if (response.status === 'SUCCESS')
    {
      let respond = true;
      
      if (typeof onSuccess === 'function')
      {
        respond = onSuccess(response, id);

        if (respond === false)
        {
          return;
        }
      }

      const action = Array.isArray(response.records) ?
        GridActions.modifyOrAddRecords : GridActions.modifyOrAddRecord;

      const formState = store.getState().form[id];

      if (typeof response.records.id !== 'undefined' && typeof formState !== 'undefined' && (formState.id === undefined || response.records.id == formState.id))
      {
        dispatch(FormActions.setValues(response.records, id));
      }
      // if respose full grid *ReadAll
      else if (Array.isArray(response.records))
      {
        const id = formState.id || response.lastInsertId;

        const record = id ? response.records.find(item => item.id == id) : undefined;

        if (record)
        {
          dispatch(FormActions.setValues(record, id))
        }
        else
        {
          dispatch(FormActions.flush(id))
        }
      }
        
      dispatch(action(response.records, id));
      dispatch(LayerActions.close());

      clear();
    }
    else
    {
      if (typeof onFailed === 'function' && onFailed(response) === false)
      {
        return;
      }
    }

    if (response.modal)
    {
      dispatch(LayerActions.modal(response.modal));
    }
    // CLOSE IF: onSuccess or onFailed external method not changed the layer
    else if (JSON.stringify(layer) === JSON.stringify(store.getState().layer))
    {
      dispatch(LayerActions.close());
    }
  }

  /**
   * Show errors on modal, if scheme validation failed
   * @param  {Object} error validate.js error object
   */
  const onError = (error) =>
  {
    dispatch(LayerActions.modal({
      title: intl.formatMessage({ id: onErrorTitle }),
      content:
        Object
          .keys(error)
          .map(e =>
          {
            if (!fields[e] || !fields[e].label)
            {
              return e;
            }
            else if (typeof fields[e].label.props === 'object')
            {
              return fields[e].label.props.children;
            }
            return intl.formatMessage({ id: fields[e].label });
          })
          .join(', '),
      classes: 'error',
    }));
  }


  const context = {
    readOnly: readOnly,
    form: id,
    fields: fields,
    onChange: onChangeHandler,
    onStart: onStart,
    onFinish: onFinish,
    onError: onError,
    ...appContext,
  };

  const formClasses = classNames({
    form: true,
    [id]: true,
    [className]: true,
    active: !!active,
    // error: !!error,
  });



  return (
    <form
      autoComplete="off"
      className={formClasses}
    >
      <FormContext.Provider value={context}>
        {children}
      </FormContext.Provider>
    </form>
  );
}

export default Form;

