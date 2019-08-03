import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/* !- React Elements */

import Field from '../../form/formField';


/**
* Input Component
*
* @extends Field
*/
class Input extends Field
{
  /**
   * @private
   * @override
   * @emits
   * @param  {SytheticEvent} event
   * @return {void}
   */
  onChangeInputHandler = (event) =>
  {
    this.onChangeHandler(event.target.value);
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
      <div className={this.getClasses('input')}>

        { this.label }

        <div className="table">

          { this.state.prefix &&
          <div className="prefix">{this.state.prefix}</div>
          }

          <input
            id={this.props.id}
            name={this.props.name}
            value={Array.isArray(this.state.value) ? '' : this.state.value}
            type={this.props.type}
            disabled={this.props.disabled}
            readOnly={this.props.disabled}
            maxLength={this.props.length}
            autoComplete="off"

            onChange={this.onChangeInputHandler}
            onBlur={this.onBlurHandler}
            onFocus={this.onFocusHandler}
            placeholder={
              Array.isArray(this.state.value) ? multipleDataText() : this.state.placeholder
            }

            ref={(ref) =>
            {
              this.element = ref;
            }}
            data-name={this.props.name}
          />

          { this.props.postfix &&
          <div className="postfix">{this.state.postfix}</div>
          }

        </div>

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
Input.propTypes =
{
  ...Input.propTypes,
  /**
   * Specifies the type of input to display such as "password" or "email".
   */
  type: PropTypes.oneOf(['text', 'password', 'email', 'date', 'tel', 'number', 'datetime-local']),
  /**
   * Regular expression to input validator
   */
  regexp: PropTypes.string,
  /**
   * Override the inline-styles of the TextField's underline element.
   */
  underlineStyle: PropTypes.objectOf(PropTypes.string),
  prefix: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
  ]),
  postfix: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
  ]),
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
Input.defaultProps =
{
  ...Input.defaultProps,
  type: 'text',
  underlineStyle: {},
  regexp: '',
  prefix: '',
  postfix: '',
  multipleData: 'placeholder.multipledata',
};

export default Input;
