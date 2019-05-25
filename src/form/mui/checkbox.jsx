import React from 'react';
import PropTypes from 'prop-types';

/* !- React Elements */

import MuiCheckbox from 'material-ui/Checkbox';

import Field from '../formField';


/**
* Checkbox Component
*
* @extends Field
* @example
<Checkbox
  id="services"
  label="Services"
  value={[1, 2]}
  columns={10}
  data={[{ id: 1, title: '#1' }, { id: 2, title: '#2' }]}
  onChange={(relay) =>
  {
    console.log(relay.id, relay.value, relay.form);
  }}

  error="Something wrong"
  mandatory
/>
*/
class Checkbox extends Field
{

  /* !- Handlers */

  /**
   * @private
   * @emits
   * @param  {SytheticEvent} event
   * @param  {bool} checked
   * @return {void}
   */
  onChangeCheckboxHandler = (event) =>
  {
    const id = parseInt(event.currentTarget.dataset.id);
    const value = [...this.state.value];
    const index = value.indexOf(id);

    if (index === -1)
    {
      value.push(id);
    }
    else
    {
      value.splice(index, 1);
    }

    this.onChangeHandler(value);
  }

  /**
   * This method is called when render the Component instance.
   * @override
   * @return {ReactElement}
   */
  render()
  {
    return (
      <div>
        {this.label}

        <div>
          {
            this.props.data.map(option =>
            (
              <div
                key={option.id}
                style={{ width: `${100 / this.props.columns}%`, display: 'inline-block' }}
              >
                <MuiCheckbox
                  id={this.props.id}
                  data-id={option.id}
                  defaultChecked={
                    (!this.state.value) ? false : !!(this.state.value.indexOf(option.id) > -1)
                  }
                  onCheck={this.onChangeCheckboxHandler}
                  label={option.title}
                  disabled={this.props.disabled}
                />
              </div>
            ))
          }
        </div>

        <div className="error">
          {this.state.error}
        </div>
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
   * The selected values.
   * @override
   */
  value: PropTypes.arrayOf(PropTypes.number),
  /**
   * Checkbox items
   * @example
   * [{ id: 2, title: 'Bar' }, { id: 1, title: 'Foo' }]
   */
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
    })).isRequired,
  /**
   * Determine the items of checkbox layout.
   * It should be placed in how many columns.
   */
  columns: PropTypes.number,
};

/**
 * defaultProps
 * @override
 * @type {Object}
 */
Checkbox.defaultProps =
{
  ...Checkbox.defaultProps,
  value: [],
  columns: 1,
};

export default Checkbox;
