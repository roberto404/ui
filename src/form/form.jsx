import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { v4 } from 'node-uuid';
import isEmpty from 'lodash/isEmpty';
import classNames from 'classnames';
import { intlShape } from 'react-intl';


/* !- Redux Actions */

import * as FormActions from './actions';
import * as LayerActions from '../layer/actions';


/**
* Form Component
* - Handling form's **field changes**: automatically dispatch to Redux by formId.
* Do not need onChange handler in the form fields.
* - **Set scheme**: before mounting
* - **Fetch values**: after mounting, if you add onLoad props *or use `<FormView>`
* - **Flush** Redux{FormId}: after umount.
*
* Providing **context**:
* - form {string} Id of `<Form>`
* - onChange {function} Redux{FormId} dispatcher: onChange({ id, value })
* - onStart {function} Set preload, change class: active
* - onFinish {function} Remove preload and class. Show modal if response.modal defined.
* Handling onSuccess and onFailed prop methods.
* - onError {function}
*
* @example
* <Form id='example-form-1'>
*   <Toggle
*     id="status"
*     label="Form connect -status"
*   />
*   <Checkbox
*     id="services"
*     label="Form connect -service"
*     columns={10}
*     data={[{ id: 1, title: '#1' }, { id: 2, title: '#2' }]}
*   />
* </Form>
*
* // => Redux.store = {
*   form: {
*     'example-form-1':
*     {
*       status: 1,
*       checkbox: [1, 2],
*     }
*   }
* }
*
* @example
* // Complex Form
* <Form
*   id="example"
*   fields={{
*     ip: {
*       id: 'ip',
*       label: 'IP Address',
*       placeholder: 'please fill it'
*     }
*   }}
*   scheme={{
*     ip: {
*       presence: {
*         message: 'mandatory',
*       },
*     },
*   }}
*   onLoad={(form) => api().then((respond) => respond)}
*   onChange={(next, prev, formId) => null}
*   onSuccess={(respond) => null}
* >
*   <Input id="ip" />
* </Form>
*
*
* @example
* // Without <Form> component
*
* import { connect } from 'react-redux';
* import * as FormActions from 'form/actions';
*
* let Form = ({ onChange }) =>
* (
*   <div>
*     <Toggle
*       id="status"
*       label="Status form2 -sample2"
*       onChange={onChange}
*     />
*   </div>
* );
*
* Form = connect(
*   null,
*   dispatch => ({ onChange: relay => dispatch(FormActions.setValue(relay)) }),
* )(Form);
*/
class Form extends Component
{
  /* !- Privates */

  constructor(props)
  {
    super(props);

    this.state = {
      active: false,
    };
  }

  getChildContext()
  {
    return {
      readOnly: this.props.readOnly,
      form: this.props.id,
      fields: this.props.fields,
      onChange: this.onChangeHandler,
      onStart: this.onStart,
      onFinish: this.onFinish,
      onError: this.onError,
    };
  }

  /* !- React lifecycle */

  componentWillMount = () =>
  {
    // set scheme
    if (!isEmpty(this.props.scheme))
    {
      this.context.store.dispatch(FormActions.setScheme(
        this.props.scheme,
        this.props.id,
      ));
    }

    // load data via API
    const isOnLoad = this.props.onLoad !== Form.defaultProps.onLoad;

    if (isOnLoad)
    {
      this.context.store.dispatch(FormActions.fetchValues(
        this.props.onLoad, this.props.id,
      ));
    }
  }

  componentDidMount = () =>
  {
    const isOnChange = this.props.onChange !== Form.defaultProps.onChange;

    // Subscribe Redux
    if (isOnChange && this.context.store)
    {
      this.formState = this.context.store.getState().form[this.props.id];
      this.unsubscribe = this.context.store.subscribe(this.onChange);
    }
  }

  componentWillUnmount()
  {
    if (this.unsubscribe)
    {
      this.unsubscribe();
    }

    if (this.props.flush)
    {
      this.context.store.dispatch(FormActions.flush(this.props.id));
    }
  }


  /* !- Handlers */

  /**
   * Dispatch setValue Form Action
   * @param  {Object} relay { id, value, form }
   * @return {void}
   */
  onChangeHandler = ({ id, value, form }) =>
  {
    if (value === undefined)
    {
      this.context.store.dispatch(FormActions.unsetValues({ id }, form || this.props.id))
    }
    else
    {
      this.context.store.dispatch(FormActions.setValues(
        { [id]: value },
        form || this.props.id,
      ));
    }
  }

  /* !- Listeners */

  /**
   * Invoke every form redux change, if props.onChange defined.
   * => onChange(formReduxItems, formPrevReduxItems, formReduxId);
   */
  onChange = () =>
  {
    const prev = { ...this.formState };
    const next = this.context.store.getState().form[this.props.id] || {};
    this.formState = next;
    this.props.onChange(next, prev, this.props.id);
  }

