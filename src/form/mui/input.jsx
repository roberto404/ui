import React from 'react';
import PropTypes from 'prop-types';

/* !- React Elements */

import MuiTextField from 'material-ui/TextField';

import Field from '../formField';


/**
* Input Component
*
* @extends Field
* @example
<Input
  id="ip"
  label="IP Address"
  placeholder="please fill it"
  value="10.0.0.1"
  regexp="[0-9.]+$"
  onChange={(relay) =>
  {
    console.log(relay.id, relay.value, relay.form);
  }}

  error="Something wrong"
  mandatory
/>
*/
class Input extends Field
{

  /* !- Handlers */

  /**
   * @private
   * @emits
   * @param  {SytheticEvent} event
   * @return {void}
   */
  onFocusHandler = (event) =>
  {
    this.props.onFocus({ id: this.props.name, value: event.target.value });
  }

  /**
   * @private
   * @emits
   * @param  {SytheticEvent} event
   * @return {void}
   */
  onBlurHandler = (event) =>
  {
    this.props.onBlur({ id: this.props.name, value: event.target.value });
  }

  /**
   * @private
   * @override
   * @emits
   * @param  {SytheticEvent} event
   * @return {void}
   */
  onChangeInputHandler = (event) =>
  {
    const value = event.target.value;

    if (this.validate(value))
    {
      this.onChangeHandler(value);
    }
  }

  /* !- Renders */

  /**
   * This method is called when render the Component instance.
   * @override
   * @return {ReactElement}
   */
  render()
  {
    return (
      <MuiTextField
        ref={(field) => { this.mui = field }}
        id={this.props.id}
        value={this.state.value}
        onChange={this.onChangeInputHandler}
        onBlur={this.onBlurHandler}
        onFocus={this.onFocusHandler}

        floatingLabelText={this.label}
        hintText={this.props.placeholder}
        errorText={this.state.error}

        type={this.props.type}
        disabled={this.props.disabled}

        fullWidth
        underlineStyle={this.props.underlineStyle}
        multiLine={this.props.multiLine}
        rows={this.props.rows}
        rowsMax={this.props.rowsMax}

        name={this.props.name}
        data-name={this.props.name}
      />
    );
  }
}

/**
 * propTypes
 * @override
 * @type {Object}
 */
Input.propTypes =
{
  ...Input.propTypes,
  /**
   * Specifies the type of input to display such as "password" or "email".
   */
  type: PropTypes.oneOf(['text', 'password', 'email']),
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
   * Regular expression to input validator
   */
  regexp: PropTypes.string,
  /**
   * Override the inline-styles of the TextField's underline element.
   */
  underlineStyle: PropTypes.objectOf(PropTypes.string),
  /**
   * Textarea format
   */
  multiLine: PropTypes.bool,
  rows: PropTypes.number,
  rowsMax: PropTypes.number,
};

/**
 * defaultProps
 * @override
 * @type {Object}
 */
Input.defaultProps =
{
  ...Input.defaultProps,
  type: 'text',
  underlineStyle: {},
  onBlur()
  {},
  onFocus()
  {},
  regexp: '',
  multiLine: false,
  rows: undefined,
  rowsMax: undefined,
};

export default Input;
