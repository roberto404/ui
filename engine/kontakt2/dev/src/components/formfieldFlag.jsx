import React from 'react';
import PropTypes from 'prop-types';


/* !- React Elements */

import Field from '@1studio/ui/form/formField';


/**
* Extended Field component.
*
* @extends Field
* @example
*
*/
class FlagCheckbox extends Field
{
  elements = []
  data = []

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
  onChangeFlagCheckboxHandler = (event) =>
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
    return this.state.value.length && Array.isArray(this.state.value[0]);
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
        value.every(record => record.indexOf(item) !== -1)
      )
      {
        return 1;
      }
      // none included
      else if (value.every(record => record.indexOf(item) === -1))
      {
        return 0;
      }

      return 2;
    }

    return +(value.indexOf(item) !== -1);
  }

  componentDidUpdate()
  {
    // multiple datas set indeterminate
    this.data.forEach(({ id }) =>
    {
      this.elements[id].indeterminate = (this.getStatus(id) === 2);
    });
  }

  /* !- Renders */

  /**
   * This method is called when render the Component instance.
   * @override
   * @return {ReactElement}
   */
  render()
  {
    // !!!this.data

    // const data = ((typeof this.props.data === 'function') ? this.props.data(this.state, this.getValue()) : this.props.data) || [];
    //


    const flags = this.context.register.data.product ? this.context.register.data.product.flags : [];

    const editableFlags = ['SALE', 'MONEY_BACK_30'];

    this.data = flags.filter(flag => editableFlags.indexOf(flag.id) !== -1);


    return (
      <div className={`field checkbox-field ${this.props.className}`}>

        { this.label }

        { this.data.map(item =>
          (
            <div
              className="value"
              key={`${this.props.id}-${item.id}`}
            >
              <input
                type="checkbox"
                id={`${this.props.id}-${item.id}`}
                name={this.props.id}
                value={item.id}
                checked={this.getStatus(item.id) !== 0}
                onChange={this.onChangeFlagCheckboxHandler}
                ref={(ref) =>
                {
                  this.elements[item.id] = ref;
                }}
              />

              <label htmlFor={`${this.props.id}-${item.id}`}>{item.title}</label>
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
FlagCheckbox.propTypes =
{
  ...FlagCheckbox.propTypes,
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
FlagCheckbox.defaultProps =
{
  ...FlagCheckbox.defaultProps,
  data: [],
};

FlagCheckbox.contextTypes =
{
  ...FlagCheckbox.contextTypes,
  register: PropTypes.object,
};

export default FlagCheckbox;
