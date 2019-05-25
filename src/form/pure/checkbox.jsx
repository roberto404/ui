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
* <Checkbox
*   id="city"
*   label="City"
*   data={[{ id, title }, ...]}
* />
*/
class Checkbox extends Field
{
  elements = []

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
   * Extends default onChangeHandler redux layer close action dispatch.
   *
   * @private
   * @override
   * @emits
   * @param  {Object} item { id, title }
   * @return {void}
   */
  onChangeCheckboxHandler = (event) =>
  {
    const value = this.state.value;

    const item = event.target.value;
    const status = this.getStatus(item);

    /**
     * Helper method which determine new item insert or remove the current state.value
     * @param  {Array}  record        one of state.value [a, b, c]
     * @param  {Boolean} [toggle=true] you can disable remove method if it is false
     * @return {Array}                new record: [a,b,c]
     */
    const createNextValue = (record, toggle = true) =>
    {
      const index = record.indexOf(item);

      if (index === -1)
      {
        return [...record, item];
      }
      else if (toggle === false) // not remove item
      {
        return record;
      }

      return [
        ...record.slice(0, index),
        ...record.slice(index + 1)];
    };

    if (this.isMultipleRecords())
    {
      const nextValue = [];

      value.forEach(record => nextValue.push(createNextValue(record, status !== 2)));

      this.onChangeHandler(nextValue);
    }
    else
    {
      this.onChangeHandler(createNextValue(value));
    }
  }


  isMultipleRecords()
  {
    return this.state.value && this.state.value.length && Array.isArray(this.state.value[0]);
  }

  /**
   * @param {string} field's item (alias checkbox id)
   * @return {integer}
   * 0 => No one: inactive, not checked
   * 1 => Have it everyone: active, checked
   * 2 => Mixed, multipledata: checked + indeterminate
   * @type {[type]}
   */
  getStatus = (item) =>
  {
    const value = this.state.value;

    // multiple records
    if (this.isMultipleRecords())
    {
      // every record include flag
      if (
        value.every(record => Array.isArray(record) && record.indexOf(item) !== -1)
      )
      {
        return 1;
      }
      // none included
      else if (value.every(record => Array.isArray(record) && record.indexOf(item) === -1))
      {
        return 0;
      }

      return 2;
    }

    return +(Array.isArray(value) && value.indexOf(item) !== -1);
  }


  /* !- Lifecycle */

  componentDidUpdate()
  {
    // multiple datas set indeterminate
    this.data.forEach(({ id }) =>
    {
      this.elements[id].indeterminate = (this.getStatus(id) === 2);
    });
  }

  /**
   * This method is called when render the Component instance.
   * @override
   * @return {ReactElement}
   */
  render()
  {
    // this.data = ((typeof this.props.data === 'function') ? this.props.data(this.state, this.getValue()) : this.props.data) || [];

    return (
      <div className={this.getClasses('checkbox')}>

        { this.label }

        { this.data.map(({ id, title }) =>
          (
            <div
              className="value"
              key={`${this.props.id}-${id}`}
            >
              { /* slugify: Cannot use props.id because JSON data use same id (see rs/features) */ }
              <input
                type="checkbox"
                id={`${slugify(this.props.label)}-${id}`}
                name={slugify(this.props.label)}
                value={id.toString()}
                checked={this.getStatus(id.toString()) !== 0}
                onChange={this.onChangeCheckboxHandler}
                ref={(ref) =>
                {
                  this.elements[id.toString()] = ref;
                }}
              />

              <label htmlFor={`${slugify(this.props.label)}-${id}`}>{title}</label>
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
Checkbox.propTypes =
{
  ...Checkbox.propTypes,
  /**
   */
  data: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })),
  ]),
};

/**
 * defaultProps
 * @type {Object}
 */
Checkbox.defaultProps =
{
  ...Checkbox.defaultProps,
  data: [],
};

export default Checkbox;
