import React, { Component } from 'react';
// import { flushSync } from 'react-dom';
import ReactDOM from "react-dom";
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import classNames from 'classnames';
import { MergedContexts } from '../context';


/* !- Redux Actions */

import { setValues, unsetValues } from './actions';


/* !- React Elements */

import IconFalse from '../icon/mui/content/remove';
import IconTrue from '../icon/mui/action/done';
import IconComplete from '../icon/mui/navigation/check';
import IconPreload from '../icon/preload';


/* !- Constants */

import { FORM_SCHEME_KEY } from './constants';


/**
* Form Item baseComponent:
* - Auto mandatory by scheme.presence
* - Auto focus
* - Listen form Redux changes, if affected then update this field component
* - Set value and error state every change
*/
class FormField extends Component
{
  constructor(props, context)
  {
    // add to props <Form fields={...}>
    const fields = (props.id && context && context.fields && context.fields[props.id])
      ? context.fields[props.id] : {};

    super(props);

    let postfix;

    if (props.complete)
    {
      postfix = <IconComplete />;
    }

    if (props.preload)
    {
      postfix = <IconPreload />;
    }

    this.state = {
      value: props.stateFormat(fields.value || this.getValue(props, context)),
      error: fields.error || this.getError(props, context),
      mandatory: fields.mandatory || this.props.mandatory,
      postfix,
      preload: props.preload,
      complete: props.complete,
      ...['label', 'prefix', 'postfix', 'placeholder'].reduce((result, item) =>
      {
        const value = fields[item] || props[item];

        if (value)
        {
          if (typeof value === 'string' && props.disableIntl !== true)
          {
            result[item] = props.intl.formatMessage({ id: value });
          }
          else
          {
            result[item] = value;
          }
        }
        return result;
      },
      {})
    };

    this.data = this.getData();
  }

  /* !- React Lifecycle */

  UNSAFE_componentWillMount()
  {
    const form = this.props.form || this.context.form;
    const store = this.context.store.getState();

    const formState = form ? store.form[form] : store.form;

    if (
      this.props.value !== undefined
      && this.props.value !== null
      && this.props.value.length
      && (!formState || !formState[this.props.id])
    )
    {
      this.onChangeHandler(this.props.value);
      this.onChangeListener(); // redux subscription has not yet occurred
    }

    // Auto mandatory by _scheme.presence
    if (this.context.store)
    {
      let state = this.context.store.getState().form;
      const form = this.props.form || this.context.form;

      if (form)
      {
        state = state[form];
      }

      if (state)
      {
        if (
          state[FORM_SCHEME_KEY] &&
          state[FORM_SCHEME_KEY][this.props.id] &&
          state[FORM_SCHEME_KEY][this.props.id].presence
        )
        {
          this.setState({ mandatory: true });
        }
      }
    }
  }


