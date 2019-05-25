import React from 'react';
import PropTypes from 'prop-types';
import slugify from '@1studio/utils/string/slugify';

/* !- React Elements */

import Field from '../../form/formField';


/**
* Extended Field component.
*
* @extends Field
* @example
*
* <Radio
*   id="city"
*   label="City"
*   data={[{ id, title }, ...]}
* />
*/
class Radio extends Field
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
  onChangeRadioHandler = (event) =>
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
    return (
      <div className={this.getClasses('radio')}>

        { this.label }

        { this.data.map(item =>
          (
            <div
              className="value"
              key={`${this.props.id}-${item.id}`}
            >
              { /* slugify: Cannot use props.id because JSON data use same id (see rs/features) */ }
              <input
                type="radio"
                id={`${slugify(this.props.label)}-${item.id}`}
                name={slugify(this.props.label)}
                value={item.id}
                checked={this.state.value.indexOf(item.id.toString()) !== -1}
                onChange={this.onChangeRadioHandler}
              />

              <label htmlFor={`${slugify(this.props.label)}-${item.id}`}>{item.title}</label>
            </div>
          ),
        )}

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
Radio.propTypes =
{
  ...Radio.propTypes,
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
   * Disable select options i18n translatations
   */
  dataTranslate: PropTypes.bool,
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
Radio.defaultProps =
{
  ...Radio.defaultProps,
  placeholder: '',
  data: [],
  dataTranslate: true,
  onBlur()
  {},
  onFocus()
  {},
};


export default Radio;
