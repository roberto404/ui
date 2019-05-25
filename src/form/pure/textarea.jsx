import React from 'react';
import PropTypes from 'prop-types';

/* !- React Elements */

import Field from '../../form/formField';


/**
* Textarea Component
*
* @extends Field
*/
class Textarea extends Field
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
  onChangeTextareaHandler = (event) =>
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
    const { intl, multipleData } = this.props;
    const multipleDataText = () => intl ? intl.formatMessage({ id: multipleData }) : multipleData;

    return (
      <div className={this.getClasses('textarea')}>

        { this.label }

        <textarea
          id={this.props.id}
          name={this.props.name}
          value={Array.isArray(this.state.value) ? '' : this.state.value}

          disabled={this.props.disabled}
          maxLength={this.props.length}
          rows={this.props.rows}

          onChange={this.onChangeTextareaHandler}
          onBlur={this.onBlurHandler}
          onFocus={this.onFocusHandler}
          placeholder={Array.isArray(this.state.value) ? multipleDataText() : this.state.placeholder}

          ref={(ref) =>
          {
            this.element = ref;
          }}
          data-name={this.props.name}
        />

        { this.state.error &&
          <div className="error">{this.state.error}</div>
        }
      </div>
    );
  }
}

/**
 * propTypes
 * @override
 * @type {Object}
 */
Textarea.propTypes =
{
  ...Textarea.propTypes,
  /**
   * Specifies the type of input to display such as "password" or "email".
   */
  type: PropTypes.oneOf(['text', 'password', 'email']),
  /**
   * The rows attribute specifies the visible height of a text area, in lines.
   */
  rows: PropTypes.number,
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
   * Special placeholder, when state.value type is array
   */
  multipleData: PropTypes.string,
};

/**
 * defaultProps
 * @override
 * @type {Object}
 */
Textarea.defaultProps =
{
  ...Textarea.defaultProps,
  type: 'text',
  rows: 5,
  underlineStyle: {},
  onBlur()
  {},
  onFocus()
  {},
  regexp: '',
  multipleData: 'placeholder.multipledata',
};

export default Textarea;
