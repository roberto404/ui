import React from 'react';
import PropTypes from 'prop-types';
import find from 'lodash/find';
import classNames from 'classnames';


/* !- React Elements */

import Field from '../../form/formField';


/**
* Extended Field component.
*
* @extends Field
* @example
*
* <Select
*   id="city"
*   label="City"
*   placeholder="Please select"
*   data={[{ id, title }, ...]}
* />
*/
class Select extends Field
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
   * Prepare default onChangeHandler
   * @private
   * @emits
   * @param  {SytheticEvent} event
   * @return {void}
   */
  onChangeSelectHandler = (event) =>
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
    return super.render() || (
      <div className={this.getClasses('select')}>

        { this.label }

        <div className="h-center">

          { this.state.prefix &&
          <div className="prefix">{this.state.prefix}</div>
          }

          <div className="w-full">
            <select
              id={this.props.id}
              name={this.props.id}
              value={this.state.value}

              onChange={this.onChangeSelectHandler}
              onBlur={this.onBlurHandler}
              onFocus={this.onFocusHandler}

              disabled={this.props.disabled}

              ref={(ref) =>
              {
                this.element = ref;
              }}
              data-name={this.props.name}
            >
              { ((this.state.placeholder && !find(this.data, i => i.id === 0)) || !find(this.data, i => i.id == this.state.value)) &&
              <option value="">{this.state.placeholder || this.state.value}</option>
              }

              { this.data.map(item =>
                (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {
                      this.props.intl && this.props.dataTranslate ?
                        this.props.intl.formatMessage({ id: item.title, default: item.title })
                        : item.title
                    }
                  </option>
                ),
              )}
            </select>
          </div>

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
Select.propTypes =
{
  ...Select.propTypes,
  /**
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
};

/**
 * defaultProps
 * @type {Object}
 */
Select.defaultProps =
{
  ...Select.defaultProps,
  placeholder: '',
  data: [],
  onBlur()
  {},
  onFocus()
  {},
};


export default Select;