  /**
   * Start preload, change form status => class
   */
  onStart = () =>
  {
    this.setState({ active: true });
    this.context.store.dispatch(LayerActions.preload());
  }

  /**
   * Show API response on modal, and clear form fields.
   * You can subscribe onSuccess or onFailed, before form clear and modal show
   * @param  {Object} response API response
   */
  onFinish = (response) =>
  {
    const layer = this.context.store.getState().layer;

    if (response.status === 'SUCCESS')
    {
      if (typeof this.props.onSuccess === 'function')
      {
        if (this.props.onSuccess(response) === false)
        {
          return;
        }
      }

      this.clear();
    }
    else
    {
      if (this.props.onFailed(response) === false)
      {
        return;
      }
    }

    if (response.modal)
    {
      this.context.store.dispatch(LayerActions.modal(response.modal));
    }
    // CLOSE IF: onSuccess or onFailed external method not changed the layer
    else if (JSON.stringify(layer) === JSON.stringify(this.context.store.getState().layer))
    {
      this.context.store.dispatch(LayerActions.close());
    }
  }

  /**
   * Show errors on modal, if scheme validation failed
   * @param  {Object} error validate.js error object
   */
  onError = (error) =>
  {
    this.context.store.dispatch(LayerActions.modal({
      title: this.props.intl.formatMessage({ id: this.props.onErrorTitle }),
      content:
        Object
          .keys(error)
          .map(e =>
          {
            if (!this.props.fields[e] || !this.props.fields[e].label)
            {
              return e;
            }
            else if (typeof this.props.fields[e].label.props === 'object')
            {
              return this.props.fields[e].label.props.children;
            }
            return this.props.intl.formatMessage({ id: this.props.fields[e].label });
          })
          .join(', '),
      classes: 'error',
    }));
  }

  /**
   * Clear Redux form, but keep the scheme
   */
  clear()
  {
    if (this.props.flush)
    {
      this.context.store.dispatch(FormActions.flush(this.props.id));
      this.context.store.dispatch(FormActions.setScheme(this.props.scheme, this.props.id));
    }

    this.setState({ active: false });
  }

  render()
  {
    const formClasses = classNames({
      form: true,
      [this.props.id]: true,
      [this.props.className]: true,
      active: !!this.state.active,
      // error: !!error,
    });

    return (
      <form
        autoComplete="off"
        className={formClasses}
      >
        {this.props.children}
      </form>
    );
  }
}

/**
 * propTypes
 * @type {Object}
 */
Form.propTypes =
{
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
  id: PropTypes.string,
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
  scheme: PropTypes.objectOf(PropTypes.object),
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
  fields: PropTypes.objectOf(PropTypes.object),
  /**
   * Default classnames: form, [formId], active<br>
   * You can define extra classnames
   */
  className: PropTypes.string,
  /**
   * @private
   */
  children: PropTypes.node,
  /**
   * Disable auto redux form flush when submit is successfull
   */
  flush: PropTypes.bool,
  /**
   * Set Plain every field
   */
  readOnly: PropTypes.bool,
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
  onLoad: PropTypes.func,
  /**
   * Subscribe to form field redux store changes
   * @param {object} next New form items value
   * @param {object} prev values before changed
   * @param {string} formId
   * @example
   * (next, prev, formId) => null
   */
  onChange: PropTypes.func,
  /**
   * API response.status = "SUCCESS" call this method
   * @param {object} response
   * @example
   * (response) => null
   */
  onSuccess: PropTypes.func,
  /**
   * API response.status not "SUCCESS" call this method
   * @param {object} response
   * @example
   * (response) => null
   */
  onFailed: PropTypes.func,
  /**
   * Modal's title when default OnError handler execute
   */
  onErrorTitle: PropTypes.string,
  intl: intlShape,
};

/**
 * defaultProps
 * @type {Object}
 */
Form.defaultProps =
{
  id: v4(),
  readOnly: false,
  scheme: {},
  fields: {},
  className: '',
  children: null,
  onErrorTitle: 'global.error_form',
  flush: true,
  onLoad: () => null,
  onChange: () => null,
  onSuccess: () => null,
  onFailed: () => null,
  intl: {
    now: ({ id }) => id,
    formatHTMLMessage: ({ id }) => id,
    formatPlural: ({ id }) => id,
    formatNumber: ({ id }) => id,
    formatRelative: ({ id }) => id,
    formatTime: ({ id }) => id,
    formatDate: ({ id }) => id,
    formatMessage: ({ id }) => id,
  },
};

/**
 * contextTypes
 * @type {Object}
 */
Form.contextTypes = {
  store: PropTypes.object,
};

/**
 * childContextTypes
 * @type {Object}
 */
Form.childContextTypes = {
  form: PropTypes.string,
  readOnly: PropTypes.bool,
  fields: PropTypes.object,
  onChange: PropTypes.func,
  onStart: PropTypes.func,
  onFinish: PropTypes.func,
  onError: PropTypes.func,
};

export default Form;
