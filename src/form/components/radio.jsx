import React from 'react';
import PropTypes from 'prop-types';
import slugify from '@1studio/utils/string/slugify';
import random from '@1studio/utils/string/random';


/* !- Contexts */

import { FormContext } from '../context';
import { AppContext, bindContexts } from '../../context';


/* !- React Elements */

import Field from '../formField';


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
    const value = event.target.value;

    if (value !== this.state.value)
    {
      this.onChangeHandler(event.target.value);
    }
    else
    {
      this.onChangeHandler(undefined);
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
    const uid = random(8);

    return super.render() || (
      <div className={this.getClasses('radio')}>

        { this.label }

        { this.data.map(item =>
          (
            <div
              className={`value ${this.props.valueClassName}`}
              key={`${this.props.id}-${item.id}`}
            >
              { /* slugify: Cannot use props.id because JSON data use same id (see rs/features) */ }
              <input
                type="radio"
                id={`${slugify(this.props.label)}-${item.id}-${uid}`}
                name={slugify(this.props.label)}
                value={item.id}
                checked={(this.state.value || []).indexOf(item.id.toString()) !== -1}
                onChange={this.onChangeRadioHandler}
              />

              <label htmlFor={`${slugify(this.props.label)}-${item.id}-${uid}`}>{item.title}</label>
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
  /**
   * Radio values block classes
   * @example
   * valueClassName="col-1-4"
   */
  valueClassName: PropTypes.string,
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
  valueClassName: '',
};


export default bindContexts(Radio, [FormContext, AppContext]);