  componentDidMount()
  {
    // Subscribe Redux
    if (this.context.store)
    {
      this.unsubscribe = this.context.store.subscribe(this.onChangeListener);
    }

    if (typeof this.props.default !== 'undefined' && !this.state.value)
    {
      this.onChangeHandler(this.props.default);
    }

    // AutoFocus or ForceFocus
    if (this.props.autoFocus || this.props.forceFocus)
    {
      this.element.focus();

      if (this.state.value && this.state.value.length && this.element.setSelectionRange)
      {
        const length = this.state.value.length;
        this.element.setSelectionRange(length, length);
      }
    }

    // TODO App listener and remove
    if (this.element && this.props.onPaste)
    {
      this.element.addEventListener('paste', this.onPasteHandler);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps)
  {
    if (!isEqual(nextProps.value, this.getValue()))
    {
      this.onChangeListener(nextProps);
    }

    if (nextProps.error !== this.state.error)
    {
      this.setState({ error: nextProps.error });
    }

    if (nextProps.complete !== this.props.complete)
    {
      this.setState({
        complete: nextProps.complete,
        postfix: nextProps.complete ? <IconComplete /> : this.props.postfix,
      });
    }

    if (nextProps.preload !== this.props.preload)
    {
      this.setState({
        preload: nextProps.preload,
        postfix: nextProps.preload ? <IconPreload /> : this.props.postfix,
      });
    }

    if (nextProps.prefix)
    {
      this.setState({ prefix: nextProps.prefix });
    }


    this.data = this.getData(nextProps);

    if (nextProps.label)
    {
      this.setState({
        label: (nextProps.label && typeof nextProps.label === 'string' && nextProps.intl && nextProps.disableIntl !== true) ?
        nextProps.intl.formatMessage({ id: nextProps.label }) : nextProps.label,
      })
    }
  }


  componentWillUnmount()
  {
    if (this.unsubscribe)
    {
      this.unsubscribe();
    }

    if (typeof this.element !== 'undefined' && typeof this.element.removeEventListener === 'function')
    {
      this.element.removeEventListener('paste', this.onPasteHandler, false);
    }

    // TODO depricated change shortcut
    if (this.context && this.context.removeListener)
    {
      this.context.removeListener(this.onKeyDown);
    }
  }

  /* !- Listeners */

  /**
   * @private
   * @emits
   * @param  {SytheticEvent} event
   * @return {void}
   */
  onFocusHandler = (event) =>
  {
    if (this.props.forceFocus && this.context.removeListener)
    {
      this.context.removeListener(this.onKeyDown);
    }

    const form = this.props.form || this.context.form;

    this.props.onFocus({ id: this.props.id, value: event.target.value, form }, event);
  }

  /**
   * @private
   * @emits
   * @param  {SytheticEvent} event
   * @return {void}
   */
  onBlurHandler = (event) =>
  {
    const form = this.props.form || this.context.form;

    this.props.onBlur({ id: this.props.id, value: event.target.value, form }, event);

    if (this.props.forceFocus && this.context.addListener)
    {
      this.context.addListener('keydown', this.onKeyDown);
    }
  }

  /**
   * Invoke every Redux changes or compent props.value change.
   * Set State: value, error (if changed)
   *
   * @param  {object} [props=this.props]
   */
  onChangeListener = (props = this.props) =>
  {
    const value = props.stateFormat(this.getValue(props));
    const error = this.getError();

    // const isChanged = Array.isArray(props.id) ?
    //   JSON.stringify(this.state.value) !== JSON.stringify(value) : this.state.value !== value;

    const isChanged = isEqual(value, this.state.value) === false;

    if (
      (typeof value !== 'undefined' && isChanged) ||
      this.state.error !== error
    )
    {
      ReactDOM.flushSync(() => {
        this.setState({ value, error });
      });
    }
  }

  /* !- Handlers */

  onPasteHandler = (event) =>
  {
    // Stop data actually being pasted into div
    event.stopPropagation();
    event.preventDefault();

    // Get pasted data via clipboard API
    const clipboardData = event.clipboardData || window?.clipboardData || '';
    const pastedData = clipboardData.getData('Text');

    this.props.onPaste(pastedData, this.onChangeHandler);
  }


  /**
   * Pass value to Redux. Invoke when the value of field change.
   *
   * @private
   * @param  {string} value Current value of the field
   * @return {void}
   */
  onChangeHandler = (value, event, options = {}) =>
  {
    /**
     * If the client erase from string
     * @type {boolean|null}
     */
    const reduce = (value && this.state.value && typeof value.length === 'number') ?
      value.length < this.state.value.length : null;

    const payload = {
      id: this.props.id,
      value: this.props.format(value, reduce, options),
    };

    // if (isEqual(payload.value, this.state.value))
    // {
    //   return;
    // }

    if (!this.validate(payload.value))
    {
      return;
    }

    options.reduce = reduce;
    options.event = event;
    options.target = this;

    const form = this.props.form || this.context.form;

    if (form)
    {
      payload.form = form;
    }

    if (
      this.props.onChange
      && this.props.onChange.toString() !== FormField.defaultProps.onChange.toString()
    )
    {
      this.props.onChange(payload, options);
    }
    else if (this.context.onChange)
    {
      this.context.onChange(payload, options);
    }
    else if (payload.value === undefined)
    {
      this.context.store.dispatch(unsetValues({ id: payload.id }, payload.form))
    }
    else
    {
      this.context.store.dispatch(setValues({ [payload.id]: payload.value }, payload.form));
    }
  }

  /**
   * [onKeyDown description]
   * @param  {[type]} event [description]
   * @return {[type]}       [description]
   */
  onKeyDown = (event) =>
  {
    if (!event.altKey && !event.metaKey && /^[a-záéúőóüöíA-ZÁÉÚŐÓÜÖÍ0-9- ]{1}$/.test(event.key))
    {
      this.onChangeHandler('');
      this.element.focus();
    }
  }

  /* !- Privates */

  /**
   * Get value from Redux Store.
   * If not use Redux or form-id not declared in the Redux, then return props.value.
   *
   * @param  {Object} [props=this.props]
   * @param  {Object} [context=this.context]
   * @return {any}
   */
  getValue(props = this.props, context = this.context)
  {
    if (typeof context === 'undefined' || !context.store)
    {
      return props.value;
    }

    const state = context.store.getState().form;
    const form = props.form || context.form;

    // handling multiple id (like: calendarInterval)
    const ids = Array.isArray(props.id) ? props.id : [props.id];

    const values = ids.map((id) => {
      if (!form)
      {
        return state[id] === undefined ? props.value : state[id];
      }
      else if (!state[form] || typeof state[form][id] === 'undefined')
      {
        return props.value;
      }

      return state[form][id];
    });

    // normal case
    if (values.length === 1)
    {
      return values[0];
    }

    // multiple id
    return values.reduce(
      (result, value, index) => ({ ...result, [ids[index]]: value }),
      {},
    );
  }

  /**
   * Get error from Redux Store
   *
   * @param  {Object} [props=this.props]
   * @param  {Object} [context=this.context]
   * @return {String}
   */
  getError(props = this.props, context = this.context)
  {
    if (typeof props.error === 'string')
    {
      return props.error;
    }

    if (typeof context === 'undefined' || !context.store)
    {
      return '';
    }

    const state = context.store.getState().form;
    const form = props.form || context.form;

    if (!form)
    {
      if (!state._errors || !Array.isArray(state._errors[this.props.id]))
      {
        return '';
      }
      return state._errors[this.props.id]
        .map(id => this.props.intl.formatMessage({ id }))
        .join('. ') + '.';
    }
    else if (
      !state[form] ||
      !state[form]._errors ||
      !Array.isArray(state[form]._errors[this.props.id])
    )
    {
      return '';
    }

    const errorMessages =
      state[form]._errors[this.props.id]
        .map(id => this.props.intl.formatMessage({ id }))
        .join('. ');

    return `${errorMessages}.`;
  }

  /**
   * Use: Dropdown, Select, Radio, Checkbox
   * Return data of fields, if it is not static use props function
   * @return {Object} data
   */
  getData(props = this.props)
  {
    return ((typeof props.data === 'function') ?
      props.data(this.state, this.getValue(), props) : props.data) || [];
  }

  getClasses(field)
  {
    return classNames({
      field: true,
      [`${field}-field`]: true,
      // active: typeof this.state.value === 'boolean' ? this.state.value : !!parseInt(this.state.value),
      active: typeof this.state.value === 'boolean' ? this.state.value : !isEmpty(this.state.value),
      [this.props.className]: true,
      'postfix-inside': this.state.complete || this.state.preload,
      'complete fill-black': this.state.complete,
      'preload fill-gray': this.state.preload,
    });
  }

  /**
   * Add mandatory if necessarry
   * @return {ReactElement}
   */
  get label()
  {
    if (!this.state.label || this.props.disableLabel === true)
    {
      return undefined;
    }

    const label = this.state.mandatory ?
      <span>{this.state.label}<span className="mandatory" /></span>
      : this.state.label;

    return <div className="label">{label}</div>;
  }


  /**
   * Evalute the props regexp
   * @private
   * @param  {string} value
   * @return {boolen}
   */
  validate = (value) =>
  {
    if (this.props.regexp && value)
    {
      const regex = new RegExp(this.props.regexp);

      if (regex.exec(value) === null)
      {
        return false;
      }
    }

    return true;
  }

  focus = () =>
  {
    this.element.focus();
  }


  /**
   * Helper method which determine new item insert or remove the current state.value
   * @param  {Array}  value        usualy state.value [a, b, c]
   * @param  {string}  item        selected item
   * @param  {Boolean} [toggle=true] you can disable remove method if it is false
   * @return {Array}                new value: [a,b,c]
   */
  createMultipleValueHelper = (value, item, toggle = true) =>
  {
    const index = value.indexOf(item);

    if (index === -1)
    {
      return [...value, item];
    }
    else if (toggle === false) // not remove item
    {
      return value;
    }

    return [
      ...value.slice(0, index),
      ...value.slice(index + 1)];
  };

  renderPlainField()
  {
    const { intl, multipleData } = this.props;
    const multipleDataText = () => intl ? intl.formatMessage({ id: multipleData }) : multipleData;
    const placeholder =
      Array.isArray(this.state.value) ? multipleDataText() : this.state.placeholder;

    let value = this.state.value;
    const data = this.getData();

    // checkbox, radio
    if (data.length)
    {
      const values = Array.isArray(value) ? value : [value];

      value =
        values
          .map(v => data.find(({ id }) => id.toString() === v.toString()).title)
          .join(', ');
    }
    // toggle, button
    else if (typeof value === 'boolean')
    {
      // button data
      if (typeof data[+value] !== 'undefined')
      {
        value = data[+value];
      }
      else
      {
        value = value ? <IconTrue className="w-1 h-1" /> : <IconFalse className="w-1 h-1" />;
      }
    }

    return (
      <div className={this.getClasses('plain')}>

        { this.label }

        <div className="h-center">

          { this.state.prefix &&
          <div className="prefix">{this.state.prefix}</div>
          }

          { this.props.dangerouslySetInnerHTML &&
            <div dangerouslySetInnerHTML={{ '__html': value }} />
          }
          { !this.props.dangerouslySetInnerHTML &&
            <div>{value || placeholder}</div>
          }

          { this.state.postfix &&
          <div className="postfix">{this.state.postfix}</div>
          }

        </div>

        { this.state.error &&
          <div className="error">{this.state.error}</div>
        }
      </div>
    );
  }

  /**
   * This method is called when render the Component instance.
   * @return {ReactElement}
   */
  render()
  {
    // console.log(this.context);
    if (this.context.readOnly !== true)
    {
      return null;
    }

    return this.renderPlainField();
  }
}

/**
 * propTypes
 * @type {Object}
 */
FormField.propTypes =
{
  /**
   * Redux Form reference. If you don't use <Form id="example"> parent component
   * you have to define redux form id which will payload field value.
   * @example
   * <div>
   *  <Input form="example" />
   * </div>
   * Or you can determine other form of collection.
   * @example
   * <Form id="example1">
   *  <Input form="example2" />
   * </Form>
   */
  form: PropTypes.string,
  /**
   * References id
   * // => multiple id
   * id={['start', 'end']}
   */
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  /**
   * Initial value of the field (via setValues form redux action).
   * Will not apply, if the redux value defined yet.
   * Therefore you can not modify when the component mounted.
   */
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  /**
   * This function will invoke when the field's value change.
   * Default operation value will forward to redux form reducer (setValue)
   *
   * @param {Object} {id, value, form}
   */
  onChange: PropTypes.func,

  /* eslint-disable react/no-unused-prop-types */

  /**
   * The content to use for the floating label element.
   */
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  /**
   * The placeholder content
   */
  placeholder: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  /**
   * Element visible inline before the field
   */
  prefix: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  /**
   * Element visible inline after the field
   */
  postfix: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  /**
   * Disable the field.
   */
  disabled: PropTypes.bool,
  /**
   * Extend field classes
   * Default classes: field, [input]-field, [active]
   */
  className: PropTypes.string,

  /* eslint-enable */


  /**
   * If true, label content extended by '*'
   */
  mandatory: PropTypes.bool,
  /**
   * Format/modify redux state value.
   * FormField value will transform before transfer to redux reducer.
   * This method call every FormField change.
   * @important if you change state value outside, the format will not apply.
   *
   * @param {string} value next value of field
   * @param {boolean} reduce next value reduced
   */
  format: PropTypes.func,
  /**
   * Format field state value.
   * When redux state change, the field state value will modify, the redux state not change.
   * This method call every Recux state change
   *
   * @param {string} value next value of field
   * @example
   * <Input
   *  format={value => new Date(value).toLocaleString()}
   * />
   */
  stateFormat: PropTypes.func,
  /**
   * Focus input field
   */
  autoFocus: PropTypes.bool,
  /**
   * OnKeyDown event automatically focus input field
   * @important you can enable if add/removeListener exist on context (See utils>models>app)
   */
  forceFocus: PropTypes.bool,
  /**
   * Callback function that is fired when the textfield's focus lost.
   *
   * @param {string} newValue The new value of the text field.
   * @param {object} event Change event targeting the text field.
   */
  onBlur: PropTypes.func,
  /**
   * Callback function that is fired when the textfield is on focus.
   *
   * @param {string} newValue The new value of the text field.
   * @param {object} event Change event targeting the text field.
   */
  onFocus: PropTypes.func,
  /**
   * Use Checkbox, Radio, Select, Dropdown
   * @example
   * data={[{ id, title }, ...]}
   */
  data: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]).isRequired,
      title: PropTypes.string.isRequired,
    })),
  ]),
  /**
   * Intl id for multiple data
   */
  multipleData: PropTypes.string,
  disableLabel: PropTypes.bool,
  complete: PropTypes.bool,
  preload: PropTypes.bool,
  /**
   * Disable data options i18n translatations
   * like select options
   */
  dataTranslate: PropTypes.bool,
};

/**
 * defaultProps
 * @type {Object}
 */
FormField.defaultProps =
{
  form: '',
  value: '',
  onChange: () =>
  {},
  label: '',
  placeholder: '',
  prefix: '',
  postfix: '',
  // error: '',
  disabled: false,
  mandatory: false,
  format: v => v,
  stateFormat: v => v,
  intl: {
    formatMessage: ({ id }) => id,
  },
  className: '',
  autoFocus: false,
  forceFocus: false,
  onBlur()
  {},
  onFocus()
  {},
  data: [],
  multipleData: 'placeholder.multipledata',
  disableLabel: false,
  complete: false,
  preload: false,
  disableIntl: false,
  dataTranslate: true,
};

FormField.contextType = MergedContexts;






export default FormField;
